import FadeIn from "@/components/FadeIn";
import { showsContent } from "../../../content/shows";

export default function Shows() {

  return (
    <div className="min-h-screen bg-[#050404]">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-16">
        {/* Main Header */}
        <FadeIn delay={0} direction="up">
          <h1 className="h1 text-white text-center mb-8 sm:mb-12">
            {showsContent.title}
          </h1>
        </FadeIn>

        {/* Mobile Shows List */}
        <div className="space-y-4 portrait:block landscape:hidden">
          {showsContent.shows.map((show, index) => (
            <FadeIn key={index} delay={300 + (index * 50)} direction="up">
              <div className="bg-[#030202] rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="body-text text-white font-medium">{show.band}</h3>
                  <span className="caption text-gray-300">{show.date}</span>
                </div>
                <p className="caption text-gray-400 mb-1">{show.venue}</p>
                <p className="caption text-gray-400">{show.time}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Desktop Shows Table */}
        <div className="hidden landscape:block bg-[#030202] rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-4 bg-[#030202] border-b border-gray-700">
            <div className="px-6 py-4 text-left body-text text-gray-300 uppercase tracking-wider">
              Date
            </div>
            <div className="px-6 py-4 text-left body-text text-gray-300 uppercase tracking-wider">
              Band/Desc.
            </div>
            <div className="px-6 py-4 text-left body-text text-gray-300 uppercase tracking-wider">
              Venue
            </div>
            <div className="px-6 py-4 text-left body-text text-gray-300 uppercase tracking-wider">
              Time
            </div>
          </div>

          {showsContent.shows.map((show, index) => (
            <FadeIn key={index} delay={300 + (index * 100)} direction="up">
              <div className="grid grid-cols-4 border-t border-gray-700">
                <div className="px-6 py-4 body-text text-white">
                  {show.date}
                </div>
                <div className="px-6 py-4 body-text text-white">
                  {show.band}
                </div>
                <div className="px-6 py-4 body-text text-white">
                  {show.venue}
                </div>
                <div className="px-6 py-4 body-text text-white">
                  {show.time}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
