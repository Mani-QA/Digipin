import { NextResponse } from 'next/server';
import { devKV } from '@/utils/kv';

export async function POST(request: Request) {
  try {
    const { digiPin } = await request.json();

    if (!digiPin) {
      return NextResponse.json(
        { error: 'DIGIPIN is required' },
        { status: 400 }
      );
    }

    // Extract coordinates from DIGIPIN
    // Assuming DIGIPIN format is: XX.XXXXX,YY.YYYYY
    const [lat, lng] = digiPin.split(',').map(Number);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'Invalid DIGIPIN format' },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      latitude: lat,
      longitude: lng
    });
  } catch (error) {
    console.error('Error in reverse lookup:', error);
    return NextResponse.json(
      { error: 'Failed to process DIGIPIN' },
      { status: 500 }
    );
  }
} 