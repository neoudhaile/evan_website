'use client';

import { useState } from 'react';

export default function TestBlob() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/content/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Title - ' + new Date().toLocaleTimeString(),
          subtitle: 'Test subtitle',
          heroImage: '/test.jpg',
          heroImageAlt: 'Test image'
        })
      });

      const data = await response.json();
      setResult({ type: 'save', status: response.status, data });
    } catch (error) {
      setResult({ type: 'save', error: String(error) });
    }
    setLoading(false);
  };

  const testLoad = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/content/home', {
        method: 'GET'
      });

      const data = await response.json();
      setResult({ type: 'load', status: response.status, data });
    } catch (error) {
      setResult({ type: 'load', error: String(error) });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050404] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-white text-2xl mb-8">Blob Storage Test</h1>

        <div className="space-x-4 mb-8">
          <button
            onClick={testSave}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Save'}
          </button>

          <button
            onClick={testLoad}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Load'}
          </button>
        </div>

        {result && (
          <div className="bg-[#030202] rounded p-4">
            <h3 className="text-white mb-4">
              {result.type === 'save' ? '💾 Save Test' : '📖 Load Test'}
              {result.status && ` (${result.status})`}
            </h3>
            <pre className="text-green-400 text-sm overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-[#030202] rounded p-4">
          <h3 className="text-white mb-4">Expected Behavior</h3>
          <ul className="text-gray-300 space-y-2 text-sm">
            <li>🔧 <strong>Local Dev:</strong> Save should work (writes to files), Load returns 404 (no Blob)</li>
            <li>☁️ <strong>Production:</strong> Both Save & Load should work (uses Blob storage)</li>
            <li>🎯 <strong>Goal:</strong> Verify save works locally, then deploy for full functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
}