import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Search, Building, CreditCard, Calculator, Briefcase, GraduationCap, Landmark, ShoppingBag, Car, Home, Users } from 'lucide-react';
import TranslatableText from '@/components/TranslatableText';
import { usePageTranslation } from '@/hooks/usePageTranslation';
import { Skeleton } from '@/components/ui/skeleton';

// Define the loan product type
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
  category: string;
};

const Loans = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define content to be translated
  const pageContent = {
    pageTitle: 'Explore Our Loan Products',
    pageDescription: 'Find the perfect loan solution tailored to your specific financial needs.',
    searchPlaceholder: 'Search for loans...',
    interestRateLabel: 'Interest Rate:',
    loanAmountLabel: 'Loan Amount:',
    tenureLabel: 'Tenure:',
    processingFeeLabel: 'Processing Fee:',
    eligibilityLabel: 'Eligibility:',
    calculateEmiLabel: 'Calculate EMI',
    allCategoryLabel: 'All',
    personalCategoryLabel: 'Personal',
    homeCategoryLabel: 'Home',
    vehicleCategoryLabel: 'Vehicle',
    educationCategoryLabel: 'Education',
    businessCategoryLabel: 'Business'
  };

  // Loan products content
  const loanProductsContent = {
    // Personal Loans
    personalLoanTitle: 'Personal Loan',
    personalLoanDescription: 'Quick access to funds for personal expenses with minimal documentation.',
    
    // Home Loans
    homeLoanTitle: 'Home Loan',
    homeLoanDescription: 'Realize your dream of owning a home with competitive interest rates.',
    
    // Car Loans
    carLoanTitle: 'Car Loan',
    carLoanDescription: 'Drive your dream car with flexible repayment options.',
    
    // Education Loans
    educationLoanTitle: 'Education Loan',
    educationLoanDescription: 'Invest in your future with education loans for higher studies.',
    
    // Business Loans
    businessLoanTitle: 'Business Loan',
    businessLoanDescription: 'Grow your business with customized financing solutions.',
    
    // Gold Loans
    goldLoanTitle: 'Gold Loan',
    goldLoanDescription: 'Get instant loans against your gold jewelry or coins.',
    
    // Two-Wheeler Loans
    twoWheelerLoanTitle: 'Two-Wheeler Loan',
    twoWheelerLoanDescription: 'Affordable financing options for your two-wheeler purchase.',
    
    // Mortgage Loans
    mortgageLoanTitle: 'Mortgage Loan',
    mortgageLoanDescription: 'Secure loans against your property with attractive interest rates.',
    
    // Eligibility criteria
    salariedIndividuals: 'Salaried individuals',
    selfEmployed: 'Self-employed professionals',
    businessOwners: 'Business owners',
    minAge: 'Age: 21-65 years',
    minIncome: 'Minimum income: ₹15,000/month',
    goodCreditScore: 'Good credit score (700+)',
    propertyValue: 'Property value assessment',
    validDrivingLicense: 'Valid driving license',
    indianCitizen: 'Indian citizen',
    collegeAdmission: 'Confirmed college admission'
  };

  // Use the custom hook to translate the content
  const { translatedContent, isLoading } = usePageTranslation(pageContent);
  const { translatedContent: translatedLoanProducts, isLoading: isLoadingLoanProducts } = usePageTranslation(loanProductsContent);

  // Define loan products with translated content
  const loanProducts: LoanProduct[] = [
    {
      id: 'personal-loan',
      title: translatedLoanProducts.personalLoanTitle,
      icon: <Users size={24} />,
      description: translatedLoanProducts.personalLoanDescription,
      interestRate: '10.5% - 18%',
      loanAmount: '₹50,000 - ₹25,00,000',
      tenure: '1 - 5 years',
      processingFee: '1% - 3%',
      eligibility: [
        translatedLoanProducts.salariedIndividuals,
        translatedLoanProducts.selfEmployed,
        translatedLoanProducts.minAge,
        translatedLoanProducts.minIncome,
        translatedLoanProducts.goodCreditScore
      ],
      category: 'Personal'
    },
    {
      id: 'home-loan',
      title: translatedLoanProducts.homeLoanTitle,
      icon: <Home size={24} />,
      description: translatedLoanProducts.homeLoanDescription,
      interestRate: '6.5% - 9.5%',
      loanAmount: '₹10,00,000 - ₹5,00,00,000',
      tenure: '5 - 30 years',
      processingFee: '0.5% - 1%',
      eligibility: [
        translatedLoanProducts.salariedIndividuals,
        translatedLoanProducts.selfEmployed,
        translatedLoanProducts.businessOwners,
        translatedLoanProducts.minAge,
        translatedLoanProducts.propertyValue,
        translatedLoanProducts.goodCreditScore
      ],
      category: 'Home'
    },
    {
      id: 'car-loan',
      title: translatedLoanProducts.carLoanTitle,
      icon: <Car size={24} />,
      description: translatedLoanProducts.carLoanDescription,
      interestRate: '7.5% - 12.5%',
      loanAmount: '₹1,00,000 - ₹1,00,00,000',
      tenure: '1 - 7 years',
      processingFee: '0.5% - 2.5%',
      eligibility: [
        translatedLoanProducts.salariedIndividuals,
        translatedLoanProducts.selfEmployed,
        translatedLoanProducts.minAge,
        translatedLoanProducts.minIncome,
        translatedLoanProducts.validDrivingLicense,
        translatedLoanProducts.indianCitizen
      ],
      category: 'Vehicle'
    },
    {
      id: 'education-loan',
      title: translatedLoanProducts.educationLoanTitle,
      icon: <GraduationCap size={24} />,
      description: translatedLoanProducts.educationLoanDescription,
      interestRate: '8% - 15%',
      loanAmount: '₹50,000 - ₹75,00,000',
      tenure: '5 - 15 years',
      processingFee: '0% - 1%',
      eligibility: [
        translatedLoanProducts.indianCitizen,
        translatedLoanProducts.collegeAdmission,
        translatedLoanProducts.minAge,
        translatedLoanProducts.goodCreditScore
      ],
      category: 'Education'
    },
    {
      id: 'business-loan',
      title: translatedLoanProducts.businessLoanTitle,
      icon: <Briefcase size={24} />,
      description: translatedLoanProducts.businessLoanDescription,
      interestRate: '11% - 24%',
      loanAmount: '₹5,00,000 - ₹2,00,00,000',
      tenure: '1 - 10 years',
      processingFee: '1% - 3%',
      eligibility: [
        translatedLoanProducts.businessOwners,
        translatedLoanProducts.selfEmployed,
        translatedLoanProducts.minAge,
        translatedLoanProducts.goodCreditScore
      ],
      category: 'Business'
    },
    {
      id: 'gold-loan',
      title: translatedLoanProducts.goldLoanTitle,
      icon: <Landmark size={24} />,
      description: translatedLoanProducts.goldLoanDescription,
      interestRate: '7% - 14%',
      loanAmount: '₹10,000 - ₹50,00,000',
      tenure: '3 months - 3 years',
      processingFee: '0.5% - 1.5%',
      eligibility: [
        translatedLoanProducts.indianCitizen,
        translatedLoanProducts.minAge
      ],
      category: 'Personal'
    },
    {
      id: 'two-wheeler-loan',
      title: translatedLoanProducts.twoWheelerLoanTitle,
      icon: <CreditCard size={24} />,
      description: translatedLoanProducts.twoWheelerLoanDescription,
      interestRate: '8% - 15%',
      loanAmount: '₹20,000 - ₹2,00,000',
      tenure: '1 - 5 years',
      processingFee: '1% - 2%',
      eligibility: [
        translatedLoanProducts.salariedIndividuals,
        translatedLoanProducts.selfEmployed,
        translatedLoanProducts.minAge,
        translatedLoanProducts.minIncome,
        translatedLoanProducts.validDrivingLicense
      ],
      category: 'Vehicle'
    },
    {
      id: 'mortgage-loan',
      title: translatedLoanProducts.mortgageLoanTitle,
      icon: <Building size={24} />,
      description: translatedLoanProducts.mortgageLoanDescription,
      interestRate: '8% - 12%',
      loanAmount: '₹5,00,000 - ₹3,00,00,000',
      tenure: '3 - 20 years',
      processingFee: '0.5% - 2%',
      eligibility: [
        translatedLoanProducts.salariedIndividuals,
        translatedLoanProducts.selfEmployed,
        translatedLoanProducts.businessOwners,
        translatedLoanProducts.minAge,
        translatedLoanProducts.propertyValue,
        translatedLoanProducts.goodCreditScore
      ],
      category: 'Home'
    }
  ];

  // Define categories
  const categories = [
    translatedContent.allCategoryLabel || 'All',
    translatedContent.personalCategoryLabel || 'Personal',
    translatedContent.homeCategoryLabel || 'Home',
    translatedContent.vehicleCategoryLabel || 'Vehicle',
    translatedContent.educationCategoryLabel || 'Education',
    translatedContent.businessCategoryLabel || 'Business'
  ];

  // Filter loan products based on search query and selected category
  const filteredLoanProducts = loanProducts.filter(loan => {
    const matchesSearch = loan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || loan.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Loading skeleton for text
  const TextSkeleton = ({ width = 'w-full', height = 'h-6', className = '' }: { width?: string, height?: string, className?: string }) => (
    <Skeleton className={`${width} ${height} ${className} rounded-md`} />
  );

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto">
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

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className={cn(
              "relative w-full md:w-1/3",
              theme === 'dark' ? "text-white" : "text-loan-gray-800"
            )}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-400"} />
              </div>
              <input
                type="text"
                placeholder={isClient ? (isLoading ? "Search for loans..." : translatedContent.searchPlaceholder) : pageContent.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-lg",
                  theme === 'dark' 
                    ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" 
                    : "bg-white border border-loan-gray-300 placeholder-loan-gray-400 text-loan-gray-800 focus:ring-loan-blue focus:border-loan-blue"
                )}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === 'All' ? 'All' : category)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    selectedCategory === category
                      ? theme === 'dark' 
                        ? "bg-blue-600 text-white" 
                        : "bg-loan-blue text-white"
                      : theme === 'dark'
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-white text-loan-gray-700 hover:bg-loan-gray-100"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loan Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoanProducts.map((loan) => (
            <div
              key={loan.id}
              className={cn(
                "p-6 rounded-xl",
                theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
              )}
            >
              <div className="flex items-center mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mr-4",
                  theme === 'dark' ? "bg-gray-700 text-blue-400" : "bg-loan-blue/10 text-loan-blue"
                )}>
                  {loan.icon}
                </div>
                <h2 className={cn(
                  "text-xl font-semibold",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {isClient && isLoadingLoanProducts ? <TextSkeleton width="w-3/4" /> : loan.title}
                </h2>
              </div>
              
              <p className={cn(
                "mb-4",
                theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
              )}>
                {isClient && isLoadingLoanProducts ? (
                  <>
                    <TextSkeleton className="mb-2" />
                    <TextSkeleton width="w-5/6" />
                  </>
                ) : loan.description}
              </p>
              
              <div className={cn(
                "mb-4 p-4 rounded-lg",
                theme === 'dark' ? "bg-gray-700" : "bg-loan-gray-50"
              )}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className={cn(
                      "text-sm font-medium mb-1",
                      theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"
                    )}>
                      {isClient ? (
                        isLoading ? "Interest Rate:" : translatedContent.interestRateLabel
                      ) : pageContent.interestRateLabel}
                    </p>
                    <p className={cn(
                      "font-semibold",
                      theme === 'dark' ? "text-white" : "text-loan-gray-800"
                    )}>
                      {loan.interestRate}
                    </p>
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-medium mb-1",
                      theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"
                    )}>
                      {isClient ? (
                        isLoading ? "Loan Amount:" : translatedContent.loanAmountLabel
                      ) : pageContent.loanAmountLabel}
                    </p>
                    <p className={cn(
                      "font-semibold",
                      theme === 'dark' ? "text-white" : "text-loan-gray-800"
                    )}>
                      {loan.loanAmount}
                    </p>
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-medium mb-1",
                      theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"
                    )}>
                      {isClient ? (
                        isLoading ? "Tenure:" : translatedContent.tenureLabel
                      ) : pageContent.tenureLabel}
                    </p>
                    <p className={cn(
                      "font-semibold",
                      theme === 'dark' ? "text-white" : "text-loan-gray-800"
                    )}>
                      {loan.tenure}
                    </p>
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-medium mb-1",
                      theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"
                    )}>
                      {isClient ? (
                        isLoading ? "Processing Fee:" : translatedContent.processingFeeLabel
                      ) : pageContent.processingFeeLabel}
                    </p>
                    <p className={cn(
                      "font-semibold",
                      theme === 'dark' ? "text-white" : "text-loan-gray-800"
                    )}>
                      {loan.processingFee}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className={cn(
                  "text-sm font-medium mb-2",
                  theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"
                )}>
                  {isClient ? (
                    isLoading ? "Eligibility:" : translatedContent.eligibilityLabel
                  ) : pageContent.eligibilityLabel}
                </p>
                <ul className={cn(
                  "list-disc pl-5 space-y-1",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  {loan.eligibility.map((item, index) => (
                    <li key={index}>
                      {isClient && isLoadingLoanProducts ? <TextSkeleton width="w-5/6" height="h-4" /> : item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link
                to="/calculator"
                className={cn(
                  "w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium",
                  theme === 'dark' 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-loan-blue text-white hover:bg-loan-blue/90"
                )}
              >
                <Calculator size={18} className="mr-2" />
                {isClient ? (
                  isLoading ? "Calculate EMI" : translatedContent.calculateEmiLabel
                ) : pageContent.calculateEmiLabel}
              </Link>
            </div>
          ))}
        </div>
        
        {filteredLoanProducts.length === 0 && (
          <div className={cn(
            "text-center p-8 rounded-lg",
            theme === 'dark' ? "bg-gray-800 text-gray-300" : "bg-loan-gray-50 text-loan-gray-600"
          )}>
            <p>No loan products match your search criteria. Please try a different search term or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loans; 