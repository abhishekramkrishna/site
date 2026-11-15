---
title: "Assume agents can read your shipped code"
description: Coding agents can now reverse-engineer shipped packages, CLIs and WASM in minutes. With 71% of iOS apps leaking a hardcoded secret, here are five checks engineering leaders should run on what their teams ship.
pubDate: 2026-11-15
tags: [agents, engineering]
draft: false
cover:
  image: ../../assets/covers/assume-agents-can-read-your-shipped-code.png
  thumb: ../../assets/covers/assume-agents-can-read-your-shipped-code-thumb.png
  alt: "Anything you ship is now cheap to read. 71% of 156,000 iOS apps leaked at least one hardcoded secret. 28.65 million new secrets were pushed to public GitHub in 2025, up 34%. Leaked AI-service keys rose 81%. Move secrets and enforcement to the server, treat obfuscation as a speed bump, and red-team your own release build with an agent."
---

"Coding agents can reverse-engineer shipped packages, CLIs, and WASM in minutes."

That is Timo Zhang, a developer who has just open-sourced [Blind LLM Agents](https://github.com/qybaihe/bla), a tool that makes shipped code harder for AI agents to read. It hardens an existing build with renaming, string encryption, build polymorphism, decoy code and integrity self-checks, without changing what the program does. His argument, as [The Register reported](https://www.theregister.com/ai-and-ml/2026/11/10/to-thwart-reverse-engineering-by-agents-dev-proposes-blinding-them/5308897), is that "classic obfuscation was built for humans and static tools, not LLMs that reason about meaning."

Even he doesn't oversell it: "We raise the cost — we don't claim it is unbreakable." The project says it doesn't promise protection against traditional interactive tools such as Ghidra or Frida.

The tool matters less than the assumption behind it. **Anything you ship to a customer's machine is now cheap to read.**

**The short version**

- Reading a binary used to take a specialist. Now it takes a prompt. Plan as if every client build will be read.
- There is a lot to find. 71% of 156,000 iOS apps leaked at least one hardcoded secret, and 28.65 million new secrets reached public GitHub in 2025.
- Move secrets and enforcement to the server, treat obfuscation as a speed bump, and point an agent at your own release build before someone else does.

## There is a lot sitting in shipped code

Two data points show how much is already exposed, before any agent gets involved.

In 2025, researchers at Cybernews scanned 156,000 iOS apps. [71% leaked at least one hardcoded secret](https://www.malwarebytes.com/blog/news/2025/03/research-on-ios-apps-shows-widespread-exposure-of-secrets), with an average of 5.2 per app and more than 815,000 in total.

GitGuardian's [State of Secrets Sprawl 2026](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/) counted 28.65 million new hardcoded secrets in public GitHub commits in 2025, up 34%, the largest jump the report has recorded. Leaked AI-service keys rose 81% to about 1.27 million. And secrets don't expire on their own: more than 64% of the credentials confirmed valid in 2022 still worked when retested in January 2026.

None of this needed an agent to find. What changes is the cost. An agent can unpack a bundle, follow the calls and explain what a licence check does, in minutes, for anyone who asks.

## Five things to check

### 1. Secrets in client code

API keys and tokens in a mobile app, CLI or browser bundle were never safe. Now they're found in minutes.

A common one: an LLM API key embedded in a mobile app so it can call the model directly. Anyone who extracts it can run up your bill or reach whatever else that key can reach. Route the call through your backend instead, scope keys to the least they need, and rotate anything that has ever shipped, because an old build in someone's download folder still contains it.

### 2. Checks that only run on the client

Licence checks in a desktop app, an "enterprise tier" flag in a JavaScript bundle, pricing logic compiled to WASM. If the client enforces it, assume it can be read and bypassed.

The fix is the same in each case: the client can show the state, but the server decides it. A feature unlocked on the client should still fail on the server if the account isn't entitled to it.

### 3. Obfuscation as a control

Obfuscation, including tools like Blind LLM Agents, adds cost and friction. That has value: it slows casual copying and raises the bar for automated analysis. Treat it as a speed bump, never as the thing standing between you and an incident.

### 4. Where your advantage actually sits

If a competitor could rebuild your product from the binary, the binary wasn't the moat. Data, operations, distribution, customer relationships and speed of iteration are much harder to copy. This is a useful question for a product leader as well as a security one.

### 5. Your own red team

Point a coding agent at your release build before someone else does. Ask it three things:

1. What secrets, keys or internal URLs can you find?
2. How does the licence or entitlement check work?
3. How would you bypass it?

Put that run in your release checklist for anything that ships to a customer's machine: mobile apps, desktop apps, CLIs, browser bundles and WASM. If you already watch what coding agents do on your engineers' laptops, as I described in [What Uber's ADR shows about securing the coding agents your engineers already use](/blog/ubers-adr-securing-coding-agents/), this is the same idea pointed outwards: assume the agent on the other side is just as capable.

## What to do this quarter

Start with an inventory of everything you ship to client machines, then run the three-question agent review against the latest build of each. Most teams will find the first two checks produce the work: a few keys to move and rotate, and a few client-side checks to enforce on the server. Those are small, well-understood fixes. The point is to make them before someone else's agent finds them.

---

**Sources**

- [The Register on Blind LLM Agents](https://www.theregister.com/ai-and-ml/2026/11/10/to-thwart-reverse-engineering-by-agents-dev-proposes-blinding-them/5308897) (November 2026)
- [Blind LLM Agents on GitHub](https://github.com/qybaihe/bla)
- [Malwarebytes: Research on iOS apps shows widespread exposure of secrets](https://www.malwarebytes.com/blog/news/2025/03/research-on-ios-apps-shows-widespread-exposure-of-secrets) (March 2025)
- [GitGuardian: The State of Secrets Sprawl 2026](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/) (March 2026)
