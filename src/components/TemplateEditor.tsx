'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Download, Eye, Loader2, Image } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import CTAEditor from './CTAEditor'
import type { Template, CTA } from '@/lib/types'

interface Props {
  initial?: Template
}

const DEFAULT_CTAS: CTA[] = [
  { id: '1', label: 'Agende uma avaliação', href: '#', icon: 'CalendarCheck' },
  { id: '2', label: 'Entre em contato agora', href: 'https://wa.me/55', icon: 'Phone' },
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
  const [subtitleHtml, setSubtitleHtml] = useState(
    initial?.subtitle_html ?? 'é o nosso <strong>compromisso</strong>.'
  )
  const [ctas, setCtas] = useState<CTA[]>(initial?.ctas ?? DEFAULT_CTAS)

  const autoSlug = useCallback((n: string) => {
    return n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const body = { name, slug: slug || autoSlug(name), logo_url: logoUrl, subtitle_html: subtitleHtml, ctas }
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
            {logoUrl && (
              <div className="mt-2 flex justify-center p-3 bg-white rounded-lg border border-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="preview" className="max-h-20 max-w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            )}
            {!logoUrl && (
              <div className="flex items-center justify-center h-16 bg-white rounded-lg border border-dashed border-zinc-200 text-zinc-300">
                <Image size={24} />
              </div>
            )}
          </Section>

          {/* Subtitle */}
          <Section title="Texto / Subtítulo">
            <p className="text-xs text-zinc-400 mb-2">Suporta HTML. Use negrito, cores e tamanho.</p>
            <RichTextEditor value={subtitleHtml} onChange={setSubtitleHtml} placeholder="Ex: é o nosso compromisso." />
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
            <PreviewPane logo={logoUrl} subtitleHtml={subtitleHtml} ctas={ctas} name={name} />
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewPane({ logo, subtitleHtml, ctas, name }: { logo: string; subtitleHtml: string; ctas: CTA[]; name: string }) {
  return (
    <div className="relative min-h-[600px] bg-[#f3f3f1]">
      {/* ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-30" style={{ background: '#A8D156', top: -80, left: -80 }} />
        <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-25" style={{ background: '#A8D156', bottom: -80, right: -80 }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-5 pt-10 pb-12">
        {/* logo */}
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={name} className="mb-4 object-contain" style={{ width: 170, height: 'auto' }} />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-zinc-200 mb-4 flex items-center justify-center text-zinc-400 text-xs">Logo</div>
        )}

        {/* headline */}
        <h1 className="font-semibold mb-1" style={{ fontSize: 22, color: '#2E7370', lineHeight: 1.1 }}>
          Cuidar do seu sorriso,
        </h1>
        <p className="mb-6 text-sm" style={{ color: '#2E7370', maxWidth: 280 }} dangerouslySetInnerHTML={{ __html: subtitleHtml }} />

        {/* CTAs */}
        <div className="w-full space-y-2.5">
          {ctas.map((cta) => (
            <div key={cta.id} className="flex items-center gap-3 px-3 py-2.5 rounded-full bg-white border border-zinc-100 shadow-sm text-left cursor-default hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 text-zinc-600 text-sm">
                {cta.icon.charAt(0)}
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
        <div className="mt-10 flex flex-col items-center gap-2 opacity-60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://pub-db8ed4fb33634589a6ce5fb07e85cb46.r2.dev/logo/op7_dash_odc/logo_op7nexo.svg" alt="OP7 Nexo" className="h-8 w-auto" />
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
