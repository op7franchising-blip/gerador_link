import { neon } from '@neondatabase/serverless'
import type { Template, TemplateInput } from './types'

const FOOTER_LOGO_DEFAULT = 'https://pub-db8ed4fb33634589a6ce5fb07e85cb46.r2.dev/logo/op7_dash_odc/logo_op7nexo.svg'
const FOOTER_HREF_DEFAULT = 'https://www.instagram.com/op7franquias'
const FOOTER_COPYRIGHT_DEFAULT = '© 2026 OP7 Nexo · Todos os direitos reservados'

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
  // Idempotent migrations
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS headline TEXT NOT NULL DEFAULT 'Cuidar do seu sorriso,'`
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS logo_width INTEGER NOT NULL DEFAULT 170`
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS accent_color TEXT NOT NULL DEFAULT '#A8D156'`
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS template_type TEXT NOT NULL DEFAULT 'modelo01'`
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS logo_href TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS secondary_color TEXT NOT NULL DEFAULT '#f15a24'`
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS brand_name TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS handle TEXT NOT NULL DEFAULT ''`
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS footer_logo_url TEXT NOT NULL DEFAULT 'https://pub-db8ed4fb33634589a6ce5fb07e85cb46.r2.dev/logo/op7_dash_odc/logo_op7nexo.svg'`
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS footer_logo_href TEXT NOT NULL DEFAULT 'https://www.instagram.com/op7franquias'`
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS footer_logo_width INTEGER NOT NULL DEFAULT 44`
  await sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS footer_copyright TEXT NOT NULL DEFAULT '© 2026 OP7 Nexo · Todos os direitos reservados'`
}

// Run migrations once per server instance, before any write.
let migrated: Promise<void> | null = null
function ensureMigrated() {
  if (!migrated) {
    migrated = initDb().catch((e) => {
      migrated = null // allow retry on next write if init failed
      throw e
    })
  }
  return migrated
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
  await ensureMigrated()
  const sql = getDb()
  const ctasJson = JSON.stringify(data.ctas)
  const rows = await sql`
    INSERT INTO templates (
      slug, name, template_type,
      logo_url, logo_width, logo_href,
      headline, subtitle_html,
      accent_color, secondary_color,
      brand_name, handle,
      footer_logo_url, footer_logo_href, footer_logo_width, footer_copyright,
      ctas
    )
    VALUES (
      ${data.slug}, ${data.name}, ${data.template_type ?? 'modelo01'},
      ${data.logo_url}, ${data.logo_width ?? 170}, ${data.logo_href ?? ''},
      ${data.headline ?? 'Cuidar do seu sorriso,'}, ${data.subtitle_html},
      ${data.accent_color ?? '#A8D156'}, ${data.secondary_color ?? '#f15a24'},
      ${data.brand_name ?? ''}, ${data.handle ?? ''},
      ${data.footer_logo_url ?? FOOTER_LOGO_DEFAULT},
      ${data.footer_logo_href ?? FOOTER_HREF_DEFAULT},
      ${data.footer_logo_width ?? 44},
      ${data.footer_copyright ?? FOOTER_COPYRIGHT_DEFAULT},
      ${ctasJson}::jsonb
    )
    RETURNING *
  `
  return rows[0] as unknown as Template
}

export async function updateTemplate(id: string, data: Partial<TemplateInput>): Promise<Template | null> {
  await ensureMigrated()
  const sql = getDb()
  const ctasJson = data.ctas !== undefined ? JSON.stringify(data.ctas) : undefined
  const rows = await sql`
    UPDATE templates SET
      slug            = COALESCE(${data.slug ?? null}, slug),
      name            = COALESCE(${data.name ?? null}, name),
      logo_url        = COALESCE(${data.logo_url ?? null}, logo_url),
      logo_href       = COALESCE(${data.logo_href ?? null}, logo_href),
      headline        = COALESCE(${data.headline ?? null}, headline),
      subtitle_html   = COALESCE(${data.subtitle_html ?? null}, subtitle_html),
      logo_width      = COALESCE(${data.logo_width ?? null}, logo_width),
      accent_color    = COALESCE(${data.accent_color ?? null}, accent_color),
      secondary_color = COALESCE(${data.secondary_color ?? null}, secondary_color),
      brand_name      = COALESCE(${data.brand_name ?? null}, brand_name),
      handle          = COALESCE(${data.handle ?? null}, handle),
      footer_logo_url   = COALESCE(${data.footer_logo_url ?? null}, footer_logo_url),
      footer_logo_href  = COALESCE(${data.footer_logo_href ?? null}, footer_logo_href),
      footer_logo_width = COALESCE(${data.footer_logo_width ?? null}, footer_logo_width),
      footer_copyright  = COALESCE(${data.footer_copyright ?? null}, footer_copyright),
      ctas            = COALESCE(${ctasJson ?? null}::jsonb, ctas),
      updated_at      = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return (rows[0] as unknown as Template) ?? null
}

export async function deleteTemplate(id: string): Promise<void> {
  const sql = getDb()
  await sql`DELETE FROM templates WHERE id = ${id}`
}
