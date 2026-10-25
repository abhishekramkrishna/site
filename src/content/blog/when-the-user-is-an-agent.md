---
title: "When the user of your software is an agent"
description: AI agents are becoming the heaviest users of enterprise software. Most products were designed for a person with a mouse. Here is what technology leaders should design for next.
pubDate: 2026-10-26
tags: [business, agents]
draft: false
---

For decades, "the user" in enterprise software meant a person: someone at a screen, often distracted, trying to finish one task before the next meeting. We designed for that person with navigation, tooltips, guided onboarding, helpful empty states and confirmation dialogs in front of anything risky.

That user isn't going away. But they are about to be outnumbered.

Box CEO Aaron Levie put it plainly in a June 2026 podcast interview: "Agents are going to be the number one user of software in the future. And they might use software at like a scale of 100x more than people ever using that software."

Vendors are already acting on it. In April, Salesforce launched Headless 360, which exposes its products as APIs, MCP tools (the Model Context Protocol, a common way for agents to call software) and command-line tools so agents can work with data and workflows directly, without a browser. Marc Benioff summarised the strategy in four words: "Our API is the UI."

**The short version**

- AI agents are on track to use business software far more than people do. Vendors such as Salesforce are already rebuilding products so agents can use them without a screen.
- Agents did not kill enterprise software. They depend on systems of record, but they need clear actions, written rules, their own permissions and defined points where a person signs off.
- Review each critical workflow with four questions: can an agent do it without the screen, where does the guidance live, what may the agent do and how fast, and where does a human approve.

## The SaaS collapse that didn't happen

Early in 2026, a popular view held that agents would make business software obsolete. If an agent can build a CRM in an afternoon, why buy one? Software stocks fell more than 26% between late January and April.

They then recovered. In early October 2026, the S&P 500 software and services index reached its highest level since November 2025, after its strongest quarter since 2020. Adam Turnquist of LPL Financial captured the shift: "AI has been more of an enabler for a lot of these software companies, more than a disruptor."

The reason is straightforward. Agents don't replace the system of record. They depend on it. An agent submitting an expense still needs the expense system, its approval policy and its audit trail. It simply uses them in a very different way from a person.

That difference is where the next round of product and platform decisions will be made.

## What a person needs versus what an agent needs

![The same task, done by a person through the screen and by an agent through APIs, meeting at a human sign-off](/images/blog/when-the-user-is-an-agent/human-vs-agent-path.svg)

A person needs to find the right screen. An agent needs to find the right action. Menus, layouts and visual cues do nothing for it. Clear action names, precise descriptions and predictable errors do everything.

A person absorbs unwritten rules over time, such as "don't approve a vendor invoice above the limit without checking with finance." Nobody wrote that into the interface. An agent cannot learn it unless someone makes it explicit, in a place the agent reads, at the moment it applies.

A person tires after twenty records. An agent will update twenty thousand without hesitation. Permission models built around "what can this employee see" look thin when the actor runs at machine speed.

And a person generally recognises when they're out of their depth. An agent usually doesn't, so the system has to know where the handoff to a human belongs.

## Four design questions for every workflow

If I were reviewing an enterprise product roadmap today, I'd ask four questions of each critical workflow.

**Can an agent complete it without seeing the screen?** If the only path is three pages of clicks, agents will either scrape the interface unreliably or fail. Every important action needs a clean, documented, stable entry point.

**Where does the guidance live?** For people, guidance sits in the interface: the tooltip, the walkthrough, the warning before deletion. For agents, the same guidance has to travel with the action itself. What is this for? When should it not be used? What must be checked first? Teams that have invested in guiding human users through complex software are well placed here, because the problem is the same with a different reader.

**What is the agent allowed to do, and at what rate?** Treat agents as a distinct class of user, with their own identity, scopes and rate limits, rather than a borrowed human login. Leaders should be able to answer "what did our agents do yesterday?" with a single query.

**Where does a human sign off?** Some steps should always return to a person: anything irreversible, anything above a financial threshold, anything a customer will see. Design that handoff deliberately, with enough context that someone can approve in thirty seconds, rather than discovering the gap in a post-incident review.

## What this means for technology leaders

Your fastest-growing group of users may not have eyes. That doesn't mean abandoning the interface. People will still handle judgement-heavy work, and they will be the ones reviewing what agents did. It means every workflow now has two audiences, and the second one reads your API documentation, error messages and permission model far more literally than any person ever has.

The question I find most unresolved is permissions. When an agent acts on behalf of an employee, and the employee's access and the agent's policy disagree, whose rules should win? I'd be interested in how other leaders are answering that.

---

**Sources**

- [Podcast Alpha: Aaron Levie on agents using enterprise software at 100x human scale](https://podcastalpha.substack.com/p/aaron-levie-agents-enterprise-software) (June 2026)
- [WebProNews: Salesforce Headless 360](https://www.webpronews.com/salesforces-headless-360-turning-crm-into-pure-ai-agent-fuel/) (April 2026)
- [American Bazaar: US software stocks hit 2026 highs as AI disruption fears fade](https://americanbazaaronline.com/2026/10/06/us-software-stocks-hit-2026-highs-as-ai-disruption-fears-fade-489493/) (October 2026)
