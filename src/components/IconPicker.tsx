'use client'
import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { Search } from 'lucide-react'
import { ICONS } from '@/lib/icons'
import { iconSvgPaths, fillIcons } from '@/lib/icon-svgs'

interface Props {
  value: string
  onChange: (name: string) => void
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d={iconSvgPaths['WhatsApp']} />
    </svg>
  )
}

function IconDisplay({ name, size = 18 }: { name: string; size?: number }) {
  if (name === 'WhatsApp') return <WhatsAppIcon size={size} />
  const Ic = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[name]
  if (!Ic) return null
  return <Ic size={size} />
}

export default function IconPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  const filtered = ICONS.filter(
    (i) =>
      i.name.toLowerCase().includes(q.toLowerCase()) ||
      i.label.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:border-zinc-300 text-sm font-medium transition-colors"
      >
        <IconDisplay name={value} size={16} />
        <span>{value}</span>
        <span className="text-zinc-400 text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute z-50 left-0 top-full mt-1 w-72 bg-white rounded-xl shadow-xl border border-zinc-100 p-3">
          <div className="relative mb-2">
            <Search size={14} className="absolute left-2.5 top-2.5 text-zinc-400" />
            <input
              autoFocus
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-zinc-200 rounded-lg outline-none focus:border-brand-green"
              placeholder="Buscar ícone..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-5 gap-1 max-h-52 overflow-y-auto">
            {filtered.map((icon) => {
              const isFill = fillIcons.has(icon.name)
              const LucideIc = !isFill
                ? (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[icon.name]
                : null
              if (!isFill && !LucideIc) return null
              return (
                <button
                  key={icon.name}
                  type="button"
                  title={icon.label}
                  onClick={() => { onChange(icon.name); setOpen(false); setQ('') }}
                  className={`flex flex-col items-center gap-0.5 p-2 rounded-lg text-[10px] transition-colors hover:bg-green-50 ${value === icon.name ? 'bg-green-100 text-brand-dark' : 'text-zinc-500'}`}
                >
                  <IconDisplay name={icon.name} size={18} />
                  <span className="truncate w-full text-center">{icon.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
