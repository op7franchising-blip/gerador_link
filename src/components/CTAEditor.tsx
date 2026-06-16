'use client'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import IconPicker from './IconPicker'
import type { CTA } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  ctas: CTA[]
  onChange: (ctas: CTA[]) => void
  showStyle?: boolean
}

export default function CTAEditor({ ctas, onChange, showStyle }: Props) {
  function add() {
    const newCta: CTA = { id: uuidv4(), label: 'Novo link', href: 'https://', icon: 'Link' }
    if (showStyle) newCta.style = 'light'
    onChange([...ctas, newCta])
  }

  function remove(id: string) {
    onChange(ctas.filter((c) => c.id !== id))
  }

  function update(id: string, patch: Partial<CTA>) {
    onChange(ctas.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  function moveUp(idx: number) {
    if (idx === 0) return
    const next = [...ctas]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    onChange(next)
  }

  function moveDown(idx: number) {
    if (idx === ctas.length - 1) return
    const next = [...ctas]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {ctas.map((cta, idx) => (
        <div key={cta.id} className="bg-white border border-zinc-200 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-zinc-300">
              <button type="button" onClick={() => moveUp(idx)} className="hover:text-zinc-500 text-xs px-1">↑</button>
              <GripVertical size={14} />
              <button type="button" onClick={() => moveDown(idx)} className="hover:text-zinc-500 text-xs px-1">↓</button>
            </div>
            <span className="text-xs text-zinc-400 flex-1">CTA {idx + 1}</span>
            <button
              type="button"
              onClick={() => remove(cta.id)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Texto do botão</label>
              <input
                className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-zinc-200 focus:border-brand-green outline-none"
                value={cta.label}
                onChange={(e) => update(cta.id, { label: e.target.value })}
                placeholder="Ex: Agende uma avaliação"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Subtexto (opcional)</label>
              <input
                className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-zinc-200 focus:border-brand-green outline-none"
                value={cta.meta ?? ''}
                onChange={(e) => update(cta.id, { meta: e.target.value || undefined })}
                placeholder="Ex: Higienópolis, 1601"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">URL de destino</label>
            <input
              className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-zinc-200 focus:border-brand-green outline-none font-mono"
              value={cta.href}
              onChange={(e) => update(cta.id, { href: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className={showStyle ? 'grid grid-cols-2 gap-2' : ''}>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Ícone</label>
              <IconPicker value={cta.icon} onChange={(icon) => update(cta.id, { icon })} />
            </div>
            {showStyle && (
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Estilo do card</label>
                <select
                  className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-zinc-200 focus:border-brand-green outline-none bg-white"
                  value={cta.style ?? 'light'}
                  onChange={(e) => update(cta.id, { style: e.target.value as CTA['style'] })}
                >
                  <option value="light">Claro (branco)</option>
                  <option value="dark">Escuro (azul)</option>
                  <option value="accent">Destaque (laranja)</option>
                </select>
              </div>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-zinc-200 text-sm text-zinc-500 hover:border-brand-green hover:text-brand-dark transition-colors"
      >
        <Plus size={16} />
        Adicionar CTA
      </button>
    </div>
  )
}
