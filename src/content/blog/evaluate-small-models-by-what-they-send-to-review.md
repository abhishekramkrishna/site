---
title: "A useful eval for a small model starts with what it sends to review"
description: Accuracy without a denominator picks the wrong model. How to evaluate a small model by coverage, accepted error and review load together, with a break-even rule for choosing between a cautious policy and a bold one.
pubDate: 2026-11-15T11:00:00Z
tags: [small-models, engineering, leadership]
draft: false
cover:
  image: ../../assets/covers/evaluate-small-models-by-what-they-send-to-review.png
  thumb: ../../assets/covers/evaluate-small-models-by-what-they-send-to-review-thumb.png
  alt: "Accuracy needs a denominator and a review budget. Two grids of 100 illustrative cases. Policy A gets 39 right and 1 wrong automatically and sends 60 to review. Policy B gets 80 right and 5 wrong and sends 15 to review. B is cheaper unless one mistake costs more than about 11 reviews."
---

Two classifiers each see the same 100 requests.

- **Policy A** decides 40 on its own and gets 39 of them right. The other 60 go to a person.
- **Policy B** decides 85 on its own and gets 80 right. The other 15 go to a person.

Which is better? A has the lower error rate on what it accepts: 2.5% against about 5.9%. B makes 80 correct decisions without a human, more than twice as many as A. Report only accuracy and A wins. Report only automation and B wins. Neither number alone can choose.

This is part 7 of the [small language models series](/blog/what-is-a-small-language-model/), and it's the post the others lean on. Every workflow in this series, from [ticket routing](/blog/small-models-for-support-ticket-routing/) to [invoice extraction](/blog/invoice-extraction-needs-evidence/), has the same structure: the model decides some cases and sends the rest to review. Your eval has to measure both halves.

**The short version**

- Always report coverage (the share the model decides on its own) next to accepted error (how often those decisions are wrong).
- Pick between policies using two costs: what a wrong decision costs and what a review costs. In the example above, B wins unless a mistake costs more than about 11 reviews.
- Build a holdout that labels high-risk cases separately, and grade whether the model sends ambiguous inputs to review.

## Put a price on both halves

Here's the same example as a table:

| | Policy A | Policy B |
| --- | --- | --- |
| Decided automatically | 40 | 85 |
| Correct | 39 | 80 |
| Wrong | 1 | 5 |
| Sent to review | 60 | 15 |

Now attach two costs. Call the cost of one wrong automatic decision **E** and the cost of one human review **R**.

- Policy A costs 1 × E + 60 × R
- Policy B costs 5 × E + 15 × R

B is cheaper whenever 4 × E is less than 45 × R, which means **whenever one mistake costs less than about 11 reviews.**

That's a question a team can actually answer. If a review takes a minute and a misrouted support ticket costs ten minutes of someone's time to fix, B wins easily. If a wrong automatic decision means paying the wrong invoice or cancelling the wrong account, A's caution is worth every one of those 60 reviews.

There's a second constraint the formula doesn't capture: **review capacity.** If the team can absorb 20 reviews a day and policy A sends 60, A isn't cautious, it's a backlog. Choose the policy the receiving team can actually operate.

Routing research uses the same framing. [RouteLLM](https://arxiv.org/abs/2406.18665) reports its routers as a curve of quality against how many calls go to the expensive model, not as a single accuracy figure, because the right point on that curve depends on your costs.

## Build the holdout

Your evaluation set decides what your numbers mean. A few rules I'd follow:

- **Score agreed outcomes.** The label is what the business agrees is correct, not what one engineer guessed.
- **Label high-risk cases separately.** Cancellations, legal threats, large payments. Report their error rate on its own, because an average will bury them.
- **Include the hard inputs on purpose:** negation, ambiguous messages, very long inputs, other languages, and inputs that belong to no category.
- **Split by time or by customer**, not at random. Random splits leak near-duplicates between training and test, and the numbers come out flattering.
- **Compare at equal review budgets** where you can. A model that sends 15% to review and one that sends 60% are not competing on the same terms.
- **Record what you need to reproduce it:** model revision, prompt, p50 and p95 latency by path, and the concurrency you tested at.

## Grade what goes to review

When the input is ambiguous, the right answer is often "send it to a person". Make that an explicit expected outcome in your holdout, and grade it. A model that confidently routes an ambiguous cancellation to billing has made an error, even if billing was a plausible guess.

After launch, keep sampling both sides: some automatic decisions, to catch errors that slipped through, and some reviewed ones, to see whether the model is sending too much. Keep enough examples in each important slice that uncertainty is visible. Five high-risk cases can't tell you a 1% error rate from a 10% one.

I've written before about [what a good agent eval looks like](/blog/what-a-good-agent-eval-looks-like/) and why [passing evals is not permission to ship](/blog/passing-evals-is-not-permission-to-ship/). For small models, the review queue is where both ideas meet.

## Takeaway

Pick the acceptance policy using the cost of wrong decisions and the team's review capacity. A single headline accuracy can't choose that trade-off for you, so don't let it.

**Small language models series:** part 7 of 8. Previous: [How to test a small model for rewriting without losing facts](/blog/rewrites-without-losing-facts/) Next: [The founder's case for an SLM pilot starts with one paid workflow](/blog/founders-case-for-an-slm-pilot/).

---

**Sources**

- [Ong et al.: RouteLLM, learning to route LLMs with preference data](https://arxiv.org/abs/2406.18665) (2024)
- The two policies are illustrative.
