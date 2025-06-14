import { NextResponse } from 'next/server';
import { devKV } from '@/utils/kv';
import { digiPinToCoordinates } from '@/utils/digipin';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { customName, digiPin } = await request.json();

    // Validate inputs
    if (!customName || !digiPin) {
      return NextResponse.json(
        { error: 'Custom name and DIGIPIN are required' },
        { status: 400 }
      );
    }

    // Validate digipin format
    if (!/^[0-9A-Z]{3}-[0-9A-Z]{3}-[0-9A-Z]{4}$/.test(digiPin)) {
      return NextResponse.json(
        { error: 'DIGIPIN must be in format XXX-XXX-XXXX (e.g., 4T3-425-F587)' },
        { status: 400 }
      );
    }

    // Check if custom name already exists
    const existingValue = await devKV.get(customName);
    if (existingValue) {
      return NextResponse.json(
        { error: 'Custom name already exists' },
        { status: 409 }
      );
    }

    // Store only the digipin
    await devKV.put(customName, digiPin);

    // Calculate coordinates for response
    const coordinates = digiPinToCoordinates(digiPin);

    return NextResponse.json({
      success: true,
      message: 'Custom name created successfully',
      data: {
        customName,
        digiPin,
        ...coordinates
      }
    });
  } catch (error) {
    console.error('Error creating custom name:', error);
    return NextResponse.json(
      { error: 'Failed to create custom name' },
      { status: 500 }
    );
  }
} 