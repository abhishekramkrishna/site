// A small, deterministic model of Claude API prompt caching, for the playground in the
// prompt caching post. It follows the documented rules: the prompt renders as tools, then
// system, then messages; entries are written only at breakpoints that meet the model's
// minimum; reads look back up to 20 blocks for an earlier write; a hit refreshes the TTL;
// and an entry is readable only once the writing response has started.
// Python version with tests: prompt-caching-lab, cachelab/sim.py.

export type Ttl = '5m' | '1h';
export interface Block { section: 'tools' | 'system' | 'messages'; content: string; tokens: number; cache?: Ttl }
export interface Req { model: ModelId; blocks: Block[]; start: number }
export interface Res { read: number; written: number; uncached: number; ttft: number; cost: number; uncachedCost: number; start: number }

// USD per million tokens, from the Claude prompt caching docs, checked 27 Oct 2026.
export const MODELS = {
  'claude-sonnet-5-5': { label: 'Sonnet 5.5', base: 2, w5: 2.5, w1: 4, read: 0.1, min: 512 },
  'claude-opus-5-5': { label: 'Opus 5.5', base: 4, w5: 5, w1: 8, read: 0.2, min: 512 },
  'claude-haiku-4-5': { label: 'Haiku 4.5', base: 1, w5: 1.25, w1: 2, read: 0.1, min: 4096 },
} as const;
export type ModelId = keyof typeof MODELS;

const TTL_S: Record<Ttl, number> = { '5m': 300, '1h': 3600 };
const LOOKBACK = 20;

// Time to first token = fixed + per uncached token + per cached token. Fitted to our measured
// Claude Sonnet 5.5 runs through Claude Code (see the post); a model, not a promise.
export const LATENCY = { fixed: 1.35, perToken: 0.000018, perCached: 0.000001 };

function hash(s: string): string {
  // FNV-1a, enough to tell prefixes apart in a demo
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16);
}

export class Cache {
  entries = new Map<string, { expires: number; readableFrom: number; ttl: Ttl }>();

  send(req: Req): Res {
    const p = MODELS[req.model];
    const keys: string[] = [];
    const cum: number[] = [];
    let k: string = req.model;
    let n = 0;
    for (const b of req.blocks) { k = hash(k + '|' + b.section + '|' + b.content); keys.push(k); n += b.tokens; cum.push(n); }
    const marks = req.blocks.flatMap((b, i) => (b.cache ? [[i, b.cache] as const] : []));
    const t = req.start;
    const live = (i: number) => { const e = this.entries.get(keys[i]); return !!e && e.readableFrom <= t && t < e.expires; };
    let hit = -1;
    for (const [bp] of marks) for (let i = bp; i > Math.max(-1, bp - LOOKBACK); i--) if (live(i)) { hit = Math.max(hit, i); break; }
    if (hit >= 0) { const e = this.entries.get(keys[hit])!; e.expires = t + TTL_S[e.ttl]; }
    const read = hit >= 0 ? cum[hit] : 0;
    const writes = marks.filter(([i]) => i > hit && cum[i] >= p.min);
    const lastW = writes.length ? Math.max(...writes.map(([i]) => i)) : hit;
    const last1h = Math.max(hit, ...writes.filter(([, ttl]) => ttl === '1h').map(([i]) => i));
    const written = (lastW >= 0 ? cum[lastW] : 0) - read;
    const w1h = last1h > hit ? cum[last1h] - read : 0;
    const uncached = cum[cum.length - 1] - read - written;
    const ttft = LATENCY.fixed + (written + uncached) * LATENCY.perToken + read * LATENCY.perCached;
    for (const [i, ttl] of writes) if (!live(i)) this.entries.set(keys[i], { expires: t + TTL_S[ttl], readableFrom: t + ttft, ttl });
    const cost = (uncached * p.base + (written - w1h) * p.w5 + w1h * p.w1 + read * p.read) / 1e6;
    return { read, written, uncached, ttft, cost, uncachedCost: (cum[cum.length - 1] * p.base) / 1e6, start: t };
  }
}

export type ScenarioId = 'stable' | 'timestamp' | 'tools' | 'idle' | 'parallel' | 'below-min';
export const SCENARIOS: { id: ScenarioId; label: string; note: string }[] = [
  { id: 'stable', label: 'Stable prefix', note: 'The same tools and system prompt every time. Only the question at the end changes.' },
  { id: 'timestamp', label: 'Timestamp in system prompt', note: 'One line, "Current time: …", at the top of the system prompt.' },
  { id: 'tools', label: 'Per-user tool list', note: 'Each request carries a slightly different tool list, say per-user tools. Tools render first, so nothing after them matches.' },
  { id: 'idle', label: '6-minute gaps', note: 'Requests arrive 6 minutes apart. On the 5-minute TTL every entry expires first; try 1 hour.' },
  { id: 'parallel', label: '4 at once, then 2', note: 'Four requests fire together, two more follow 25 seconds later.' },
  { id: 'below-min', label: 'Too short to cache', note: 'A 3,000-token prompt on Haiku 4.5, whose minimum is 4,096 tokens. No error, no cache.' },
];

export function run(id: ScenarioId, model: ModelId, prefix: number, ttl: Ttl, n = 6): Res[] {
  const c = new Cache();
  const out: Res[] = [];
  const m: ModelId = id === 'below-min' ? 'claude-haiku-4-5' : model;
  const size = id === 'below-min' ? 3000 : prefix;
  for (let i = 0; i < n; i++) {
    const start = id === 'idle' ? i * 360 : id === 'parallel' ? (i < 4 ? 0 : 25) : i * 30;
    const tools: Block[] = [{ section: 'tools', content: id === 'tools' ? `search, account tools for user ${i}` : 'search', tokens: 400 }];
    const sys = id === 'timestamp' ? `Current time: 09:${String(i).padStart(2, '0')}\nYou are…` : 'You are…';
    out.push(c.send({ model: m, start, blocks: [
      ...tools,
      { section: 'system', content: sys, tokens: size, cache: ttl },
      { section: 'messages', content: `question ${i}`, tokens: 60 },
    ] }));
  }
  return out;
}
