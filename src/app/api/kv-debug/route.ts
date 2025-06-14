import { NextResponse } from 'next/server';
import { devKV } from '@/utils/kv';

export const runtime = 'edge';

export async function GET() {
  try {
    // Test data
    const testData = {
      digiPin: "123456",
      latitude: 12.9716,
      longitude: 77.5946
    };

    // Get environment variables (without exposing sensitive data)
    const envCheck = {
      hasAccountId: !!process.env.CLOUDFLARE_ACCOUNT_ID,
      hasApiToken: !!process.env.CLOUDFLARE_API_TOKEN,
      hasNamespaceId: !!process.env.NEXT_PUBLIC_DEV_KV_ID,
      namespaceId: process.env.NEXT_PUBLIC_DEV_KV_ID
    };

    // Try to write to KV
    let writeResult;
    try {
      await devKV.put('test-key', JSON.stringify(testData));
      writeResult = { success: true };
    } catch (writeError) {
      writeResult = {
        success: false,
        error: writeError instanceof Error ? writeError.message : 'Unknown write error'
      };
    }

    // Try to read from KV
    let readResult;
    try {
      const value = await devKV.get('test-key');
      readResult = {
        success: true,
        value: value ? JSON.parse(value) : null,
        rawValue: value
      };
    } catch (readError) {
      readResult = {
        success: false,
        error: readError instanceof Error ? readError.message : 'Unknown read error'
      };
    }

    return NextResponse.json({
      environment: envCheck,
      write: writeResult,
      read: readResult
    });
  } catch (error) {
    console.error('KV debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 