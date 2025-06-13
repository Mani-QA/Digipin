import { Metadata } from 'next';
import Link from 'next/link';
import devKV from '@/lib/dev-kv';

interface Props {
  params: {
    customName: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `DIGIPIN Location - ${params.customName}`,
    description: 'View location details for this DIGIPIN',
  };
}

async function getDigiPinData(customName: string) {
  // Use development KV store in development, Cloudflare KV in production
  const kv = process.env.NODE_ENV === 'development' ? devKV : global.env.DIGIPIN_KV;
  const data = await kv.get(customName);
  return data ? JSON.parse(data) : null;
}

export default async function CustomDigiPinPage({ params }: Props) {
  const data = await getDigiPinData(params.customName);

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">DIGIPIN Not Found</h1>
          <p className="text-gray-600 mb-6">The requested DIGIPIN location does not exist.</p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const { digiPin, latitude, longitude } = data;
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const whatsappUrl = `https://wa.me/?text=Check out this location: ${googleMapsUrl}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">DIGIPIN Location Details</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">DIGIPIN</h2>
              <p className="text-2xl font-mono bg-gray-50 p-3 rounded-lg border border-gray-200">{digiPin}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Coordinates</h2>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-gray-600">Latitude: {latitude}</p>
                <p className="text-gray-600">Longitude: {longitude}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View on Google Maps
              </a>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Share on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 