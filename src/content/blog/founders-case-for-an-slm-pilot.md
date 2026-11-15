---
title: "The founder's case for an SLM pilot starts with one paid workflow"
description: MIT's NANDA initiative found about 95% of enterprise generative AI pilots deliver little measurable P&L impact. A two-week plan for a small-model pilot built around one approved output a buyer already pays for, and how to turn saved minutes into a price.
pubDate: 2026-11-15T10:00:00Z
tags: [small-models, business, strategy]
draft: false
cover:
  image: ../../assets/covers/founders-case-for-an-slm-pilot.png
  thumb: ../../assets/covers/founders-case-for-an-slm-pilot-thumb.png
  alt: "Start with a job someone already pays for. MIT NANDA found about 95% of enterprise generative AI pilots deliver little measurable P&L impact, and the biggest returns came from back-office work. A two-week pilot: days 1 to 3 observe and time the work, days 4 to 7 build a template and a small-model draft, days 8 to 14 run beside the existing workflow and ask for paid terms."
---

If I had two weeks to test a small-model business, I wouldn't start with the model. I'd start with an invoice, a ticket or a product listing that someone already pays a person to produce, and a buyer willing to show me how long it takes today.

This is the last part of the [small language models series](/blog/what-is-a-small-language-model/). The earlier parts were about engineering: routing, extraction, cost, commands, rewriting and evaluation. This one is about the business case, because a pilot that can't show value doesn't survive, however good the model.

**The short version**

- Most generative AI pilots don't pay off. MIT's NANDA initiative found about 95% deliver little measurable P&L impact, and the best returns came from unglamorous back-office work.
- Start with one recurring job that has a buyer and a definition of done, and measure the baseline before you build anything.
- Sell the verified output or the capacity gained, and keep the model replaceable.

## Why most pilots stall

In August 2025, [MIT's NANDA initiative reported](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/) that about 95% of enterprise generative AI pilots were falling short, delivering little measurable impact on profit and loss. The study drew on 150 interviews with leaders, a survey of 350 employees and an analysis of 300 public AI deployments.

Two findings matter for anyone selling into that market. More than half of generative AI budgets went to sales and marketing tools, but the biggest returns came from back-office automation, such as cutting outsourcing and agency costs. And tools bought from specialised vendors succeeded about 67% of the time, while internal builds succeeded only about a third as often.

Read that as an opening. Buyers want a specialised product that does one back-office job measurably better. That's a small-model business.

## Pick the workflow, not the model

A good pilot workflow has:

- **A buyer** who pays for the output today, in salaries, agency fees or outsourcing.
- **A definition of done** the buyer already uses: an approved listing, a coded invoice, a routed ticket.
- **Volume.** Hundreds of items a week, so small savings add up and measurement is quick.
- **An owner willing to show you the baseline.** Without the "before", there's no "after".

Take an agency that edits product listings for online merchants. The deliverable is an approved listing that follows each merchant's content rules. That's repeatable, checkable and already paid for.

## A two-week pilot

**Days 1 to 3: observe.** Watch the work being done. Time it. Write down the acceptance criteria the editors actually use, including the unwritten ones. Collect a sample of real items and their approved versions.

**Days 4 to 7: build two candidates.** A plain template, and a small-model draft. Give both the same validated product facts, so you're testing the writing, not data quality. For each item, save the draft, the editor's approval time and the reason for every correction.

**Days 8 to 14: run beside the existing workflow.** Put the better candidate next to the current process on live work. Compare time per approved item, correction reasons and error rate. Before the pilot starts, agree with the buyer on the bar that would make it worth paying for. At the end, if you've cleared it, ask them to continue on paid terms.

Notice the template. If a template gets most of the gain, that's worth knowing on day 7, not after you've built a fine-tuning pipeline. The model has to beat the cheap option, not just the manual one. The same rule runs through this series, from [keyword routers](/blog/small-models-for-support-ticket-routing/) to [invoice rules](/blog/invoice-extraction-needs-evidence/).

## Translate time into buyer value

Here's an illustrative calculation. Swap in your buyer's numbers.

- 300 listings a week
- One minute saved per verified listing
- That's 5 hours a week
- At $25 an hour, that's **$125 a week** in time value

Two honest caveats. That's before inference costs, extra QA and onboarding. And it's time value, not cash. It only becomes a saving if it changes what the buyer actually spends, such as fewer agency hours or less overtime.

Often the better pitch is capacity: the same team handles more merchants without hiring. That's a different conversation, with a different buyer, and usually a bigger one.

Use a simple scorecard to keep everyone honest, filled in for both the baseline and the pilot:

| Metric | Unit |
| --- | --- |
| Verified completions | items per week |
| Time per verified item | minutes |
| Cost per verified item | dollars |
| High-cost errors | count |
| Review time | minutes per week |

## Keep the model replaceable

The model you pilot with won't be the model you run in a year. Prices fall, new small models appear every few months, and models get retired, as I wrote in [Model retirement is the new dependency upgrade](/blog/model-retirement-is-the-new-dependency-upgrade/). Build the product around the workflow, the evaluation set and the buyer's definition of done. Those are the assets. The model is a component.

## Takeaway

Sell the verified output or the capacity gain. Prove the recurring job first, and keep the model replaceable, so the value you deliver survives changes in serving cost and in which models exist.

**Small language models series:** part 8 of 8. Previous: [A useful eval for a small model starts with what it sends to review](/blog/evaluate-small-models-by-what-they-send-to-review/). Start from the beginning: [What is a small language model?](/blog/what-is-a-small-language-model/)

---

**Sources**

- [Fortune: MIT report, 95% of generative AI pilots at companies are failing](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/) (August 2025), on MIT NANDA's "The GenAI Divide: State of AI in Business 2025"
- The listing example and value calculation are illustrative.
