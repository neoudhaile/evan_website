'use client';

import { useState } from 'react';
import { showsContent } from '../../../../content/shows';

interface Show {
  date: string;
  band: string;
  venue: string;
  time: string;
}

interface ShowsContent {
  title: string;
  shows: Show[];
}

export default function ShowsEditor() {
  const [content, setContent] = useState<ShowsContent>(showsContent);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/content/shows', {
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

  const addShow = () => {
    const newShow: Show = {
      date: '',
      band: '',
      venue: '',
      time: ''
    };
    setContent({
      ...content,
      shows: [...content.shows, newShow]
    });
  };

  const updateShow = (index: number, field: keyof Show, value: string) => {
    const newShows = [...content.shows];
    newShows[index] = { ...newShows[index], [field]: value };
    setContent({ ...content, shows: newShows });
  };

  const deleteShow = (index: number) => {
    const newShows = content.shows.filter((_, i) => i !== index);
    setContent({ ...content, shows: newShows });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="h2 text-white">Show Dates</h2>
        <div className="flex gap-2">
          <button
            onClick={addShow}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors body-text"
          >
            + Add Show
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

        {/* Shows List */}
        <div>
          <h3 className="h3 text-white mb-4">Shows ({content.shows.length})</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {content.shows.map((show, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="body-text text-white font-medium">Show #{index + 1}</h4>
                  <button
                    onClick={() => deleteShow(index)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block caption text-gray-400 mb-1">Date</label>
                    <input
                      type="text"
                      value={show.date}
                      onChange={(e) => updateShow(index, 'date', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-600 bg-[#050404] text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-white"
                      placeholder="9/12/25"
                    />
                  </div>
                  <div>
                    <label className="block caption text-gray-400 mb-1">Time</label>
                    <input
                      type="text"
                      value={show.time}
                      onChange={(e) => updateShow(index, 'time', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-600 bg-[#050404] text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-white"
                      placeholder="7:30pm-10:00pm"
                    />
                  </div>
                  <div>
                    <label className="block caption text-gray-400 mb-1">Band/Description</label>
                    <input
                      type="text"
                      value={show.band}
                      onChange={(e) => updateShow(index, 'band', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-600 bg-[#050404] text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-white"
                      placeholder="EMP Trio"
                    />
                  </div>
                  <div>
                    <label className="block caption text-gray-400 mb-1">Venue</label>
                    <input
                      type="text"
                      value={show.venue}
                      onChange={(e) => updateShow(index, 'venue', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-600 bg-[#050404] text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-white"
                      placeholder="Blu Jazz +"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="border border-gray-600 rounded-lg p-4">
          <h3 className="h3 text-white mb-4">Preview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left caption text-gray-300 py-2">Date</th>
                  <th className="text-left caption text-gray-300 py-2">Band/Desc.</th>
                  <th className="text-left caption text-gray-300 py-2">Venue</th>
                  <th className="text-left caption text-gray-300 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {content.shows.slice(0, 5).map((show, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="caption text-white py-1">{show.date}</td>
                    <td className="caption text-white py-1">{show.band}</td>
                    <td className="caption text-white py-1">{show.venue}</td>
                    <td className="caption text-white py-1">{show.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {content.shows.length > 5 && (
              <p className="caption text-gray-400 mt-2">
                Showing first 5 shows. Total: {content.shows.length}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}