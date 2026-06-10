'use client'
import { useState } from 'react'
import { Trash2, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props { templateId: string; templateName: string }

export default function DeleteButton({ templateId, templateName }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/templates/${templateId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      setOpen(false)
      router.refresh()
    } catch (e) {
      alert('Erro: ' + String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true) }}
        className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
        title="Excluir template"
      >
        <Trash2 size={12} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-start justify-between mb-1">
              <h2 className="font-semibold text-zinc-800">Excluir template</h2>
              <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors -mt-0.5">
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-zinc-500 mt-2 mb-6">
              Deseja excluir <strong className="text-zinc-800">&ldquo;{templateName}&rdquo;</strong>?
              <br />Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-zinc-200 text-sm text-zinc-600 hover:border-zinc-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
