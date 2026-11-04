// The "subagent or main loop?" check from the "When to spin up a subagent" post.
// Shared by the post's interactive checker and its test, so the text and the verdicts never disagree.
// Reasons and blockers are distilled from the sources the post links: Anthropic (Oct 2026 and
// June 2025), Cognition (Apr 2026), LangChain (June 2025) and the Claude Code team (Apr 2026).
// The verdict rule is the author's judgement, not a benchmark.

export type Kind = 'reason' | 'blocker';

export interface Question {
  id: string;
  kind: Kind;
  ask: string;
  why: string;
}

export const QUESTIONS: Question[] = [
  {
    id: 'reads-a-lot',
    kind: 'reason',
    ask: 'It reads a lot and returns a little',
    why: 'Dozens of files or pages in, a short answer out. A fresh context keeps the noise out of the main one.',
  },
  {
    id: 'parallel',
    kind: 'reason',
    ask: 'It splits into independent pieces that can run at once',
    why: 'Three or more pieces that need nothing from each other, mostly reading or searching.',
  },
  {
    id: 'fresh-eyes',
    kind: 'reason',
    ask: 'It needs eyes that did not do the work',
    why: 'A review or a check that should not inherit the author\'s assumptions.',
  },
  {
    id: 'different-access',
    kind: 'reason',
    ask: 'It needs different permissions or a different model',
    why: 'A read-only researcher, a cheaper model for bulk work, a stronger one for a hard step.',
  },
  {
    id: 'measured',
    kind: 'reason',
    ask: 'Your evals show the single loop getting worse',
    why: 'Measured context bloat, or the agent picking the wrong tool or skill, not a hunch.',
  },
  {
    id: 'writes-shared',
    kind: 'blocker',
    ask: 'It writes to the same files or state as other work',
    why: 'Two writers make conflicting choices nobody reconciles. Keep one writer.',
  },
  {
    id: 'needs-history',
    kind: 'blocker',
    ask: 'It needs the decisions made earlier in the conversation',
    why: 'If the brief would have to retell the whole session, the handoff loses what matters.',
  },
  {
    id: 'chained',
    kind: 'blocker',
    ask: 'Each step needs the previous step\'s output right away',
    why: 'A relay of agents passing state is a telephone game. One loop sees every step.',
  },
  {
    id: 'small',
    kind: 'blocker',
    ask: 'It is a few tool calls of work',
    why: 'Spinning up a context, a brief and a summary costs more than doing it.',
  },
];

export interface Verdict {
  key: 'loop' | 'split' | 'split-reads' | 'measure';
  label: string;
  advice: string;
}

const VERDICTS: Record<Verdict['key'], Omit<Verdict, 'key'>> = {
  loop: {
    label: 'Keep it in the main loop',
    advice: 'Nothing here pays for a second context. Give the loop a skill for the procedure and a tool for the data instead.',
  },
  split: {
    label: 'Spin up a subagent',
    advice: 'Call it like a tool: a clear objective, the tools it may use, and a short, fixed shape for what it returns. Check its result against real data.',
  },
  'split-reads': {
    label: 'Split the reading, keep one writer',
    advice: 'Fan out the read-only part in parallel and bring back compact findings. The main loop makes every edit.',
  },
  measure: {
    label: 'Keep it in the loop for now, and measure',
    advice: 'There is a reason to split and a reason not to. Run your evals both ways and keep the subagent only if the folded version scores worse.',
  },
};

export function verdict(yes: Iterable<string>): Verdict {
  const on = new Set(yes);
  const reasons = QUESTIONS.filter((q) => q.kind === 'reason' && on.has(q.id)).map((q) => q.id);
  const blockers = QUESTIONS.filter((q) => q.kind === 'blocker' && on.has(q.id)).map((q) => q.id);
  let key: Verdict['key'];
  if (reasons.length === 0) key = 'loop';
  else if (blockers.length === 0) key = 'split';
  else if (blockers.length === 1 && blockers[0] === 'writes-shared' && (on.has('reads-a-lot') || on.has('parallel'))) key = 'split-reads';
  else if (blockers.includes('small') && reasons.length === 1) key = 'loop';
  else key = 'measure';
  return { key, ...VERDICTS[key] };
}
