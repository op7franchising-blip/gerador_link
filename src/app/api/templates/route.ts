import { NextRequest, NextResponse } from 'next/server'
import { getAllTemplates, createTemplate } from '@/lib/db'
import type { TemplateInput } from '@/lib/types'

export async function GET() {
  try {
    const templates = await getAllTemplates()
    return NextResponse.json(templates)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TemplateInput
    if (!body.slug || !body.name) {
      return NextResponse.json({ error: 'slug and name are required' }, { status: 400 })
    }
    const template = await createTemplate(body)
    return NextResponse.json(template, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
