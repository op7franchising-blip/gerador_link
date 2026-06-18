import { notFound } from 'next/navigation'
import { getTemplateBySlug } from '@/lib/db'
import type { CTA } from '@/lib/types'
import { iconSvgPaths, fillIcons } from '@/lib/icon-svgs'

export const dynamic = 'force-dynamic'

function ctaIcon(iconName: string) {
  const paths = iconSvgPaths[iconName] ?? iconSvgPaths['Link']
  const isFill = fillIcons.has(iconName)
  return (
    <svg viewBox="0 0 24 24" fill={isFill ? 'currentColor' : 'none'} stroke={isFill ? 'none' : 'currentColor'}
      strokeWidth={isFill ? undefined : 1.6} strokeLinecap={isFill ? undefined : 'round'} strokeLinejoin={isFill ? undefined : 'round'}
      className="w-[18px] h-[18px]">
      <g dangerouslySetInnerHTML={{ __html: paths }} />
    </svg>
  )
}

function LogoLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  return <>{children}</>
}

function FooterLogo({ url, href, width }: { url: string; href: string; width: number }) {
  if (!url) return null
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="logo" style={{ height: width, width: 'auto', display: 'block', margin: '0 auto' }} />
  )
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer">{img}</a>
  return img
}

export default async function LinkBioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const template = await getTemplateBySlug(slug)
  if (!template) notFound()

  const ctas: CTA[] = Array.isArray(template.ctas) ? template.ctas : []
  const accent = template.accent_color ?? '#A8D156'
  const logoWidth = template.logo_width ?? 170
  const headline = template.headline ?? 'Cuidar do seu sorriso,'
  const footerLogoUrl = template.footer_logo_url ?? 'https://pub-db8ed4fb33634589a6ce5fb07e85cb46.r2.dev/logo/op7_dash_odc/logo_op7nexo.svg'
  const footerLogoHref = template.footer_logo_href ?? 'https://www.instagram.com/op7franquias'
  const footerLogoWidth = template.footer_logo_width ?? 44
  const footerCopyright = template.footer_copyright ?? '© 2026 OP7 Nexo · Todos os direitos reservados'

  if (template.template_type === 'modelo02') {
    const secondary = template.secondary_color ?? '#f15a24'
    return <Modelo02Page template={template} ctas={ctas} accent={accent} secondary={secondary} logoWidth={logoWidth} headline={headline} footerLogoUrl={footerLogoUrl} footerLogoHref={footerLogoHref} footerLogoWidth={footerLogoWidth} footerCopyright={footerCopyright} />
  }

  return <Modelo01Page template={template} ctas={ctas} accent={accent} logoWidth={logoWidth} headline={headline} footerLogoUrl={footerLogoUrl} footerLogoHref={footerLogoHref} footerLogoWidth={footerLogoWidth} footerCopyright={footerCopyright} />
}

// ── Modelo 01 ──
function Modelo01Page({ template, ctas, accent, logoWidth, headline, footerLogoUrl, footerLogoHref, footerLogoWidth, footerCopyright }: {
  template: Awaited<ReturnType<typeof getTemplateBySlug>> & object
  ctas: CTA[]; accent: string; logoWidth: number; headline: string
  footerLogoUrl: string; footerLogoHref: string; footerLogoWidth: number; footerCopyright: string
}) {
  if (!template) return null
  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#f3f3f1;--bg-2:#ebeae6;--ink:#0a0a0a;--ink-2:#1a1a1a;
          --muted:#6b6b66;--line:rgba(10,10,10,0.07);--line-2:rgba(10,10,10,0.12);
          --card:#ffffff;--card-ink:#0a0a0a;--accent:${accent};
        }
        body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);min-height:100vh;color:var(--ink)}
        @keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .reveal{opacity:0;transform:translateY(10px);animation:rise .55s cubic-bezier(.2,.7,.2,1) forwards}
        .link{display:flex;align-items:center;gap:14px;width:100%;padding:10px 18px 10px 10px;border-radius:999px;background:var(--card);color:var(--card-ink);text-decoration:none;border:1px solid rgba(10,10,10,.08);box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 8px 18px -8px rgba(0,0,0,.12);transition:transform .2s,border-color .25s}
        .link:hover{transform:translateY(-1px);border-color:var(--accent)}
        .ico{width:40px;height:40px;border-radius:999px;background:var(--bg-2);border:1px solid var(--line-2);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--ink-2);transition:background .25s,border-color .25s,color .25s}
        .link:hover .ico{background:var(--accent);border-color:var(--accent);color:#fff}
        .arrow{transition:transform .2s}
        .link:hover .arrow{transform:translateX(2px) rotate(-45deg)}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[580px] h-[580px] rounded-full opacity-30" style={{ background: accent, filter: 'blur(130px)', top: -180, left: -160 }} />
        <div className="absolute w-[580px] h-[580px] rounded-full opacity-25" style={{ background: accent, filter: 'blur(130px)', bottom: -220, right: -140 }} />
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to right,rgba(10,10,10,0.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(10,10,10,0.045) 1px,transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%,#000 40%,transparent 100%)',
          }}
        />
      </div>

      <main className="relative z-10 max-w-[480px] mx-auto px-5 pt-12 pb-16 flex flex-col items-center">
        <header className="flex flex-col items-center text-center mb-8">
          <div className="reveal mb-1" style={{ animationDelay: '.05s' }}>
            <LogoLink href={template.logo_href ?? ''}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={template.logo_url} alt={template.name} style={{ width: logoWidth, height: 'auto', display: 'block' }} />
            </LogoLink>
          </div>
          <h1 className="reveal font-semibold mt-2 mb-1" style={{ fontSize: 22, color: '#2E7370', lineHeight: 1.1, animationDelay: '.18s' }}>
            {headline}
          </h1>
          <p className="reveal text-sm" style={{ color: '#2E7370', maxWidth: 280, lineHeight: 1.4, animationDelay: '.24s' }}
            dangerouslySetInnerHTML={{ __html: template.subtitle_html }}
          />
        </header>

        <nav className="w-full flex flex-col gap-2.5" aria-label="Links">
          {ctas.map((cta, i) => (
            <a key={cta.id} className="link reveal" href={cta.href} target="_blank" rel="noopener noreferrer" style={{ animationDelay: `${0.34 + i * 0.08}s` }}>
              <span className="ico">{ctaIcon(cta.icon)}</span>
              <span className="flex-1 flex flex-col gap-0.5">
                <span className="text-[15px] font-medium tracking-[-0.01em]">{cta.label}</span>
                {cta.meta && <span className="text-xs" style={{ color: 'var(--muted)' }}>{cta.meta}</span>}
              </span>
              <span className="arrow w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <path d="M7 17 17 7" /><path d="M9 7h8v8" />
                </svg>
              </span>
            </a>
          ))}
        </nav>

        <footer className="mt-11 flex flex-col items-center gap-2">
          <FooterLogo url={footerLogoUrl} href={footerLogoHref} width={footerLogoWidth} />
          <p className="text-[11px] text-zinc-500 tracking-wide">{footerCopyright}</p>
        </footer>
      </main>
    </>
  )
}

// ── Modelo 02 ──
function Modelo02Page({ template, ctas, accent, secondary, logoWidth, headline, footerLogoUrl, footerLogoHref, footerLogoWidth, footerCopyright }: {
  template: Awaited<ReturnType<typeof getTemplateBySlug>> & object
  ctas: CTA[]; accent: string; secondary: string; logoWidth: number; headline: string
  footerLogoUrl: string; footerLogoHref: string; footerLogoWidth: number; footerCopyright: string
}) {
  if (!template) return null
  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Helvetica Neue',Arial,sans-serif;
          background:linear-gradient(160deg,#eaf1fd 0%,#dbe9fb 35%,#eef3fb 70%,#fff 100%);
          color:#0c1b33;min-height:100vh;display:flex;justify-content:center}
        .grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;
          background-image:linear-gradient(to right,rgba(10,58,140,0.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(10,58,140,0.05) 1px,transparent 1px);
          background-size:56px 56px;background-position:-1px -1px;
          mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,#000 40%,transparent 100%);
          -webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,#000 40%,transparent 100%)}
        .wrap{width:100%;max-width:460px;padding:40px 20px 50px;position:relative;z-index:1}
        .logo-shell{margin:8px auto 22px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 18px 32px rgba(10,58,140,0.28))}
        .logo-shell img{width:100%;height:100%;object-fit:contain}
        .handle-row{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:18px;font-size:14px}
        .brand-name{color:#5b6b85;letter-spacing:0.2px}
        .handle{background:rgba(3,93,215,0.1);color:${accent};font-weight:700;padding:4px 12px;border-radius:999px;font-size:13px}
        h1.hero{text-align:center;font-size:clamp(1.4rem,8vw,1.9rem);line-height:1.15;font-weight:800;letter-spacing:-0.4px;color:#0c1b33;margin-bottom:16px}
        p.sub{text-align:center;font-size:1.02rem;color:#5b6b85;line-height:1.5;max-width:360px;margin:0 auto 36px}
        p.sub strong{color:#0c1b33;font-weight:700}
        .section-label{display:flex;align-items:center;gap:14px;margin-bottom:18px;font-size:12px;letter-spacing:2px;font-weight:700;color:#8a97ad}
        .section-label .rule{flex:1;height:1px;background:linear-gradient(90deg,rgba(10,58,140,0.25),rgba(10,58,140,0.06))}
        .links{display:flex;flex-direction:column;gap:14px}
        .card{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:999px;text-decoration:none;transition:transform 0.18s ease,box-shadow 0.18s ease;position:relative;overflow:hidden}
        .card:active{transform:scale(0.98)}
        .card.light{background:#fff;box-shadow:0 6px 18px rgba(10,58,140,0.08);color:#0c1b33}
        .card.dark{background:linear-gradient(150deg,${accent}bb 0%,${accent} 50%,${accent}dd 100%);color:#fff;box-shadow:0 14px 30px ${accent}44,inset 0 1px 0 rgba(255,255,255,0.25)}
        .card.accent-card{background:linear-gradient(150deg,${secondary}cc 0%,${secondary} 50%,${secondary}dd 100%);color:#fff;box-shadow:0 14px 30px ${secondary}44,inset 0 1px 0 rgba(255,255,255,0.25)}
        .card.dark::before,.card.accent-card::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(180deg,rgba(255,255,255,0.32) 0%,rgba(255,255,255,0.1) 30%,rgba(255,255,255,0) 65%);pointer-events:none}
        .icon{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;z-index:2}
        .card.light .icon{background:rgba(3,93,215,0.08);color:${accent}}
        .card.dark .icon,.card.accent-card .icon{background:rgba(255,255,255,0.18);color:#fff}
        .icon svg{width:21px;height:21px}
        .card-text{flex:1;min-width:0;position:relative;z-index:2}
        .card-title{font-weight:700;font-size:1.02rem;margin-bottom:2px;letter-spacing:-0.1px}
        .card-sub{font-size:0.86rem;opacity:0.72}
        .card.dark .card-sub,.card.accent-card .card-sub{opacity:0.85}
        .arrow{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;z-index:2}
        .card.light .arrow{background:#f1f4fa;color:#5b6b85}
        .card.dark .arrow,.card.accent-card .arrow{background:rgba(255,255,255,0.18);color:#fff}
        .arrow svg{width:16px;height:16px}
        footer{text-align:center;margin-top:44px;font-size:0.78rem;color:#9aa6ba;display:flex;flex-direction:column;align-items:center}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>

      <div className="grid-bg" aria-hidden="true" />

      <div className="wrap">
        <div className="logo-shell" style={{ width: logoWidth, height: logoWidth }}>
          <LogoLink href={template.logo_href ?? ''}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={template.logo_url} alt={template.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </LogoLink>
        </div>

        {(template.brand_name || template.handle) && (
          <div className="handle-row">
            {template.brand_name && <span className="brand-name">{template.brand_name}</span>}
            {template.handle && <span className="handle">{template.handle}</span>}
          </div>
        )}

        <h1 className="hero">{headline}</h1>
        <p className="sub" dangerouslySetInnerHTML={{ __html: template.subtitle_html }} />

        <div className="section-label">
          LINKS <span className="rule"></span> {String(ctas.length).padStart(2, '0')}
        </div>

        <div className="links">
          {ctas.map((cta) => {
            const style = cta.style ?? 'light'
            const cls = style === 'dark' ? 'card dark' : style === 'accent' ? 'card accent-card' : 'card light'
            return (
              <a key={cta.id} className={cls} href={cta.href} target="_blank" rel="noopener noreferrer">
                <span className="icon">{ctaIcon(cta.icon)}</span>
                <span className="card-text">
                  <div className="card-title">{cta.label}</div>
                  {cta.meta && <div className="card-sub">{cta.meta}</div>}
                </span>
                <span className="arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </a>
            )
          })}
        </div>

        <footer>
          <FooterLogo url={footerLogoUrl} href={footerLogoHref} width={footerLogoWidth} />
          <p style={{ marginTop: footerLogoUrl ? 8 : 0 }}>{footerCopyright}</p>
        </footer>
      </div>
    </>
  )
}
