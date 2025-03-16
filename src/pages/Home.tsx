import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Building, CreditCard, Calculator, ChevronRight, Shield, Clock, Percent, Users } from 'lucide-react';
import ApiUrlInput from '@/components/ApiUrlInput';
import TranslatableText from '@/components/TranslatableText';
import { usePageTranslation } from '@/hooks/usePageTranslation';
import { Skeleton } from '@/components/ui/skeleton';

const Home = () => {
  const { theme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define content to be translated
  const pageContent = {
    heroTitle: 'Your Trusted Partner for All Loan Solutions',
    heroSubtitle: 'Get personalized loan recommendations and expert advice in multiple Indian languages.',
    exploreLoans: 'Explore Loans',
    loanCalculator: 'Loan Calculator',
    multilingualSupport: 'Multilingual Loan Assistance',
    multilingualDescription: 'Our AI-powered chatbot provides loan information in 11 Indian languages, making financial services accessible to everyone.',
    loanProductsTitle: 'Explore Our Loan Products',
    loanProductsDescription: 'We offer a wide range of loan products tailored to meet your specific financial needs.',
    whyChooseUs: 'Why Choose Us',
    whyChooseUsDescription: 'We strive to provide the best loan experience with features that set us apart.',
    configureApi: 'Configure API Settings',
    configureApiDescription: 'Customize the chatbot\'s API endpoint to connect with your own backend services.'
  };

  // Loan types content
  const loanTypesContent = {
    personalLoansTitle: 'Personal Loans',
    personalLoansDescription: 'Quick access to funds for personal expenses with minimal documentation.',
    homeLoansTitle: 'Home Loans',
    homeLoansDescription: 'Realize your dream of owning a home with competitive interest rates.',
    carLoansTitle: 'Car Loans',
    carLoansDescription: 'Drive your dream car with flexible repayment options.',
    educationLoansTitle: 'Education Loans',
    educationLoansDescription: 'Invest in your future with education loans for higher studies.',
    learnMore: 'Learn More'
  };

  // Features content
  const featuresContent = {
    quickApprovalTitle: 'Quick Approval',
    quickApprovalDescription: 'Get your loan approved within 24-48 hours with minimal documentation.',
    competitiveRatesTitle: 'Competitive Rates',
    competitiveRatesDescription: 'Enjoy some of the lowest interest rates in the market.',
    flexibleRepaymentTitle: 'Flexible Repayment',
    flexibleRepaymentDescription: 'Choose from multiple repayment options that suit your financial situation.',
    secureProcessTitle: 'Secure Process',
    secureProcessDescription: 'Your data is protected with bank-grade security throughout the application process.'
  };

  // Use the custom hook to translate the content
  const { translatedContent, isLoading } = usePageTranslation(pageContent);
  const { translatedContent: translatedLoanTypes, isLoading: isLoadingLoanTypes } = usePageTranslation(loanTypesContent);
  const { translatedContent: translatedFeatures, isLoading: isLoadingFeatures } = usePageTranslation(featuresContent);

  // Define loan types with translated content
  const loanTypes = [
    {
      title: translatedLoanTypes.personalLoansTitle,
      icon: <Users size={24} />,
      description: translatedLoanTypes.personalLoansDescription,
      color: theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700',
    },
    {
      title: translatedLoanTypes.homeLoansTitle,
      icon: <Building size={24} />,
      description: translatedLoanTypes.homeLoansDescription,
      color: theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700',
    },
    {
      title: translatedLoanTypes.carLoansTitle,
      icon: <CreditCard size={24} />,
      description: translatedLoanTypes.carLoansDescription,
      color: theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700',
    },
    {
      title: translatedLoanTypes.educationLoansTitle,
      icon: <Shield size={24} />,
      description: translatedLoanTypes.educationLoansDescription,
      color: theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700',
    },
  ];

  // Define features with translated content
  const features = [
    {
      title: translatedFeatures.quickApprovalTitle,
      icon: <Clock size={24} />,
      description: translatedFeatures.quickApprovalDescription,
    },
    {
      title: translatedFeatures.competitiveRatesTitle,
      icon: <Percent size={24} />,
      description: translatedFeatures.competitiveRatesDescription,
    },
    {
      title: translatedFeatures.flexibleRepaymentTitle,
      icon: <Calculator size={24} />,
      description: translatedFeatures.flexibleRepaymentDescription,
    },
    {
      title: translatedFeatures.secureProcessTitle,
      icon: <Shield size={24} />,
      description: translatedFeatures.secureProcessDescription,
    },
  ];

  // Loading skeleton for text
  const TextSkeleton = ({ width = 'w-full', height = 'h-6', className = '' }: { width?: string, height?: string, className?: string }) => (
    <Skeleton className={`${width} ${height} ${className} rounded-md`} />
  );

  return (
    <div>
      {/* Hero Section */}
      <section className={cn(
        "py-16 px-4",
        theme === 'dark' ? "bg-gray-800" : "bg-loan-blue"
      )}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {isClient ? (
                  isLoading ? <TextSkeleton /> : translatedContent.heroTitle
                ) : pageContent.heroTitle}
              </h1>
              <p className="text-lg text-white/90 mb-8">
                {isClient ? (
                  isLoading ? <TextSkeleton /> : translatedContent.heroSubtitle
                ) : pageContent.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/loans"
                  className={cn(
                    "px-6 py-3 rounded-lg font-medium flex items-center",
                    theme === 'dark' ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-loan-blue hover:bg-gray-100"
                  )}
                >
                  {isClient ? (
                    isLoading ? "Explore Loans" : translatedContent.exploreLoans
                  ) : pageContent.exploreLoans}
                  <ChevronRight size={18} className="ml-1" />
                </Link>
                <Link
                  to="/calculator"
                  className={cn(
                    "px-6 py-3 rounded-lg font-medium flex items-center",
                    theme === 'dark' ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-loan-blue/20 text-white hover:bg-loan-blue/30"
                  )}
                >
                  {isClient ? (
                    isLoading ? "Loan Calculator" : translatedContent.loanCalculator
                  ) : pageContent.loanCalculator}
                  <Calculator size={18} className="ml-1" />
                </Link>
              </div>
            </div>
            <div className={cn(
              "rounded-xl overflow-hidden shadow-lg",
              theme === 'dark' ? "bg-gray-700" : "bg-white"
            )}>
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Happy family with loan approval"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className={cn(
                  "text-xl font-semibold mb-2",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {isClient ? (
                    isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.multilingualSupport
                  ) : pageContent.multilingualSupport}
                </h3>
                <p className={cn(
                  "mb-4",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  {isClient ? (
                    isLoading ? (
                      <>
                        <TextSkeleton className="mb-2" />
                        <TextSkeleton width="w-5/6" />
                      </>
                    ) : translatedContent.multilingualDescription
                  ) : pageContent.multilingualDescription}
                </p>
                <div className="flex flex-wrap gap-2">
                  {['English', 'हिन्दी', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ'].map((lang) => (
                    <span
                      key={lang}
                      className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        theme === 'dark' ? "bg-gray-600 text-gray-200" : "bg-loan-gray-100 text-loan-gray-700"
                      )}
                    >
                      {lang}
                    </span>
                  ))}
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full",
                    theme === 'dark' ? "bg-gray-600 text-gray-200" : "bg-loan-gray-100 text-loan-gray-700"
                  )}>
                    +6 more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Types Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className={cn(
              "text-3xl font-bold mb-4",
              theme === 'dark' ? "text-white" : "text-loan-gray-800"
            )}>
              {isClient ? (
                isLoading ? <TextSkeleton width="w-1/3" className="mx-auto" /> : translatedContent.loanProductsTitle
              ) : pageContent.loanProductsTitle}
            </h2>
            <p className={cn(
              "max-w-2xl mx-auto",
              theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
            )}>
              {isClient ? (
                isLoading ? <TextSkeleton width="w-2/3" className="mx-auto" /> : translatedContent.loanProductsDescription
              ) : pageContent.loanProductsDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loanTypes.map((loan, index) => (
              <div
                key={index}
                className={cn(
                  "p-6 rounded-xl transition-transform hover:scale-105",
                  theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                  loan.color
                )}>
                  {loan.icon}
                </div>
                <h3 className={cn(
                  "text-xl font-semibold mb-2",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {isClient && isLoadingLoanTypes ? <TextSkeleton width="w-3/4" /> : loan.title}
                </h3>
                <p className={cn(
                  "mb-4",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  {isClient && isLoadingLoanTypes ? (
                    <>
                      <TextSkeleton className="mb-2" />
                      <TextSkeleton width="w-5/6" />
                    </>
                  ) : loan.description}
                </p>
                <Link
                  to="/loans"
                  className={cn(
                    "flex items-center text-sm font-medium",
                    theme === 'dark' ? "text-blue-400 hover:text-blue-300" : "text-loan-blue hover:text-loan-blue/80"
                  )}
                >
                  {isClient ? (
                    isLoadingLoanTypes ? "Learn More" : translatedLoanTypes.learnMore
                  ) : "Learn More"}
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={cn(
        "py-16 px-4",
        theme === 'dark' ? "bg-gray-800" : "bg-loan-gray-50"
      )}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className={cn(
              "text-3xl font-bold mb-4",
              theme === 'dark' ? "text-white" : "text-loan-gray-800"
            )}>
              {isClient ? (
                isLoading ? <TextSkeleton width="w-1/4" className="mx-auto" /> : translatedContent.whyChooseUs
              ) : pageContent.whyChooseUs}
            </h2>
            <p className={cn(
              "max-w-2xl mx-auto",
              theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
            )}>
              {isClient ? (
                isLoading ? <TextSkeleton width="w-2/3" className="mx-auto" /> : translatedContent.whyChooseUsDescription
              ) : pageContent.whyChooseUsDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "p-6 rounded-xl",
                  theme === 'dark' ? "bg-gray-700" : "bg-white shadow-md"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                  theme === 'dark' ? "bg-gray-600 text-blue-300" : "bg-loan-blue/10 text-loan-blue"
                )}>
                  {feature.icon}
                </div>
                <h3 className={cn(
                  "text-xl font-semibold mb-2",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {isClient && isLoadingFeatures ? <TextSkeleton width="w-3/4" /> : feature.title}
                </h3>
                <p className={cn(
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  {isClient && isLoadingFeatures ? (
                    <>
                      <TextSkeleton className="mb-2" />
                      <TextSkeleton width="w-5/6" />
                    </>
                  ) : feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Configuration Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className={cn(
              "text-3xl font-bold mb-4",
              theme === 'dark' ? "text-white" : "text-loan-gray-800"
            )}>
              {isClient ? (
                isLoading ? <TextSkeleton width="w-1/3" className="mx-auto" /> : translatedContent.configureApi
              ) : pageContent.configureApi}
            </h2>
            <p className={cn(
              "max-w-2xl mx-auto",
              theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
            )}>
              {isClient ? (
                isLoading ? <TextSkeleton width="w-2/3" className="mx-auto" /> : translatedContent.configureApiDescription
              ) : pageContent.configureApiDescription}
            </p>
          </div>
          
          <ApiUrlInput />
        </div>
      </section>
    </div>
  );
};

export default Home; 