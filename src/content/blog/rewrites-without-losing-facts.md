---
title: "How to test a small model for rewriting without losing facts"
description: A release-note rewrite can sound better and quietly change who gets the feature. Small models vary from under 6% to over 23% hallucination on summaries. How to protect product facts and measure editor time and accuracy together.
pubDate: 2026-11-15T12:00:00Z
tags: [small-models, engineering, leadership]
draft: false
cover:
  image: ../../assets/covers/rewrites-without-losing-facts.png
  thumb: ../../assets/covers/rewrites-without-losing-facts-thumb.png
  alt: "A rewrite can sound better and change the promise. On Vectara's hallucination leaderboard, small models summarising the same 7,700 articles range from 5.7% for Qwen3 4B and 6.4% for Gemma 3 4B to 23.5% for Phi-4-mini. Keep version, plan and audience in protected fields, rewrite only the prose, and grade factual changes separately from style."
---

A team ships dozens of release notes a month. Engineers write them, accurately but unevenly: some are three words, some are a paragraph of internal jargon. A compact instruction model could turn each one into clean, consistent, customer-facing copy.

It could also turn "available to admins on the Pro plan" into "available to everyone". The new sentence reads better. It also just promised a feature to customers who won't get it.

This is part 6 of the [small language models series](/blog/what-is-a-small-language-model/): how to use a small model for rewriting without letting it change the facts.

**The short version**

- Small models differ a lot in how faithfully they stick to a source. On Vectara's leaderboard, models of a similar size range from 5.7% to 23.5% hallucination on the same summarisation task. Test the one you'll use, on your text.
- Don't let the model touch facts. Render version, plan and audience from structured fields; let the model rewrite only the prose around them.
- Grade factual changes separately from style, and measure time to approved copy against your current workflow.

## Small models are not equally faithful

Vectara's [hallucination leaderboard](https://github.com/vectara/hallucination-leaderboard) asks each model to summarise more than 7,700 articles and measures how often the summary includes something the source doesn't support. In the October 2026 update, the best model scored 1.8%. Among small models:

| Model | Hallucination rate |
| --- | --- |
| Qwen3 4B | 5.7% |
| Gemma 3 4B | 6.4% |
| Phi-4-mini | 23.5% |

Three models of roughly the same size, and a fourfold difference in how often they add something that isn't there. Parameter count tells you very little about faithfulness. The only way to know is to test the model you plan to use on the kind of text you'll give it.

Summarisation isn't exactly rewriting, but the failure is the same: fluent text that drifts from the source.

## Protect product facts

The most reliable way to stop a model changing a fact is not to give it the chance.

**Put facts in fields, not prose.** Version number, supported plans, audience, dates and limits come from structured data and are rendered by your application into a fixed template. The model writes the sentence around them, never the values.

**Pass one short note at a time.** Long batches invite the model to blend details between items. One source note in, one rewrite out, in a stable output format.

**Review the risky categories.** Even with protected fields, prose can shift meaning. Have the reviewer check five things in particular:

1. **Scope:** who gets it ("admins" vs "everyone")
2. **Timing:** "planned for March" vs "launches in March"
3. **Plans:** which tiers include it
4. **Quantities:** "up to 10 saved views" vs "10 saved views"
5. **Negation:** "no longer requires" vs "requires"

A literal checker can catch missing exact strings, such as a version number that vanished. Paraphrases and changes in meaning need a person, or at least a second model whose output a person samples.

## Benchmark the editorial workflow

Here's a small evaluation sheet of the kind I'd start with. Each row is a real source note with the facts that must survive:

| Case | Source | Must survive |
| --- | --- | --- |
| Admin export | Version 4.2 adds CSV export for admins on Pro. | 4.2; admins; Pro |
| Delayed launch | Search improvements are planned for March; rollout date is unconfirmed. | planned, not confirmed |
| Quantity | Teams can add up to 10 saved views. | maximum of 10 |

Run three versions side by side on a balanced set of notes across teams and change types:

- **The existing workflow:** an editor rewrites the engineer's draft.
- **A template:** fixed structure, fields filled in, no model.
- **A small-model draft:** protected fields plus model-written prose, then an editor's review.

Grade each output twice: once for factual changes, once for style. Mixing the two hides the problem, because a beautifully written note with the wrong audience will score well on style. Then track the number that pays for the project: **time to approved copy.**

Hugging Face's [SmolLM2](https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B) instruct models list text rewriting among their intended uses, which makes the family a sensible place to start. Starting point, not conclusion.

## Takeaway

Automate the parts of formatting that are already deterministic. Keep the model where editorial judgement still helps, and only keep it if edit time falls without a single product fact changing on the way out.

**Small language models series:** part 6 of 8. Previous: [Can a 270M model turn plain English into app commands?](/blog/small-models-for-app-commands/) Next: [A useful eval for a small model starts with what it sends to review](/blog/evaluate-small-models-by-what-they-send-to-review/).

---

**Sources**

- [Vectara: hallucination leaderboard](https://github.com/vectara/hallucination-leaderboard) (updated October 2026)
- [SmolLM2 model card](https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B)
