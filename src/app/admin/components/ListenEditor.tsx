'use client';

import { useState, useEffect } from 'react';
import { listenContent } from '../../../../content/listen';

interface SocialLink {
  name: string;
  href: string;
  bgColor: string;
  hoverColor: string;
}

interface ListenContent {
  title: string;
  description: string;
  socialLinks: SocialLink[];
}

export default function ListenEditor() {
  const [content, setContent] = useState<ListenContent>(listenContent);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load current content from API when component mounts
  useEffect(() => {
    const loadCurrentContent = async () => {
      try {
        const response = await fetch(`/api/admin/content/listen?t=${Date.now()}`);

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.content) {
            setContent(result.content);
          }
        }
      } catch (error) {
        console.error('Error loading Listen content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentContent();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/content/listen?t=${Date.now()}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.content) {
          setContent(result.content);
        }
      }
    } catch (error) {
      console.error('Error refreshing Listen content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/content/listen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      const result = await response.json();

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(`Failed to save: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving Listen content:', error);
      alert(`Error saving content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const addSocialLink = () => {
    setContent({
      ...content,
      socialLinks: [...content.socialLinks, { name: '', href: '', bgColor: 'bg-gray-600', hoverColor: 'hover:bg-gray-700' }]
    });
  };

  const removeSocialLink = (index: number) => {
    const newSocialLinks = content.socialLinks.filter((_, i) => i !== index);
    setContent({ ...content, socialLinks: newSocialLinks });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const newSocialLinks = [...content.socialLinks];
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
    setContent({ ...content, socialLinks: newSocialLinks });
  };

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="h2 text-white">Listen Page Content</h2>
          <div className="text-gray-400 body-text">Loading...</div>
        </div>
        <div className="text-center text-gray-400 body-text py-8">Loading current Listen content...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="h2 text-white">Listen Page Content</h2>
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
          <label className="block body-text text-gray-300 mb-2">Page Title</label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block body-text text-gray-300 mb-2">Description</label>
          <textarea
            value={content.description}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text resize-vertical"
          />
        </div>

        {/* Social Links */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="h3 text-white">Social Links</h3>
            <button
              onClick={addSocialLink}
              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors body-text text-sm"
            >
              + Add Social Link
            </button>
          </div>

          {content.socialLinks.map((link, index) => (
            <div key={index} className="bg-[#030202] rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="body-text text-gray-300 font-medium">Social Link {index + 1}</h4>
                <button
                  onClick={() => removeSocialLink(index)}
                  className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition-colors body-text text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block body-text text-gray-300 mb-1">Platform Name</label>
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
                    placeholder="YouTube"
                  />
                </div>

                <div>
                  <label className="block body-text text-gray-300 mb-1">URL</label>
                  <input
                    type="url"
                    value={link.href}
                    onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
                    placeholder="https://www.youtube.com/@username"
                  />
                </div>

                <div>
                  <label className="block body-text text-gray-300 mb-1">Background Color (Tailwind class)</label>
                  <input
                    type="text"
                    value={link.bgColor}
                    onChange={(e) => updateSocialLink(index, 'bgColor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
                    placeholder="bg-red-600"
                  />
                </div>

                <div>
                  <label className="block body-text text-gray-300 mb-1">Hover Color (Tailwind class)</label>
                  <input
                    type="text"
                    value={link.hoverColor}
                    onChange={(e) => updateSocialLink(index, 'hoverColor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
                    placeholder="hover:bg-red-700"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="border border-gray-600 rounded-lg p-4">
          <h3 className="h3 text-white mb-4">Preview</h3>
          <div className="text-center">
            <h1 className="h2 text-white mb-4">{content.title}</h1>

            <div className="flex justify-center space-x-4 mb-4">
              {content.socialLinks.slice(0, 3).map((link, index) => (
                <div key={index} className={`w-12 h-12 ${link.bgColor} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{link.name.charAt(0)}</span>
                </div>
              ))}
            </div>

            <p className="body-text text-gray-300 text-sm">
              {content.description}
            </p>

            <p className="caption text-gray-400 mt-2">
              Preview shows simplified version. Full content will appear on the site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}