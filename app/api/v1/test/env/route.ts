import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    PLAYWRIGHT_TEST: process.env.PLAYWRIGHT_TEST,
    NODE_ENV: process.env.NODE_ENV,
    env_keys: Object.keys(process.env).filter(k => k.includes('PLAYWRIGHT') || k.includes('NODE')),
  })
}
