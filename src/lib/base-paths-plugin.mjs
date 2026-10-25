// Sätteri hast plugin: prefixes root-relative src, poster and href values in Markdown
// posts with the site's base path, so authors can write `/images/...` and it still
// resolves when the site is served under a sub-path such as `/site`.
export default function basePathsPlugin(base = '/') {
  const prefix = base.replace(/\/$/, '');
  const fix = (v) =>
    typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') && !v.startsWith(prefix + '/') ? prefix + v : v;
  const attrs = ['src', 'poster', 'href'];
  return {
    name: 'base-paths',
    element: {
      filter: ['a', 'img', 'video', 'source'],
      visit(node, ctx) {
        if (!prefix) return;
        for (const k of attrs) {
          const v = node.properties?.[k];
          if (fix(v) !== v) ctx.setProperty(node, k, fix(v));
        }
      },
    },
    // Inline HTML (for example a <video> tag) arrives as a raw string
    raw(node, ctx) {
      if (!prefix) return;
      const value = node.value.replace(/\b(src|poster|href)="([^"]*)"/g, (_, k, v) => `${k}="${fix(v)}"`);
      if (value !== node.value) ctx.replaceNode(node, { type: 'raw', value });
    },
  };
}
