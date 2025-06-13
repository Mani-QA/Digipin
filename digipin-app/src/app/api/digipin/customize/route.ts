import { NextResponse } from 'next/server';
import { getLatLngFromDigiPin } from '@/utils/digipin';
import devKV from '@/lib/dev-kv';

export async function POST(request: Request) {
  try {
    const { digiPin, customName } = await request.json();
    
    if (!digiPin || !customName) {
      return NextResponse.json(
        { error: 'DIGIPIN and custom name are required' },
        { status: 400 }
      );
    }

    // Validate the DIGIPIN by trying to decode it
    const location = getLatLngFromDigiPin(digiPin);

    // Store in KV
    const data = {
      digiPin,
      latitude: location.latitude,
      longitude: location.longitude,
      createdAt: new Date().toISOString()
    };
    
    // Use development KV store in development, Cloudflare KV in production
    const kv = process.env.NODE_ENV === 'development' ? devKV : global.env.DIGIPIN_KV;
    await kv.put(customName, JSON.stringify(data));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
} 