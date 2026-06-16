'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Plus, ChevronDown } from 'lucide-react'

export default function NewTemplateDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-dark text-white text-sm font-medium hover:bg-teal-800 transition-colors"
      >
        <Plus size={14} />
        Novo template
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-52 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <Link
            href="/editor/new?type=modelo01"
            onClick={() => setOpen(false)}
            className="flex flex-col px-4 py-3 hover:bg-zinc-50 transition-colors border-b border-zinc-100"
          >
            <span className="text-sm font-medium text-zinc-800">Modelo 01</span>
            <span className="text-xs text-zinc-400 mt-0.5">Layout clean · bege/verde</span>
          </Link>
          <Link
            href="/editor/new?type=modelo02"
            onClick={() => setOpen(false)}
            className="flex flex-col px-4 py-3 hover:bg-zinc-50 transition-colors"
          >
            <span className="text-sm font-medium text-zinc-800">Modelo 02</span>
            <span className="text-xs text-zinc-400 mt-0.5">Layout premium · azul/laranja</span>
          </Link>
        </div>
      )}
    </div>
  )
}
