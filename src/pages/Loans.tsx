import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { 
  Users, Building, Car, GraduationCap, Briefcase, 
  ShoppingBag, ChevronRight, Check, Search, Filter
} from 'lucide-react';

type LoanProduct = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  interestRate: string;
  loanAmount: string;
  tenure: string;
  processingFee: string;
  eligibility: string[];
  category: 'personal' | 'home' | 'vehicle' | 'education' | 'business' | 'other';
};

const Loans = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const loanProducts: LoanProduct[] = [
    {
      id: 'personal-loan',
      title: 'Personal Loan',
      icon: <Users size={24} />,
      description: 'Quick access to funds for personal expenses with minimal documentation.',
      interestRate: '10.5% - 18%',
      loanAmount: '₹50,000 - ₹40,00,000',
      tenure: '12 - 60 months',
      processingFee: 'Up to 2.5% of loan amount',
      eligibility: [
        'Age: 23-58 years',
        'Minimum income: ₹25,000 per month',
        'Credit score: 700+',
        'Employment: Salaried or self-employed'
      ],
      category: 'personal'
    },
    {
      id: 'home-loan',
      title: 'Home Loan',
      icon: <Building size={24} />,
      description: 'Realize your dream of owning a home with competitive interest rates.',
      interestRate: '6.7% - 9.5%',
      loanAmount: '₹10,00,000 - ₹5,00,00,000',
      tenure: '5 - 30 years',
      processingFee: '0.5% - 1% of loan amount',
      eligibility: [
        'Age: 21-65 years',
        'Minimum income: ₹40,000 per month',
        'Credit score: 750+',
        'Employment: Stable job or business for 2+ years'
      ],
      category: 'home'
    },
    {
      id: 'car-loan',
      title: 'Car Loan',
      icon: <Car size={24} />,
      description: 'Drive your dream car with flexible repayment options.',
      interestRate: '7.25% - 12.5%',
      loanAmount: '₹1,00,000 - ₹1,00,00,000',
      tenure: '12 - 84 months',
      processingFee: '1% - 2% of loan amount',
      eligibility: [
        'Age: 21-65 years',
        'Minimum income: ₹30,000 per month',
        'Credit score: 700+',
        'Employment: Salaried or self-employed with 1+ year stability'
      ],
      category: 'vehicle'
    },
    {
      id: 'education-loan',
      title: 'Education Loan',
      icon: <GraduationCap size={24} />,
      description: 'Invest in your future with education loans for higher studies.',
      interestRate: '8.15% - 15.2%',
      loanAmount: '₹50,000 - ₹75,00,000',
      tenure: '5 - 15 years',
      processingFee: '0% - 1% of loan amount',
      eligibility: [
        'Age: 18+ years',
        'Admission to recognized institution',
        'Co-applicant (parent/guardian) required',
        'Collateral may be required for loans above ₹7,50,000'
      ],
      category: 'education'
    },
    {
      id: 'business-loan',
      title: 'Business Loan',
      icon: <Briefcase size={24} />,
      description: 'Grow your business with quick and hassle-free business loans.',
      interestRate: '11% - 18%',
      loanAmount: '₹5,00,000 - ₹50,00,000',
      tenure: '12 - 60 months',
      processingFee: '1.5% - 3% of loan amount',
      eligibility: [
        'Business age: 2+ years',
        'Minimum turnover: ₹40 lakhs per annum',
        'Credit score: 720+',
        'ITR for last 2 years'
      ],
      category: 'business'
    },
    {
      id: 'gold-loan',
      title: 'Gold Loan',
      icon: <ShoppingBag size={24} />,
      description: 'Get instant loans against your gold jewelry or ornaments.',
      interestRate: '7.5% - 24%',
      loanAmount: 'Up to ₹25,00,000',
      tenure: '3 - 36 months',
      processingFee: '0.25% - 1% of loan amount',
      eligibility: [
        'Age: 21+ years',
        'Ownership of gold assets',
        'KYC documents',
        'No credit score check required'
      ],
      category: 'other'
    },
  ];

  const categories = [
    { id: 'all', label: 'All Loans', icon: <Filter size={18} /> },
    { id: 'personal', label: 'Personal', icon: <Users size={18} /> },
    { id: 'home', label: 'Home', icon: <Building size={18} /> },
    { id: 'vehicle', label: 'Vehicle', icon: <Car size={18} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={18} /> },
    { id: 'business', label: 'Business', icon: <Briefcase size={18} /> },
    { id: 'other', label: 'Other', icon: <ShoppingBag size={18} /> },
  ];

  // Filter loans based on search term and category
  const filteredLoans = loanProducts.filter(loan => {
    const matchesSearch = loan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === null || selectedCategory === 'all' || 
                           loan.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className={cn(
            "text-3xl font-bold mb-4",
            theme === 'dark' ? "text-white" : "text-loan-gray-800"
          )}>
            Loan Products
          </h1>
          <p className={cn(
            "max-w-2xl mx-auto",
            theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
          )}>
            Explore our range of loan products designed to meet your financial needs.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className={cn(
              "relative flex-1",
              theme === 'dark' ? "text-white" : "text-loan-gray-800"
            )}>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-400"} />
              </div>
              <input
                type="text"
                placeholder="Search loan products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-lg",
                  theme === 'dark' 
                    ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500" 
                    : "bg-white border-gray-200 text-loan-gray-800 placeholder:text-loan-gray-400 focus:border-loan-blue focus:ring-loan-blue"
                )}
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
                className={cn(
                  "px-4 py-2 rounded-lg flex items-center whitespace-nowrap",
                  selectedCategory === category.id || (category.id === 'all' && selectedCategory === null)
                    ? theme === 'dark'
                      ? "bg-blue-600 text-white"
                      : "bg-loan-blue text-white"
                    : theme === 'dark'
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-white text-loan-gray-600 hover:bg-loan-gray-50"
                )}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loan Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoans.length > 0 ? (
            filteredLoans.map((loan) => (
              <div
                key={loan.id}
                className={cn(
                  "p-6 rounded-xl transition-all hover:shadow-lg",
                  theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
                )}
              >
                <div className="flex items-start mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mr-4",
                    theme === 'dark' ? "bg-gray-700 text-blue-400" : "bg-loan-blue/10 text-loan-blue"
                  )}>
                    {loan.icon}
                  </div>
                  <div>
                    <h3 className={cn(
                      "text-xl font-semibold",
                      theme === 'dark' ? "text-white" : "text-loan-gray-800"
                    )}>
                      {loan.title}
                    </h3>
                    <p className={cn(
                      "text-sm mt-1",
                      theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                    )}>
                      {loan.description}
                    </p>
                  </div>
                </div>

                <div className={cn(
                  "grid grid-cols-2 gap-4 mb-4 text-sm",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  <div>
                    <p className="font-medium mb-1">Interest Rate</p>
                    <p>{loan.interestRate}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Loan Amount</p>
                    <p>{loan.loanAmount}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Tenure</p>
                    <p>{loan.tenure}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Processing Fee</p>
                    <p>{loan.processingFee}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className={cn(
                    "font-medium mb-2 text-sm",
                    theme === 'dark' ? "text-white" : "text-loan-gray-800"
                  )}>
                    Eligibility
                  </p>
                  <ul className={cn(
                    "text-xs space-y-1",
                    theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                  )}>
                    {loan.eligibility.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={14} className={cn(
                          "mr-1 mt-0.5 flex-shrink-0",
                          theme === 'dark' ? "text-blue-400" : "text-loan-blue"
                        )} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/calculator"
                  className={cn(
                    "flex items-center justify-center w-full py-2 rounded-lg text-sm font-medium mt-2",
                    theme === 'dark' 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-loan-blue text-white hover:bg-loan-blue/90"
                  )}
                >
                  Calculate EMI
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            ))
          ) : (
            <div className={cn(
              "col-span-full p-8 text-center rounded-xl",
              theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
            )}>
              <p className={cn(
                "text-lg",
                theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
              )}>
                No loan products match your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
                className={cn(
                  "mt-4 px-4 py-2 rounded-lg text-sm font-medium",
                  theme === 'dark' 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-loan-blue text-white hover:bg-loan-blue/90"
                )}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Loan Application Process */}
        <div className={cn(
          "mt-16 p-8 rounded-xl",
          theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-lg"
        )}>
          <h2 className={cn(
            "text-2xl font-bold mb-6 text-center",
            theme === 'dark' ? "text-white" : "text-loan-gray-800"
          )}>
            Loan Application Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: 'Choose a Loan',
                description: 'Select the loan product that best suits your financial needs.'
              },
              {
                step: 2,
                title: 'Check Eligibility',
                description: 'Verify that you meet the eligibility criteria for the selected loan.'
              },
              {
                step: 3,
                title: 'Submit Application',
                description: 'Fill out the application form and submit the required documents.'
              },
              {
                step: 4,
                title: 'Get Approval',
                description: 'Once approved, the loan amount will be disbursed to your account.'
              }
            ].map((step) => (
              <div key={step.step} className="relative">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto",
                  theme === 'dark' ? "bg-blue-900 text-blue-300" : "bg-loan-blue text-white"
                )}>
                  {step.step}
                </div>
                <h3 className={cn(
                  "text-lg font-semibold mb-2 text-center",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {step.title}
                </h3>
                <p className={cn(
                  "text-sm text-center",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  {step.description}
                </p>
                {step.step < 4 && (
                  <div className={cn(
                    "hidden md:block absolute top-6 left-full w-full h-0.5 -translate-x-6",
                    theme === 'dark' ? "bg-gray-700" : "bg-loan-gray-200"
                  )}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loans; 