import { sql } from '@vercel/postgres'
import type { Template, TemplateInput } from './types'

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS templates (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug        TEXT UNIQUE NOT NULL,
      name        TEXT NOT NULL,
      logo_url    TEXT NOT NULL DEFAULT '',
      subtitle_html TEXT NOT NULL DEFAULT '',
      ctas        JSONB NOT NULL DEFAULT '[]',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export async function getAllTemplates(): Promise<Template[]> {
  const { rows } = await sql`
    SELECT * FROM templates ORDER BY updated_at DESC
  `
  return rows as Template[]
}

export async function getTemplateById(id: string): Promise<Template | null> {
  const { rows } = await sql`
    SELECT * FROM templates WHERE id = ${id}
  `
  return (rows[0] as Template) ?? null
}

export async function getTemplateBySlug(slug: string): Promise<Template | null> {
  const { rows } = await sql`
    SELECT * FROM templates WHERE slug = ${slug}
  `
  return (rows[0] as Template) ?? null
}

export async function createTemplate(data: TemplateInput): Promise<Template> {
  const ctasJson = JSON.stringify(data.ctas)
  const { rows } = await sql`
    INSERT INTO templates (slug, name, logo_url, subtitle_html, ctas)
    VALUES (${data.slug}, ${data.name}, ${data.logo_url}, ${data.subtitle_html}, ${ctasJson}::jsonb)
    RETURNING *
  `
  return rows[0] as Template
}

export async function updateTemplate(id: string, data: Partial<TemplateInput>): Promise<Template | null> {
  const ctasJson = data.ctas !== undefined ? JSON.stringify(data.ctas) : undefined
  const { rows } = await sql`
    UPDATE templates SET
      slug          = COALESCE(${data.slug ?? null}, slug),
      name          = COALESCE(${data.name ?? null}, name),
      logo_url      = COALESCE(${data.logo_url ?? null}, logo_url),
      subtitle_html = COALESCE(${data.subtitle_html ?? null}, subtitle_html),
      ctas          = COALESCE(${ctasJson ?? null}::jsonb, ctas),
      updated_at    = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return (rows[0] as Template) ?? null
}

export async function deleteTemplate(id: string): Promise<void> {
  await sql`DELETE FROM templates WHERE id = ${id}`
}
