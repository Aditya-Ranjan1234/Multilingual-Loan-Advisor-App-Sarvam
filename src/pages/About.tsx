import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Building2, Globe, Landmark, Users, Zap, MessageSquareText } from 'lucide-react';

const About = () => {
  const { theme } = useTheme();

  const banks = [
    {
      name: 'HDFC Bank',
      logo: '/banks/hdfc.png',
      description: 'One of India\'s leading private sector banks offering a wide range of loan products with competitive interest rates.',
      website: 'https://www.hdfcbank.com'
    },
    {
      name: 'State Bank of India (SBI)',
      logo: '/banks/sbi.png',
      description: 'India\'s largest public sector bank with extensive loan offerings and nationwide presence.',
      website: 'https://www.onlinesbi.com'
    },
    {
      name: 'Indian Overseas Bank (IOB)',
      logo: '/banks/iob.png',
      description: 'A major public sector bank with specialized loan products and services for various customer segments.',
      website: 'https://www.iob.in'
    },
    {
      name: 'ICICI Bank',
      logo: '/banks/icici.png',
      description: 'A leading private sector bank offering innovative loan products with digital-first application processes.',
      website: 'https://www.icicibank.com'
    },
    {
      name: 'Axis Bank',
      logo: '/banks/axis.png',
      description: 'A private sector bank known for quick loan approvals and customer-friendly policies.',
      website: 'https://www.axisbank.com'
    },
    {
      name: 'Bank of Baroda',
      logo: '/banks/bob.png',
      description: 'A major public sector bank with competitive interest rates and flexible repayment options.',
      website: 'https://www.bankofbaroda.in'
    }
  ];

  return (
    <div className={cn(
      "container mx-auto px-4 py-8",
      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
    )}>
      <section className="mb-12">
        <h1 className={cn(
          "text-3xl font-bold mb-4",
          theme === 'dark' ? 'text-white' : 'text-loan-blue'
        )}>About Our Multilingual Loan Assistant</h1>
        <p className="text-lg mb-6">
          Welcome to our comprehensive loan information platform designed to make financial services accessible to everyone, regardless of language barriers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={cn(
            "p-6 rounded-lg",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          )}>
            <h2 className={cn(
              "text-xl font-semibold mb-3 flex items-center",
              theme === 'dark' ? 'text-blue-400' : 'text-loan-blue'
            )}>
              <Globe className="mr-2 h-5 w-5" />
              Our Mission
            </h2>
            <p>
              Our mission is to bridge the gap between financial institutions and customers by providing accurate, accessible loan information in multiple Indian languages. We believe everyone deserves to understand their financial options clearly, regardless of their primary language.
            </p>
          </div>
          <div className={cn(
            "p-6 rounded-lg",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          )}>
            <h2 className={cn(
              "text-xl font-semibold mb-3 flex items-center",
              theme === 'dark' ? 'text-blue-400' : 'text-loan-blue'
            )}>
              <Users className="mr-2 h-5 w-5" />
              Who We Serve
            </h2>
            <p>
              We serve individuals across India who are seeking loan information but face language barriers. Our platform is particularly valuable for those in rural and semi-urban areas where access to multilingual financial information may be limited.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className={cn(
          "text-2xl font-bold mb-6",
          theme === 'dark' ? 'text-white' : 'text-loan-blue'
        )}>Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={cn(
            "p-5 rounded-lg",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          )}>
            <h3 className={cn(
              "text-lg font-semibold mb-2 flex items-center",
              theme === 'dark' ? 'text-blue-400' : 'text-loan-blue'
            )}>
              <MessageSquareText className="mr-2 h-5 w-5" />
              Multilingual Support
            </h3>
            <p>
              Our AI-powered chatbot provides loan information in multiple Indian languages, including Hindi, Tamil, Telugu, Bengali, Marathi, and more.
            </p>
          </div>
          <div className={cn(
            "p-5 rounded-lg",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          )}>
            <h3 className={cn(
              "text-lg font-semibold mb-2 flex items-center",
              theme === 'dark' ? 'text-blue-400' : 'text-loan-blue'
            )}>
              <Zap className="mr-2 h-5 w-5" />
              Loan Calculator
            </h3>
            <p>
              Our interactive loan calculator helps you estimate EMIs, total interest, and repayment schedules for different loan types and amounts.
            </p>
          </div>
          <div className={cn(
            "p-5 rounded-lg",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          )}>
            <h3 className={cn(
              "text-lg font-semibold mb-2 flex items-center",
              theme === 'dark' ? 'text-blue-400' : 'text-loan-blue'
            )}>
              <Building2 className="mr-2 h-5 w-5" />
              Comprehensive Loan Information
            </h3>
            <p>
              Detailed information about various loan types, eligibility criteria, documentation requirements, and application processes.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className={cn(
          "text-2xl font-bold mb-6",
          theme === 'dark' ? 'text-white' : 'text-loan-blue'
        )}>
          <Landmark className="inline mr-2 h-6 w-6" />
          Partner Banks
        </h2>
        <p className="mb-6">
          We provide information about loan products from various leading banks in India. While we are not directly affiliated with these banks, our platform helps you understand their loan offerings better.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banks.map((bank, index) => (
            <div key={index} className={cn(
              "p-5 rounded-lg flex flex-col",
              theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
            )}>
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 mr-3 flex items-center justify-center bg-white rounded-full p-1">
                  <img 
                    src={bank.logo} 
                    alt={`${bank.name} logo`} 
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/banks/placeholder.png';
                    }}
                  />
                </div>
                <h3 className={cn(
                  "text-lg font-semibold",
                  theme === 'dark' ? 'text-blue-400' : 'text-loan-blue'
                )}>
                  {bank.name}
                </h3>
              </div>
              <p className="mb-3 flex-grow">{bank.description}</p>
              <a 
                href={bank.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn(
                  "text-sm font-medium inline-flex items-center",
                  theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-loan-blue hover:text-blue-700'
                )}
              >
                <Globe className="mr-1 h-4 w-4" />
                Visit Official Website
              </a>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className={cn(
          "text-2xl font-bold mb-6",
          theme === 'dark' ? 'text-white' : 'text-loan-blue'
        )}>API Integration</h2>
        <div className={cn(
          "p-6 rounded-lg",
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
        )}>
          <p className="mb-4">
            Our platform integrates with custom APIs to provide real-time loan information and multilingual support. The chatbot can connect to:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Custom APIs hosted via ngrok for real-time loan information</li>
            <li>Language processing APIs for multilingual support</li>
            <li>Bank-specific APIs for the latest loan product details</li>
          </ul>
          <p>
            For developers interested in integrating with our platform, please note that our API expects queries in the format <code className={cn("px-2 py-1 rounded", theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100')}>{"{ \"question\": \"your query here\" }"}</code> and returns responses with an <code className={cn("px-2 py-1 rounded", theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100')}>answer</code> field.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About; 