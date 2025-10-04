'use client';

import { useState, useEffect } from 'react';
import { galleryContent } from '../../../../content/gallery';
import Image from 'next/image';

interface GalleryFile {
  filename: string;
  src: string;
  size: number;
  modified: string;
  index: number;
}

interface GalleryMetadata {
  title?: string;
  description?: string;
  order?: number;
  visible?: boolean;
}

interface GalleryContent {
  title: string;
  subtitle?: string;
  gridColumns: number;
  imageMetadata: Record<string, GalleryMetadata>;
}

export default function GalleryEditor() {
  const [content, setContent] = useState<GalleryContent>(galleryContent);
  const [files, setFiles] = useState<GalleryFile[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(false);

  // Load gallery content and files
  useEffect(() => {
    loadContent();
    loadFiles();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch(`/api/admin/content/gallery?t=${Date.now()}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.content) {
          setContent(result.content);
        }
      }
    } catch (error) {
      console.error('Error loading gallery content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async () => {
    setFilesLoading(true);
    try {
      const response = await fetch(`/api/admin/gallery/files?t=${Date.now()}`);
      if (response.ok) {
        const filesData = await response.json();
        setFiles(filesData);
      }
    } catch (error) {
      console.error('Error loading gallery files:', error);
    } finally {
      setFilesLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/content/gallery', {
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
      console.error('Error saving gallery content:', error);
      alert('Error saving content');
    }
  };

  const updateImageMetadata = (filename: string, field: keyof GalleryMetadata, value: string | number | boolean) => {
    setContent(prev => ({
      ...prev,
      imageMetadata: {
        ...prev.imageMetadata,
        [filename]: {
          ...prev.imageMetadata[filename],
          [field]: value
        }
      }
    }));
  };

  const getGitHubUploadUrl = () => {
    return 'https://github.com/neoudhaile/evan_website/upload/main/public/gallery';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="h2 text-white">Gallery Management</h2>
          <div className="text-gray-400 body-text">Loading...</div>
        </div>
        <div className="text-center text-gray-400 body-text py-8">Loading gallery content...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="h2 text-white">Gallery Management</h2>
        <div className="flex gap-2">
          <button
            onClick={loadFiles}
            disabled={filesLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors body-text disabled:opacity-50"
          >
            {filesLoading ? '🔄' : '↻ Refresh'}
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors body-text"
          >
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Upload Section */}
        <div className="bg-[#030202] rounded-lg p-6">
          <h3 className="h3 text-white mb-4">📸 Upload New Images</h3>
          <div className="bg-blue-900 bg-opacity-20 border border-blue-600 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="text-blue-400 text-xl">💡</div>
              <div>
                <h4 className="body-text text-blue-300 font-medium mb-2">How to upload images:</h4>
                <ol className="caption text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Click &quot;Upload to GitHub&quot; below</li>
                  <li>Drag &amp; drop your images to GitHub&apos;s upload area</li>
                  <li>Add a commit message (optional)</li>
                  <li>Click &quot;Commit changes&quot;</li>
                  <li>Return here and click &quot;Refresh&quot; to see new images</li>
                  <li>Edit titles and descriptions below</li>
                </ol>
              </div>
            </div>
          </div>

          <a
            href={getGitHubUploadUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors body-text"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            📸 Upload Images to GitHub
          </a>
        </div>

        {/* Gallery Settings */}
        <div className="bg-[#030202] rounded-lg p-6">
          <h3 className="h3 text-white mb-4">Gallery Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block body-text text-gray-300 mb-2">Page Title</label>
              <input
                type="text"
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
              />
            </div>
            <div>
              <label className="block body-text text-gray-300 mb-2">Grid Columns</label>
              <select
                value={content.gridColumns}
                onChange={(e) => setContent({ ...content, gridColumns: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
              >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block body-text text-gray-300 mb-2">Subtitle (optional)</label>
            <input
              type="text"
              value={content.subtitle || ''}
              onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-600 bg-[#050404] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent body-text"
              placeholder="Photos from performances and events"
            />
          </div>
        </div>

        {/* Image Management */}
        <div className="bg-[#030202] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="h3 text-white">Image Management ({files.length} images)</h3>
            {filesLoading && <div className="text-gray-400 body-text">Loading images...</div>}
          </div>

          {files.length === 0 ? (
            <p className="text-gray-400 body-text text-center py-8">
              No images found. Upload some images using the GitHub link above.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => {
                const metadata = content.imageMetadata[file.filename] || {};
                const cleanFilename = file.filename.replace(/\.[^/.]+$/, "").replace(/_/g, ' ');

                return (
                  <div key={file.filename} className="bg-[#050404] rounded-lg p-4">
                    {/* Image Preview */}
                    <div className="relative h-32 mb-3 bg-gray-800 rounded overflow-hidden">
                      <Image
                        src={file.src}
                        alt={metadata.title || cleanFilename}
                        fill
                        className="object-cover"
                        sizes="300px"
                      />
                    </div>

                    {/* Metadata Form */}
                    <div className="space-y-3">
                      <div>
                        <label className="block caption text-gray-300 mb-1">Custom Title</label>
                        <input
                          type="text"
                          value={metadata.title || ''}
                          onChange={(e) => updateImageMetadata(file.filename, 'title', e.target.value)}
                          placeholder={cleanFilename}
                          className="w-full px-2 py-1 border border-gray-600 bg-[#030202] text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-white"
                        />
                      </div>

                      <div>
                        <label className="block caption text-gray-300 mb-1">Description</label>
                        <textarea
                          value={metadata.description || ''}
                          onChange={(e) => updateImageMetadata(file.filename, 'description', e.target.value)}
                          rows={2}
                          placeholder="Image description..."
                          className="w-full px-2 py-1 border border-gray-600 bg-[#030202] text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-white resize-none"
                        />
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block caption text-gray-300 mb-1">Order</label>
                          <input
                            type="number"
                            value={metadata.order ?? file.index}
                            onChange={(e) => updateImageMetadata(file.filename, 'order', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-600 bg-[#030202] text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-white"
                          />
                        </div>

                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={metadata.visible !== false}
                              onChange={(e) => updateImageMetadata(file.filename, 'visible', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="caption text-gray-300">Visible</span>
                          </label>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 space-y-1">
                        <div>{file.filename}</div>
                        <div>{formatFileSize(file.size)} • {new Date(file.modified).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="border border-gray-600 rounded-lg p-4">
          <h3 className="h3 text-white mb-4">Preview</h3>
          <div className="text-center mb-4">
            <h1 className="h2 text-white">{content.title}</h1>
            {content.subtitle && (
              <p className="body-text text-gray-300 mt-2">{content.subtitle}</p>
            )}
          </div>

          <div className={`grid gap-4 ${
            content.gridColumns === 1 ? 'grid-cols-1' :
            content.gridColumns === 2 ? 'grid-cols-2' :
            content.gridColumns === 3 ? 'grid-cols-3' :
            'grid-cols-4'
          }`}>
            {files
              .filter(file => content.imageMetadata[file.filename]?.visible !== false)
              .sort((a, b) => {
                const orderA = content.imageMetadata[a.filename]?.order ?? a.index;
                const orderB = content.imageMetadata[b.filename]?.order ?? b.index;
                return orderA - orderB;
              })
              .slice(0, 6)
              .map((file) => {
                const metadata = content.imageMetadata[file.filename] || {};
                const cleanFilename = file.filename.replace(/\.[^/.]+$/, "").replace(/_/g, ' ');

                return (
                  <div key={file.filename} className="bg-[#030202] rounded overflow-hidden">
                    <div className="relative h-24 bg-gray-800">
                      <Image
                        src={file.src}
                        alt={metadata.title || cleanFilename}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    </div>
                    <div className="p-2">
                      <p className="caption text-white text-xs truncate">
                        {metadata.title || cleanFilename}
                      </p>
                      {metadata.description && (
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {metadata.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <p className="caption text-gray-400 mt-4 text-center">
            Preview shows first 6 visible images. Full gallery will appear on the site.
          </p>
        </div>
      </div>
    </div>
  );
}