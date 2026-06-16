export interface CTA {
  id: string; label: string; href: string; icon: string; meta?: string
  style?: 'dark' | 'accent' | 'light'
}
export interface Template {
  id: string; slug: string; name: string
  template_type: 'modelo01' | 'modelo02'
  logo_url: string; logo_width: number
  logo_href: string
  headline: string; subtitle_html: string
  accent_color: string
  secondary_color: string
  brand_name: string
  handle: string
  footer_logo_url: string
  footer_logo_href: string
  footer_logo_width: number
  footer_copyright: string
  ctas: CTA[]; created_at: string; updated_at: string
}
export type TemplateInput = Omit<Template, 'id' | 'created_at' | 'updated_at'>
