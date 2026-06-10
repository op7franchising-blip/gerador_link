export interface CTA {
  id: string
  label: string
  href: string
  icon: string
  meta?: string
}

export interface Template {
  id: string
  slug: string
  name: string
  logo_url: string
  subtitle_html: string
  ctas: CTA[]
  created_at: string
  updated_at: string
}

export type TemplateInput = Omit<Template, 'id' | 'created_at' | 'updated_at'>
