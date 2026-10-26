---
title: "Passing evals is not permission to ship"
description: Fewer enterprises now let AI agents deploy changes on automated evaluations alone, and 61% have had a customer-facing failure after tests passed. Why engineering leaders should separate evaluation from approval.
pubDate: 2026-10-26
tags: [agents, strategy]
draft: false
cover:
  image: ../../assets/covers/passing-evals-is-not-permission-to-ship.png
  thumb: ../../assets/covers/passing-evals-is-not-permission-to-ship-thumb.png
  alt: "Passing evals is not permission to ship: enterprises letting agents ship on automated evals alone fell from 75% to 56%, 61% had a customer-facing failure after tests passed, and those expecting to keep human review rose from 20% to 42%."
---

A few months ago, the direction of travel looked settled. Build good evaluations, and once an agent passes them, let it ship. Human approval was a temporary crutch.

The data is now moving the other way.

**The short version**

- Between July and August 2026, the share of enterprises letting AI agents ship changes on automated tests alone fell from 75% to 56%. 61% had a customer-facing failure after tests passed.
- Testing an agent and approving what it ships are two separate decisions. Automate the first as far as possible. Decide the second by risk.
- Put three controls in place: quality checks on live traffic, a fast off switch, and a habit of turning every production failure into a new test.

## Trust is falling, not rising

VentureBeat Intelligence surveyed enterprises running AI agents in July and again in August 2026. In July, 75% of those deploying autonomous agents allowed some production changes based on automated evaluations alone, or were building toward it. By August, that figure had fallen to 56%. Among final purchasing decision-makers, the drop was sharper: from 88% to 61%.

Over the same period, the share expecting to keep human review for the foreseeable future rose from 20% to 42%.

The reason is in another number from the same survey. 61% of respondents whose teams test agents before release had experienced at least one customer-facing failure in the past twelve months after their internal tests had passed. 22% had more than one.

These are separate, self-selected samples of roughly 100 to 140 respondents, and the mix of respondents shifted between the two surveys, so treat them as direction rather than precision. But the direction is clear.

## Why evaluations and production diverge

Evaluations test what you thought to test. Production tests everything else.

An evaluation suite is a set of known cases, written by people who already understand the problem. Real users bring unusual inputs, ambiguous requests, stale data and edge cases nobody anticipated. An agent can score well on every case you wrote and still behave badly on the one you didn't.

There is a subtler problem too. The survey notes that "a fast, confidently wrong response can produce a clean trace and a 200 status code." In other words, every technical signal says the agent worked, even when the answer was wrong. Most monitoring was built to catch systems that fail loudly. Agents tend to fail quietly and plausibly.

## Two decisions, not one

The most useful line in the report is this: "automating evaluation and automating deployment approval are different decisions."

Many teams have treated them as one. Once evaluation is automated, approval follows automatically. I'd separate them explicitly:

- **Automate evaluation as far as you can.** Run it on every change, track it over time, and treat a falling score as a blocking signal.
- **Decide approval by risk, not by score.** Low-risk, easily reversible changes can ship on evaluations. Anything irreversible, financial or customer-visible needs a named person to sign off, regardless of how well the agent scored.

## What to put in place

Three practical controls make the difference between an agent you can trust and one you hope works:

**Quality checks on live traffic, not only before release.** In the same survey, only 29% of teams used inline quality assertions on live traffic as their primary monitoring. Pre-release evaluations tell you an agent was good. Live checks tell you it still is.

**A fast way to stop it.** Every agent with production access should have a clearly owned off switch and a rollback path that works in minutes, not hours.

**Failures that feed back into evaluations.** Every production failure should become a new evaluation case within a week. That is how the suite catches up with reality.

For the right category of change, human approval is the control that lets you move faster everywhere else.

---

**Sources**

- [VentureBeat: the share of enterprises trusting AI agents to make production changes on their own has fallen from 75% to 56%](https://venturebeat.com/orchestration/the-share-of-enterprises-trusting-ai-agents-to-make-production-changes-on-their-own-has-fallen-from-75-to-56-vb-intelligence-finds) (October 2026)
