'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Download, Eye, Loader2, Image as ImageIcon } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import CTAEditor from './CTAEditor'
import type { Template, CTA } from '@/lib/types'
import { iconSvgPaths, fillIcons } from '@/lib/icon-svgs'

const FOOTER_LOGO_DEFAULT = 'https://pub-db8ed4fb33634589a6ce5fb07e85cb46.r2.dev/logo/op7_dash_odc/logo_op7nexo.svg'
const FOOTER_HREF_DEFAULT = 'https://www.instagram.com/op7franquias'
const FOOTER_COPYRIGHT_DEFAULT = '© 2026 OP7 Nexo · Todos os direitos reservados'

interface Props {
  initial?: Template
  templateType?: 'modelo01' | 'modelo02'
}

const DEFAULT_CTAS_M01: CTA[] = [
  { id: '1', label: 'Agende uma avaliação', href: '#', icon: 'CalendarCheck' },
  { id: '2', label: 'Entre em contato agora', href: 'https://wa.me/55', icon: 'WhatsApp' },
  { id: '3', label: 'Ver localização', href: 'https://maps.google.com', icon: 'MapPin', meta: '' },
  { id: '4', label: 'Conheça nosso site', href: 'https://', icon: 'Globe' },
  { id: '5', label: 'Visite nossa página', href: 'https://instagram.com', icon: 'Instagram' },
]

const DEFAULT_CTAS_M02: CTA[] = [
  { id: '1', label: 'O que a OP7 faz', meta: 'Conheça nosso modelo de franquia', href: '#', icon: 'Globe', style: 'dark' },
  { id: '2', label: 'Baixe nosso pitch de investimento', meta: 'PDF · Apresentação completa', href: '#', icon: 'Download', style: 'accent' },
  { id: '3', label: 'Fale com um especialista', meta: 'WhatsApp · Resposta rápida', href: 'https://wa.me/55', icon: 'WhatsApp', style: 'light' },
  { id: '4', label: 'Visite nossa página', meta: 'op7franchising.com', href: 'https://', icon: 'Globe', style: 'light' },
  { id: '5', label: 'Onde estamos localizados', meta: 'Veja nossas unidades', href: 'https://maps.google.com', icon: 'MapPin', style: 'dark' },
]

export default function TemplateEditor({ initial, templateType: templateTypeProp }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const ttype = initial?.template_type ?? templateTypeProp ?? 'modelo01'
  const isM02 = ttype === 'modelo02'

  const [name, setName] = useState(initial?.name ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [logoUrl, setLogoUrl] = useState(initial?.logo_url ?? (isM02 ? '' : 'https://pub-db8ed4fb33634589a6ce5fb07e85cb46.r2.dev/landingpage_odc_franchising/logo_odontocompany%20(2).svg'))
  const [logoWidth, setLogoWidth] = useState(initial?.logo_width ?? (isM02 ? 132 : 170))
  const [logoHref, setLogoHref] = useState(initial?.logo_href ?? '')
  const [headline, setHeadline] = useState(initial?.headline ?? (isM02 ? 'Transforme seus resultados.' : 'Cuidar do seu sorriso,'))
  const [subtitleHtml, setSubtitleHtml] = useState(
    initial?.subtitle_html ?? (isM02
      ? 'Modelo de franquia testado, suporte completo e oportunidade real para <strong>quem quer empreender com segurança</strong>.'
      : 'é o nosso <strong>compromisso</strong>.')
  )
  const [accentColor, setAccentColor] = useState(initial?.accent_color ?? (isM02 ? '#035dd7' : '#A8D156'))
  const [secondaryColor, setSecondaryColor] = useState(initial?.secondary_color ?? '#f15a24')
  const [brandName, setBrandName] = useState(initial?.brand_name ?? (isM02 ? 'OP7 Franchising' : ''))
  const [handle, setHandle] = useState(initial?.handle ?? (isM02 ? '@op7.franchising' : ''))
  const [footerLogoUrl, setFooterLogoUrl] = useState(initial?.footer_logo_url ?? FOOTER_LOGO_DEFAULT)
  const [footerLogoHref, setFooterLogoHref] = useState(initial?.footer_logo_href ?? FOOTER_HREF_DEFAULT)
  const [footerLogoWidth, setFooterLogoWidth] = useState(initial?.footer_logo_width ?? 44)
  const [footerCopyright, setFooterCopyright] = useState(initial?.footer_copyright ?? FOOTER_COPYRIGHT_DEFAULT)
  const [ctas, setCtas] = useState<CTA[]>(initial?.ctas ?? (isM02 ? DEFAULT_CTAS_M02 : DEFAULT_CTAS_M01))

  const autoSlug = useCallback((n: string) => {
    return n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const body = {
        name, slug: slug || autoSlug(name),
        template_type: ttype,
        logo_url: logoUrl, logo_width: logoWidth, logo_href: logoHref,
        headline, subtitle_html: subtitleHtml,
        accent_color: accentColor, secondary_color: secondaryColor,
        brand_name: brandName, handle,
        footer_logo_url: footerLogoUrl, footer_logo_href: footerLogoHref,
        footer_logo_width: footerLogoWidth, footer_copyright: footerCopyright,
        ctas,
      }
      const res = initial
        ? await fetch(`/api/templates/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch('/api/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(await res.text())
      const saved = await res.json()
      if (!initial) router.push(`/editor/${saved.id}`)
    } catch (e) {
      alert('Erro ao salvar: ' + String(e))
    } finally {
      setSaving(false)
    }
  }

  async function handleExport() {
    if (!initial?.id) { alert('Salve primeiro para exportar.'); return }
    window.open(`/api/export/${initial.id}`, '_blank')
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* ── Editor panel ── */}
      <div className="w-[420px] flex-shrink-0 overflow-y-auto border-r border-zinc-100 bg-zinc-50">
        <div className="p-5 space-y-6">

          {/* Header actions */}
          <div className="flex items-center gap-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-dark text-white text-sm font-medium hover:bg-teal-800 transition-colors disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Salvar
            </button>
            {initial && (
              <>
                <a href={`/${initial.slug}`} target="_blank" className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-600 hover:border-zinc-300 transition-colors">
                  <Eye size={14} />
                  Preview
                </a>
                <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-600 hover:border-zinc-300 transition-colors">
                  <Download size={14} />
                  HTML
                </button>
              </>
            )}
            <span className={`ml-auto text-[10px] font-bold px-2 py-1 rounded-md ${isM02 ? 'bg-blue-100 text-blue-700' : 'bg-zinc-200 text-zinc-600'}`}>
              {isM02 ? 'Modelo 02' : 'Modelo 01'}
            </span>
          </div>

          {/* Name + slug */}
          <Section title="Identificação">
            <Field label="Nome do template">
              <input className={input} value={name} onChange={(e) => { setName(e.target.value); if (!initial) setSlug(autoSlug(e.target.value)) }} placeholder="Ex: Odontocompany SP" />
            </Field>
            <Field label="Slug (URL pública)">
              <div className="flex items-center gap-1">
                <span className="text-sm text-zinc-400 shrink-0">/</span>
                <input className={input} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="odontocompany-sp" />
              </div>
            </Field>
          </Section>

          {/* Modelo 02 — brand identity */}
          {isM02 && (
            <Section title="Identidade da marca">
              <Field label="Nome da marca">
                <input className={input} value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Ex: OP7 Franchising" />
              </Field>
              <Field label="Handle / @usuario">
                <input className={input} value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@op7.franchising" />
              </Field>
            </Section>
          )}

          {/* Logo */}
          <Section title="Logo">
            <Field label="URL da imagem">
              <input className={input} value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Link da logo (opcional)">
              <input className={input} value={logoHref} onChange={(e) => setLogoHref(e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Largura (px)">
              <div className="flex items-center gap-2">
                <input type="range" min={60} max={380} step={10} value={logoWidth} onChange={(e) => setLogoWidth(Number(e.target.value))} className="flex-1 accent-brand-green" />
                <span className="text-xs text-zinc-500 w-12 text-right">{logoWidth}px</span>
              </div>
            </Field>
            {logoUrl ? (
              <div className="mt-2 flex justify-center p-3 bg-white rounded-lg border border-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="preview" style={{ width: logoWidth, height: 'auto' }} className="object-contain max-h-24" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-16 bg-white rounded-lg border border-dashed border-zinc-200 text-zinc-300">
                <ImageIcon size={24} />
              </div>
            )}
          </Section>

          {/* Headline */}
          <Section title="Título principal">
            <Field label="Texto do título">
              <input className={input} value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder={isM02 ? 'Ex: Transforme seus resultados.' : 'Ex: Cuidar do seu sorriso,'} />
            </Field>
          </Section>

          {/* Subtitle */}
          <Section title="Subtítulo">
            <p className="text-xs text-zinc-400 mb-2">Suporta HTML. Use negrito, cores e tamanho.</p>
            <RichTextEditor value={subtitleHtml} onChange={setSubtitleHtml} placeholder="Ex: é o nosso compromisso." />
          </Section>

          {/* Colors */}
          <Section title={isM02 ? 'Cores' : 'Cor de destaque (hover)'}>
            <Field label={isM02 ? 'Cor primária (cards escuros)' : 'Cor do ícone e borda no hover'}>
              <div className="flex items-center gap-3">
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-9 rounded-lg border border-zinc-200 cursor-pointer p-0.5 bg-white" />
                <input className={`${input} flex-1`} value={accentColor} onChange={(e) => setAccentColor(e.target.value)} placeholder={isM02 ? '#035dd7' : '#A8D156'} />
              </div>
            </Field>
            {isM02 && (
              <Field label="Cor secundária (cards destaque)">
                <div className="flex items-center gap-3">
                  <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-10 h-9 rounded-lg border border-zinc-200 cursor-pointer p-0.5 bg-white" />
                  <input className={`${input} flex-1`} value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} placeholder="#f15a24" />
                </div>
              </Field>
            )}
          </Section>

          {/* CTAs */}
          <Section title="Botões (CTAs)">
            <CTAEditor ctas={ctas} onChange={setCtas} showStyle={isM02} />
          </Section>

          {/* Footer */}
          <Section title="Rodapé">
            <Field label="URL da logo do rodapé">
              <input className={input} value={footerLogoUrl} onChange={(e) => setFooterLogoUrl(e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Link da logo do rodapé">
              <input className={input} value={footerLogoHref} onChange={(e) => setFooterLogoHref(e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Largura da logo do rodapé (px)">
              <div className="flex items-center gap-2">
                <input type="range" min={20} max={200} step={4} value={footerLogoWidth} onChange={(e) => setFooterLogoWidth(Number(e.target.value))} className="flex-1 accent-brand-green" />
                <span className="text-xs text-zinc-500 w-12 text-right">{footerLogoWidth}px</span>
              </div>
            </Field>
            {footerLogoUrl && (
              <div className="flex justify-center p-3 bg-white rounded-lg border border-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={footerLogoUrl} alt="footer logo preview" style={{ height: footerLogoWidth, width: 'auto' }} className="object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            )}
            <Field label="Texto de copyright">
              <input className={input} value={footerCopyright} onChange={(e) => setFooterCopyright(e.target.value)} placeholder="© 2026 OP7 Nexo · Todos os direitos reservados" />
            </Field>
          </Section>

        </div>
      </div>

      {/* ── Live preview ── */}
      <div className="flex-1 overflow-hidden bg-zinc-100">
        <div className="h-full overflow-y-auto flex items-start justify-center p-8">
          <div className={`rounded-2xl shadow-xl overflow-hidden w-full max-w-[390px] min-h-[600px]`} style={{ fontFamily: 'system-ui, sans-serif', background: isM02 ? '#eaf1fd' : '#f3f3f1' }}>
            {isM02 ? (
              <PreviewPane02
                logo={logoUrl} logoWidth={logoWidth} logoHref={logoHref}
                headline={headline} subtitleHtml={subtitleHtml}
                ctas={ctas} name={name}
                accentColor={accentColor} secondaryColor={secondaryColor}
                brandName={brandName} handle={handle}
                footerLogoUrl={footerLogoUrl} footerLogoHref={footerLogoHref}
                footerLogoWidth={footerLogoWidth} footerCopyright={footerCopyright}
              />
            ) : (
              <PreviewPane01
                logo={logoUrl} logoWidth={logoWidth} logoHref={logoHref}
                headline={headline} subtitleHtml={subtitleHtml}
                ctas={ctas} name={name} accentColor={accentColor}
                footerLogoUrl={footerLogoUrl} footerLogoHref={footerLogoHref}
                footerLogoWidth={footerLogoWidth} footerCopyright={footerCopyright}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Icon helper ──
function CtaIconPreview({ iconName }: { iconName: string }) {
  const paths = iconSvgPaths[iconName] ?? iconSvgPaths['Link']
  const isFill = fillIcons.has(iconName)
  return (
    <svg viewBox="0 0 24 24" fill={isFill ? 'currentColor' : 'none'} stroke={isFill ? 'none' : 'currentColor'}
      strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
      style={{ width: 18, height: 18 }} dangerouslySetInnerHTML={{ __html: paths }} />
  )
}

// ── Preview Modelo 01 ──
function PreviewPane01({ logo, logoWidth, logoHref, headline, subtitleHtml, ctas, name, accentColor, footerLogoUrl, footerLogoHref, footerLogoWidth, footerCopyright }: {
  logo: string; logoWidth: number; logoHref: string; headline: string; subtitleHtml: string
  ctas: CTA[]; name: string; accentColor: string
  footerLogoUrl: string; footerLogoHref: string; footerLogoWidth: number; footerCopyright: string
}) {
  return (
    <div className="relative min-h-[600px] bg-[#f3f3f1]">
      <style>{`
        .prev-link:hover { border-color: ${accentColor}; }
        .prev-link:hover .prev-ico { background: ${accentColor}; border-color: ${accentColor}; color: #fff; }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-30" style={{ background: accentColor, top: -80, left: -80 }} />
        <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-25" style={{ background: accentColor, bottom: -80, right: -80 }} />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center px-5 pt-10 pb-12">
        {/* logo */}
        {logo ? (
          logoHref ? (
            <a href={logoHref} target="_blank" rel="noopener noreferrer" className="mb-4 block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt={name} className="object-contain" style={{ width: logoWidth, height: 'auto' }} />
            </a>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={name} className="mb-4 object-contain" style={{ width: logoWidth, height: 'auto' }} />
          )
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-zinc-200 mb-4 flex items-center justify-center text-zinc-400 text-xs">Logo</div>
        )}
        <h1 className="font-semibold mb-1" style={{ fontSize: 22, color: '#2E7370', lineHeight: 1.1 }}>{headline}</h1>
        <p className="mb-6 text-sm" style={{ color: '#2E7370', maxWidth: 280 }} dangerouslySetInnerHTML={{ __html: subtitleHtml }} />
        <div className="w-full space-y-2.5">
          {ctas.map((cta) => (
            <div key={cta.id} className="prev-link flex items-center gap-3 px-3 py-2.5 rounded-full bg-white border border-zinc-100 shadow-sm text-left cursor-default transition-colors" style={{ borderWidth: 1 }}>
              <div className="prev-ico w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center flex-shrink-0 text-zinc-600 transition-colors">
                <CtaIconPreview iconName={cta.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-zinc-800 truncate">{cta.label}</div>
                {cta.meta && <div className="text-xs text-zinc-400 truncate">{cta.meta}</div>}
              </div>
              <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs flex-shrink-0">↗</div>
            </div>
          ))}
        </div>
        {/* footer */}
        <div className="mt-10 flex flex-col items-center gap-2">
          {footerLogoUrl && (
            footerLogoHref ? (
              <a href={footerLogoHref} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={footerLogoUrl} alt="footer logo" style={{ height: footerLogoWidth, width: 'auto' }} />
              </a>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={footerLogoUrl} alt="footer logo" style={{ height: footerLogoWidth, width: 'auto' }} />
            )
          )}
          <p className="text-xs text-zinc-400">{footerCopyright}</p>
        </div>
      </div>
    </div>
  )
}

// ── Preview Modelo 02 ──
function PreviewPane02({ logo, logoWidth, logoHref, headline, subtitleHtml, ctas, name, accentColor, secondaryColor, brandName, handle, footerLogoUrl, footerLogoHref, footerLogoWidth, footerCopyright }: {
  logo: string; logoWidth: number; logoHref: string; headline: string; subtitleHtml: string
  ctas: CTA[]; name: string; accentColor: string; secondaryColor: string
  brandName: string; handle: string
  footerLogoUrl: string; footerLogoHref: string; footerLogoWidth: number; footerCopyright: string
}) {
  return (
    <div className="relative min-h-[600px] overflow-hidden" style={{ background: 'linear-gradient(160deg,#eaf1fd 0%,#dbe9fb 35%,#eef3fb 70%,#fff 100%)' }}>
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: 'linear-gradient(to right,rgba(10,58,140,0.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(10,58,140,0.05) 1px,transparent 1px)',
        backgroundSize: '56px 56px',
        backgroundPosition: '-1px -1px',
        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%,#000 40%,transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%,#000 40%,transparent 100%)',
      }} />
      <div className="relative z-10 flex flex-col items-center text-center px-5 pt-10 pb-12">
        {/* logo */}
        {logo ? (
          logoHref ? (
            <a href={logoHref} target="_blank" rel="noopener noreferrer" className="mb-4 block" style={{ filter: 'drop-shadow(0 8px 16px rgba(10,58,140,0.22))' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt={name} className="object-contain" style={{ width: logoWidth, height: 'auto' }} />
            </a>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={name} className="mb-4 object-contain" style={{ width: logoWidth, height: 'auto', filter: 'drop-shadow(0 8px 16px rgba(10,58,140,0.22))' }} />
          )
        ) : (
          <div className="w-28 h-28 rounded-2xl bg-zinc-200 mb-4 flex items-center justify-center text-zinc-400 text-xs">Logo</div>
        )}

        {/* brand + handle */}
        {(brandName || handle) && (
          <div className="flex items-center justify-center gap-2 mb-4" style={{ fontSize: 13 }}>
            {brandName && <span style={{ color: '#5b6b85', letterSpacing: '0.2px' }}>{brandName}</span>}
            {handle && (
              <span style={{ background: `${accentColor}18`, color: accentColor, fontWeight: 700, padding: '3px 10px', borderRadius: 999, fontSize: 12 }}>
                {handle}
              </span>
            )}
          </div>
        )}

        <h1 className="font-extrabold mb-3" style={{ fontSize: 26, color: '#0c1b33', lineHeight: 1.15, letterSpacing: '-0.4px' }}>{headline}</h1>
        <p className="mb-6 text-sm" style={{ color: '#5b6b85', maxWidth: 300 }} dangerouslySetInnerHTML={{ __html: subtitleHtml }} />

        {/* CTAs */}
        <div className="w-full flex flex-col gap-3">
          {ctas.map((cta) => {
            const style = cta.style ?? 'light'
            let cardStyle: React.CSSProperties = {}
            let iconStyle: React.CSSProperties = {}
            let textColor = '#0c1b33'
            let subColor = '#5b6b85'
            let arrowStyle: React.CSSProperties = {}

            if (style === 'dark') {
              cardStyle = { background: `linear-gradient(150deg,${accentColor}cc 0%,${accentColor} 50%,${accentColor}dd 100%)`, boxShadow: `0 8px 20px ${accentColor}44`, color: '#fff' }
              iconStyle = { background: 'rgba(255,255,255,0.18)', color: '#fff' }
              textColor = '#fff'; subColor = 'rgba(255,255,255,0.8)'
              arrowStyle = { background: 'rgba(255,255,255,0.18)', color: '#fff' }
            } else if (style === 'accent') {
              cardStyle = { background: `linear-gradient(150deg,${secondaryColor}cc 0%,${secondaryColor} 50%,${secondaryColor}dd 100%)`, boxShadow: `0 8px 20px ${secondaryColor}44`, color: '#fff' }
              iconStyle = { background: 'rgba(255,255,255,0.18)', color: '#fff' }
              textColor = '#fff'; subColor = 'rgba(255,255,255,0.8)'
              arrowStyle = { background: 'rgba(255,255,255,0.18)', color: '#fff' }
            } else {
              cardStyle = { background: '#fff', boxShadow: '0 4px 12px rgba(10,58,140,0.07)', color: '#0c1b33' }
              iconStyle = { background: `${accentColor}14`, color: accentColor }
              arrowStyle = { background: '#f1f4fa', color: '#5b6b85' }
            }

            return (
              <div key={cta.id} className="flex items-center gap-3 px-4 py-3 text-left" style={{ borderRadius: 999, ...cardStyle }}>
                <div className="flex items-center justify-center flex-shrink-0" style={{ width: 42, height: 42, borderRadius: '50%', ...iconStyle }}>
                  <CtaIconPreview iconName={cta.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate" style={{ color: textColor }}>{cta.label}</div>
                  {cta.meta && <div className="text-xs truncate" style={{ color: subColor }}>{cta.meta}</div>}
                </div>
                <div className="flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, borderRadius: '50%', ...arrowStyle }}>
                  <span style={{ fontSize: 14 }}>↗</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* footer */}
        <div className="mt-10 flex flex-col items-center gap-2">
          {footerLogoUrl && (
            footerLogoHref ? (
              <a href={footerLogoHref} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={footerLogoUrl} alt="footer logo" style={{ height: footerLogoWidth, width: 'auto' }} />
              </a>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={footerLogoUrl} alt="footer logo" style={{ height: footerLogoWidth, width: 'auto' }} />
            )
          )}
          <p style={{ fontSize: 11, color: '#9aa6ba' }}>{footerCopyright}</p>
        </div>
      </div>
    </div>
  )
}

const input = 'w-full text-sm px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white focus:border-brand-green outline-none transition-colors'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1">{label}</label>
      {children}
    </div>
  )
}
