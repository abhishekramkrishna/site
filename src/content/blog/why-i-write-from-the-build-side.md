---
title: Why I'm writing about AI from the build side
description: Most AI commentary comes from researchers or marketers. This blog is written from the middle, where an Engineering Leader has to make AI work in production with a team, a budget and a deadline.
pubDate: 2026-10-26
tags: [leadership, agents]
draft: false
cover:
  image: ../../assets/covers/why-i-write-from-the-build-side.png
  thumb: ../../assets/covers/why-i-write-from-the-build-side-thumb.png
  alt: "Writing about AI from the build side: researchers explain what models can do, marketers what they will do, and the build side asks whether it will hold up in production, what it will cost to run and who owns it when it breaks."
---

Most of what I read about AI comes from two places. Researchers explain what models can do. Marketers explain what they will do. Far less comes from the people in between, the ones accountable for making it work with a real team, a real budget and a real deadline.

That is where I spend my time. As an Engineering Leader, the question in front of me is rarely "is this model impressive?" It is "will this hold up in production, what will it cost to run, and who owns it when it breaks?"

That gap shows up in the data. In Google's 2025 DORA research, a survey of nearly 5,000 technology professionals, around 90% now use AI in their work. Yet in Stack Overflow's 2025 developer survey, 46% of developers said they distrust the accuracy of AI tools, and only 3% said they highly trust the output. Adoption is nearly universal. Confidence isn't. DORA also found that delivery instability keeps rising alongside AI adoption, even as throughput improves.

The space between those numbers is where engineering leaders work every day. In practice it looks like questions such as these, each of which became a post:

- An agent passes every eval. Who signs off before it ships, and for which kinds of change? ([Passing evals is not permission to ship](/blog/passing-evals-is-not-permission-to-ship/))
- Finance asks what the AI budget buys. Which metric survives that conversation, when pull requests inflate and resolved work doesn't? ([What should you spend on AI per engineer?](/blog/what-to-spend-on-ai-per-engineer/))
- Engineers already run coding agents on their laptops. What should security actually watch? ([What Uber's ADR shows about securing the coding agents your engineers already use](/blog/ubers-adr-securing-coding-agents/))

This blog is for engineering leaders and technology executives asking the same questions.

## What I'll write about

Four themes, each kept specific and practical:

- **Building AI agents.** What fails in production, how to test it, and when a plain workflow is the better choice.
- **AI strategy for leaders.** Build versus buy, how to staff an AI effort, how to budget for it, and what to measure.
- **AI in the business.** Where AI creates real value in an operation, where it doesn't, and what it costs.
- **Leading engineering organisations in the AI era.** Code review, hiring, team design and developing talent when AI writes much of the code.

## What you can expect

Every post will take a clear position and show the reasoning behind it. Where I cite numbers, I'll link the source so you can judge them yourself. Where the evidence is thin or contested, I'll say so.

I'll also avoid two things that dominate AI writing today: predictions without evidence, and frameworks that sound good but never survive contact with a real engineering team.

## How to follow along

New posts appear here first, and I share each one on LinkedIn and X. If you use a feed reader, the RSS link is at the bottom of every page.

If there's a question you'd like me to take on, message me on LinkedIn. The most useful posts usually start as someone else's question.

---

**Sources**

- [InfoQ: DORA 2025 State of AI-assisted Software Development, with Stack Overflow 2025 trust data](https://www.infoq.com/news/2025/09/dora-state-of-ai-in-dev-2025) (September 2025)

*Updated 15 November 2026: added the adoption and trust data, and three example questions linking to posts that answer them.*
