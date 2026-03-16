import { NextRequest, NextResponse } from 'next/server';
import { resetRateLimit } from '@/lib/rate-limit';

/**
 * Temporary endpoint to reset rate limit for testing purposes
 * TODO: Remove this after initial production setup
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ip } = body;

    if (!ip) {
      return NextResponse.json({ error: 'IP address required' }, { status: 400 });
    }

    // Reset rate limit for the IP
    resetRateLimit(ip);

    return NextResponse.json({
      success: true,
      message: `Rate limit reset for IP: ${ip}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[reset-rate-limit-prod] Error:', error);
    return NextResponse.json(
      { error: 'Failed to reset rate limit' },
      { status: 500 }
    );
  }
}
