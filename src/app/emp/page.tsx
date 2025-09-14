import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import Image from "next/image";

export default function EMP() {
  return (
    <div className="min-h-screen bg-[#050404]">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16">
        {/* Main Header */}
        <FadeIn delay={0} direction="up">
          <h1 className="h1 text-white text-center mb-8 sm:mb-12">
            EMP Music
          </h1>
        </FadeIn>

        {/* EMP Logo */}
        <FadeIn delay={300} direction="up">
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto bg-[#030202] rounded-lg flex items-center justify-center p-4">
              <Image
                src="/emp_logo/EMP Logo.PNG"
                alt="EMP Music Logo"
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
              EMP Music is an Ohio-based consultation service for musicians. EMP Music's goal is to help young artists 
              navigate the modern music industry and gain traction through live performances. Services offered include 
              live show promotion and logistical management, social media promotion, booking, individual promotion 
              consultation, and more.
            </p>
          </div>
        </FadeIn>

        {/* Services */}
        <div className="space-y-6 sm:space-y-8 lg:space-y-12">
          {/* Live Show Promotion */}
          <FadeIn delay={900} direction="up">
            <div className="bg-[#030202] rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
              <h2 className="h2 text-white mb-4">
                Live Show Promotion & Booking
              </h2>
              <p className="body-text text-gray-300 leading-relaxed mb-4">
                EMP Music offers promotional services for bands both local and touring to Ohio-based markets such as 
                Cleveland and Toledo. EMP Music helps acts get in contact with venues and manage negotiations for the act. 
                Along with this, EMP Music helps create sensible bills to maximize attendance and success of the event.
              </p>
            </div>
          </FadeIn>

          {/* Social Media Promotion */}
          <FadeIn delay={1200} direction="up">
            <div className="bg-[#030202] rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
              <h2 className="h2 text-white mb-4">
                Social Media Promotion & Consultation
              </h2>
              <p className="body-text text-gray-300 leading-relaxed mb-4">
                EMP Music also offers consultation for emerging artists who are looking to build their social following 
                through media promotion. EMP Music helps artists create interactive content to grow their social media 
                presence while engaging with fans and followers. Along with that, EMP Music helps artists stay on a 
                consistent schedule by researching demographics that align with artists and offer unique ideas to stay 
                present in the ever-changing social media trends.
              </p>
            </div>
          </FadeIn>

          {/* Contact Button */}
          <FadeIn delay={1500} direction="up">
            <div className="text-center">
              <Link 
                href="/contact"
                className="inline-block bg-white text-black body-text py-3 px-6 sm:px-8 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                Contact EMP Music
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
