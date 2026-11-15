---
title: "When does a small-model first pass actually save money?"
description: A model cascade can cut the inference bill by 70% and still raise the cost of the workflow. A worked example of cascade economics, the break-even escalation rate, and what to measure before you route real traffic.
pubDate: 2026-11-15T14:00:00Z
tags: [small-models, business, strategy]
draft: false
cover:
  image: ../../assets/covers/when-a-small-model-first-pass-saves-money.png
  thumb: ../../assets/covers/when-a-small-model-first-pass-saves-money-thumb.png
  alt: "A cheaper model bill can mean a more expensive workflow. Illustrative month of 100,000 requests: strong model only costs $1,000. A small first pass with 20% escalation costs $300 in inference, but $1,100 once four cents of human review per escalation is added. With those inputs the cascade only wins below an 18% escalation rate."
---

A support assistant handles two kinds of request. Most are routine: where's my order, reset my password, what's your refund policy. A few need the customer's full history and some judgement.

The obvious design is a cascade. A small model takes the first pass at everything. When it isn't confident, or a check fails, the request escalates to a stronger model or a person. The research says this can work spectacularly well. The arithmetic says it can also quietly cost you more.

This is part 4 of the [small language models series](/blog/what-is-a-small-language-model/).

**The short version**

- Research shows large savings are possible: FrugalGPT matched GPT-4 at up to 98% lower cost, and RouteLLM cut costs by over 85% on MT Bench while keeping 95% of GPT-4's quality.
- But a cascade pays the small model on every request and adds work on every escalation. In a worked example, a 70% cut in inference cost turned into a 10% increase in total cost once review was counted.
- Measure cost per verified completion and latency by route. The escalation rate is a business metric, not a model detail.

## What the research shows

Two papers made the case for mixing models.

[FrugalGPT](https://arxiv.org/abs/2305.05176), from Stanford, found that LLM API prices differ by two orders of magnitude, and that a cascade of cheaper and more expensive models could match the best single model with up to 98% cost reduction, or beat it by 4% at the same cost.

[RouteLLM](https://lmsys.org/blog/2024-07-01-routellm/), from LMSYS and UC Berkeley, trained routers that decide up front which model should take a query. They reported cost reductions of over 85% on MT Bench, 45% on MMLU and 35% on GSM8K compared with GPT-4 alone, while keeping 95% of GPT-4's performance.

Notice the range: 85% on one benchmark, 35% on another. The saving depends heavily on the mix of easy and hard requests in your traffic. Your workload is not a benchmark.

## Routers and cascades are not the same thing

- A **router** chooses the path before the main call. Easy requests go to the small model, hard ones go straight to the strong model. You pay once per request, but the router itself has to be good at spotting hard cases.
- A **cascade** tries the small model first, checks the result, and escalates if needed. It's simpler to build, but it pays the small model's charge on every request, and an escalated request carries the latency of both calls.

Either way, don't use the model's own stated confidence to decide. "I'm 90% sure" from a language model is not calibrated. Use checks you can verify: did the answer match the schema, cite a real source, agree with a deterministic rule? Or train a router on measured outcomes.

## Run the economics

Here's an illustrative month. These are made-up but plausible inputs, so substitute your own.

- 100,000 requests a month
- Small model: $0.001 per request
- Strong model: $0.01 per request
- 20% of requests escalate

**Strong model only:** 100,000 × $0.01 = **$1,000**.

**Cascade, inference only:** 100,000 × $0.001 + 20,000 × $0.01 = $100 + $200 = **$300**. A 70% saving. This is the slide that gets the project approved.

Now add what happens to escalated requests in a real workflow. Say each escalation also needs four cents of extra human review: someone glances at the handoff, checks the context, or confirms the answer.

**Cascade, with review:** $300 + 20,000 × $0.04 = **$1,100**. More than the strong-only path.

The general formula is:

```
cascade = volume × (small + escalation_rate × (strong + review_per_escalation)) + fixed_costs
```

With these inputs the cascade breaks even at an 18% escalation rate. Here's how sensitive that is:

| Escalation rate | Cascade, with review | vs strong only |
| --- | --- | --- |
| 10% | $600 | saves $400 |
| 15% | $850 | saves $150 |
| 18% | $1,000 | breaks even |
| 20% | $1,100 | costs $100 more |
| 30% | $1,600 | costs $600 more |

Two caveats keep this honest. If the strong-only path also needs human review, add it there too, and the comparison shifts. And fixed costs, such as hosting your own small model, building the checks and maintaining the router, push the break-even point lower still.

## What to measure before you switch

- **Cost per verified completion.** Not cost per request. Count only the requests that ended with a correct, accepted outcome, and divide the whole bill, including review, by that number.
- **Escalation rate, by request type.** It will drift as your traffic changes. Watch it like a business metric, because it is one.
- **Tail latency by route.** p95 on the escalated path is the small model plus the strong model plus any wait for review. That's the experience your hardest customers get.
- **Errors that slip through.** A cascade that saves money by accepting wrong answers from the small model hasn't saved anything.

I made a similar argument about tokens in [Stop counting tokens](/blog/stop-counting-tokens/): the bill that matters is the cost of the finished work, not the cost of the model call.

## Takeaway

Report cost per verified completion and tail latency by route. A lower model bill only matters if the system still reliably finishes the work customers pay for, and the escalation rate decides whether it does.

**Small language models series:** part 4 of 8. Previous: [What an invoice extractor should return besides the total](/blog/invoice-extraction-needs-evidence/) Next: [Can a 270M model turn plain English into app commands?](/blog/small-models-for-app-commands/)

---

**Sources**

- [Chen, Zaharia and Zou: FrugalGPT](https://arxiv.org/abs/2305.05176) (2023)
- [LMSYS: RouteLLM, an open-source framework for cost-effective LLM routing](https://lmsys.org/blog/2024-07-01-routellm/) (July 2024), and the [RouteLLM paper](https://arxiv.org/abs/2406.18665)
- The worked example uses illustrative inputs.
