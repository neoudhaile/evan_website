'use client';

import { useState } from 'react';
import HomeEditor from './HomeEditor';
import BioEditor from './BioEditor';
import ShowsEditor from './ShowsEditor';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminSection = 'home' | 'bio' | 'shows' | 'emp' | 'listen' | 'contact' | 'gallery';

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>('home');

  const sections = [
    { id: 'home' as AdminSection, label: 'Homepage', icon: '🏠' },
    { id: 'bio' as AdminSection, label: 'Biography', icon: '📖' },
    { id: 'shows' as AdminSection, label: 'Show Dates', icon: '🎭' },
    { id: 'emp' as AdminSection, label: 'EMP Music', icon: '🏢' },
    { id: 'listen' as AdminSection, label: 'Listen', icon: '🎵' },
    { id: 'contact' as AdminSection, label: 'Contact', icon: '📞' },
    { id: 'gallery' as AdminSection, label: 'Gallery', icon: '🖼️' }
  ];

  const renderEditor = () => {
    switch (activeSection) {
      case 'home':
        return <HomeEditor />;
      case 'bio':
        return <BioEditor />;
      case 'shows':
        return <ShowsEditor />;
      default:
        return (
          <div className="text-center py-12">
            <p className="body-text text-gray-300">
              {sections.find(s => s.id === activeSection)?.label} editor coming soon...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050404]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="h1 text-white">Content Management</h1>
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors caption"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-[#030202] rounded-lg p-6">
            <h2 className="h3 text-white mb-4">Sections</h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors body-text flex items-center gap-3 ${
                    activeSection === section.id
                      ? 'bg-white text-black'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span>{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-[#030202] rounded-lg p-6">
            {renderEditor()}
          </div>
        </div>
      </div>
    </div>
  );
}