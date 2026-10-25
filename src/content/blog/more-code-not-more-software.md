---
title: "More code, not more software: review is the new bottleneck"
description: AI agents are raising code output across engineering teams. Delivered work is rising far less. The constraint has moved to code review, and engineering leaders need to redesign it.
pubDate: 2026-10-26
tags: [agents, leadership]
draft: false
---

Most engineering organisations that have adopted AI coding agents can show a chart that goes up and to the right. Pull requests, commits, lines of code. The harder question, and the one boards and CFOs are starting to ask, is whether the business is getting more software out of it.

The best evidence so far says: some, but much less than the output charts suggest.

**The short version**

- In a study of 718 companies, AI agents raised lines of code by about 30% but issues resolved by only 12%. Time to review a pull request rose 49%.
- Review is now the constraint. Treating every change the same wastes reviewer attention on low-risk work and under-protects high-risk work.
- Split review into three lanes by risk, require authors to explain agent-written code, and judge output by issues resolved rather than pull requests.

## What the data shows

A Harvard study, reported by InfoQ in October 2026, analysed 718 companies on the Jellyfish engineering analytics platform, covering roughly 700,000 people and data from January 2021 to March 2026. When teams adopted AI agents, lines of code rose about 30% and pull requests rose 23%. Issues actually resolved rose 12%.

The cost appeared downstream. Average time to review a pull request rose 49%. Comments per pull request rose 53%. The share of pull requests needing changes roughly doubled. Using AI to assist with review produced no measurable improvement.

![Agents widen the top of the pipeline. Review stays the same width.](/images/blog/more-code-not-more-software/review-bottleneck.svg)

The authors summarise it well: when AI speeds up writing code, "complementary steps may serve as bottlenecks." Code review is the largest of those steps.

## Why review breaks first

Writing code was never the majority of an engineer's time. The same study estimates it at 30 to 40%. The rest is reading, deciding, reviewing, coordinating and fixing. Accelerate the writing and every other stage receives more input than it was designed for.

Review also carries a second, less visible cost. AI has made producing a change cheap. It has not made understanding one cheap. Addy Osmani describes this as comprehension debt: the growing gap between how much code exists in a system and how much of it anyone actually understands. As he puts it, "A junior engineer can now generate code faster than a senior engineer can critically audit it."

Andrej Karpathy made the same observation in October 2026, writing that "human review and comprehension are starting to fall behind."

The predictable failure mode follows. Review queues grow, reviewers fall behind, and approvals become faster than reading. Gergely Orosz calls these zombie code reviews, and his line from his LDX3 New York keynote should concern every engineering leader: "If your team is still doing code reviews, you're probably not doing code reviews."

## Redesign review around risk

Some companies are responding by removing review for non-critical code. Ramp, for example, has reportedly told engineers they can skip review on non-critical changes. I understand the impulse, but I don't think it's the right default. The better move is to stop treating every change the same way.

I recommend three review lanes, assigned by risk rather than by size.

![Three review lanes by risk: low, medium and high](/images/blog/more-code-not-more-software/review-tiers.svg)

**Low risk.** Tests, internal tooling, copy changes, dependency updates that pass CI. An automated review pass plus one brief human check. The reviewer confirms the change does what the ticket asked. They are not expected to read every line.

**Medium risk.** Most feature work. A full human review, with one condition: the author writes a short summary of what changed, why, and what they would examine as the reviewer. If an agent wrote the code, the author must be able to explain it without referring back to the agent's session. If they can't, the change isn't ready for review.

**High risk.** Authentication, payments, data migrations, anything touching customer data, anything difficult to roll back. Two human reviewers, one of whom owns that part of the system. No agent-only approvals.

The "explain it back" rule matters more than it looks. It slows teams down for a week or two. After that, engineers start directing agents more deliberately, because they know they will have to defend the result. That shift from passive delegation to active, question-driven use is exactly what Osmani argues protects skill and understanding.

## Change what you measure

Pull request count and cycle time are now flattering metrics. More pull requests can mean more delivered work, or simply more load on reviewers. I'd add two measures to any engineering dashboard:

- **Review wait time by lane.** If low-risk changes wait as long as high-risk ones, the lanes aren't doing their job.
- **Issues resolved per engineer.** It was the one output measure in the Harvard data that didn't inflate with AI adoption, which is precisely why it's worth trusting.

## Where to start

Take last month's merged pull requests and plot time-to-approve against size. Large changes approved quickly are where zombie reviews hide. Then identify the single category of change your organisation is most concerned about getting wrong, and make that your first lane with stricter rules. There's no need to redesign the whole process at once.

The open question I'm still weighing is how much human attention a low-risk, agent-written change really needs. If your organisation has moved a lane to fully automated review, I'd be interested to hear which signals you rely on to know it's safe.

---

**Sources**

- [InfoQ: Harvard and Jellyfish study on AI coding productivity](https://www.infoq.com/news/2026/10/jellyfish-ai-productivity/) (October 2026)
- [Addy Osmani on comprehension debt, O'Reilly Radar](https://www.oreilly.com/radar/comprehension-debt-the-hidden-cost-of-ai-generated-code/) (April 2026)
- [Business Today on Karpathy's post about review falling behind](https://www.businesstoday.in/technology/artificial-intelligence/story/only-5000-people-have-access-to-ai-agents-that-can-tackle-years-of-work-in-weeks-says-ai-researcher-andrej-karpathy-560943-2026-10-12) (October 2026)
- [Summary of Gergely Orosz's LDX3 keynote](https://pjfp.com/gergely-orosz-state-of-tech-industry-2026-ldx3/) (October 2026)
