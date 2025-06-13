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
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' or 'customize'

  const handleGenerateDigiPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                    Latitude
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      id="latitude"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="e.g., 28.6139"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                    Longitude
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      id="longitude"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="e.g., 77.2090"
                      required
                    />
                  </div>
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
                    placeholder="e.g., home, office"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  If provided, your DIGIPIN will be accessible at digipin.link/{customName || 'your-name'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  Use My Location
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate DIGIPIN'
                  )}
                </button>
              </div>
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
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Your DIGIPIN</h2>
              <p className="text-2xl font-mono bg-white p-3 rounded-lg border border-blue-200 shadow-sm">{digiPin}</p>
              
              {customName && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Share this link: <a href={`/${customName}`} className="text-blue-600 hover:underline">digipin.link/{customName}</a>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
