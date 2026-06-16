import Link from 'next/link'
import { getAllTemplates } from '@/lib/db'
import { ExternalLink, Pencil, Download, Layers, Copy, ChevronDown } from 'lucide-react'
import DuplicateButton from '@/components/DuplicateButton'
import DeleteButton from '@/components/DeleteButton'
import NewTemplateDropdown from '@/components/NewTemplateDropdown'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  let templates: Awaited<ReturnType<typeof getAllTemplates>> = []
  let dbError = false

  try {
    templates = await getAllTemplates()
  } catch {
    dbError = true
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Topbar */}
      <header className="h-16 border-b border-zinc-200 bg-white flex items-center px-6 gap-4">
        <div className="flex items-center gap-2 font-semibold text-zinc-800">
          <Layers size={18} className="text-brand-dark" />
          Link Bio Editor
        </div>
        <span className="text-zinc-300">|</span>
        <span className="text-sm text-zinc-400">OP7 Nexo</span>
        <div className="ml-auto">
          <NewTemplateDropdown />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {dbError && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            <strong>Banco de dados não configurado.</strong> Acesse{' '}
            <a href="/api/db" className="underline font-medium">/api/db</a>{' '}
            para inicializar/migrar a tabela.
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-zinc-800">Meus templates</h1>
          <span className="text-sm text-zinc-400">{templates.length} template{templates.length !== 1 ? 's' : ''}</span>
        </div>

        {templates.length === 0 && !dbError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
              <Layers size={24} className="text-zinc-300" />
            </div>
            <p className="text-zinc-500 text-sm mb-4">Nenhum template ainda.</p>
            <Link href="/editor/new?type=modelo01" className="text-brand-dark text-sm font-medium hover:underline">
              Criar o primeiro →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                {/* Preview strip */}
                <div className="h-24 bg-[#f3f3f1] flex items-center justify-center overflow-hidden relative flex-shrink-0">
                  <div className="absolute w-32 h-32 rounded-full opacity-20" style={{ background: t.accent_color ?? '#A8D156', filter: 'blur(40px)', top: -16, left: -16 }} />
                  {t.logo_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={t.logo_url} alt={t.name} className="relative z-10 max-h-14 max-w-[150px] object-contain" />
                    : <span className="text-zinc-300 text-xs">sem logo</span>
                  }
                  {/* Template type badge */}
                  <span className={`absolute top-2 left-2 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${t.template_type === 'modelo02' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}>
                    {t.template_type === 'modelo02' ? 'M2' : 'M1'}
                  </span>
                  <DeleteButton templateId={t.id} templateName={t.name} />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-zinc-800 truncate">{t.name}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5 truncate">/{t.slug}</p>
                  <p className="text-xs text-zinc-400 mt-1">{Array.isArray(t.ctas) ? t.ctas.length : 0} CTAs</p>

                  {/* Buttons — 2×2 symmetric grid */}
                  <div className="grid grid-cols-2 gap-1.5 mt-4">
                    <Link
                      href={`/editor/${t.id}`}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-brand-dark text-white text-xs font-medium hover:bg-teal-800 transition-colors"
                    >
                      <Pencil size={11} />
                      Editar
                    </Link>
                    <DuplicateButton templateId={t.id} />
                    <a
                      href={`/${t.slug}`}
                      target="_blank"
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-600 hover:border-zinc-300 transition-colors"
                    >
                      <ExternalLink size={11} />
                      Ver
                    </a>
                    <a
                      href={`/api/export/${t.id}`}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-600 hover:border-zinc-300 transition-colors"
                    >
                      <Download size={11} />
                      HTML
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
