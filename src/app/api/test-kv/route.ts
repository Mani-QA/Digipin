import { NextResponse } from 'next/server';
import { devKV } from '@/utils/kv';

export async function GET() {
  try {
    // Test data
    const testData = {
      digiPin: "123456",
      latitude: 12.9716,
      longitude: 77.5946
    };

    console.log('Attempting to write to KV...');
    // Try to write to KV
    await devKV.put('home', JSON.stringify(testData));
    console.log('Write operation completed');
    
    // Try to read from KV
    console.log('Attempting to read from KV...');
    const value = await devKV.get('home');
    console.log('Read operation completed, value:', value);
    
    // Verify the value
    if (!value) {
      console.log('Warning: Value is null after write operation');
    }

    return NextResponse.json({
      success: true,
      message: 'KV test completed',
      value: value ? JSON.parse(value) : null,
      rawValue: value // Include raw value for debugging
    });
  } catch (error) {
    console.error('KV test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 