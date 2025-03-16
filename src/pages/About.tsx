import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Building, Users, Award, Globe, MessageSquare, Phone } from 'lucide-react';
import TranslatableText from '@/components/TranslatableText';
import { usePageTranslation } from '@/hooks/usePageTranslation';
import { Skeleton } from '@/components/ui/skeleton';

const About = () => {
  const { theme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define content to be translated
  const pageContent = {
    pageTitle: 'About Us',
    pageDescription: 'Learn more about our mission, values, and the team behind our multilingual loan platform.',
    ourMissionTitle: 'Our Mission',
    ourMissionDescription: 'Our mission is to make financial services accessible to everyone, regardless of language barriers. We believe that everyone deserves access to clear, understandable information about loans and financial products in their preferred language.',
    ourValuesTitle: 'Our Values',
    inclusivityTitle: 'Inclusivity',
    inclusivityDescription: 'We are committed to serving all communities across India by providing financial information in multiple languages.',
    transparencyTitle: 'Transparency',
    transparencyDescription: 'We believe in complete transparency in all our operations and loan information, with no hidden fees or terms.',
    innovationTitle: 'Innovation',
    innovationDescription: 'We continuously innovate to provide the best user experience and most accurate information using cutting-edge AI technology.',
    customerFirstTitle: 'Customer First',
    customerFirstDescription: 'Our customers are at the heart of everything we do. We strive to provide exceptional service and support.',
    ourTeamTitle: 'Our Team',
    ourTeamDescription: 'We are a diverse team of financial experts, technologists, and language specialists committed to breaking down language barriers in financial services.',
    languageSupportTitle: 'Language Support',
    languageSupportDescription: 'Our platform currently supports 11 Indian languages, with plans to expand to more languages in the future.',
    contactUsTitle: 'Contact Us',
    contactUsDescription: 'Have questions or feedback? We\'d love to hear from you. Reach out to our team through any of the channels below.',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    addressLabel: 'Address'
  };

  // Use the custom hook to translate the content
  const { translatedContent, isLoading } = usePageTranslation(pageContent);

  // Loading skeleton for text
  const TextSkeleton = ({ width = 'w-full', height = 'h-6', className = '' }: { width?: string, height?: string, className?: string }) => (
    <Skeleton className={`${width} ${height} ${className} rounded-md`} />
  );

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className={cn(
            "text-3xl font-bold mb-4",
            theme === 'dark' ? "text-white" : "text-loan-gray-800"
          )}>
            {isClient ? (
              isLoading ? <TextSkeleton width="w-1/3" className="mx-auto" /> : translatedContent.pageTitle
            ) : pageContent.pageTitle}
          </h1>
          <p className={cn(
            "max-w-2xl mx-auto",
            theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
          )}>
            {isClient ? (
              isLoading ? <TextSkeleton width="w-2/3" className="mx-auto" /> : translatedContent.pageDescription
            ) : pageContent.pageDescription}
          </p>
        </div>

        {/* Mission Section */}
        <div className={cn(
          "mb-12 p-6 rounded-xl",
          theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
        )}>
          <div className="flex items-center mb-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mr-4",
              theme === 'dark' ? "bg-gray-700 text-blue-400" : "bg-loan-blue/10 text-loan-blue"
            )}>
              <Building size={24} />
            </div>
            <h2 className={cn(
              "text-2xl font-semibold",
              theme === 'dark' ? "text-white" : "text-loan-gray-800"
            )}>
              {isClient ? (
                isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.ourMissionTitle
              ) : pageContent.ourMissionTitle}
            </h2>
          </div>
          <p className={cn(
            "text-lg",
            theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
          )}>
            {isClient ? (
              isLoading ? (
                <>
                  <TextSkeleton className="mb-2" />
                  <TextSkeleton width="w-5/6" />
                </>
              ) : translatedContent.ourMissionDescription
            ) : pageContent.ourMissionDescription}
          </p>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className={cn(
            "text-2xl font-semibold mb-6 text-center",
            theme === 'dark' ? "text-white" : "text-loan-gray-800"
          )}>
            {isClient ? (
              isLoading ? <TextSkeleton width="w-1/4" className="mx-auto" /> : translatedContent.ourValuesTitle
            ) : pageContent.ourValuesTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={cn(
              "p-6 rounded-xl",
              theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
            )}>
              <div className="flex items-center mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                  theme === 'dark' ? "bg-gray-700 text-blue-400" : "bg-loan-blue/10 text-loan-blue"
                )}>
                  <Users size={20} />
                </div>
                <h3 className={cn(
                  "text-xl font-semibold",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {isClient ? (
                    isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.inclusivityTitle
                  ) : pageContent.inclusivityTitle}
                </h3>
              </div>
              <p className={cn(
                theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
              )}>
                {isClient ? (
                  isLoading ? <TextSkeleton width="w-full" /> : translatedContent.inclusivityDescription
                ) : pageContent.inclusivityDescription}
              </p>
            </div>
            <div className={cn(
              "p-6 rounded-xl",
              theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
            )}>
              <div className="flex items-center mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                  theme === 'dark' ? "bg-gray-700 text-blue-400" : "bg-loan-blue/10 text-loan-blue"
                )}>
                  <Award size={20} />
                </div>
                <h3 className={cn(
                  "text-xl font-semibold",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {isClient ? (
                    isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.transparencyTitle
                  ) : pageContent.transparencyTitle}
                </h3>
              </div>
              <p className={cn(
                theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
              )}>
                {isClient ? (
                  isLoading ? <TextSkeleton width="w-full" /> : translatedContent.transparencyDescription
                ) : pageContent.transparencyDescription}
              </p>
            </div>
            <div className={cn(
              "p-6 rounded-xl",
              theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
            )}>
              <div className="flex items-center mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                  theme === 'dark' ? "bg-gray-700 text-blue-400" : "bg-loan-blue/10 text-loan-blue"
                )}>
                  <Globe size={20} />
                </div>
                <h3 className={cn(
                  "text-xl font-semibold",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {isClient ? (
                    isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.innovationTitle
                  ) : pageContent.innovationTitle}
                </h3>
              </div>
              <p className={cn(
                theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
              )}>
                {isClient ? (
                  isLoading ? <TextSkeleton width="w-full" /> : translatedContent.innovationDescription
                ) : pageContent.innovationDescription}
              </p>
            </div>
            <div className={cn(
              "p-6 rounded-xl",
              theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
            )}>
              <div className="flex items-center mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                  theme === 'dark' ? "bg-gray-700 text-blue-400" : "bg-loan-blue/10 text-loan-blue"
                )}>
                  <MessageSquare size={20} />
                </div>
                <h3 className={cn(
                  "text-xl font-semibold",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {isClient ? (
                    isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.customerFirstTitle
                  ) : pageContent.customerFirstTitle}
                </h3>
              </div>
              <p className={cn(
                theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
              )}>
                {isClient ? (
                  isLoading ? <TextSkeleton width="w-full" /> : translatedContent.customerFirstDescription
                ) : pageContent.customerFirstDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className={cn(
                "text-2xl font-semibold mb-4",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                {isClient ? (
                  isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.ourTeamTitle
                ) : pageContent.ourTeamTitle}
              </h2>
              <p className={cn(
                "mb-6",
                theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
              )}>
                {isClient ? (
                  isLoading ? (
                    <>
                      <TextSkeleton className="mb-2" />
                      <TextSkeleton width="w-5/6" />
                    </>
                  ) : translatedContent.ourTeamDescription
                ) : pageContent.ourTeamDescription}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className={cn(
                    "p-4 rounded-lg text-center",
                    theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-sm"
                  )}>
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-3"></div>
                    <p className={cn(
                      "font-medium",
                      theme === 'dark' ? "text-white" : "text-loan-gray-800"
                    )}>Team Member {index}</p>
                    <p className={cn(
                      "text-sm",
                      theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"
                    )}>Role {index}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className={cn(
                "text-2xl font-semibold mb-4",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                {isClient ? (
                  isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.languageSupportTitle
                ) : pageContent.languageSupportTitle}
              </h2>
              <p className={cn(
                "mb-6",
                theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
              )}>
                {isClient ? (
                  isLoading ? (
                    <>
                      <TextSkeleton className="mb-2" />
                      <TextSkeleton width="w-5/6" />
                    </>
                  ) : translatedContent.languageSupportDescription
                ) : pageContent.languageSupportDescription}
              </p>
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
              )}>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'English', 'हिन्दी', 'தமிழ்', 
                    'తెలుగు', 'ಕನ್ನಡ', 'മലയാളം',
                    'ગુજરાતી', 'ਪੰਜਾਬੀ', 'বাংলা',
                    'मराठी', 'ଓଡ଼ିଆ'
                  ].map((language) => (
                    <div key={language} className={cn(
                      "p-2 text-center rounded",
                      theme === 'dark' ? "bg-gray-700" : "bg-loan-gray-50"
                    )}>
                      <span className={theme === 'dark' ? "text-gray-300" : "text-loan-gray-700"}>
                        {language}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className={cn(
          "p-6 rounded-xl",
          theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
        )}>
          <h2 className={cn(
            "text-2xl font-semibold mb-6 text-center",
            theme === 'dark' ? "text-white" : "text-loan-gray-800"
          )}>
            {isClient ? (
              isLoading ? <TextSkeleton width="w-1/4" className="mx-auto" /> : translatedContent.contactUsTitle
            ) : pageContent.contactUsTitle}
          </h2>
          <p className={cn(
            "text-center mb-8 max-w-2xl mx-auto",
            theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
          )}>
            {isClient ? (
              isLoading ? <TextSkeleton width="w-2/3" className="mx-auto" /> : translatedContent.contactUsDescription
            ) : pageContent.contactUsDescription}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={cn(
              "p-4 rounded-lg text-center",
              theme === 'dark' ? "bg-gray-700" : "bg-loan-gray-50"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3",
                theme === 'dark' ? "bg-gray-600 text-blue-400" : "bg-loan-blue/10 text-loan-blue"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className={cn(
                "font-medium mb-2",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                {isClient ? (
                  isLoading ? "Email" : translatedContent.emailLabel
                ) : pageContent.emailLabel}
              </h3>
              <p className={theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"}>
                contact@loansarvam.com
              </p>
            </div>
            <div className={cn(
              "p-4 rounded-lg text-center",
              theme === 'dark' ? "bg-gray-700" : "bg-loan-gray-50"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3",
                theme === 'dark' ? "bg-gray-600 text-blue-400" : "bg-loan-blue/10 text-loan-blue"
              )}>
                <Phone size={24} />
              </div>
              <h3 className={cn(
                "font-medium mb-2",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                {isClient ? (
                  isLoading ? "Phone" : translatedContent.phoneLabel
                ) : pageContent.phoneLabel}
              </h3>
              <p className={theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"}>
                +91 1234567890
              </p>
            </div>
            <div className={cn(
              "p-4 rounded-lg text-center",
              theme === 'dark' ? "bg-gray-700" : "bg-loan-gray-50"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3",
                theme === 'dark' ? "bg-gray-600 text-blue-400" : "bg-loan-blue/10 text-loan-blue"
              )}>
                <Building size={24} />
              </div>
              <h3 className={cn(
                "font-medium mb-2",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                {isClient ? (
                  isLoading ? "Address" : translatedContent.addressLabel
                ) : pageContent.addressLabel}
              </h3>
              <p className={theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"}>
                123 Financial District, Hyderabad, India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 