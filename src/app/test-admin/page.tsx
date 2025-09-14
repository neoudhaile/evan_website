'use client';

import { useState } from 'react';

interface TestResult {
  type: 'diagnostics' | 'save-test' | 'error';
  data?: unknown;
  error?: string;
}

export default function TestAdmin() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-content');
      const data = await response.json();
      setResult({ type: 'diagnostics', data });
    } catch (error) {
      setResult({ type: 'error', error: String(error) });
    }
    setLoading(false);
  };

  const testSaveLoad = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-content', { method: 'POST' });
      const data = await response.json();
      setResult({ type: 'save-test', data });
    } catch (error) {
      setResult({ type: 'error', error: String(error) });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050404] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-3xl mb-8">Admin System Diagnostics</h1>

        <div className="space-x-4 mb-8">
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Running...' : 'Run Diagnostics'}
          </button>

          <button
            onClick={testSaveLoad}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Save/Load'}
          </button>
        </div>

        <div className="bg-gray-800 rounded p-4 mb-6">
          <h3 className="text-white mb-4">🎯 What this tests:</h3>
          <ul className="text-gray-300 space-y-2">
            <li>• <strong>Diagnostics:</strong> Checks Blob storage, static content, and fallback mechanism</li>
            <li>• <strong>Save/Load Test:</strong> Performs complete save → load cycle to verify round-trip</li>
            <li>• <strong>Environment:</strong> Shows if running in local vs production mode</li>
            <li>• <strong>Content Comparison:</strong> Verifies saved data matches loaded data</li>
          </ul>
        </div>

        {result && (
          <div className="bg-[#030202] rounded p-6">
            <h2 className="text-white text-xl mb-4">
              {result.type === 'diagnostics' ? '🔍 Diagnostics Results' :
               result.type === 'save-test' ? '💾 Save/Load Test Results' :
               '❌ Error'}
            </h2>
            <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(result.data || result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-yellow-900 border border-yellow-600 rounded p-4">
          <h3 className="text-yellow-300 mb-2">🔬 Debugging Strategy:</h3>
          <ul className="text-yellow-200 space-y-1 text-sm">
            <li>1. <strong>If Blob content is null:</strong> Content isn&apos;t being saved to Blob properly</li>
            <li>2. <strong>If Blob content exists but doesn&apos;t match:</strong> Save/load mismatch</li>
            <li>3. <strong>If fallback content equals static:</strong> Homepage is using static files instead of Blob</li>
            <li>4. <strong>If environment shows local:</strong> Running locally, should use filesystem fallback</li>
          </ul>
        </div>
      </div>
    </div>
  );
}