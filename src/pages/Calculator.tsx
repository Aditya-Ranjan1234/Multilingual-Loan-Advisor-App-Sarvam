import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Calculator as CalculatorIcon, DollarSign, Calendar, Percent, ArrowRight, RefreshCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import TranslatableText from '@/components/TranslatableText';
import { usePageTranslation } from '@/hooks/usePageTranslation';
import { Skeleton } from '@/components/ui/skeleton';

const Calculator = () => {
  const { theme } = useTheme();
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanTerm, setLoanTerm] = useState(5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define content to be translated
  const pageContent = {
    pageTitle: 'Loan EMI Calculator',
    pageDescription: 'Calculate your monthly EMI, total payment, and total interest for your loan.',
    loanAmountLabel: 'Loan Amount',
    interestRateLabel: 'Interest Rate',
    loanTermLabel: 'Loan Term',
    monthlyPaymentLabel: 'Monthly Payment (EMI)',
    totalPaymentLabel: 'Total Payment',
    totalInterestLabel: 'Total Interest',
    resetButtonLabel: 'Reset',
    principalLabel: 'Principal',
    interestLabel: 'Interest',
    tipsTitle: 'Tips to Get the Best Loan Rates',
    tip1Title: 'Maintain a Good Credit Score',
    tip1Description: 'A credit score above 750 can help you secure loans at better interest rates.',
    tip2Title: 'Compare Multiple Lenders',
    tip2Description: 'Shop around and compare offers from different banks and financial institutions.',
    tip3Title: 'Opt for Shorter Loan Terms',
    tip3Description: 'Shorter loan terms usually come with lower interest rates, saving you money in the long run.',
    tip4Title: 'Make a Larger Down Payment',
    tip4Description: 'A larger down payment reduces the loan amount, resulting in lower EMIs and interest payments.'
  };

  // Use the custom hook to translate the content
  const { translatedContent, isLoading } = usePageTranslation(pageContent);

  // Calculate loan details
  useEffect(() => {
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    
    // Total number of payments
    const payments = loanTerm * 12;
    
    // Calculate monthly payment
    const x = Math.pow(1 + monthlyRate, payments);
    const monthly = (loanAmount * x * monthlyRate) / (x - 1);
    
    if (isFinite(monthly)) {
      // Update state with calculated values
      setMonthlyPayment(monthly);
      setTotalPayment(monthly * payments);
      setTotalInterest((monthly * payments) - loanAmount);
    }
  }, [loanAmount, interestRate, loanTerm]);

  // Format currency in Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Reset function
  const handleReset = () => {
    setLoanAmount(500000);
    setInterestRate(10);
    setLoanTerm(5);
  };

  // Loading skeleton for text
  const TextSkeleton = ({ width = 'w-full', height = 'h-6', className = '' }: { width?: string, height?: string, className?: string }) => (
    <Skeleton className={`${width} ${height} ${className} rounded-md`} />
  );

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className={cn(
            "text-3xl font-bold mb-4 flex items-center justify-center gap-2",
            theme === 'dark' ? "text-white" : "text-loan-gray-800"
          )}>
            <CalculatorIcon size={28} className={theme === 'dark' ? "text-blue-400" : "text-loan-blue"} />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className={cn(
              "p-6 rounded-xl",
              theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
            )}>
              {/* Loan Amount */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className={cn(
                    "font-medium",
                    theme === 'dark' ? "text-white" : "text-loan-gray-800"
                  )}>
                    {isClient ? (
                      isLoading ? "Loan Amount" : translatedContent.loanAmountLabel
                    ) : pageContent.loanAmountLabel}
                  </label>
                  <span className={cn(
                    "text-sm font-semibold",
                    theme === 'dark' ? "text-blue-400" : "text-loan-blue"
                  )}>
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
                <Slider
                  value={[loanAmount]}
                  min={50000}
                  max={10000000}
                  step={10000}
                  onValueChange={(value) => setLoanAmount(value[0])}
                  className={theme === 'dark' ? "py-4" : "py-4"}
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"}>₹50,000</span>
                  <span className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"}>₹1 Crore</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className={cn(
                    "font-medium",
                    theme === 'dark' ? "text-white" : "text-loan-gray-800"
                  )}>
                    {isClient ? (
                      isLoading ? "Interest Rate" : translatedContent.interestRateLabel
                    ) : pageContent.interestRateLabel}
                  </label>
                  <span className={cn(
                    "text-sm font-semibold",
                    theme === 'dark' ? "text-blue-400" : "text-loan-blue"
                  )}>
                    {interestRate}%
                  </span>
                </div>
                <Slider
                  value={[interestRate]}
                  min={5}
                  max={24}
                  step={0.1}
                  onValueChange={(value) => setInterestRate(value[0])}
                  className={theme === 'dark' ? "py-4" : "py-4"}
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"}>5%</span>
                  <span className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"}>24%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className={cn(
                    "font-medium",
                    theme === 'dark' ? "text-white" : "text-loan-gray-800"
                  )}>
                    {isClient ? (
                      isLoading ? "Loan Term" : translatedContent.loanTermLabel
                    ) : pageContent.loanTermLabel}
                  </label>
                  <span className={cn(
                    "text-sm font-semibold",
                    theme === 'dark' ? "text-blue-400" : "text-loan-blue"
                  )}>
                    {loanTerm} {loanTerm === 1 ? 'Year' : 'Years'}
                  </span>
                </div>
                <Slider
                  value={[loanTerm]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={(value) => setLoanTerm(value[0])}
                  className={theme === 'dark' ? "py-4" : "py-4"}
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"}>1 Year</span>
                  <span className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"}>30 Years</span>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className={cn(
                  "flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium mt-4",
                  theme === 'dark' 
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600" 
                    : "bg-loan-gray-100 text-loan-gray-700 hover:bg-loan-gray-200"
                )}
              >
                <RefreshCw size={16} className="mr-2" />
                {isClient ? (
                  isLoading ? "Reset" : translatedContent.resetButtonLabel
                ) : pageContent.resetButtonLabel}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <div className={cn(
              "p-6 rounded-xl",
              theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
            )}>
              <h3 className={cn(
                "text-xl font-semibold mb-6",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                {isClient ? (
                  isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.monthlyPaymentLabel
                ) : pageContent.monthlyPaymentLabel}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className={cn(
                    "text-sm mb-1",
                    theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"
                  )}>
                    {isClient ? (
                      isLoading ? "Monthly Payment (EMI)" : translatedContent.monthlyPaymentLabel
                    ) : pageContent.monthlyPaymentLabel}
                  </p>
                  <p className={cn(
                    "text-2xl font-bold",
                    theme === 'dark' ? "text-white" : "text-loan-gray-800"
                  )}>
                    {formatCurrency(monthlyPayment)}
                  </p>
                </div>
                
                <div>
                  <p className={cn(
                    "text-sm mb-1",
                    theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"
                  )}>
                    {isClient ? (
                      isLoading ? "Total Payment" : translatedContent.totalPaymentLabel
                    ) : pageContent.totalPaymentLabel}
                  </p>
                  <p className={cn(
                    "text-xl font-semibold",
                    theme === 'dark' ? "text-white" : "text-loan-gray-800"
                  )}>
                    {formatCurrency(totalPayment)}
                  </p>
                </div>
                
                <div>
                  <p className={cn(
                    "text-sm mb-1",
                    theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"
                  )}>
                    {isClient ? (
                      isLoading ? "Total Interest" : translatedContent.totalInterestLabel
                    ) : pageContent.totalInterestLabel}
                  </p>
                  <p className={cn(
                    "text-xl font-semibold",
                    theme === 'dark' ? "text-white" : "text-loan-gray-800"
                  )}>
                    {formatCurrency(totalInterest)}
                  </p>
                </div>
              </div>
              
              {/* Loan Breakdown */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className={cn(
                  "text-sm font-medium mb-3",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-700"
                )}>
                  Loan Breakdown
                </h4>
                
                <div className="flex items-center mb-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(loanAmount / totalPayment) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                    <span className={theme === 'dark' ? "text-gray-300" : "text-loan-gray-700"}>
                      {isClient ? (
                        isLoading ? "Principal" : translatedContent.principalLabel
                      ) : pageContent.principalLabel}
                    </span>
                  </div>
                  <span className={theme === 'dark' ? "text-gray-300" : "text-loan-gray-700"}>
                    {Math.round((loanAmount / totalPayment) * 100)}%
                  </span>
                </div>
                
                <div className="flex justify-between text-sm mt-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                    <span className={theme === 'dark' ? "text-gray-300" : "text-loan-gray-700"}>
                      {isClient ? (
                        isLoading ? "Interest" : translatedContent.interestLabel
                      ) : pageContent.interestLabel}
                    </span>
                  </div>
                  <span className={theme === 'dark' ? "text-gray-300" : "text-loan-gray-700"}>
                    {Math.round((totalInterest / totalPayment) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tips Section */}
        <div className={cn(
          "mt-8 p-6 rounded-xl",
          theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"
        )}>
          <h3 className={cn(
            "text-xl font-semibold mb-4",
            theme === 'dark' ? "text-white" : "text-loan-gray-800"
          )}>
            {isClient ? (
              isLoading ? <TextSkeleton width="w-1/3" /> : translatedContent.tipsTitle
            ) : pageContent.tipsTitle}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0",
                theme === 'dark' ? "bg-gray-700 text-blue-400" : "bg-loan-blue/10 text-loan-blue"
              )}>
                <span className="text-lg font-semibold">1</span>
              </div>
              <div>
                <h4 className={cn(
                  "font-semibold mb-1",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {isClient ? (
                    isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.tip1Title
                  ) : pageContent.tip1Title}
                </h4>
                <p className={cn(
                  "text-sm",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  {isClient ? (
                    isLoading ? <TextSkeleton width="w-full" /> : translatedContent.tip1Description
                  ) : pageContent.tip1Description}
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0",
                theme === 'dark' ? "bg-gray-700 text-blue-400" : "bg-loan-blue/10 text-loan-blue"
              )}>
                <span className="text-lg font-semibold">2</span>
              </div>
              <div>
                <h4 className={cn(
                  "font-semibold mb-1",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {isClient ? (
                    isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.tip2Title
                  ) : pageContent.tip2Title}
                </h4>
                <p className={cn(
                  "text-sm",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  {isClient ? (
                    isLoading ? <TextSkeleton width="w-full" /> : translatedContent.tip2Description
                  ) : pageContent.tip2Description}
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0",
                theme === 'dark' ? "bg-gray-700 text-blue-400" : "bg-loan-blue/10 text-loan-blue"
              )}>
                <span className="text-lg font-semibold">3</span>
              </div>
              <div>
                <h4 className={cn(
                  "font-semibold mb-1",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {isClient ? (
                    isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.tip3Title
                  ) : pageContent.tip3Title}
                </h4>
                <p className={cn(
                  "text-sm",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  {isClient ? (
                    isLoading ? <TextSkeleton width="w-full" /> : translatedContent.tip3Description
                  ) : pageContent.tip3Description}
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0",
                theme === 'dark' ? "bg-gray-700 text-blue-400" : "bg-loan-blue/10 text-loan-blue"
              )}>
                <span className="text-lg font-semibold">4</span>
              </div>
              <div>
                <h4 className={cn(
                  "font-semibold mb-1",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {isClient ? (
                    isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.tip4Title
                  ) : pageContent.tip4Title}
                </h4>
                <p className={cn(
                  "text-sm",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  {isClient ? (
                    isLoading ? <TextSkeleton width="w-full" /> : translatedContent.tip4Description
                  ) : pageContent.tip4Description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 