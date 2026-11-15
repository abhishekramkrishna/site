---
title: "What an invoice extractor should return besides the total"
description: Valid JSON can still hold the wrong amount. Why an invoice extractor should return the line that supports its answer, how to verify it in code, and when a small model beats the rules you already have.
pubDate: 2026-11-15T15:00:00Z
tags: [small-models, engineering, business]
draft: false
cover:
  image: ../../assets/covers/invoice-extraction-needs-evidence.png
  thumb: ../../assets/covers/invoice-extraction-needs-evidence-thumb.png
  alt: "A verified total needs the value and the evidence. An invoice with subtotal $100.00, tax $18.00, total $118.00 highlighted, and a prior balance of $50.00, next to the extractor's answer: amount 118.00 and the line \"Total: $118.00\". Checks: the quoted line exists, a money parser agrees, there is only one plausible total, otherwise a person reviews it."
---

An invoice says "Total: $118.00". Two lines down it says "Prior balance: $50.00". Your extraction service returns perfectly valid JSON:

```json
{ "currency": "USD", "amount": "168.00" }
```

The schema check passes. The amount is wrong. And the person approving the payment has nothing to check it against except the original PDF, which is exactly the work you were trying to save them.

This is part 3 of the [small language models series](/blog/what-is-a-small-language-model/). The argument is simple: an extractor should return the evidence for its answer, and your code should verify that evidence before anyone trusts the number.

**The short version**

- A valid schema is not a correct answer. Ask for the amount and the exact source line that supports it.
- Verify in code: the quoted line exists in the document, a deterministic parser reads the same amount, and there's only one plausible total.
- Use rules where they already work. Bring in a small model for the messier supplier formats, and judge it on verified invoices per hour after corrections.

## Why this is worth getting right

Accounts payable is a big, measurable cost. Ardent Partners' [AP Metrics That Matter in 2025](https://www.apexanalytix.com/resources/blog/ardent-partners-key-ap-metrics-2025/) puts the average cost to process an invoice at $9.40, against $2.78 for best-in-class teams that have automated. The average invoice takes 9.2 days to process, and 14% still end up as exceptions.

Most of the gap between $9.40 and $2.78 is people touching invoices that a machine could have handled, and exceptions that bounce back and forth. An extractor that's right most of the time but can't show why doesn't close that gap. Someone still opens every PDF to be sure.

## Ask for the evidence, not just the answer

Change the contract. Instead of a bare amount, ask for:

- the currency and amount,
- the exact text of the line it came from,
- and, for multi-page documents, the page or line reference.

```json
{ "amount": "118.00", "line": "Total: $118.00" }
```

Then verify it with ordinary code:

1. **The quote exists.** The returned line must appear in the source text. If it doesn't, the model made it up, and the invoice goes to review.
2. **An independent parser agrees.** Parse the amount from the quoted line with a deterministic money parser. If the parser and the model disagree, review.
3. **There's only one plausible total.** If the document has two lines that both look like totals, don't let the model pick. Send it to a person.
4. **Keep the evidence.** Store the quoted line with the approved record, so an auditor can see why the system paid $118.

The reviewer's job also gets easier. Instead of hunting through the PDF, they see the proposed amount next to the line it came from.

If scanned documents are in scope, keep OCR failures separate from extraction failures. They have different fixes, and you want to test both on new supplier templates.

## Rules first, then a small model where rules run out

On a five-invoice synthetic fixture, a plain rules extractor that looks for a line labelled "Total" handled every case correctly. It accepted three invoices and sent two to review: one with no explicit total line, and one with two conflicting totals. That's the right behaviour.

So why bring in a model at all? Because real suppliers don't all write "Total:". They write "Amount due", "Balance payable", "Gesamtbetrag", or put the number in a table cell three columns from its label. Each new format is another rule to write and maintain.

That's the gap to test a small model on. Before you do, establish that the gap exists: collect invoices from new supplier templates your rules miss, and check that writing more rules isn't the cheaper fix. Then compare rules and a small model on that shared holdout, with the same verification step in front of both.

The model never gets the final say. It proposes an amount and a line, and the same checks above decide whether to accept it.

## What to measure

- **Verified invoices per hour**, including the time spent correcting the ones that went to review. This is the number that moves the cost per invoice.
- **Downstream corrections**, meaning invoices that were accepted automatically and later found to be wrong. Keep this near zero.
- **Exception rate by supplier template**, so you can see where the model helps and where it doesn't.

## Takeaway

Use deterministic extraction for the templates it already covers. Introduce a small model for the formats where it increases verified throughput after correction time, and make every answer carry its evidence.

**Small language models series:** part 3 of 8. Previous: [Can a small model route support tickets better than keywords?](/blog/small-models-for-support-ticket-routing/) Next: [When does a small-model first pass actually save money?](/blog/when-a-small-model-first-pass-saves-money/)

---

**Sources**

- [Ardent Partners, AP Metrics That Matter in 2025, via apexanalytix](https://www.apexanalytix.com/resources/blog/ardent-partners-key-ap-metrics-2025/) (2025)
- [Ollama: structured outputs](https://docs.ollama.com/capabilities/structured-outputs)
- The five-invoice fixture is synthetic and illustrative.
