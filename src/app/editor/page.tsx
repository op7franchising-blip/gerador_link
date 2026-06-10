import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import TemplateEditor from '@/components/TemplateEditor'

export default function NewEditorPage() {
  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 border-b border-zinc-200 bg-white flex items-center px-6 gap-3 flex-shrink-0">
        <Link href="/" className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
          <ChevronLeft size={16} />
          Dashboard
        </Link>
        <span className="text-zinc-300">|</span>
        <span className="text-sm font-medium text-zinc-800">Novo template</span>
      </header>
      <TemplateEditor />
    </div>
  )
}
