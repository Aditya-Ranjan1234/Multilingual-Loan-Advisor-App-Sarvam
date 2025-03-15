import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Building, CreditCard, Calculator, ChevronRight, Shield, Clock, Percent, Users } from 'lucide-react';
import ApiUrlInput from '@/components/ApiUrlInput';

const Home = () => {
  const { theme } = useTheme();

  const loanTypes = [
    {
      title: 'Personal Loans',
      icon: <Users size={24} />,
      description: 'Quick access to funds for personal expenses with minimal documentation.',
      color: theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Home Loans',
      icon: <Building size={24} />,
      description: 'Realize your dream of owning a home with competitive interest rates.',
      color: theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700',
    },
    {
      title: 'Car Loans',
      icon: <CreditCard size={24} />,
      description: 'Drive your dream car with flexible repayment options.',
      color: theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700',
    },
    {
      title: 'Education Loans',
      icon: <Shield size={24} />,
      description: 'Invest in your future with education loans for higher studies.',
      color: theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700',
    },
  ];

  const features = [
    {
      title: 'Quick Approval',
      icon: <Clock size={24} />,
      description: 'Get your loan approved within 24-48 hours with minimal documentation.',
    },
    {
      title: 'Competitive Rates',
      icon: <Percent size={24} />,
      description: 'Enjoy some of the lowest interest rates in the market.',
    },
    {
      title: 'Flexible Repayment',
      icon: <Calculator size={24} />,
      description: 'Choose from multiple repayment options that suit your financial situation.',
    },
    {
      title: 'Secure Process',
      icon: <Shield size={24} />,
      description: 'Your data is protected with bank-grade security throughout the application process.',
    },
  ];

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
                Your Trusted Partner for All Loan Solutions
              </h1>
              <p className="text-lg text-white/90 mb-8">
                Get personalized loan recommendations and expert advice in multiple Indian languages.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/loans"
                  className={cn(
                    "px-6 py-3 rounded-lg font-medium flex items-center",
                    theme === 'dark' ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-loan-blue hover:bg-gray-100"
                  )}
                >
                  Explore Loans
                  <ChevronRight size={18} className="ml-1" />
                </Link>
                <Link
                  to="/calculator"
                  className={cn(
                    "px-6 py-3 rounded-lg font-medium flex items-center",
                    theme === 'dark' ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-loan-blue/20 text-white hover:bg-loan-blue/30"
                  )}
                >
                  Loan Calculator
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
                  Multilingual Loan Assistance
                </h3>
                <p className={cn(
                  "mb-4",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  Our AI-powered chatbot provides loan information in 11 Indian languages, making financial services accessible to everyone.
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
              Explore Our Loan Products
            </h2>
            <p className={cn(
              "max-w-2xl mx-auto",
              theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
            )}>
              We offer a wide range of loan products tailored to meet your specific financial needs.
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
                  {loan.title}
                </h3>
                <p className={cn(
                  "mb-4",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  {loan.description}
                </p>
                <Link
                  to="/loans"
                  className={cn(
                    "flex items-center text-sm font-medium",
                    theme === 'dark' ? "text-blue-400 hover:text-blue-300" : "text-loan-blue hover:text-loan-blue/80"
                  )}
                >
                  Learn More
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
              Why Choose Us
            </h2>
            <p className={cn(
              "max-w-2xl mx-auto",
              theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
            )}>
              We strive to provide the best loan experience with features that set us apart.
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
                  {feature.title}
                </h3>
                <p className={cn(
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  {feature.description}
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
              Configure API Settings
            </h2>
            <p className={cn(
              "max-w-2xl mx-auto",
              theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
            )}>
              Customize the chatbot's API endpoint to connect with your own backend services.
            </p>
          </div>
          
          <ApiUrlInput />
        </div>
      </section>
    </div>
  );
};

export default Home; 