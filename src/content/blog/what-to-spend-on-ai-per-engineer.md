---
title: "What should you spend on AI per engineer?"
description: The median company spends about $137 a year per employee on AI. The top 1% of software companies spend about $89,000. How engineering leaders can set an AI budget, and the metric to defend it with.
pubDate: 2026-10-26
tags: [strategy, leadership]
draft: false
---

Every engineering leader will soon be asked a version of the same question by finance: what are we getting for what we spend on AI? Most of us are still setting that budget by instinct.

**The short version**

- AI spend per employee ranges from about $137 a year at the median company to about $89,000 at the top 1% of software companies. There is no agreed normal.
- Seats, tokens and pull requests are poor ways to justify the spend. Cost per resolved issue, paired with a quality measure, ties spend to finished work.
- Set the budget as a share of engineering cost, guarantee a baseline for everyone, show spend weekly by team, and review cost per resolved issue every quarter.

## The range is extraordinary

Tomasz Tunguz analysed data from the Ramp AI Index in June 2026. The median company spent about $137 per employee per year on AI. The top 1% of software companies spent about $89,000 per employee per year, roughly 40% of a $224,000 fully loaded senior engineer salary, and that figure was growing around 14% a month.

That is a gap of about 650 times. These are per-employee figures across whole companies, so per-engineer spend is higher in most organisations. Even so, the spread makes one thing clear: there is no consensus on what normal looks like.

Tunguz's base case projects AI spend passing 100% of an engineer's salary by 2028. You don't need to accept the exact year to see the direction. AI is moving from a tooling line item to one of the largest costs in engineering.

## Why most organisations can't defend their number

Finance leaders feel the same pressure. The Open Future Forum's CFO AI Leverage Report, published in October 2026, found that proving ROI is the top barrier to AI spending, cited by 54% of 389 respondents. In a separate, smaller group of 77 AI leaders, 17% reported no visibility into what their AI costs to run, and a further 39% had only partial visibility.

Spend is rising, visibility is poor, and the value is hard to articulate.

Part of the problem is that the easy metrics mislead. Seats and token counts tell you what you spent, not what you received. Output metrics are worse, because AI inflates them. The Harvard and Jellyfish study of 718 companies found that AI agents raised lines of code by about 30% and pull requests by 23%, while issues resolved rose only 12%. Measure AI's value in pull requests and you nearly double it.

![A ladder of metrics from inputs at the bottom to outcomes at the top](/images/blog/what-to-spend-on-ai-per-engineer/metric-ladder.svg)

## The metric I'd use

I'd anchor on **cost per resolved issue**, paired with a quality measure.

Cost per resolved issue is total AI spend for a team (seats, API usage and agent compute) divided by the issues or tickets closed and shipped in the same period. It isn't perfect: work items vary in size, and any metric can be gamed. But it ties spend to something the business recognises as finished work, and it is the output measure that didn't inflate in the research.

The quality pairing matters because fast and wrong costs more than slow and right. Escaped defects or customer-facing incidents per release both work. VentureBeat's August 2026 survey found that 61% of organisations that test their agents before release had at least one customer-facing failure in the past year after their internal tests had passed. Speed that ships those failures is not savings.

Cost per merged pull request is sometimes proposed. I'd avoid it as a headline measure for the reason above: pull requests are exactly what AI makes cheap. It remains useful for spotting runaway agent usage, but not for explaining value to the business.

## How I'd set the budget

For a single team, this is the approach I'd take. Scaling it across an organisation follows the same logic, with the decision sitting with whoever owns the wider budget.

**Set a ceiling as a share of salary, not a per-seat price.** Something like 5 to 10% of fully loaded engineering cost for the first quarter is high enough for people to use agents properly and low enough to keep finance comfortable. Per-seat thinking breaks down once agents run for hours on their own.

**Guarantee a floor.** The worst outcome is a few heavy users and everyone else afraid to spend. Make it explicit that baseline use is expected and funded.

**Make spend visible weekly, by team.** If you are among the 17% without cost visibility, fix that first. A number you only see at month-end can't be managed.

**Review cost per resolved issue quarterly.** If it falls while quality holds, raise the ceiling. If it rises, find the workflows consuming tokens without closing work. It is often a small number of agents caught in loops rather than broad overuse.

## The better question for finance

Instead of "how much should we spend on AI?", ask "what would it cost to deliver the same outcomes without it?" That frames AI as a cost of production, like cloud infrastructure, rather than a discretionary licence. It also forces the conversation onto the work rather than the tool.

I'd like to know which metric other engineering leaders are using to justify AI spend, and whether anyone has found something more reliable than cost per resolved issue.

---

**Sources**

- [Tomasz Tunguz: AI spend breakeven (Ramp AI Index, June 2026)](https://tomtunguz.com/ai-spend-breakeven-2029/) (June 2026)
- [Open Future Forum: CFO AI Leverage Report, Edition 4](https://openfutureforum.com/research/cfo-ai-leverage-report-october-2026) (October 2026)
- [InfoQ: Harvard and Jellyfish study on AI coding productivity](https://www.infoq.com/news/2026/10/jellyfish-ai-productivity/) (October 2026)
- [VentureBeat: enterprise trust in autonomous agents](https://venturebeat.com/orchestration/the-share-of-enterprises-trusting-ai-agents-to-make-production-changes-on-their-own-has-fallen-from-75-to-56-vb-intelligence-finds) (October 2026)
