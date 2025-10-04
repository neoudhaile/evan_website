import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import Image from "next/image";
import { empContent } from "../../../content/emp";
import { getContentWithFallback } from "@/lib/content-storage";

// Force dynamic rendering to avoid static generation caching
export const dynamic = 'force-dynamic';

export default async function EMP() {
  // Get dynamic content with fallback to static file
  const content = await getContentWithFallback('emp', empContent);
  return (
    <div className="min-h-screen bg-[#050404]">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16">
        {/* Main Header */}
        <FadeIn delay={0} direction="up">
          <h1 className="h1 text-white text-center mb-8 sm:mb-12">
            {content.title}
          </h1>
        </FadeIn>

        {/* EMP Logo */}
        <FadeIn delay={300} direction="up">
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto bg-[#030202] rounded-lg flex items-center justify-center p-4">
              <Image
                src={content.logo}
                alt={content.logoAlt}
                width={160}
                height={160}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </FadeIn>

        {/* Introduction */}
        <FadeIn delay={600} direction="up">
          <div className="bg-[#030202] rounded-lg shadow-md p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <p className="body-text text-gray-300 leading-relaxed text-center">
              {content.introduction}
            </p>
          </div>
        </FadeIn>

        {/* Services */}
        <div className="space-y-6 sm:space-y-8 lg:space-y-12">
          {content.services.map((service, index) => (
            <FadeIn key={index} delay={900 + (index * 300)} direction="up">
              <div className="bg-[#030202] rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
                <h2 className="h2 text-white mb-4">
                  {service.title}
                </h2>
                <p className="body-text text-gray-300 leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}

          {/* Contact Button */}
          <FadeIn delay={1500} direction="up">
            <div className="text-center">
              <Link
                href={content.contactButtonLink}
                className="inline-block bg-white text-black body-text py-3 px-6 sm:px-8 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                {content.contactButtonText}
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
