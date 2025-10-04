'use client';

import { useState, useEffect } from 'react';
import { contactContent } from '../../../../content/contact';

interface SocialLink {
  name: string;
  href: string;
  bgColor: string;
}

interface ContactContent {
  title: string;
  description: string;
  email: string;
  additionalText: string;
  socialLinks: SocialLink[];
}

export default function ContactEditor() {
  const [content, setContent] = useState<ContactContent>(contactContent);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load current content from API when component mounts
  useEffect(() => {
    const loadCurrentContent = async () => {
      try {
        const response = await fetch(`/api/admin/content/contact?t=${Date.now()}`);

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.content) {
            setContent(result.content);
          }
        }
      } catch (error) {
        console.error('Error loading Contact content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentContent();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/content/contact?t=${Date.now()}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.content) {
          setContent(result.content);
        }
      }
    } catch (error) {
      console.error('Error refreshing Contact content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/content/contact', {
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
      console.error('Error saving Contact content:', error);
      alert(`Error saving content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const addSocialLink = () => {
    setContent({
      ...content,
      socialLinks: [...content.socialLinks, { name: '', href: '', bgColor: 'bg-gray-600' }]
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
          <h2 className="h2 text-white">Contact Page Content</h2>
          <div className="text-gray-400 body-text">Loading...</div>
        </div>
        <div className="text-center text-gray-400 body-text py-8">Loading current Contact content...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="h2 text-white">Contact Page Content</h2>
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
          <label className="block body-text text-gray-300 mb-2">Description (first part of contact text)</label>
          <textarea
            value={content.description}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text resize-vertical"
            placeholder="Please send all questions or service inquiries to"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block body-text text-gray-300 mb-2">Contact Email</label>
          <input
            type="email"
            value={content.email}
            onChange={(e) => setContent({ ...content, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
            placeholder="evanpalermo.booking@gmail.com"
          />
        </div>

        {/* Additional Text */}
        <div>
          <label className="block body-text text-gray-300 mb-2">Additional Text (after email)</label>
          <textarea
            value={content.additionalText}
            onChange={(e) => setContent({ ...content, additionalText: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text resize-vertical"
            placeholder=", or leave a message below:"
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block body-text text-gray-300 mb-1">Platform Name</label>
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
                    placeholder="Instagram"
                  />
                </div>

                <div>
                  <label className="block body-text text-gray-300 mb-1">URL</label>
                  <input
                    type="url"
                    value={link.href}
                    onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
                    placeholder="https://www.instagram.com/username"
                  />
                </div>

                <div>
                  <label className="block body-text text-gray-300 mb-1">Background Color (Tailwind class)</label>
                  <input
                    type="text"
                    value={link.bgColor}
                    onChange={(e) => updateSocialLink(index, 'bgColor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
                    placeholder="bg-blue-600 or bg-gradient-to-r from-purple-500 to-pink-500"
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

            <p className="body-text text-gray-300 mb-4">
              {content.description}<br />
              <a href={`mailto:${content.email}`} className="text-white hover:text-gray-300">
                {content.email}
              </a>
              <br />
              {content.additionalText}
            </p>

            <div className="flex justify-center space-x-4 mb-4">
              {content.socialLinks.slice(0, 3).map((link, index) => (
                <div key={index} className={`w-12 h-12 ${link.bgColor} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{link.name.charAt(0)}</span>
                </div>
              ))}
            </div>

            <p className="caption text-gray-400 mt-2">
              Preview shows simplified version. Full content will appear on the site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}