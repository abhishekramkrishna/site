// The 10-point agent-readiness audit from the "Is your codebase agent-ready?" post.
// Each point scores 0 (missing), 1 (partly) or 2 (in place). Shared by the scorecard figure
// and the interactive scorer, so the post, the figure and the scorer never disagree.
export interface AuditPoint {
  n: number;
  name: string;
  check: string;
  // Scores for the two repos scored in the post, measured 28 Oct 2026
  site: 0 | 1 | 2;
  lab: 0 | 1 | 2;
}

export const POINTS: AuditPoint[] = [
  { n: 1, name: 'A short map for agents', check: 'An AGENTS.md or CLAUDE.md under about 150 lines: what this is, where things live, which commands to run', site: 2, lab: 1 },
  { n: 2, name: 'One command that means done', check: 'A single command runs everything CI runs, and the map names it', site: 2, lab: 1 },
  { n: 3, name: 'Feedback in seconds', check: 'Lint, types and the relevant tests run locally in under a minute', site: 2, lab: 2 },
  { n: 4, name: 'Rules a machine enforces, with the fix in the error', check: 'Architecture and conventions are checked by linters or tests whose messages say how to fix them', site: 1, lab: 1 },
  { n: 5, name: 'Knowledge lives in the repo', check: 'Decisions, runbooks and "how we do X here" are versioned files, not chat threads or memory', site: 1, lab: 2 },
  { n: 6, name: 'One way to do each thing', check: 'New code has one obvious pattern to copy; old patterns are migrated or marked', site: 2, lab: 2 },
  { n: 7, name: 'A clean environment in one step', check: 'A fresh, isolated checkout builds and tests with one setup step and pinned versions', site: 1, lab: 1 },
  { n: 8, name: 'The agent can see the result', check: 'It can run the app, take screenshots and read logs, not only read the code', site: 2, lab: 2 },
  { n: 9, name: 'Hard limits are configuration, not prose', check: 'Never-rules are hooks, deny rules, sandboxes or required checks, not sentences in a prompt', site: 1, lab: 0 },
  { n: 10, name: 'Someone cleans up after the agents', check: 'A recurring job finds drift, stale docs and dead code, and opens small PRs', site: 0, lab: 1 },
];

export const MAX = POINTS.length * 2;
export const total = (key: 'site' | 'lab') => POINTS.reduce((a, p) => a + p[key], 0);

// What a total means. Thresholds are the author's judgement, not a benchmark.
export function band(score: number): { label: string; advice: string } {
  if (score >= 15) return { label: 'Ready for background agents', advice: 'Agents can take queued work and open PRs on their own. Keep point 10 running so it stays that way.' };
  if (score >= 9) return { label: 'Ready for supervised agents', advice: 'Agents help with a person watching each session. Fix your zeros first, starting with points 2 and 9.' };
  return { label: 'Not ready yet', advice: 'Agents will write code that does not fit. Start with points 1, 2 and 9: a map, one command and hard limits.' };
}
