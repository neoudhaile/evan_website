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
  const [content, setContent] = useState<HomeContent>(homeContent);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/content/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="h2 text-white">Homepage Content</h2>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors body-text"
        >
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
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