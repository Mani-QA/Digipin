'use client';

import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { MapPinIcon, ArrowPathIcon, LinkIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [customName, setCustomName] = useState('');
  const [digiPin, setDigiPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('generate'); // 'generate', 'reverse', or 'customize'
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapsUrl, setMapsUrl] = useState('');

  // Helper to extract coordinates from Google Maps URL
  function extractLatLngFromUrl(url: string): { latitude: string; longitude: string } | null {
    // Try to match @lat,lng or /@lat,lng or /lat,lng
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || url.match(/\/(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return { latitude: match[1], longitude: match[2] };
    }
    return null;
  }

  const handleGenerateDigiPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Extract coordinates from URL
    const coords = extractLatLngFromUrl(mapsUrl);
    if (!coords) {
      toast.error('Could not extract coordinates from the provided Google Maps URL.');
      setLoading(false);
      return;
    }
    const { latitude, longitude } = coords;

    try {
      const response = await fetch('/api/digipin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude, customName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate DIGIPIN');
      }

      setDigiPin(data.digiPin);
      if (customName) {
        toast.success(`DIGIPIN saved as ${customName}`);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomName = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/digipin/customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ digiPin, customName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create custom name');
      }

      toast.success(`DIGIPIN ${digiPin} saved as ${customName}`);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReverseLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/digipin/reverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ digiPin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to lookup coordinates');
      }

      setCoordinates(data);
      toast.success('Coordinates found!');
    } catch (error) {
      toast.error((error as Error).message);
      setCoordinates(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
      },
      (error) => {
        toast.error('Unable to retrieve your location');
      }
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">DIGIPIN Generator</h1>
          <p className="text-lg text-gray-600">
            Generate unique DIGIPINs for any location in India. Share locations easily with custom named DIGIPINs.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="flex space-x-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                activeTab === 'generate'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Generate DIGIPIN
            </button>
            <button
              onClick={() => setActiveTab('reverse')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                activeTab === 'reverse'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Lookup Coordinates
            </button>
            <button
              onClick={() => setActiveTab('customize')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                activeTab === 'customize'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Custom Name
            </button>
          </div>

          {activeTab === 'generate' ? (
            <form onSubmit={handleGenerateDigiPin} className="space-y-6">
              <div>
                <label htmlFor="mapsUrl" className="block text-sm font-medium text-gray-700">
                  Google Maps URL
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="mapsUrl"
                    id="mapsUrl"
                    value={mapsUrl}
                    onChange={(e) => setMapsUrl(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Paste Google Maps URL here"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="customName" className="block text-sm font-medium text-gray-700">
                  Custom Name (Optional)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="customName"
                    id="customName"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g., blore"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate DIGIPIN'}
              </button>
            </form>
          ) : activeTab === 'reverse' ? (
            <form onSubmit={handleReverseLookup} className="space-y-6">
              <div>
                <label htmlFor="digiPin" className="block text-sm font-medium text-gray-700">
                  DIGIPIN
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="digiPin"
                    id="digiPin"
                    value={digiPin}
                    onChange={(e) => setDigiPin(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter DIGIPIN (e.g., 28.6139,77.2090)"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                      Looking up...
                    </>
                  ) : (
                    'Lookup Coordinates'
                  )}
                </button>
              </div>

              {coordinates && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Coordinates Found:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Latitude</p>
                      <p className="text-lg font-medium">{coordinates.latitude}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Longitude</p>
                      <p className="text-lg font-medium">{coordinates.longitude}</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleCreateCustomName} className="space-y-6">
              <div>
                <label htmlFor="digiPin" className="block text-sm font-medium text-gray-700">
                  DIGIPIN
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="digiPin"
                    id="digiPin"
                    value={digiPin}
                    onChange={(e) => setDigiPin(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your DIGIPIN"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="customName" className="block text-sm font-medium text-gray-700">
                  Custom Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="customName"
                    id="customName"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g., home, office"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Your DIGIPIN will be accessible at digipin.link/{customName || 'your-name'}
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <LinkIcon className="h-5 w-5 mr-2" />
                      Create Custom Name
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {digiPin && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Your DIGIPIN</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{digiPin}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(digiPin);
                    toast.success('DIGIPIN copied to clipboard!');
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
