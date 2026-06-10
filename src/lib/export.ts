import type { Template } from './types'
import { iconSvgPaths, fillIcons } from './icon-svgs'

function ctaIconSvg(iconName: string): string {
  const paths = iconSvgPaths[iconName] ?? iconSvgPaths['Link']
  if (fillIcons.has(iconName)) {
    return `<svg viewBox="0 0 24 24" fill="currentColor">${paths}</svg>`
  }
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
}

const arrowSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M9 7h8v8"/></svg>`

export function generateHtml(t: Template): string {
  const accent = t.accent_color ?? '#A8D156'
  const logoWidth = t.logo_width ?? 170
  const headline = t.headline ?? 'Cuidar do seu sorriso,'

  const ctasHtml = t.ctas.map((cta, i) => `
      <a class="link" href="${escHtml(cta.href)}" target="_blank" rel="noopener" style="animation-delay:${(0.34 + i * 0.08).toFixed(2)}s">
        <span class="ico" aria-hidden="true">${ctaIconSvg(cta.icon)}</span>
        <span class="body">
          <span class="label">${escHtml(cta.label)}</span>${cta.meta ? `\n          <span class="meta">${escHtml(cta.meta)}</span>` : ''}
        </span>
        <span class="arrow" aria-hidden="true">${arrowSvg}</span>
      </a>`).join('\n')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>${escHtml(t.name)} — Links</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    :root{
      --bg:#f3f3f1;--bg-2:#ebeae6;--ink:#0a0a0a;--ink-2:#1a1a1a;
      --muted:#6b6b66;--line:rgba(10,10,10,0.07);--line-2:rgba(10,10,10,0.12);
      --card:#ffffff;--card-ink:#0a0a0a;--accent:${accent};
    }
    html,body{margin:0;padding:0}
    body{font-family:"Inter",ui-sans-serif,system-ui,-apple-system,sans-serif;color:var(--ink);background:var(--bg);min-height:100vh}
    .grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;
      background-image:linear-gradient(to right,rgba(10,10,10,0.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(10,10,10,0.045) 1px,transparent 1px);
      background-size:56px 56px;background-position:-1px -1px;
      mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,#000 40%,transparent 100%);
      -webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,#000 40%,transparent 100%)}
    .ambient{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
    .ambient::before,.ambient::after{content:"";position:absolute;width:580px;height:580px;border-radius:50%;filter:blur(130px);opacity:.32}
    .ambient::before{background:var(--accent);top:-180px;left:-160px}
    .ambient::after{background:var(--accent);bottom:-220px;right:-140px;opacity:.28}
    main{position:relative;z-index:1;max-width:480px;margin:0 auto;padding:48px 20px 64px;display:flex;flex-direction:column;align-items:center}
    .header{display:flex;flex-direction:column;align-items:center;text-align:center;margin-bottom:32px}
    .avatar{width:${logoWidth}px;height:auto;background:transparent;display:block;box-shadow:none;position:relative}
    .avatar img{width:100%;height:auto;display:block}
    h1{margin:10px 0 6px;font-size:clamp(20px,5vw,24px);font-weight:600;letter-spacing:-0.02em;line-height:1.05;color:#2E7370}
    .tagline{color:#2E7370;font-size:15px;max-width:320px;line-height:1.4;margin:6px 0 0}
    .tagline strong{color:#2E7370;font-weight:600}
    nav.links{width:100%;display:flex;flex-direction:column;gap:10px}
    .link{position:relative;display:flex;align-items:center;gap:14px;width:100%;padding:10px 18px 10px 10px;border-radius:999px;background:var(--card);color:var(--card-ink);text-decoration:none;border:1px solid rgba(10,10,10,.08);box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 8px 18px -8px rgba(0,0,0,.12);transition:transform .2s,border-color .25s}
    .link:hover,.link:focus-visible{transform:translateY(-1px);border-color:var(--accent);outline:none}
    .ico{width:40px;height:40px;border-radius:999px;background:var(--bg-2);border:1px solid var(--line-2);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--ink-2);transition:background .25s,border-color .25s,color .25s}
    .ico svg{width:18px;height:18px}
    .link:hover .ico,.link:focus-visible .ico{background:var(--accent);border-color:var(--accent);color:#fff}
    .body{flex:1;display:flex;flex-direction:column;gap:2px}
    .label{font-size:15px;font-weight:500;letter-spacing:-0.01em}
    .meta{font-size:12px;color:var(--muted)}
    .arrow{width:28px;height:28px;border-radius:50%;background:rgba(10,10,10,.05);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .2s}
    .arrow svg{width:13px;height:13px}
    .link:hover .arrow,.link:focus-visible .arrow{transform:translateX(2px) rotate(-45deg)}
    .foot{margin-top:44px;display:flex;flex-direction:column;align-items:center;gap:14px;color:var(--muted);font-size:11px;letter-spacing:.06em}
    .copyright{text-align:center;font-size:11px;color:var(--muted)}
    @keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .reveal{opacity:0;transform:translateY(10px);animation:rise .55s cubic-bezier(.2,.7,.2,1) forwards}
    @media(min-width:720px){main{padding-top:64px}.avatar{width:${logoWidth}px;height:auto}}
    @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
  </style>
</head>
<body>
  <div class="grid-bg" aria-hidden="true"></div>
  <div class="ambient" aria-hidden="true"></div>
  <main>
    <header class="header">
      <div class="avatar reveal" style="animation-delay:.05s" aria-hidden="true">
        <img src="${escHtml(t.logo_url)}" alt="${escHtml(t.name)}" style="width:100%;height:auto;display:block;">
      </div>
      <h1 class="reveal" style="animation-delay:.18s">${escHtml(headline)}</h1>
      <p class="tagline reveal" style="animation-delay:.24s">${t.subtitle_html}</p>
    </header>
    <nav class="links" aria-label="Links principais">
${ctasHtml}
    </nav>
    <footer class="foot reveal" style="animation-delay:.86s">
      <div class="copyright">
        <a href="https://www.op7franchising.com/" target="_blank" rel="noopener">
          <img src="https://pub-db8ed4fb33634589a6ce5fb07e85cb46.r2.dev/logo/op7_dash_odc/logo_op7nexo.svg" alt="OP7 Nexo" style="display:block;height:44px;width:auto;margin:0 auto 12px;">
        </a>
        &copy; 2026 OP7 Nexo &middot; Todos os direitos reservados
      </div>
    </footer>
  </main>
</body>
</html>`
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
