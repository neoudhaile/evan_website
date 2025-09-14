'use client';

import { useState } from 'react';

interface DiagnosticResult {
  timestamp: string;
  environment: string;
  platform: string;
  cwd: string;
  vercel: boolean;
  filesystem: {
    canRead: boolean;
    canWrite: boolean;
    contentDirExists: boolean;
    contentDirContents: string[];
  };
  errors: string[];
}

export default function AdminDebug() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);
  const [writeTest, setWriteTest] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/debug');
      const data = await response.json();
      setDiagnostics(data);
    } catch (error) {
      console.error('Failed to run diagnostics:', error);
    }
    setLoading(false);
  };

  const testWrite = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testField: 'test value',
          timestamp: new Date().toISOString()
        })
      });
      const data = await response.json();
      setWriteTest(data);
    } catch (error) {
      console.error('Failed to test write:', error);
    }
    setLoading(false);
  };

  const testExistingAPI = async (endpoint: string) => {
    try {
      const response = await fetch(`/api/admin/content/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testField: 'diagnostic test',
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.text();
      console.log(`${endpoint} API Response:`, result);

      alert(`${endpoint} API ${response.ok ? 'succeeded' : 'failed'}: ${result}`);
    } catch (error) {
      console.error(`${endpoint} API failed:`, error);
      alert(`${endpoint} API failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#050404] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-2xl mb-6">Admin Debug Console</h1>

        <div className="space-y-4 mb-8">
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Running...' : 'Run System Diagnostics'}
          </button>

          <button
            onClick={testWrite}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-4"
          >
            {loading ? 'Testing...' : 'Test File Write'}
          </button>

          <div className="space-x-2">
            <button onClick={() => testExistingAPI('home')} className="bg-purple-600 text-white px-3 py-1 rounded text-sm">Test Home API</button>
            <button onClick={() => testExistingAPI('bio')} className="bg-purple-600 text-white px-3 py-1 rounded text-sm">Test Bio API</button>
            <button onClick={() => testExistingAPI('shows')} className="bg-purple-600 text-white px-3 py-1 rounded text-sm">Test Shows API</button>
          </div>
        </div>

        {diagnostics && (
          <div className="bg-[#030202] rounded-lg p-4 mb-6">
            <h2 className="text-white text-xl mb-4">System Diagnostics</h2>
            <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(diagnostics, null, 2)}
            </pre>
          </div>
        )}

        {writeTest && (
          <div className="bg-[#030202] rounded-lg p-4 mb-6">
            <h2 className="text-white text-xl mb-4">Write Test Results</h2>
            <pre className="text-yellow-400 text-sm overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(writeTest, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-[#030202] rounded-lg p-4">
          <h2 className="text-white text-xl mb-4">Expected Issues on Vercel</h2>
          <ul className="text-gray-300 space-y-2">
            <li>• <span className="text-red-400">filesystem.canWrite: false</span> - Vercel serverless functions have read-only filesystem</li>
            <li>• <span className="text-red-400">Write test will fail</span> - Cannot write files to deployed filesystem</li>
            <li>• <span className="text-green-400">filesystem.canRead: true</span> - Should be able to read existing files</li>
            <li>• <span className="text-blue-400">vercel: true</span> - Running in Vercel environment</li>
          </ul>
        </div>
      </div>
    </div>
  );
}