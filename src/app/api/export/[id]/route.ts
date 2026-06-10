import { NextRequest, NextResponse } from 'next/server'
import { getTemplateById } from '@/lib/db'
import { generateHtml } from '@/lib/export'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const template = await getTemplateById(id)
    if (!template) return NextResponse.json({ error: 'not found' }, { status: 404 })
    const html = generateHtml(template)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${template.slug}.html"`,
      },
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
