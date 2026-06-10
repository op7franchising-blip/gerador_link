'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Download, Eye, Loader2, Image } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import CTAEditor from './CTAEditor'
import type { Template, CTA } from '@/lib/types'
import { iconSvgPaths, fillIcons } from '@/lib/icon-svgs'

interface Props {
  initial?: Template
}

const DEFAULT_CTAS: CTA[] = [
  { id: '1', label: 'Agende uma avaliação', href: '#', icon: 'CalendarCheck' },
  { id: '2', label: 'Entre em contato agora', href: 'https://wa.me/55', icon: 'WhatsApp' },
  { id: '3', label: 'Ver localização', href: 'https://maps.google.com', icon: 'MapPin', meta: '' },
  { id: '4', label: 'Conheça nosso site', href: 'https://', icon: 'Globe' },
  { id: '5', label: 'Visite nossa página', href: 'https://instagram.com', icon: 'Instagram' },
]

export default function TemplateEditor({ initial }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState(initial?.name ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [logoUrl, setLogoUrl] = useState(
    initial?.logo_url ??
      'https://pub-db8ed4fb33634589a6ce5fb07e85cb46.r2.dev/landingpage_odc_franchising/logo_odontocompany%20(2).svg'
  )
  const [logoWidth, setLogoWidth] = useState(initial?.logo_width ?? 170)
  const [headline, setHeadline] = useState(initial?.headline ?? 'Cuidar do seu sorriso,')
  const [subtitleHtml, setSubtitleHtml] = useState(
    initial?.subtitle_html ?? 'é o nosso <strong>compromisso</strong>.'
  )
  const [accentColor, setAccentColor] = useState(initial?.accent_color ?? '#A8D156')
  const [ctas, setCtas] = useState<CTA[]>(initial?.ctas ?? DEFAULT_CTAS)

  const autoSlug = useCallback((n: string) => {
    return n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const body = {
        name, slug: slug || autoSlug(name), logo_url: logoUrl,
        headline, subtitle_html: subtitleHtml,
        logo_width: logoWidth, accent_color: accentColor, ctas,
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

          {/* Logo */}
          <Section title="Logo">
            <Field label="URL da imagem">
              <input className={input} value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Largura (px)">
              <div className="flex items-center gap-2">
                <input
                  type="range" min={60} max={380} step={10}
                  value={logoWidth}
                  onChange={(e) => setLogoWidth(Number(e.target.value))}
                  className="flex-1 accent-brand-green"
                />
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
                <Image size={24} />
              </div>
            )}
          </Section>

          {/* Headline */}
          <Section title="Título principal">
            <Field label="Texto do título">
              <input
                className={input}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ex: Cuidar do seu sorriso,"
              />
            </Field>
          </Section>

          {/* Subtitle */}
          <Section title="Subtítulo">
            <p className="text-xs text-zinc-400 mb-2">Suporta HTML. Use negrito, cores e tamanho.</p>
            <RichTextEditor value={subtitleHtml} onChange={setSubtitleHtml} placeholder="Ex: é o nosso compromisso." />
          </Section>

          {/* Accent color */}
          <Section title="Cor de destaque (hover)">
            <Field label="Cor do ícone e borda no hover">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-9 rounded-lg border border-zinc-200 cursor-pointer p-0.5 bg-white"
                />
                <input
                  className={`${input} flex-1`}
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#A8D156"
                />
              </div>
            </Field>
          </Section>

          {/* CTAs */}
          <Section title="Botões (CTAs)">
            <CTAEditor ctas={ctas} onChange={setCtas} />
          </Section>

        </div>
      </div>

      {/* ── Live preview ── */}
      <div className="flex-1 overflow-hidden bg-zinc-100">
        <div className="h-full overflow-y-auto flex items-start justify-center p-8">
          <div className="bg-[#f3f3f1] rounded-2xl shadow-xl overflow-hidden w-full max-w-[390px] min-h-[600px]" style={{ fontFamily: 'system-ui, sans-serif' }}>
            <PreviewPane logo={logoUrl} logoWidth={logoWidth} headline={headline} subtitleHtml={subtitleHtml} ctas={ctas} name={name} accentColor={accentColor} />
          </div>
        </div>
      </div>
    </div>
  )
}

function CtaIconPreview({ iconName }: { iconName: string }) {
  const paths = iconSvgPaths[iconName] ?? iconSvgPaths['Link']
  const isFill = fillIcons.has(iconName)
  return (
    <svg
      viewBox="0 0 24 24"
      fill={isFill ? 'currentColor' : 'none'}
      stroke={isFill ? 'none' : 'currentColor'}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 18, height: 18 }}
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  )
}

function PreviewPane({
  logo, logoWidth, headline, subtitleHtml, ctas, name, accentColor,
}: {
  logo: string; logoWidth: number; headline: string; subtitleHtml: string
  ctas: CTA[]; name: string; accentColor: string
}) {
  return (
    <div className="relative min-h-[600px] bg-[#f3f3f1]">
      <style>{`
        .prev-link:hover { border-color: ${accentColor}; }
        .prev-link:hover .prev-ico { background: ${accentColor}; border-color: ${accentColor}; color: #fff; }
      `}</style>
      {/* ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-30" style={{ background: accentColor, top: -80, left: -80 }} />
        <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-25" style={{ background: accentColor, bottom: -80, right: -80 }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-5 pt-10 pb-12">
        {/* logo */}
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={name} className="mb-4 object-contain" style={{ width: logoWidth, height: 'auto' }} />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-zinc-200 mb-4 flex items-center justify-center text-zinc-400 text-xs">Logo</div>
        )}

        {/* headline */}
        <h1 className="font-semibold mb-1" style={{ fontSize: 22, color: '#2E7370', lineHeight: 1.1 }}>
          {headline}
        </h1>
        <p className="mb-6 text-sm" style={{ color: '#2E7370', maxWidth: 280 }} dangerouslySetInnerHTML={{ __html: subtitleHtml }} />

        {/* CTAs */}
        <div className="w-full space-y-2.5">
          {ctas.map((cta) => (
            <div
              key={cta.id}
              className="prev-link flex items-center gap-3 px-3 py-2.5 rounded-full bg-white border border-zinc-100 shadow-sm text-left cursor-default transition-colors"
              style={{ borderWidth: 1, transition: 'border-color .2s' }}
            >
              <div className="prev-ico w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center flex-shrink-0 text-zinc-600 transition-colors" style={{ transition: 'background .2s, border-color .2s, color .2s' }}>
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <a href="https://www.instagram.com/op7franquias" target="_blank" rel="noopener">
            <img src="https://pub-db8ed4fb33634589a6ce5fb07e85cb46.r2.dev/logo/op7_dash_odc/logo_op7nexo.svg" alt="OP7 Nexo" className="h-8 w-auto" />
          </a>
          <p className="text-xs text-zinc-400">© 2026 OP7 Nexo · Todos os direitos reservados</p>
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
