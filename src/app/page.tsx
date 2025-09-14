import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { homeContent } from "../../content/home";
import { getContentWithFallback } from "@/lib/content-storage";

export default async function Home() {
  // Get dynamic content with fallback to static file
  const content = await getContentWithFallback('home', homeContent);
  return (
    <div className="min-h-screen bg-[#050404] flex items-center justify-center px-4">
      <div className="text-center w-full max-w-md mx-auto">
        {/* Main Header */}
        <FadeIn delay={300} direction="up">
          <h1 className="text-white mb-8 text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight">
            {content.title}
          </h1>
        </FadeIn>

        {/* Artist Picture - Centered */}
        <FadeIn delay={0} direction="fade">
          <div className="mb-8">
            <div className="w-64 h-80 sm:w-72 sm:h-90 lg:w-80 lg:h-96 mx-auto rounded-lg overflow-hidden">
              <Image
                src={content.heroImage}
                alt={content.heroImageAlt}
                width={320}
                height={384}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </FadeIn>

        {/* Sub Text */}
        <FadeIn delay={600} direction="up">
          <p className="body-text text-gray-300 text-lg sm:text-xl">
            {content.subtitle}
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
