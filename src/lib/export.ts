import type { Template } from './types'
import { iconSvgPaths, fillIcons } from './icon-svgs'

const FOOTER_LOGO_DEFAULT = 'https://pub-db8ed4fb33634589a6ce5fb07e85cb46.r2.dev/logo/op7_dash_odc/logo_op7nexo.svg'
const FOOTER_HREF_DEFAULT = 'https://www.instagram.com/op7franquias'
const FOOTER_COPYRIGHT_DEFAULT = '© 2026 OP7 Nexo · Todos os direitos reservados'

function ctaIconSvg(iconName: string): string {
  const paths = iconSvgPaths[iconName] ?? iconSvgPaths['Link']
  if (fillIcons.has(iconName)) {
    return `<svg viewBox="0 0 24 24" fill="currentColor">${paths}</svg>`
  }
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
}

const arrowSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M9 7h8v8"/></svg>`
const arrowSvg02 = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>`

export function generateHtml(t: Template): string {
  if (t.template_type === 'modelo02') return generateHtml02(t)
  return generateHtml01(t)
}

function footerLogoHtml(t: Template, heightPx: number): string {
  const url = t.footer_logo_url || FOOTER_LOGO_DEFAULT
  const href = t.footer_logo_href || FOOTER_HREF_DEFAULT
  const img = `<img src="${escHtml(url)}" alt="logo" style="display:block;height:${heightPx}px;width:auto;margin:0 auto 12px;">`
  if (href) return `<a href="${escHtml(href)}" target="_blank" rel="noopener">${img}</a>`
  return img
}

function headerLogoHtml(t: Template, logoWidth: number): string {
  const img = `<img src="${escHtml(t.logo_url)}" alt="${escHtml(t.name)}" style="width:${logoWidth}px;height:auto;display:block;">`
  if (t.logo_href) return `<a href="${escHtml(t.logo_href)}" target="_blank" rel="noopener noreferrer">${img}</a>`
  return img
}

// ── Modelo 01 export ──
function generateHtml01(t: Template): string {
  const accent = t.accent_color ?? '#A8D156'
  const logoWidth = t.logo_width ?? 170
  const headline = t.headline ?? 'Cuidar do seu sorriso,'
  const footerLogoWidth = t.footer_logo_width ?? 44
  const footerCopyright = t.footer_copyright || FOOTER_COPYRIGHT_DEFAULT

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
        ${headerLogoHtml(t, logoWidth)}
      </div>
      <h1 class="reveal" style="animation-delay:.18s">${escHtml(headline)}</h1>
      <p class="tagline reveal" style="animation-delay:.24s">${t.subtitle_html}</p>
    </header>
    <nav class="links" aria-label="Links principais">
${ctasHtml}
    </nav>
    <footer class="foot reveal" style="animation-delay:.86s">
      <div class="copyright">
        ${footerLogoHtml(t, footerLogoWidth)}
        &copy; ${escHtml(footerCopyright.replace('©', '').trim())}
      </div>
    </footer>
  </main>
</body>
</html>`
}

// ── Modelo 02 export ──
function generateHtml02(t: Template): string {
  const accent = t.accent_color ?? '#035dd7'
  const secondary = t.secondary_color ?? '#f15a24'
  const logoWidth = t.logo_width ?? 132
  const headline = t.headline ?? 'Transforme seus resultados.'
  const brandName = t.brand_name ?? ''
  const handle = t.handle ?? ''
  const footerLogoWidth = t.footer_logo_width ?? 44
  const footerCopyright = t.footer_copyright || FOOTER_COPYRIGHT_DEFAULT

  const ctasHtml = t.ctas.map((cta) => {
    const style = cta.style ?? 'light'
    const cls = style === 'dark' ? 'card dark' : style === 'accent' ? 'card accent-card' : 'card light'
    return `
    <a class="${cls}" href="${escHtml(cta.href)}" target="_blank" rel="noopener noreferrer">
      <span class="icon">${ctaIconSvg(cta.icon)}</span>
      <span class="card-text">
        <div class="card-title">${escHtml(cta.label)}</div>
        ${cta.meta ? `<div class="card-sub">${escHtml(cta.meta)}</div>` : ''}
      </span>
      <span class="arrow">${arrowSvg02}</span>
    </a>`
  }).join('\n')

  const handleRowHtml = (brandName || handle) ? `
  <div class="handle-row">
    ${brandName ? `<span class="brand-name">${escHtml(brandName)}</span>` : ''}
    ${handle ? `<span class="handle">${escHtml(handle)}</span>` : ''}
  </div>` : ''

  const ctaCount = String(t.ctas.length).padStart(2, '0')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(t.name)}</title>
<style>
  :root {
    --blue-deep: #0a3a8c;
    --blue-main: ${accent};
    --orange: ${secondary};
    --ink: #0c1b33;
    --paper: #f4f7fc;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(160deg, #eaf1fd 0%, #dbe9fb 35%, #eef3fb 70%, #ffffff 100%);
    color: var(--ink);
    min-height: 100vh;
    display:flex;
    justify-content:center;
  }
  .grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;
    background-image:linear-gradient(to right,rgba(10,58,140,0.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(10,58,140,0.05) 1px,transparent 1px);
    background-size:56px 56px;background-position:-1px -1px;
    mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,#000 40%,transparent 100%);
    -webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,#000 40%,transparent 100%)}
  .wrap {
    width: 100%;
    max-width: 460px;
    padding: 40px 20px 50px;
    position: relative;
    z-index: 1;
  }
  .logo-shell {
    width: ${logoWidth}px; height:${logoWidth}px;
    margin: 8px auto 22px;
    display:flex; align-items:center; justify-content:center;
    filter: drop-shadow(0 18px 32px rgba(10,58,140,0.28));
  }
  .logo-shell img { width: 100%; height:100%; object-fit:contain; }
  .handle-row {
    display:flex; align-items:center; justify-content:center;
    gap:10px; margin-bottom: 18px;
    font-size: 14px;
  }
  .brand-name { color:#5b6b85; letter-spacing:0.2px; }
  .handle {
    background: rgba(3,93,215,0.1);
    color: var(--blue-main);
    font-weight:700;
    padding: 4px 12px;
    border-radius: 999px;
    font-size:13px;
  }
  h1.hero {
    text-align:center;
    font-size: clamp(1.4rem, 8vw, 1.9rem);
    line-height:1.15;
    font-weight: 800;
    letter-spacing: -0.4px;
    color: var(--ink);
    margin-bottom: 16px;
  }
  p.sub {
    text-align:center;
    font-size: 1.02rem;
    color:#5b6b85;
    line-height:1.5;
    max-width: 360px;
    margin: 0 auto 36px;
  }
  p.sub strong { color: var(--ink); font-weight:700; }
  .section-label {
    display:flex; align-items:center; gap:14px;
    margin-bottom: 18px;
    font-size: 12px;
    letter-spacing: 2px;
    font-weight:700;
    color:#8a97ad;
  }
  .section-label .rule {
    flex:1; height:1px;
    background: linear-gradient(90deg, rgba(10,58,140,0.25), rgba(10,58,140,0.06));
  }
  .links { display:flex; flex-direction:column; gap:14px; }
  .card {
    display:flex; align-items:center; gap:14px;
    padding: 16px 18px;
    border-radius: 999px;
    text-decoration:none;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    position:relative;
    overflow:hidden;
  }
  .card:active { transform: scale(0.98); }
  .card.light {
    background: #ffffff;
    box-shadow: 0 6px 18px rgba(10,58,140,0.08);
    color: var(--ink);
  }
  .card.dark {
    background: linear-gradient(150deg, ${accent}bb 0%, ${accent} 50%, ${accent}dd 100%);
    color: #ffffff;
    box-shadow: 0 14px 30px ${accent}44, inset 0 1px 0 rgba(255,255,255,0.25);
  }
  .card.accent-card {
    background: linear-gradient(150deg, ${secondary}cc 0%, ${secondary} 50%, ${secondary}dd 100%);
    color: #ffffff;
    box-shadow: 0 14px 30px ${secondary}44, inset 0 1px 0 rgba(255,255,255,0.25);
  }
  .card.dark::before,
  .card.accent-card::before {
    content:'';
    position:absolute;
    top:0; left:0; right:0; bottom:0;
    background: linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0) 65%);
    pointer-events:none;
  }
  .icon {
    width: 46px; height:46px;
    border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0;
    position:relative; z-index:2;
  }
  .card.light .icon { background: rgba(3,93,215,0.08); color: var(--blue-main); }
  .card.dark .icon, .card.accent-card .icon { background: rgba(255,255,255,0.18); color:#fff; }
  .icon svg { width:21px; height:21px; }
  .card-text { flex:1; min-width:0; position:relative; z-index:2; }
  .card-title { font-weight:700; font-size:1.02rem; margin-bottom:2px; letter-spacing:-0.1px; }
  .card-sub { font-size:0.86rem; opacity:0.72; }
  .card.dark .card-sub, .card.accent-card .card-sub { opacity:0.85; }
  .arrow {
    width: 38px; height:38px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0;
    position:relative; z-index:2;
  }
  .card.light .arrow { background:#f1f4fa; color:#5b6b85; }
  .card.dark .arrow, .card.accent-card .arrow { background: rgba(255,255,255,0.18); color:#fff; }
  .arrow svg { width:16px; height:16px; }
  footer {
    text-align:center;
    margin-top: 44px;
    font-size: 0.78rem;
    color:#9aa6ba;
  }
  @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>
</head>
<body>
<div class="grid-bg" aria-hidden="true"></div>
<div class="wrap">
  <div class="logo-shell">
    ${headerLogoHtml(t, logoWidth)}
  </div>
  ${handleRowHtml}
  <h1 class="hero">${escHtml(headline)}</h1>
  <p class="sub">${t.subtitle_html}</p>
  <div class="section-label">
    LINKS <span class="rule"></span> ${ctaCount}
  </div>
  <div class="links">
${ctasHtml}
  </div>
  <footer>
    ${footerLogoHtml(t, footerLogoWidth)}
    ${escHtml(footerCopyright)}
  </footer>
</div>
</body>
</html>`
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
