import { notFound } from 'next/navigation'
import { getTemplateBySlug } from '@/lib/db'
import type { CTA } from '@/lib/types'
import { iconSvgPaths, fillIcons } from '@/lib/icon-svgs'

export const dynamic = 'force-dynamic'

function ctaIcon(iconName: string) {
  const paths = iconSvgPaths[iconName] ?? iconSvgPaths['Link']
  const isFill = fillIcons.has(iconName)
  return (
    <svg
      viewBox="0 0 24 24"
      fill={isFill ? 'currentColor' : 'none'}
      stroke={isFill ? 'none' : 'currentColor'}
      strokeWidth={isFill ? undefined : 1.6}
      strokeLinecap={isFill ? undefined : 'round'}
      strokeLinejoin={isFill ? undefined : 'round'}
      className="w-[18px] h-[18px]"
    >
      <g dangerouslySetInnerHTML={{ __html: paths }} />
    </svg>
  )
}

export default async function LinkBioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const template = await getTemplateBySlug(slug)
  if (!template) notFound()

  const ctas: CTA[] = Array.isArray(template.ctas) ? template.ctas : []
  const accent = template.accent_color ?? '#A8D156'
  const logoWidth = template.logo_width ?? 170
  const headline = template.headline ?? 'Cuidar do seu sorriso,'

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="reveal mb-1" style={{ animationDelay: '.05s' }}>
            <img src={template.logo_url} alt={template.name} style={{ width: logoWidth, height: 'auto', display: 'block' }} />
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
            <a
              key={cta.id}
              className="link reveal"
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ animationDelay: `${0.34 + i * 0.08}s` }}
            >
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <a href="https://www.op7franchising.com/" target="_blank" rel="noopener">
            <img src="https://pub-db8ed4fb33634589a6ce5fb07e85cb46.r2.dev/logo/op7_dash_odc/logo_op7nexo.svg" alt="OP7 Nexo" className="h-11 w-auto" />
          </a>
          <p className="text-[11px] text-zinc-500 tracking-wide">© 2026 OP7 Nexo · Todos os direitos reservados</p>
        </footer>
      </main>
    </>
  )
}
