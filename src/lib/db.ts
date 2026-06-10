import { neon } from '@neondatabase/serverless'
import type { Template, TemplateInput } from './types'

function getDb() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL not set')
  return neon(url)
}

export async function initDb() {
  const sql = getDb()
  await sql`
    CREATE TABLE IF NOT EXISTS templates (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug          TEXT UNIQUE NOT NULL,
      name          TEXT NOT NULL,
      logo_url      TEXT NOT NULL DEFAULT '',
      headline      TEXT NOT NULL DEFAULT 'Cuidar do seu sorriso,',
      subtitle_html TEXT NOT NULL DEFAULT '',
      logo_width    INTEGER NOT NULL DEFAULT 170,
      accent_color  TEXT NOT NULL DEFAULT '#A8D156',
      ctas          JSONB NOT NULL DEFAULT '[]',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  // Idempotent migrations for existing tables
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS headline TEXT NOT NULL DEFAULT 'Cuidar do seu sorriso,'`
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS logo_width INTEGER NOT NULL DEFAULT 170`
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS accent_color TEXT NOT NULL DEFAULT '#A8D156'`
}

export async function getAllTemplates(): Promise<Template[]> {
  const sql = getDb()
  const rows = await sql`SELECT * FROM templates ORDER BY updated_at DESC`
  return rows as unknown as Template[]
}

export async function getTemplateById(id: string): Promise<Template | null> {
  const sql = getDb()
  const rows = await sql`SELECT * FROM templates WHERE id = ${id}`
  return (rows[0] as unknown as Template) ?? null
}

export async function getTemplateBySlug(slug: string): Promise<Template | null> {
  const sql = getDb()
  const rows = await sql`SELECT * FROM templates WHERE slug = ${slug}`
  return (rows[0] as unknown as Template) ?? null
}

export async function createTemplate(data: TemplateInput): Promise<Template> {
  const sql = getDb()
  const ctasJson = JSON.stringify(data.ctas)
  const rows = await sql`
    INSERT INTO templates (slug, name, logo_url, headline, subtitle_html, logo_width, accent_color, ctas)
    VALUES (
      ${data.slug}, ${data.name}, ${data.logo_url},
      ${data.headline ?? 'Cuidar do seu sorriso,'},
      ${data.subtitle_html},
      ${data.logo_width ?? 170},
      ${data.accent_color ?? '#A8D156'},
      ${ctasJson}::jsonb
    )
    RETURNING *
  `
  return rows[0] as unknown as Template
}

export async function updateTemplate(id: string, data: Partial<TemplateInput>): Promise<Template | null> {
  const sql = getDb()
  const ctasJson = data.ctas !== undefined ? JSON.stringify(data.ctas) : undefined
  const rows = await sql`
    UPDATE templates SET
      slug          = COALESCE(${data.slug ?? null}, slug),
      name          = COALESCE(${data.name ?? null}, name),
      logo_url      = COALESCE(${data.logo_url ?? null}, logo_url),
      headline      = COALESCE(${data.headline ?? null}, headline),
      subtitle_html = COALESCE(${data.subtitle_html ?? null}, subtitle_html),
      logo_width    = COALESCE(${data.logo_width ?? null}, logo_width),
      accent_color  = COALESCE(${data.accent_color ?? null}, accent_color),
      ctas          = COALESCE(${ctasJson ?? null}::jsonb, ctas),
      updated_at    = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return (rows[0] as unknown as Template) ?? null
}

export async function deleteTemplate(id: string): Promise<void> {
  const sql = getDb()
  await sql`DELETE FROM templates WHERE id = ${id}`
}
