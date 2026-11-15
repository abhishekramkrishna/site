---
title: "What is a small language model, and when should you use one?"
description: Small describes the model, not where it runs. A practical definition of small language models for engineering leaders, the numbers behind the shift to task-specific models, and how to pick a first workload.
pubDate: 2026-11-15T17:00:00Z
tags: [small-models, engineering, strategy]
draft: false
cover:
  image: ../../assets/covers/what-is-a-small-language-model.png
  thumb: ../../assets/covers/what-is-a-small-language-model-thumb.png
  alt: "Small is a model choice, hosting is a deployment choice. Gartner expects organisations to use small, task-specific models three times more than general-purpose LLMs by 2027. NVIDIA researchers put serving a 7B model at 10 to 30 times cheaper than a 70 to 175B one. Start with a frequent, bounded decision that is cheap to verify."
---

A support team wants to label 20,000 incoming tickets a month. Every ticket gets one of six labels, or goes to a person for review. Nobody needs the model to write poetry, reason about tax law or remember the conversation. It needs to make one bounded decision, quickly and cheaply, thousands of times a day.

That is the kind of job where I would start evaluating a small language model (SLM). This post opens an eight-part series on where small models earn their place in real software, and how to prove it before you bet a roadmap on them.

**The short version**

- "Small" describes the model: a comparatively low parameter count, typically from a few hundred million to a few billion. It says nothing about where the model runs.
- The economics are why it matters. NVIDIA researchers estimate that serving a 7B model is 10 to 30 times cheaper than serving a 70 to 175B one, and Gartner expects task-specific models to be used three times more than general LLMs by 2027.
- Pick the job first: frequent inputs, a constrained decision, cheap verification. Pick where it runs second.

## What "small" actually describes

There is no official cutoff. In practice people use "small" for models from about 100 million to a few billion parameters. Some current examples:

- Hugging Face's [SmolLM2](https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B) comes in 135M, 360M and 1.7B sizes. The 1.7B model was trained on 11 trillion tokens, is Apache 2.0 licensed, and its instruct variant is pitched at rewriting, summarisation and function calling.
- Google's [Gemma 3 270M](https://developers.googleblog.com/en/introducing-gemma-3-270m/) has 170 million embedding parameters and only 100 million in its transformer blocks. Google says the INT4 version used 0.75% of a Pixel 9 Pro's battery across 25 conversations.
- [FunctionGemma](https://blog.google/technology/developers/functiongemma/), a 270M variant tuned for function calling, is meant to be fine-tuned for one app's actions. Part 5 of this series looks at it in detail.

Two things are easy to confuse here.

**Size is a model choice. Hosting is a deployment choice.** A 1.7B model can run behind a hosted API, in your own private service, or on a phone. "On-device" describes where inference happens, and a SaaS team can run a small model entirely in its backend without any edge hardware.

**Quantisation is not shrinking.** Quantising stores the same weights at lower precision, say 4 bits instead of 16. That cuts memory and often latency, and can cost some quality, but the parameter count stays the same. Measure the quantised build you will actually serve, not the model card's numbers.

## Why engineering leaders are paying attention

The case for small models is mostly about cost and control, and the numbers are getting hard to ignore.

In [Small Language Models are the Future of Agentic AI](https://arxiv.org/abs/2506.02153), NVIDIA researchers argue that serving a 7B model is 10 to 30 times cheaper in latency, energy and FLOPs than serving a 70 to 175B model. They then looked at three open-source agent systems and estimated that specialised small models could reliably handle about 60% of MetaGPT's LLM calls, 40% of Open Operator's and 70% of Cradle's. Those are the authors' estimates, not measured deployments, but they point at the same thing I see in production agents: most calls are narrow, repetitive and well specified.

Gartner [predicts](https://www.ciodive.com/news/small-AI-model-use-growth-Gartner-prediction/745435/) that by 2027 organisations will use small, task-specific AI models three times more than general-purpose LLMs. As Sumit Agarwal, VP Analyst at Gartner, puts it: "These smaller, task-specific models provide quicker responses and use less computational power."

And specialisation works. In Predibase's [LoRA Land](https://arxiv.org/abs/2405.00732) study, 310 fine-tuned models built on 10 small and mid-sized base models beat their base models by 34 points on average across 31 tasks, and beat GPT-4 by 10 points on average. Narrow tasks reward a narrow model.

None of this means small models replace large ones. It means a good system uses each where it fits, and the bounded, high-volume jobs are where small models fit first.

## How to choose a first task

A good first workload has three properties:

1. **Frequent inputs.** Thousands a day, so savings and measurement both add up quickly.
2. **A constrained decision.** A fixed set of labels, a typed field, a small set of actions. Not open-ended writing.
3. **Cheap verification.** You can check the answer against a source, a schema or a person's quick glance.

Then run a small feasibility study before anything touches production:

- Write the output contract first: the exact labels or fields, plus an explicit "send to review" outcome.
- Pick 100 representative examples, including the awkward ones.
- Compare three candidates on identical inputs: a rules or classic classifier baseline, a compact instruction model, and a stronger model.
- Track accuracy by label, the share sent to review, and end-to-end cost per correct decision.
- Measure latency and footprint separately, on the hardware or service you actually plan to use.

If the small model wins on cost per correct decision and holds quality on the cases that matter, you have a reason to use it. If it doesn't, the baseline you built is still useful.

## What this series covers

Each part takes one workflow and asks what a small model would have to prove:

1. **What a small language model is**, and when to use one (this post)
2. [Routing support tickets](/blog/small-models-for-support-ticket-routing/) better than keyword rules
3. [Extracting invoices](/blog/invoice-extraction-needs-evidence/) with evidence, not just a total
4. [When a small-model first pass saves money](/blog/when-a-small-model-first-pass-saves-money/), and when it doesn't
5. [Turning plain English into app commands](/blog/small-models-for-app-commands/) with a 270M model
6. [Rewriting without losing facts](/blog/rewrites-without-losing-facts/)
7. [Evaluating a small model](/blog/evaluate-small-models-by-what-they-send-to-review/) by what it sends to review
8. [The founder's case for an SLM pilot](/blog/founders-case-for-an-slm-pilot/)

## Takeaway

Choose the decision before you choose the model, and choose the model before you choose where it runs. If you can explain what the customer gains from a faster, cheaper version of one bounded decision, you have a candidate for a small model.

---

**Sources**

- [NVIDIA Research: Small Language Models are the Future of Agentic AI](https://arxiv.org/abs/2506.02153) (2025)
- [CIO Dive: Gartner predicts small, task-specific model use will triple that of general-purpose LLMs by 2027](https://www.ciodive.com/news/small-AI-model-use-growth-Gartner-prediction/745435/) (April 2025)
- [Predibase: LoRA Land, 310 fine-tuned LLMs that rival GPT-4](https://arxiv.org/abs/2405.00732) (2024)
- [SmolLM2 model card](https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B)
- [Google: Introducing Gemma 3 270M](https://developers.googleblog.com/en/introducing-gemma-3-270m/) (August 2025)
