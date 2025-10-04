'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import FadeIn from "@/components/FadeIn";
import ScrollFadeIn from "@/components/ScrollFadeIn";

interface GalleryImage {
  id: number;
  filename: string;
  src: string;
  title: string;
  description?: string;
  order: number;
  visible: boolean;
}

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gallerySettings, setGallerySettings] = useState({
    title: 'Gallery',
    subtitle: '',
    gridColumns: 2
  });

  // Fetch images and settings from API when component mounts
  useEffect(() => {
    // Load gallery images
    const loadGallery = fetch('/api/gallery')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        return response.json();
      })
      .then((data: GalleryImage[]) => {
        setGalleryImages(data);
      });

    // Load gallery settings
    const loadSettings = fetch('/api/admin/content/gallery')
      .then(response => response.json())
      .then(data => {
        if (data.success && data.content) {
          setGallerySettings({
            title: data.content.title || 'Gallery',
            subtitle: data.content.subtitle || '',
            gridColumns: data.content.gridColumns || 2
          });
        }
      })
      .catch(error => {
        console.error('Error loading gallery settings:', error);
        // Continue with defaults
      });

    // Wait for both requests
    Promise.allSettled([loadGallery, loadSettings])
      .then((results) => {
        const galleryResult = results[0];
        if (galleryResult.status === 'rejected') {
          setError(galleryResult.reason?.message || 'Failed to load gallery');
        }
        setLoading(false);
      });
  }, []);

  const openModal = (imageId: number) => {
    setSelectedImage(imageId);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050404] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading gallery...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#050404] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading gallery: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050404]">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-16">
        {/* Main Header */}
        <FadeIn delay={0} direction="up">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="h1 text-white">
              {gallerySettings.title}
            </h1>
            {gallerySettings.subtitle && (
              <p className="body-text text-gray-300 mt-2">
                {gallerySettings.subtitle}
              </p>
            )}
          </div>
        </FadeIn>

        {/* Gallery Grid - Dynamic Columns */}
        <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${
          gallerySettings.gridColumns === 1 ? 'grid-cols-1' :
          gallerySettings.gridColumns === 2 ? 'grid-cols-1 sm:grid-cols-2' :
          gallerySettings.gridColumns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {galleryImages.map((image, index) => {
            // Calculate delay based on position: left to right, then next row
            const row = Math.floor(index / 2);
            const col = index % 2;
            const delay = 300 + (row * 200) + (col * 100);
            
            return (
              <ScrollFadeIn
                key={image.id}
                delay={delay}
                direction="up"
              >
                <div
                  className="bg-[#030202] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => openModal(index)}
                >
                  <div className="relative h-64 bg-[#030202] overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="h3 text-white">{image.title}</h3>
                  </div>
                </div>
              </ScrollFadeIn>
            );
          })}
        </div>

        {/* Modal Overlay */}
        {selectedImage !== null && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Modal Content Container */}
            <div 
              className="relative w-full max-w-6xl max-h-full mx-4 flex items-center justify-center"
            >
              {/* Left Arrow - Fixed position outside image */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow - Fixed position outside image */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image Container - Centered with space for buttons */}
              <div
                className="mx-16 bg-[#030202] rounded-lg overflow-hidden shadow-2xl max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-96 bg-[#030202] overflow-hidden">
                  <Image
                    src={galleryImages[selectedImage].src}
                    alt={galleryImages[selectedImage].title}
                    fill
                    className="object-contain"
                    sizes="90vw"
                    priority
                  />
                </div>
                <div className="p-6">
                  <h3 className="h3 text-white text-center">
                    {galleryImages[selectedImage].title}
                  </h3>
                  <p className="text-center caption text-gray-400 mt-2">
                    {selectedImage + 1} of {galleryImages.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
