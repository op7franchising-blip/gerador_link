'use client'
import { useState } from 'react'
import { Copy, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props { templateId: string }

export default function DuplicateButton({ templateId }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handle() {
    setLoading(true)
    try {
      const res = await fetch(`/api/templates/${templateId}`)
      if (!res.ok) throw new Error('Erro ao buscar template')
      const data = await res.json()
      const suffix = Date.now().toString(36).slice(-4)
      const copy = {
        name: `${data.name} (cópia)`,
        slug: `${data.slug}-${suffix}`,
        template_type: data.template_type ?? 'modelo01',
        logo_url: data.logo_url,
        logo_href: data.logo_href ?? '',
        headline: data.headline ?? 'Cuidar do seu sorriso,',
        subtitle_html: data.subtitle_html,
        logo_width: data.logo_width ?? 170,
        accent_color: data.accent_color ?? '#A8D156',
        secondary_color: data.secondary_color ?? '#f15a24',
        brand_name: data.brand_name ?? '',
        handle: data.handle ?? '',
        footer_logo_url: data.footer_logo_url ?? '',
        footer_logo_href: data.footer_logo_href ?? '',
        footer_logo_width: data.footer_logo_width ?? 44,
        footer_copyright: data.footer_copyright ?? '',
        ctas: data.ctas,
      }
      const r2 = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copy),
      })
      if (!r2.ok) throw new Error(await r2.text())
      router.refresh()
    } catch (e) {
      alert('Erro ao duplicar: ' + String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-zinc-200 text-xs text-zinc-600 hover:border-zinc-300 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={11} className="animate-spin" /> : <Copy size={11} />}
      Duplicar
    </button>
  )
}
