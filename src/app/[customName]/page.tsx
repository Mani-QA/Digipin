import { Metadata } from 'next';
import Link from 'next/link';
import { devKV } from '@/utils/kv';
import { digiPinToCoordinates } from '@/utils/digipin';

interface PageProps {
  params: {
    customName: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { customName } = params;
  const data = await getDigiPinData(customName);

  if (!data) {
    return {
      title: 'DIGIPIN Not Found',
      description: 'The requested DIGIPIN location could not be found.',
    };
  }

  return {
    title: `${customName} - DIGIPIN Location`,
    description: `View the DIGIPIN location for ${customName}. Key: ${customName}, DIGIPIN: ${data.digiPin}`,
    openGraph: {
      title: `${customName} - DIGIPIN Location`,
      description: `View the DIGIPIN location for ${customName}. Key: ${customName}, DIGIPIN: ${data.digiPin}`,
      type: 'website',
    },
  };
}

async function getDigiPinData(customName: string) {
  try {
    const digiPin = await devKV.get(customName);
    console.log('Retrieved digipin:', digiPin);

    if (!digiPin) {
      console.log('No digipin found for:', customName);
      return null;
    }

    const coordinates = digiPinToCoordinates(digiPin);
    console.log('Calculated coordinates:', coordinates);

    return {
      digiPin,
      ...coordinates
    };
  } catch (error) {
    console.error('Error getting digipin data:', error);
    return null;
  }
}

export default async function CustomDigiPinPage({ params }: PageProps) {
  const { customName } = params;
  const data = await getDigiPinData(customName);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">DIGIPIN Not Found</h1>
          <p className="text-gray-600 mb-6">The DIGIPIN location you're looking for doesn't exist.</p>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{customName}</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">DIGIPIN</p>
                <p className="text-xl font-bold text-gray-800">{digiPin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Coordinates</p>
                <p className="text-xl font-bold text-gray-800">{latitude}, {longitude}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              View on Google Maps
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Share via WhatsApp
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Create Another Custom Name
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 