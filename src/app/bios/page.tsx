import FadeIn from "@/components/FadeIn";
import Image from "next/image";
import { bioContent } from "../../../content/bio";

export default function Bios() {
  return (
    <div className="min-h-screen bg-[#050404]">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-16">
        {/* Bio Header */}
        <FadeIn delay={0} direction="up">
          <h1 className="h1 text-white text-center mb-8 sm:mb-12">
            {bioContent.title}
          </h1>
        </FadeIn>

        {/* Portrait Mode: Stack all content vertically */}
        <div className="block portrait:block landscape:hidden">
          {/* First 2 paragraphs */}
          <FadeIn delay={300} direction="up">
            <div className="max-w-4xl mx-auto mb-8">
              <p className="body-text text-gray-300 leading-relaxed mb-6 text-justify">
                {bioContent.paragraphs[0]}
              </p>

              <p className="body-text text-gray-300 leading-relaxed mb-6 text-justify">
                {bioContent.paragraphs[1]}
              </p>
            </div>
          </FadeIn>

          {/* Image */}
          <FadeIn delay={600} direction="up">
            <div className="flex justify-center mb-8">
              <div className="w-80 h-96 rounded-lg overflow-hidden">
                <Image
                  src={bioContent.image}
                  alt={bioContent.imageAlt}
                  width={320}
                  height={384}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </FadeIn>

          {/* Remaining paragraphs */}
          <FadeIn delay={900} direction="up">
            <div className="max-w-4xl mx-auto">
              {bioContent.paragraphs.slice(2).map((paragraph, index) => (
                <p key={index} className="body-text text-gray-300 leading-relaxed mb-6 text-justify">
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Landscape Mode: Two-column with overflow */}
        <div className="hidden landscape:block">
          <div className="flex gap-12 items-start mb-12">
            {/* Text column - fills space equal to image height */}
            <FadeIn delay={300} direction="left">
              <div className="flex-1">
                <div className="h-96 overflow-hidden">
                  {bioContent.paragraphs.slice(0, 4).map((paragraph, index) => (
                    <p key={index} className="body-text text-gray-300 leading-relaxed mb-6 text-justify">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Image column */}
            <FadeIn delay={600} direction="right">
              <div className="flex-shrink-0">
                <div className="w-80 h-96 rounded-lg overflow-hidden">
                  <Image
                    src={bioContent.image}
                    alt={bioContent.imageAlt}
                    width={320}
                    height={384}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Overflow text - full width below */}
          <FadeIn delay={900} direction="up">
            <div className="max-w-4xl mx-auto">
              {bioContent.paragraphs.slice(4).map((paragraph, index) => (
                <p key={index} className={`body-text text-gray-300 leading-relaxed text-justify ${index < bioContent.paragraphs.slice(4).length - 1 ? 'mb-6' : ''}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
