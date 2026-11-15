---
title: "Can a small language model route support tickets better than keywords?"
description: A keyword router can look perfect by sending everything hard to a person. How to test whether a small model earns its place in ticket routing, with a constrained output, conservative guards and time to the right owner as the metric.
pubDate: 2026-11-15T16:00:00Z
tags: [small-models, engineering, leadership]
draft: false
cover:
  image: ../../assets/covers/small-models-for-support-ticket-routing.png
  thumb: ../../assets/covers/small-models-for-support-ticket-routing-thumb.png
  alt: "A router can look perfect by routing less. On a 10-ticket synthetic fixture, keyword rules routed 4 tickets automatically, got all 4 right and sent 6 to review, including a Spanish billing complaint. Report coverage next to accuracy and measure time to the right owner."
---

A customer writes: "Nos cobraron dos veces esta semana." We were charged twice this week. An English keyword rule looking for "charged" or "refund" doesn't see a billing problem.

Another writes: "I can't sign in and I want a refund." That's two problems for two teams. Force it into one label and one of those issues lands with the wrong owner.

Ticket routing is the classic first job for a small language model: high volume, a fixed set of queues, and a mistake that's usually visible and reversible. But "the model is more accurate than our rules" is the wrong test. This is part 2 of the [small language models series](/blog/what-is-a-small-language-model/).

**The short version**

- A router can look perfect by routing less. Always report coverage (what it decided on its own) next to accuracy (how often those decisions were right).
- Constrain the model to your queues plus an explicit "review" outcome, keep hard rules for cancellations and mixed requests, and run it in shadow mode first.
- The business metric is time to the right owner, with a ceiling on costly misroutes.

## A perfect score that hides the problem

I built a small synthetic fixture: ten tickets across billing, technical, product and account queues, with an expected decision for each. Some expected decisions are "review", for cancellations and messages that mix intents.

The keyword rules did this:

| Measure | Rules baseline |
| --- | --- |
| Routed automatically | 4 of 10 |
| Correct, of those routed | 4 of 4 |
| Sent to review | 6 of 10 |
| Matched the expected decision | 9 of 10 |

A 100% accuracy on accepted tickets sounds great until you notice it only accepted four. The one mismatch is the Spanish billing complaint, which the rules couldn't read and sent to a person.

This is a toy fixture with deliberately conservative review labels. It's useful for checking your instrumentation, not for judging any model. But it shows the shape of the real problem: the rules are precise and narrow, and every ticket they can't handle becomes a person's time.

That's the gap where I'd test whether a small model earns its keep. Can it recover the Spanish billing ticket, and similar cases, without starting to route cancellations to the wrong queue?

## Why a small model is a reasonable bet here

Classification into a handful of labels is exactly the kind of narrow task where small, specialised models do well. In Predibase's [LoRA Land](https://arxiv.org/abs/2405.00732) study, fine-tuned small and mid-sized models beat GPT-4 by 10 points on average across 31 tasks, many of them classification. You don't need a frontier model to choose between five queues. You need a model that has seen your queues.

It's also a job where cost compounds. If you route 20,000 tickets a month, a cheaper model per call matters more than it would on a few hundred deep research questions.

## Design the routing and review policy

Here's how I'd set it up in a hosted service.

**Constrain the output.** The model can only answer with one of your queues or "review". Most serving stacks can enforce this with a JSON schema; [Ollama's structured outputs](https://docs.ollama.com/capabilities/structured-outputs), for example, take a schema in the request's `format` field, and recommend temperature 0 for consistency.

```json
{
  "type": "object",
  "properties": {
    "queue": { "type": "string", "enum": ["billing", "technical", "product", "account", "review"] }
  },
  "required": ["queue"],
  "additionalProperties": false
}
```

**Keep hard guards in code.** Anything mentioning cancellation goes to review. Anything matching signals for two different queues goes to review. These rules run before the model and can't be talked out of it. Treat the ticket text as data, never as instructions.

**Validate, then show your work.** If the model's answer isn't in the enum, it's review. When a person reviews, show them the original ticket and the proposed queue, and capture a reason when they correct it.

**Run in shadow mode first.** Let the model decide alongside the rules for a few weeks without acting on its answers. You get a real comparison on live traffic, with zero customer risk.

## What to measure in a pilot

Toy fixtures check plumbing. A pilot needs real numbers:

- **Time to the right owner**, from ticket creation to the team that resolves it. This is what customers feel.
- **Precision per queue.** A billing misroute and a security misroute don't cost the same.
- **Missed high-cost cases**, such as cancellations or legal threats that were routed automatically when they should have gone to a person.
- **Review minutes**, since that's where the saving actually comes from.

Use the same held-out set for every candidate: rules, the small model and a stronger model. [Part 7](/blog/evaluate-small-models-by-what-they-send-to-review/) goes deeper on reading coverage and error together.

## Takeaway

Start with the queue whose misroutes are easiest to detect and reverse. Expand when the small model improves coverage at an error rate that queue's owners have agreed to, and keep the guards for the tickets that should always reach a person.

**Small language models series:** part 2 of 8. Previous: [What is a small language model?](/blog/what-is-a-small-language-model/) Next: [What an invoice extractor should return besides the total](/blog/invoice-extraction-needs-evidence/).

---

**Sources**

- [Predibase: LoRA Land, 310 fine-tuned LLMs that rival GPT-4](https://arxiv.org/abs/2405.00732) (2024)
- [Ollama: structured outputs](https://docs.ollama.com/capabilities/structured-outputs)
- The ten-ticket fixture is synthetic and illustrative.
