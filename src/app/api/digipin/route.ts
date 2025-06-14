import { NextResponse } from 'next/server';
import { getDigiPin, getLatLngFromDigiPin } from '@/utils/digipin';
import { devKV } from '@/utils/kv';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { latitude, longitude, customName } = await request.json();
    
    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    const digiPin = getDigiPin(Number(latitude), Number(longitude));
    
    if (customName) {
      // Store in KV if custom name is provided
      await devKV.put(customName, digiPin);
    }

    return NextResponse.json({ digiPin });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const digiPin = searchParams.get('digiPin');
    
    if (!digiPin) {
      return NextResponse.json({ error: 'DIGIPIN is required' }, { status: 400 });
    }

    const location = getLatLngFromDigiPin(digiPin);
    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
} 