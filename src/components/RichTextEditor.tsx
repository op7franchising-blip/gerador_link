'use client'
import { useRef, useEffect } from 'react'
import { Bold, Italic, Type } from 'lucide-react'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value
    }
  }, [value])

  function exec(cmd: string, val?: string) {
    ref.current?.focus()
    document.execCommand(cmd, false, val)
    if (ref.current) onChange(ref.current.innerHTML)
  }

  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden focus-within:border-brand-green transition-colors">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-zinc-100 bg-zinc-50 flex-wrap">
        <ToolBtn title="Negrito" onClick={() => exec('bold')}><Bold size={13} /></ToolBtn>
        <ToolBtn title="Itálico" onClick={() => exec('italic')}><Italic size={13} /></ToolBtn>
        <div className="w-px h-4 bg-zinc-200 mx-1" />
        {[14, 16, 18, 22, 28].map((sz) => (
          <ToolBtn key={sz} title={`${sz}px`} onClick={() => exec('fontSize', String(sz > 22 ? 6 : sz > 17 ? 5 : sz > 14 ? 3 : 2))}>
            <span className="text-xs font-medium">{sz}</span>
          </ToolBtn>
        ))}
        <div className="w-px h-4 bg-zinc-200 mx-1" />
        <ToolBtn title="Verde escuro" onClick={() => exec('foreColor', '#2E7370')}>
          <span className="w-3.5 h-3.5 rounded-sm block" style={{ background: '#2E7370' }} />
        </ToolBtn>
        <ToolBtn title="Verde claro" onClick={() => exec('foreColor', '#A8D156')}>
          <span className="w-3.5 h-3.5 rounded-sm block" style={{ background: '#A8D156' }} />
        </ToolBtn>
        <ToolBtn title="Preto" onClick={() => exec('foreColor', '#0a0a0a')}>
          <span className="w-3.5 h-3.5 rounded-sm block bg-zinc-900" />
        </ToolBtn>
        <label
          title="Cor personalizada"
          className="p-1 rounded hover:bg-zinc-200 text-zinc-600 transition-colors cursor-pointer flex items-center"
        >
          <span className="w-3.5 h-3.5 rounded-sm block border border-zinc-300"
            style={{ background: 'linear-gradient(135deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f)' }}
          />
          <input
            type="color"
            className="sr-only"
            onChange={(e) => exec('foreColor', e.target.value)}
          />
        </label>
        <div className="w-px h-4 bg-zinc-200 mx-1" />
        <ToolBtn title="Limpar formatação" onClick={() => exec('removeFormat')}>
          <Type size={13} />
        </ToolBtn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={() => { if (ref.current) onChange(ref.current.innerHTML) }}
        className="min-h-[80px] px-3 py-2.5 text-sm outline-none text-zinc-800 empty:before:content-[attr(data-placeholder)] empty:before:text-zinc-400"
      />
    </div>
  )
}

function ToolBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className="p-1 rounded hover:bg-zinc-200 text-zinc-600 transition-colors"
    >
      {children}
    </button>
  )
}
