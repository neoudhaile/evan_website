'use client';

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import FadeIn from "@/components/FadeIn";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  // EmailJS initialization
  useEffect(() => {
    try {
      console.log('Initializing EmailJS...');
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      console.log('Environment check:', {
        serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? 'Present' : 'Missing',
        templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? 'Present' : 'Missing',
        publicKey: publicKey ? 'Present' : 'Missing'
      });

      if (publicKey) {
        emailjs.init(publicKey);
        console.log('EmailJS initialized successfully with key:', publicKey);
      } else {
        console.error('EmailJS public key not found in environment variables');
      }
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      console.log('Form submission started with config:', {
        serviceId: serviceId ? 'Present' : 'Missing',
        templateId: templateId ? 'Present' : 'Missing',
        publicKey: publicKey ? 'Present' : 'Missing'
      });

      if (!serviceId || !templateId || !publicKey) {
        throw new Error(`Missing EmailJS configuration: ${!serviceId ? 'serviceId ' : ''}${!templateId ? 'templateId ' : ''}${!publicKey ? 'publicKey' : ''}`);
      }

      // EmailJS template parameters exactly matching your template
      const templateParams = {
        name: `${formData.firstName} ${formData.lastName}`,
        time: new Date().toLocaleString(),
        message: formData.message,
        email: formData.email
      };

      console.log('Sending email with template params:', templateParams);
      console.log('Using service ID:', serviceId);
      console.log('Using template ID:', templateId);

      // Send email using the initialized EmailJS
      const response = await emailjs.send(serviceId, templateId, templateParams);

      console.log('EmailJS response:', {
        status: response.status,
        text: response.text
      });

      if (response.status === 200) {
        console.log('Email sent successfully!');
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        throw new Error(`EmailJS returned status: ${response.status}`);
      }

    } catch (error: any) {
      console.error('Failed to send email:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050404]">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-16">
        {/* Main Header */}
        <FadeIn delay={0} direction="up">
          <h1 className="h1 text-white text-center mb-6 sm:mb-8">
            Contact
          </h1>
        </FadeIn>

        {/* Sub Text */}
        <FadeIn delay={300} direction="up">
          <p className="body-text text-gray-300 text-center mb-8 sm:mb-12">
            Please send all questions or service inquiries to<br />
            <a href="mailto:evanpalermo.booking@gmail.com" className="text-white hover:text-gray-300">
              evanpalermo.booking@gmail.com
            </a>
            ,<br />
            or leave a message below:
          </p>
        </FadeIn>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Contact Form - Left Aligned */}
          <div className="w-full lg:flex-1">
            <FadeIn delay={600} direction="left">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First and Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block body-text text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-600 bg-[#030202] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block body-text text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-600 bg-[#030202] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block body-text text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-[#030202] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block body-text text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-600 bg-[#030202] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    required
                  />
                </div>

                {/* Status Messages */}
                {status === 'success' && (
                  <div className="bg-green-600 text-white p-3 rounded-md text-center body-text">
                    Message sent successfully! Evan will get back to you soon.
                  </div>
                )}

                {status === 'error' && (
                  <div className="bg-red-600 text-white p-3 rounded-md text-center body-text">
                    Failed to send message. Please try again or email directly.
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors duration-200 body-text disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </FadeIn>
          </div>

          {/* Social Media Links - Right Aligned */}
          <div className="w-full lg:flex-shrink-0 lg:w-auto">
            <FadeIn delay={900} direction="right">
              <div className="space-y-4 sm:space-y-6">
                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/evan_palermo/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <span className="caption text-gray-300 group-hover:text-white">Instagram</span>
                </a>

                {/* Facebook */}
                <a 
                  href="https://www.facebook.com/evan.palermo.54/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 group"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="caption text-gray-300 group-hover:text-white">Facebook</span>
                </a>

                {/* TikTok */}
                <a 
                  href="https://www.tiktok.com/@evanpalermo?lang=en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 group"
                >
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </div>
                  <span className="caption text-gray-300 group-hover:text-white">TikTok</span>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
