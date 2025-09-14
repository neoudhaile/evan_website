import FadeIn from "@/components/FadeIn";

export default function Listen() {
  const socialLinks = [
    {
      name: "YouTube",
      href: "https://www.youtube.com/@Evan_Palermo",
      bgColor: "bg-red-600",
      hoverColor: "hover:bg-red-700",
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#050404]">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16">
        {/* Main Header */}
        <FadeIn delay={0} direction="up">
          <h1 className="h1 text-white text-center mb-8 sm:mb-12">
            Listen
          </h1>
        </FadeIn>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-8 sm:space-x-12">
          {socialLinks.map((link, index) => (
            <FadeIn key={link.name} delay={300 + (index * 200)} direction="left">
              <a 
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                <div className={`w-20 h-20 sm:w-24 sm:h-24 ${link.bgColor} rounded-full flex items-center justify-center ${link.hoverColor} transition-colors duration-200`}>
                  {link.icon}
                </div>
                <p className="text-center mt-2 caption text-gray-300 group-hover:text-white">{link.name}</p>
              </a>
            </FadeIn>
          ))}
        </div>

        {/* Additional Text */}
        <FadeIn delay={900} direction="up">
          <div className="text-center mt-12">
            <p className="body-text text-gray-400 text-center px-4">
              Check out Evan&apos;s latest recordings and performances on YouTube
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
