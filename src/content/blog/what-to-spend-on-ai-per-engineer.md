---
title: "What should you spend on AI per engineer?"
description: The median company spends about $137 a year per employee on AI. The top 1% of companies spend about $89,000. How engineering leaders can set an AI budget, and the metric to defend it with.
pubDate: 2026-10-26
tags: [strategy, leadership]
draft: false
cover:
  image: ../../assets/covers/what-to-spend-on-ai-per-engineer.png
  thumb: ../../assets/covers/what-to-spend-on-ai-per-engineer-thumb.png
  alt: "AI spend per employee ranges from $137 a year at the median company to $89,000 at the top 1% of companies, a gap of about 650 times. Defend it with cost per resolved issue, paired with a quality measure."
---

Every engineering leader will soon be asked a version of the same question by finance: what are we getting for what we spend on AI? Most of us are still setting that budget by instinct.

**The short version**

- AI spend per employee ranges from about $137 a year at the median company to about $89,000 at the top 1% of companies. There is no agreed normal.
- A typical engineer today costs roughly $20 to $40 a month in assistant seats and $150 to $250 a month for a coding agent used daily. For a 50-engineer team that is about 2% of engineering cost.
- Seats, tokens and pull requests are poor ways to justify the spend. Cost per resolved issue, paired with a quality measure, ties spend to finished work.
- Set the budget as a share of engineering cost, guarantee a baseline for everyone, show spend weekly by team, and review cost per resolved issue every quarter.
- Before raising or cutting the budget, check five things: visibility, adoption, cost per resolved issue, runaway agents and review capacity.

## The range is extraordinary

Tomasz Tunguz analysed data from the Ramp AI Index in June 2026. The median company spent about $137 per employee per year on AI ($11.38 a month, roughly the price of one enterprise chat seat). The top 10% spent about $611 per employee per month, or around $7,300 a year. The top 1% spent about $89,000 per employee per year ($7,449 a month), roughly 40% of a $224,000 fully loaded senior engineer salary, and that figure was growing around 14% a month.

That is a gap of about 650 times. These are per-employee figures across whole companies, so per-engineer spend is higher in most organisations. Even so, the spread makes one thing clear: there is no consensus on what normal looks like.

Tunguz's base case projects AI spend passing 100% of an engineer's salary by 2028. You don't need to accept the exact year to see the direction. AI is moving from a tooling line item to one of the largest costs in engineering.

## What an engineer costs today

The company-wide averages hide what an individual engineer actually consumes. Three tiers cover most teams:

- **Assistant seats: about $19 to $40 a month.** GitHub Copilot Business lists at $19 per user per month and Cursor's business plan at $40. Enterprise tiers with platform requirements land nearer $60.
- **A coding agent used daily: about $150 to $250 a month.** Anthropic's own documentation puts Claude Code at around $13 per developer per active day across enterprise deployments, with 90% of users staying below $30 a day. In April 2026 it raised that estimate from $6 a day, a reminder that agent usage grows as people learn what to hand over.
- **Heavy agent users on API billing: $600 to $1,500 a month** is reported for engineers who run agents for hours at a time, before any background or scheduled agents.

So the honest answer to "what does an engineer cost in AI?" is a range of about two orders of magnitude, depending on whether they autocomplete, delegate or orchestrate.

## Why most organisations can't defend their number

Finance leaders feel the same pressure. The Open Future Forum's CFO AI Leverage Report, published in October 2026, found that proving ROI is the top barrier to AI spending, cited by 54% of 389 respondents. In a separate, smaller group of 77 AI leaders, 17% reported no visibility into what their AI costs to run, and a further 39% had only partial visibility.

Spend is rising, visibility is poor, and the value is hard to articulate.

Part of the problem is that the easy metrics mislead. Seats and token counts tell you what you spent, not what you received. Output metrics are worse, because AI inflates them. The Harvard and Jellyfish study of 718 companies found that AI agents raised lines of code by about 30% and pull requests by 23%, while resolved issues showed no statistically significant gain; the confidence interval rules out a rise above 12%. Time to review a pull request rose 49%. Measure AI's value in pull requests and you count a gain the business may never see.

![A ladder of metrics from inputs at the bottom to outcomes at the top](/images/blog/what-to-spend-on-ai-per-engineer/metric-ladder.svg)

## The metric I'd use

I'd anchor on **cost per resolved issue**, paired with a quality measure.

Cost per resolved issue is total AI spend for a team (seats, API usage and agent compute) divided by the issues or tickets closed and shipped in the same period. It isn't perfect: work items vary in size, and any metric can be gamed. But it ties spend to something the business recognises as finished work, and it is the output measure that didn't inflate in the research.

The quality pairing matters because fast and wrong costs more than slow and right. Escaped defects or customer-facing incidents per release both work. VentureBeat's August 2026 survey found that 61% of organisations that test their agents before release had at least one customer-facing failure in the past year after their internal tests had passed. Speed that ships those failures is not savings.

Cost per merged pull request is sometimes proposed. I'd avoid it as a headline measure for the reason above: pull requests are exactly what AI makes cheap. It remains useful for spotting runaway agent usage, but not for explaining value to the business.

## How I'd set the budget

For a single team, this is the approach I'd take. Scaling it across an organisation follows the same logic, with the decision sitting with whoever owns the wider budget.

**Set a ceiling as a share of salary, not a per-seat price.** Something like 5 to 10% of fully loaded engineering cost for the first quarter is high enough for people to use agents properly and low enough to keep finance comfortable. Per-seat thinking breaks down once agents run for hours on their own. At a $224,000 fully loaded cost, 5 to 10% is about $930 to $1,870 per engineer per month: four to seven times what a typical daily agent user consumes, so there is headroom without a blank cheque.

**Guarantee a floor.** The worst outcome is a few heavy users and everyone else afraid to spend. Make it explicit that baseline use is expected and funded.

**Make spend visible weekly, by team.** If you are among the 17% without cost visibility, fix that first. A number you only see at month-end can't be managed.

**Review cost per resolved issue quarterly.** If it falls while quality holds, raise the ceiling. If it rises, find the workflows consuming tokens without closing work. It is often a small number of agents caught in loops rather than broad overuse.

## A worked example

Take a team of 50 engineers at a $224,000 fully loaded cost each, or $11.2 million a year.

- **Floor:** an assistant seat for everyone at about $40, so $2,000 a month.
- **Daily agent users:** 25 engineers at about $250, so $6,250 a month.
- **A capped pool for long-running agents:** $10,000 a month, allocated to the workflows that have earned it.

That totals about $18,250 a month, or roughly $219,000 a year: about 2% of engineering cost, well under a 5% ceiling.

Two things follow. First, the tools are rarely the expensive part. The risk is either underinvesting, so half the team never builds the habit, or unmeasured agents quietly looping. Second, the break-even bar is low. Spending 2% of engineering cost needs about 2% more finished work to pay for itself. DX's analysis of more than 400 companies found a median pull request throughput gain of about 8%, but as above, pull requests overstate the gain. The hard part is proving the finished work, not affording the tools.

Use your own loaded cost. The percentages travel between markets; the dollar figures don't.

![A worked example for a 50-engineer team at $224,000 loaded cost each: assistant seats for all $2,000 a month, 25 daily coding-agent users at about $250 is $6,250 a month, a capped pool for long-running agents $10,000 a month, about $219,000 a year or 2% of $11.2 million engineering cost. Before the budget review: see spend weekly by team; if the floor is unused it is an adoption problem; if cost per resolved issue falls while quality holds, raise the ceiling; if it rises, find agents in loops; if review is slow, fund review first.](/images/blog/what-to-spend-on-ai-per-engineer/worked-example.webp)

## Five questions before the budget review

1. **Can you see spend weekly, by team?** If not, fix that first. Everything else depends on it.
2. **Is everyone using the floor?** If many engineers barely touch the tools, you have an adoption problem, not a budget one. More money won't fix it; training and visible use by leaders will.
3. **Is cost per resolved issue falling while quality holds?** Raise the ceiling.
4. **Is it rising?** Look for a few agents stuck in loops or long-running jobs nobody owns before you cut seats for everyone.
5. **Is review the bottleneck?** With review time up 49% in the Harvard data, more spend on generating code just grows the queue. Fund review capacity, smaller changes and better tests first.

## The better question for finance

Instead of "how much should we spend on AI?", ask "what would it cost to deliver the same outcomes without it?" That frames AI as a cost of production, like cloud infrastructure, rather than a discretionary licence. It also forces the conversation onto the work rather than the tool.

I'd like to know which metric other engineering leaders are using to justify AI spend, and whether anyone has found something more reliable than cost per resolved issue.

---

**Sources**

- [Tomasz Tunguz: AI spend breakeven (Ramp AI Index, June 2026)](https://tomtunguz.com/ai-spend-breakeven-2029/) (June 2026)
- [Open Future Forum: CFO AI Leverage Report, Edition 4](https://openfutureforum.com/research/cfo-ai-leverage-report-october-2026) (October 2026)
- [InfoQ: Harvard and Jellyfish study on AI coding productivity](https://www.infoq.com/news/2026/10/jellyfish-ai-productivity/) (October 2026)
- [Ramp Economics Lab: How much does it cost to be AI-pilled? (Ramp AI Index)](https://ramp.com/data/ai-index-june-2026) (June 2026)
- [Claude Code docs: Manage costs effectively](https://code.claude.com/docs/en/costs) (accessed November 2026)
- [Shopifreaks: Anthropic more than doubles its estimate of daily Claude Code spending](https://www.shopifreaks.com/anthropic-more-than-doubles-its-public-estimate-of-average-daily-claude-code-spending-from-6-to-13-per-developer/) (April 2026)
- [DX: AI coding assistant pricing and ROI guide](https://getdx.com/blog/ai-coding-assistant-pricing/) (2026)
- [VentureBeat: enterprise trust in autonomous agents](https://venturebeat.com/orchestration/the-share-of-enterprises-trusting-ai-agents-to-make-production-changes-on-their-own-has-fallen-from-75-to-56-vb-intelligence-finds) (October 2026)

*Updated 15 November 2026: added per-engineer cost benchmarks, a worked 50-engineer budget, five questions for the budget review and new sources. Corrected the Harvard and Jellyfish finding: resolved issues showed no statistically significant gain, not a 12% rise. Ramp's top 1% covers all companies, not only software companies.*
