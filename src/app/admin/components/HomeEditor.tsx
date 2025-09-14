'use client';

import { useState, useEffect } from 'react';
import { homeContent } from '../../../../content/home';

interface HomeContent {
  title: string;
  subtitle: string;
  heroImage: string;
  heroImageAlt: string;
}

export default function HomeEditor() {
  console.log('🏗️ HomeEditor v2.0 - WITH API LOADING initialized');
  const [content, setContent] = useState<HomeContent>(homeContent);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load current content from API when component mounts
  useEffect(() => {
    const loadCurrentContent = async () => {
      try {
        console.log('🔄 Loading current content from API...');
        // Add cache-busting to ensure fresh data
        const response = await fetch(`/api/admin/content/home?t=${Date.now()}`);

        if (response.ok) {
          const result = await response.json();
          console.log('📡 Loaded content:', result);

          if (result.success && result.content) {
            console.log('🔄 Setting admin content to:', JSON.stringify(result.content, null, 2));
            setContent(result.content);
            console.log('✅ Content loaded successfully');
            console.log('🔍 Current state after load:', JSON.stringify(result.content, null, 2));
          }
        } else {
          console.log('⚠️ API returned error, using static content');
        }
      } catch (error) {
        console.error('❌ Error loading content:', error);
        console.log('⚠️ Using static content as fallback');
      } finally {
        setLoading(false);
      }
    };

    loadCurrentContent();
  }, []);

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/content/home?t=${Date.now()}`);
      if (response.ok) {
        const result = await response.json();
        console.log('📡 Manual refresh - loaded content:', result);

        if (result.success && result.content) {
          console.log('🔄 Manual refresh - setting content to:', JSON.stringify(result.content, null, 2));
          setContent(result.content);
          console.log('✅ Manual refresh successful');
        }
      }
    } catch (error) {
      console.error('❌ Manual refresh error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      console.log('🔄 Saving home content...', content);

      const response = await fetch('/api/admin/content/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      const result = await response.json();
      console.log('📡 Save response:', result);

      if (response.ok) {
        console.log('✅ Save successful!');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        console.error('❌ Save failed:', result);
        alert(`Failed to save: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      alert(`Error saving content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="h2 text-white">Homepage Content</h2>
          <div className="text-gray-400 body-text">Loading...</div>
        </div>
        <div className="text-center text-gray-400 body-text py-8">Loading current content...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="h2 text-white">Homepage Content</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors body-text disabled:opacity-50"
          >
            {loading ? '🔄' : '↻ Refresh'}
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors body-text"
          >
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block body-text text-gray-300 mb-2">Main Title</label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block body-text text-gray-300 mb-2">Subtitle</label>
          <input
            type="text"
            value={content.subtitle}
            onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
          />
        </div>

        {/* Hero Image */}
        <div>
          <label className="block body-text text-gray-300 mb-2">Hero Image Path</label>
          <input
            type="text"
            value={content.heroImage}
            onChange={(e) => setContent({ ...content, heroImage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
            placeholder="/homepage/image.jpg"
          />
        </div>

        {/* Hero Image Alt Text */}
        <div>
          <label className="block body-text text-gray-300 mb-2">Hero Image Alt Text</label>
          <input
            type="text"
            value={content.heroImageAlt}
            onChange={(e) => setContent({ ...content, heroImageAlt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
          />
        </div>

        {/* Preview */}
        <div className="border border-gray-600 rounded-lg p-4">
          <h3 className="h3 text-white mb-4">Preview</h3>
          <div className="text-center">
            <h1 className="text-4xl font-normal text-white mb-4">{content.title}</h1>
            <p className="body-text text-gray-300">{content.subtitle}</p>
            <div className="mt-4">
              <img
                src={content.heroImage}
                alt={content.heroImageAlt}
                className="w-32 h-40 mx-auto rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}