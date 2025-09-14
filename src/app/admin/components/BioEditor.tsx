'use client';

import { useState } from 'react';
import { bioContent } from '../../../../content/bio';

interface BioContent {
  title: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
}

export default function BioEditor() {
  const [content, setContent] = useState<BioContent>(bioContent);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/content/bio', {
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

  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...content.paragraphs];
    newParagraphs[index] = value;
    setContent({ ...content, paragraphs: newParagraphs });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="h2 text-white">Biography Content</h2>
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
          <label className="block body-text text-gray-300 mb-2">Page Title</label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
          />
        </div>

        {/* Bio Image */}
        <div>
          <label className="block body-text text-gray-300 mb-2">Bio Image Path</label>
          <input
            type="text"
            value={content.image}
            onChange={(e) => setContent({ ...content, image: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
            placeholder="/gallery/bio-image.jpg"
          />
        </div>

        {/* Bio Image Alt Text */}
        <div>
          <label className="block body-text text-gray-300 mb-2">Bio Image Alt Text</label>
          <input
            type="text"
            value={content.imageAlt}
            onChange={(e) => setContent({ ...content, imageAlt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
          />
        </div>

        {/* Bio Paragraphs */}
        <div>
          <h3 className="h3 text-white mb-4">Bio Paragraphs</h3>
          {content.paragraphs.map((paragraph, index) => (
            <div key={index} className="mb-4">
              <label className="block body-text text-gray-300 mb-2">
                Paragraph {index + 1}
              </label>
              <textarea
                value={paragraph}
                onChange={(e) => updateParagraph(index, e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text resize-vertical"
              />
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="border border-gray-600 rounded-lg p-4">
          <h3 className="h3 text-white mb-4">Preview</h3>
          <div>
            <h1 className="h2 text-white text-center mb-4">{content.title}</h1>
            <div className="flex gap-4 items-start mb-4">
              <div className="flex-1">
                <p className="body-text text-gray-300 text-justify">
                  {content.paragraphs[0]?.substring(0, 200)}...
                </p>
              </div>
              <div className="w-32">
                <img
                  src={content.image}
                  alt={content.imageAlt}
                  className="w-full h-40 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
            <p className="caption text-gray-400">
              Showing first paragraph preview. Full bio will appear on the site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}