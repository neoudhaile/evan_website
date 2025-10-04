'use client';

import { useState, useEffect } from 'react';
import { empContent } from '../../../../content/emp';

interface Service {
  title: string;
  description: string;
}

interface EMPContent {
  title: string;
  logo: string;
  logoAlt: string;
  introduction: string;
  services: Service[];
  contactButtonText: string;
  contactButtonLink: string;
}

export default function EMPEditor() {
  const [content, setContent] = useState<EMPContent>(empContent);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load current content from API when component mounts
  useEffect(() => {
    const loadCurrentContent = async () => {
      try {
        const response = await fetch(`/api/admin/content/emp?t=${Date.now()}`);

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.content) {
            setContent(result.content);
          }
        }
      } catch (error) {
        console.error('Error loading EMP content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentContent();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/content/emp?t=${Date.now()}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.content) {
          setContent(result.content);
        }
      }
    } catch (error) {
      console.error('Error refreshing EMP content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/content/emp', {
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
      console.error('Error saving EMP content:', error);
      alert(`Error saving content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const addService = () => {
    setContent({
      ...content,
      services: [...content.services, { title: '', description: '' }]
    });
  };

  const removeService = (index: number) => {
    const newServices = content.services.filter((_, i) => i !== index);
    setContent({ ...content, services: newServices });
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    const newServices = [...content.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setContent({ ...content, services: newServices });
  };

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="h2 text-white">EMP Music Content</h2>
          <div className="text-gray-400 body-text">Loading...</div>
        </div>
        <div className="text-center text-gray-400 body-text py-8">Loading current EMP content...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="h2 text-white">EMP Music Content</h2>
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

        {/* Logo */}
        <div>
          <label className="block body-text text-gray-300 mb-2">Logo Path</label>
          <input
            type="text"
            value={content.logo}
            onChange={(e) => setContent({ ...content, logo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
            placeholder="/emp_logo/EMP Logo.PNG"
          />
        </div>

        {/* Logo Alt Text */}
        <div>
          <label className="block body-text text-gray-300 mb-2">Logo Alt Text</label>
          <input
            type="text"
            value={content.logoAlt}
            onChange={(e) => setContent({ ...content, logoAlt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
          />
        </div>

        {/* Introduction */}
        <div>
          <label className="block body-text text-gray-300 mb-2">Introduction</label>
          <textarea
            value={content.introduction}
            onChange={(e) => setContent({ ...content, introduction: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text resize-vertical"
          />
        </div>

        {/* Services */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="h3 text-white">Services</h3>
            <button
              onClick={addService}
              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors body-text text-sm"
            >
              + Add Service
            </button>
          </div>

          {content.services.map((service, index) => (
            <div key={index} className="bg-[#030202] rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="body-text text-gray-300 font-medium">Service {index + 1}</h4>
                <button
                  onClick={() => removeService(index)}
                  className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition-colors body-text text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block body-text text-gray-300 mb-1">Service Title</label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => updateService(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
                  />
                </div>

                <div>
                  <label className="block body-text text-gray-300 mb-1">Service Description</label>
                  <textarea
                    value={service.description}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text resize-vertical"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Button */}
        <div>
          <label className="block body-text text-gray-300 mb-2">Contact Button Text</label>
          <input
            type="text"
            value={content.contactButtonText}
            onChange={(e) => setContent({ ...content, contactButtonText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
          />
        </div>

        <div>
          <label className="block body-text text-gray-300 mb-2">Contact Button Link</label>
          <input
            type="text"
            value={content.contactButtonLink}
            onChange={(e) => setContent({ ...content, contactButtonLink: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
            placeholder="/contact"
          />
        </div>

        {/* Preview */}
        <div className="border border-gray-600 rounded-lg p-4">
          <h3 className="h3 text-white mb-4">Preview</h3>
          <div className="text-center">
            <h1 className="h2 text-white mb-4">{content.title}</h1>

            <div className="w-16 h-16 mx-auto mb-4 bg-[#030202] rounded-lg flex items-center justify-center p-2">
              <img
                src={content.logo}
                alt={content.logoAlt}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>

            <p className="body-text text-gray-300 text-sm mb-4 text-justify">
              {content.introduction.substring(0, 150)}...
            </p>

            <div className="space-y-2 mb-4">
              {content.services.slice(0, 2).map((service, index) => (
                <div key={index} className="bg-[#030202] rounded p-2">
                  <h4 className="caption text-white font-medium">{service.title}</h4>
                  <p className="caption text-gray-400 text-xs">
                    {service.description.substring(0, 80)}...
                  </p>
                </div>
              ))}
            </div>

            <button className="bg-white text-black caption py-1 px-3 rounded text-xs">
              {content.contactButtonText}
            </button>

            <p className="caption text-gray-400 mt-2">
              Preview shows condensed version. Full content will appear on the site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}