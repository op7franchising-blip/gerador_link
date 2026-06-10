import { NextResponse } from 'next/server'
import { initDb } from '@/lib/db'

async function init() {
  try {
    await initDb()
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export const GET = init
export const POST = init
