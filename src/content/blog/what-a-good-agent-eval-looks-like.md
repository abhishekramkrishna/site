---
title: "What a good eval looks like for an AI agent"
description: I built a small eval agent that grades a support agent across tasks, trials and graders. It caught a candidate that scored better and still broke the rules. What engineering leaders should copy from it.
pubDate: 2026-10-27
tags: [agents, strategy]
draft: false
cover:
  image: ../../assets/covers/what-a-good-agent-eval-looks-like.png
  thumb: ../../assets/covers/what-a-good-agent-eval-looks-like-thumb.png
  alt: "v2 scored better and broke rules v1 kept: capability tasks up from 30% to 80%, regression tasks down from 100% to 77%, trials with a critical failure up from 0 to 4. Decision: hold."
---

In [Passing evals is not permission to ship](/blog/passing-evals-is-not-permission-to-ship/), I argued that testing an agent and approving what it ships are two different decisions. Automate the first as far as you can. Decide the second by risk.

The obvious follow-up question is what "good" automated testing looks like for an agent. So I built a small eval agent to find out. Everything below uses mock data: the agent, the tickets and the numbers are made up. The graders and the metrics are real code.

**The short version**

- A good agent eval runs every task several times and grades the outcome in the real environment, not the agent's own account of what it did.
- Use code graders for what must be exactly right, a model as judge for tone and nuance, and people to keep the judge honest. Report how often the agent succeeds every time, not just on average.
- Put an eval agent in the loop. It reads every failed transcript, turns failures into new tests, and makes the ship call by risk.

## The 90-second version

<video controls preload="none" playsinline poster="/images/blog/what-a-good-agent-eval-looks-like/demo-poster.jpg" src="/images/blog/what-a-good-agent-eval-looks-like/demo.mp4" style="width:100%;height:auto;border-radius:8px" aria-label="90-second explainer of agent evals and the eval agent demo, with narration and captions"></video>

## The failure evals exist to catch

A customer writes in: their $900 order arrived late, and they want a refund. The support agent replies: "Done. I've refunded $900 to your original payment method." Polite, clear, and resolved in one turn.

It's also wrong. The agent may only refund up to $500 on its own. Anything above that needs a person to approve it.

Nothing about this failure is loud. No error, no timeout, no angry customer, at least not yet. If your test reads the reply and asks "is this a good answer?", it passes. This is the failure mode that worries me most with agents. They rarely fail loudly. They fail plausibly.

## Start with the right vocabulary

Anthropic's engineering team published [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) in January 2026. It is the clearest guide I've read, and most of its vocabulary is worth adopting as is:

- A **task** is one test with clear success criteria, ideally with a reference answer.
- A **trial** is one attempt at the task. You run several, because agents vary from run to run.
- The **transcript** is everything the agent did: tool calls, reasoning, the reply.
- The **outcome** is the final state of the environment. Did the refund happen in the database, or did the agent only say it did?
- **Graders** score the transcript and the outcome.

![Anatomy of an agent eval: task, trials, transcript and outcome, graders, and the score](/images/blog/what-a-good-agent-eval-looks-like/eval-anatomy.svg)

The single most useful idea in that list is the difference between transcript and outcome. Grade what happened, not what the agent says happened.

## Three kinds of graders, each with a job

**Code graders** check what must be exactly right. Is the refund in the database the expected amount? Did any refund above $500 happen without approval? Did the reply say "refunded" when nothing was refunded? They are fast, cheap and objective. They are also brittle with anything that has more than one right answer.

**A model as judge** handles nuance: tone with an upset customer, a clear next step, no promises outside policy. It scales to open-ended output, but it is non-deterministic and needs checking. Anthropic's advice is to give the judge an "unknown" option and to grade each dimension separately. In my demo, an "unknown" verdict never counts as a pass. It goes to a person.

**People** keep the judge honest. Read transcripts, grade a sample by hand, and compare with the judge. It's slow and expensive, so use it to calibrate, not to grade everything.

In the demo, the judge passed the $900 reply. The tone was fine. Only the code graders, the ones that checked the database and the policy, caught it. That is the case for layering graders rather than picking one.

## Report consistency, not luck

The second idea I'd take to any leadership review is the difference between **pass@k** and **pass^k**.

pass@k asks whether at least one of k attempts succeeds. It rises as k grows. That is the right measure when one success is enough, for example a coding agent that can retry until the tests pass.

pass^k asks whether all k attempts succeed. It falls as k grows. That is the right measure when every customer gets exactly one try.

![An agent with 75% success per try: pass@1 is 75%, pass@3 is 98%, pass^3 is 42%](/images/blog/what-a-good-agent-eval-looks-like/pass-k.svg)

An agent that works three times out of four gets all three tries right only 42% of the time. Executives understand "it works most of the time" and "it works every time" without a statistics lesson, and customers feel the second number.

## A small eval agent, end to end

To make this concrete, I built a small demo. A mock refund-support agent with four tools: look up an order, check the policy, issue a refund, escalate to a person. Two versions: v1, the current one, and v2, a candidate prompted to "resolve the customer's problem in one turn".

The suite has 10 tasks taken from (mock) support tickets and one incident:

- **6 regression tasks**: things the agent already does well and must not break. Several are "should not" cases: don't refund outside the window, do escalate the $900 refund.
- **4 capability tasks**: harder cases v1 gets wrong, such as a partial refund for 2 damaged items out of 5.

Each task runs 5 times per version in a fresh environment, with the same random seeds for both versions so the comparison is fair. A trial passes only if every grader passes.

![The eval report: capability up from 30% to 80%, regression down from 100% to 77%, pass^5 on regression down from 100% to 50%, and 4 critical failures; decision HOLD](/images/blog/what-a-good-agent-eval-looks-like/report.webp)

| Measure | v1 (current) | v2 (candidate) |
| --- | --- | --- |
| Capability tasks, pass@1 | 30% | 80% |
| Regression tasks, pass@1 | 100% | 77% |
| Regression tasks passed on all 5 tries (pass^5) | 100% | 50% |
| Trials with a critical failure | 0 | 4 |

If you only looked at the capability score, v2 is a clear win. It isn't. It refunded $900 and $1,500 without approval, promised a customer an exception the policy doesn't allow, and twice told a customer "I've refunded" after the payments call had timed out and no money had moved.

![One failed trial: the agent refunded $900 above the $500 limit; the judge passed the reply, the outcome and policy graders failed it](/images/blog/what-a-good-agent-eval-looks-like/transcript.webp)

## What the eval agent does

A dashboard that says "77%" still leaves someone to work out why. That is where the eval agent comes in. After each run, it:

1. **Compares** the candidate with the baseline on the same tasks and seeds.
2. **Reads** every failed transcript, not just the scores. Anthropic's post says it plainly: "Read the transcripts!"
3. **Explains** the failures, grouped by the most severe grader that failed: policy, honesty, outcome, then tone.
4. **Grows** the suite. Each failure cluster becomes a proposed regression task: a $501 refund, one dollar over the limit; a payments timeout where the agent must not claim success.
5. **Decides** by risk tier. This agent moves customer money, so any critical failure means hold, and even a clean run needs a named owner to sign off.

![The eval agent loop: run, read, explain, grow the suite, then decide by risk](/images/blog/what-a-good-agent-eval-looks-like/eval-agent-loop.svg)

Anthropic describes a similar loop in [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents): generate realistic tasks, run them in a simple agent loop, then have a model read the transcripts and propose fixes, with a held-out set so you don't overfit.

## Mistakes that make evals lie

A few lessons from Anthropic's engineering posts that I'd put in front of any team building evals:

- **Broken graders look like weak agents.** A 0% pass rate across many trials usually means the task or the grader is broken. In one case Anthropic describes, fixing grading and scaffold problems moved a model's score on one benchmark from 42% to 95%.
- **Infrastructure is part of the test.** On Terminal-Bench 2.0, changing only the compute and memory headroom moved scores by 6 percentage points, [more than the gap between top models](https://www.anthropic.com/engineering/infrastructure-noise). Be sceptical of small differences until the setup is matched.
- **The agent may know it's being tested.** In a [BrowseComp analysis](https://www.anthropic.com/engineering/eval-awareness-browsecomp), a model suspected it was being evaluated, found the benchmark and decrypted its answers. Treat eval integrity as an ongoing problem, and watch for runs with unusual token use.
- **One-sided suites train one-sided agents.** If every task rewards refunding, you get an agent that refunds everything. Test the "should not" cases too.
- **A suite at 100% has stopped teaching you.** It still catches regressions, but you need harder tasks to see progress.

## Open-source tools worth a look

You don't need to build a harness from scratch. These are active and credible as of October 2026:

| Tool | From | Good for |
| --- | --- | --- |
| [Inspect](https://inspect.aisi.org.uk/) | UK AI Security Institute | Agent evals with datasets, solvers, scorers, sandboxes and a transcript viewer |
| [Harbor](https://pypi.org/project/harbor/) | Laude Institute | Running containerised agent trials at scale; Terminal-Bench 2.0 ships through it |
| [promptfoo](https://www.npmjs.com/package/promptfoo) | Promptfoo, now part of OpenAI | Test cases and LLM-rubric assertions in CI, plus red teaming |
| [DeepEval](https://pypi.org/project/deepeval/) | Confident AI | Pytest-style tests with agent metrics such as tool correctness |
| [autoevals](https://pypi.org/project/autoevals/) | Braintrust | Prebuilt scorers you can drop into your own harness |
| [lm-evaluation-harness](https://pypi.org/project/lm-eval/) | EleutherAI | Model benchmarks for choosing a model, not for agent behaviour |

The tools matter less than the tasks you put through them.

## What I'd ask an engineering leader to do this quarter

1. **Start with 20 to 50 tasks drawn from real failures.** Anthropic calls this "a great start". Support tickets and incident reviews are the best source you have.
2. **Keep two suites.** Capability tasks to climb, regression tasks that must stay near 100%. Promote tasks from the first to the second as they pass.
3. **Put pass^k on the dashboard** for anything customer-facing, next to the average.
4. **Grade outcomes with code first,** and use a model as judge only for what code can't check. Calibrate it against people.
5. **Give the suite an owner** and an eval agent that reads every failure and grows the suite after each run.
6. **Tie the result to approval tiers.** Green evals are the entry ticket. For anything that moves money, touches customer data or can't be undone, a named person still signs off.

Evals tell you what changed. Approval is still a human decision. Build both.

---

**Sources**

- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (January 2026)
- [Anthropic: Quantifying infrastructure noise in agentic coding evals](https://www.anthropic.com/engineering/infrastructure-noise) (February 2026)
- [Anthropic: Eval awareness in Claude Opus 4.6's BrowseComp performance](https://www.anthropic.com/engineering/eval-awareness-browsecomp) (March 2026)
- [Anthropic: Writing effective tools for agents, with agents](https://www.anthropic.com/engineering/writing-tools-for-agents) (September 2025)
- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (December 2024)
- [SiliconANGLE: OpenAI to acquire Promptfoo](https://siliconangle.com/2026/03/09/openai-acquire-promptfoo-expand-ai-application-testing-capabilities/) (March 2026)
- Tool versions checked on PyPI and npm on 25 October 2026.
