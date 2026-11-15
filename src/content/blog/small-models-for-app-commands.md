---
title: "Can a 270M model turn plain English into app commands?"
description: Google's FunctionGemma went from 58% to 85% accuracy on its mobile actions task after fine-tuning. How to scope a natural-language command feature around a tiny model, where the model proposes and your app decides.
pubDate: 2026-11-15T13:00:00Z
tags: [small-models, engineering, agents]
draft: false
cover:
  image: ../../assets/covers/small-models-for-app-commands.png
  thumb: ../../assets/covers/small-models-for-app-commands-thumb.png
  alt: "The model proposes, the app decides. FunctionGemma is a 270M model for function calling. Google reports fine-tuning lifted its mobile actions accuracy from a 58% baseline to 85%. Start with three reversible actions, then resolve IDs, check access and confirm in your own code."
---

A warehouse worker, gloves on, says: "Show incomplete items in the morning checklist."

To act on that, your app needs three things: a known operation (filter a checklist), a real checklist ID (not the words "morning checklist"), and a typed argument (incomplete only: true). Today the worker gets there with four taps through a menu.

Turning that sentence into a structured call is a narrow job, and narrow jobs are where small models shine. Google built a model for exactly this. This is part 5 of the [small language models series](/blog/what-is-a-small-language-model/).

**The short version**

- FunctionGemma is a 270M model tuned for function calling. On Google's mobile actions task, fine-tuning lifted it from a 58% baseline to 85% accuracy. Fine-tuning for your own actions is the point.
- The model only proposes the action and arguments. Your app resolves IDs, checks permissions and asks for confirmation, exactly as it would for a tap.
- Start with three reversible actions people struggle to find, and benchmark against the command palette you already have.

## A model built for this job

Google released [FunctionGemma](https://blog.google/technology/developers/functiongemma/) in December 2025. It's a version of Gemma 3 270M fine-tuned for function calling: it reads a request and a list of available functions, and returns a structured call.

Two details matter for engineering leaders.

First, it's meant as a starting point, not a finished product. The [model card](https://ai.google.dev/gemma/docs/functiongemma/model_card) describes it as a base for task-specific fine-tuning. Google's own example shows why: on its Mobile Actions evaluation, fine-tuning lifted accuracy from a 58% baseline to 85% on a held-out set. Out of the box, it gets a lot wrong. Trained on your actions, it gets much better.

Second, it's small enough to run almost anywhere. Google says it fits on edge devices like phones and the NVIDIA Jetson Nano. That gives you a choice: run it on the device for privacy and offline use, or in your backend next to the rest of your logic. Pick based on your latency and data constraints, not on novelty.

## Define the tool contract first

Before training anything, write down exactly what the model is allowed to propose. Start with three actions, such as:

- `open_checklist(checklist)`
- `filter_checklist(checklist, incomplete_only)`
- `draft_note(checklist, text)`

All three are reversible. Opening, filtering and drafting don't change anything a person can't undo. Leave deleting, submitting and paying for later.

Then build a dataset. Keep training cases and evaluation cases strictly separate, and watch for near-duplicates leaking from one into the other. Include the awkward requests: checklist names that don't exist, contradictory filters ("show done items that aren't done"), and requests that aren't in the menu at all. Google's [fine-tuning guide](https://ai.google.dev/gemma/docs/functiongemma/finetuning-with-functiongemma) walks through the mechanics.

## The model proposes, the app decides

This is the part that keeps the feature safe. The model's output is a proposal, and it goes through the same validation and authorisation as any request from the UI:

```python
def validate_proposal(proposal, allowed_ids):
    if set(proposal) != {"action", "checklist", "incomplete_only"}:
        raise ValueError("Unexpected proposal shape")
    if proposal["action"] != "filter_checklist":
        raise ValueError("Unsupported action")
    if type(proposal["incomplete_only"]) is not bool:
        raise ValueError("Invalid arguments")
    checklist_id = CHECKLISTS.get(proposal["checklist"])
    if checklist_id is None or checklist_id not in allowed_ids:
        raise ValueError("Checklist unavailable")
    return {"action": "filter_checklist", "checklist_id": checklist_id,
            "incomplete_only": proposal["incomplete_only"]}
```

The shape is checked exactly. The action has to be on the list. The checklist name is resolved to a real ID by the application, not invented by the model, and that ID has to be one this user is allowed to see. Anything that fails is shown to the user as "I couldn't do that", with the normal menu one tap away.

When you later add actions with consequences, add a confirmation step. The model can fill in the form; a person presses the button.

## Measure real command use

The baseline isn't "no feature". It's the command palette or search box you already have. Measure:

- **Correct action and correct arguments together.** Getting the action right with the wrong checklist is a failure.
- **Cancel rate.** How often users dismiss the suggestion.
- **Fallback to taps.** How often they give up and use the menu anyway.
- **Steps saved** on the tasks that succeed.

Test the failure cases deliberately: wrong IDs, contradictory filters, out-of-scope requests. A good command feature fails politely and hands control back.

## Takeaway

Start with reversible actions people have trouble finding. Add more commands only after you can show fewer steps without an increase in wrong operations, and keep execution, permissions and confirmation in your own code.

**Small language models series:** part 5 of 8. Previous: [When does a small-model first pass actually save money?](/blog/when-a-small-model-first-pass-saves-money/) Next: [How to test a small model for rewriting without losing facts](/blog/rewrites-without-losing-facts/).

---

**Sources**

- [Google: FunctionGemma, bringing bespoke function calling to the edge](https://blog.google/technology/developers/functiongemma/) (December 2025)
- [FunctionGemma model card](https://ai.google.dev/gemma/docs/functiongemma/model_card)
- [Fine-tuning with FunctionGemma](https://ai.google.dev/gemma/docs/functiongemma/finetuning-with-functiongemma)
