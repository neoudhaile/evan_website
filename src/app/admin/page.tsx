'use client';

import { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';

const ADMIN_PASSWORD = 'emp2025'; // Simple password for now

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050404] flex items-center justify-center">
        <div className="bg-[#030202] p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="h2 text-white text-center mb-6">Admin Login</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block body-text text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 caption text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-white text-black py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors duration-200 body-text"
            >
              Login
            </button>
          </form>

          <p className="caption text-gray-400 text-center mt-4">
            Contact the developer if you need password access
          </p>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
}