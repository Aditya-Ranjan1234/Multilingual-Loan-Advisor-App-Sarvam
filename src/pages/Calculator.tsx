import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Calculator as CalcIcon, DollarSign, Calendar, Percent, ArrowRight, RefreshCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const Calculator = () => {
  const { theme } = useTheme();
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [loanTerm, setLoanTerm] = useState(36);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Calculate loan details
  useEffect(() => {
    // Convert annual interest rate to monthly
    const monthlyRate = interestRate / 100 / 12;
    
    // Calculate monthly payment using the formula: P = L[i(1+i)^n]/[(1+i)^n-1]
    // Where P = monthly payment, L = loan amount, i = monthly interest rate, n = number of payments
    const monthlyPaymentValue = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    
    // Calculate total payment and interest
    const totalPaymentValue = monthlyPaymentValue * loanTerm;
    const totalInterestValue = totalPaymentValue - loanAmount;
    
    setMonthlyPayment(isNaN(monthlyPaymentValue) ? 0 : monthlyPaymentValue);
    setTotalPayment(isNaN(totalPaymentValue) ? 0 : totalPaymentValue);
    setTotalInterest(isNaN(totalInterestValue) ? 0 : totalInterestValue);
  }, [loanAmount, interestRate, loanTerm]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Reset calculator
  const resetCalculator = () => {
    setLoanAmount(500000);
    setInterestRate(10.5);
    setLoanTerm(36);
  };

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className={cn(
            "text-3xl font-bold mb-4",
            theme === 'dark' ? "text-white" : "text-loan-gray-800"
          )}>
            Loan EMI Calculator
          </h1>
          <p className={cn(
            "max-w-2xl mx-auto",
            theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
          )}>
            Calculate your monthly EMI, total payment, and total interest for your loan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Inputs */}
          <div className={cn(
            "col-span-1 lg:col-span-2 p-6 rounded-xl",
            theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-lg"
          )}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={cn(
                "text-xl font-semibold flex items-center",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                <CalcIcon className="mr-2" size={20} />
                Loan Details
              </h2>
              <button
                onClick={resetCalculator}
                className={cn(
                  "flex items-center text-sm px-3 py-1.5 rounded",
                  theme === 'dark' ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-loan-gray-100 text-loan-gray-600 hover:bg-loan-gray-200"
                )}
              >
                <RefreshCw size={14} className="mr-1" />
                Reset
              </button>
            </div>

            {/* Loan Amount */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className={cn(
                  "flex items-center text-sm font-medium",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-700"
                )}>
                  <DollarSign size={16} className="mr-1" />
                  Loan Amount
                </label>
                <div className={cn(
                  "px-3 py-1 rounded text-sm font-medium",
                  theme === 'dark' ? "bg-gray-700 text-white" : "bg-loan-blue/10 text-loan-blue"
                )}>
                  {formatCurrency(loanAmount)}
                </div>
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
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className={cn(
                  "flex items-center text-sm font-medium",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-700"
                )}>
                  <Percent size={16} className="mr-1" />
                  Interest Rate (% p.a.)
                </label>
                <div className={cn(
                  "px-3 py-1 rounded text-sm font-medium",
                  theme === 'dark' ? "bg-gray-700 text-white" : "bg-loan-blue/10 text-loan-blue"
                )}>
                  {interestRate.toFixed(2)}%
                </div>
              </div>
              <Slider
                value={[interestRate]}
                min={5}
                max={20}
                step={0.1}
                onValueChange={(value) => setInterestRate(value[0])}
                className={theme === 'dark' ? "py-4" : "py-4"}
              />
              <div className="flex justify-between text-xs mt-1">
                <span className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"}>5%</span>
                <span className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"}>20%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className={cn(
                  "flex items-center text-sm font-medium",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-700"
                )}>
                  <Calendar size={16} className="mr-1" />
                  Loan Term (months)
                </label>
                <div className={cn(
                  "px-3 py-1 rounded text-sm font-medium",
                  theme === 'dark' ? "bg-gray-700 text-white" : "bg-loan-blue/10 text-loan-blue"
                )}>
                  {loanTerm} months
                </div>
              </div>
              <Slider
                value={[loanTerm]}
                min={6}
                max={84}
                step={1}
                onValueChange={(value) => setLoanTerm(value[0])}
                className={theme === 'dark' ? "py-4" : "py-4"}
              />
              <div className="flex justify-between text-xs mt-1">
                <span className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"}>6 months</span>
                <span className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"}>7 years</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className={cn(
            "col-span-1 p-6 rounded-xl",
            theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-lg"
          )}>
            <h2 className={cn(
              "text-xl font-semibold mb-6",
              theme === 'dark' ? "text-white" : "text-loan-gray-800"
            )}>
              Loan Summary
            </h2>

            <div className="space-y-6">
              {/* Monthly Payment */}
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? "bg-gray-700" : "bg-loan-blue/5"
              )}>
                <div className={cn(
                  "text-sm mb-1",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  Monthly EMI
                </div>
                <div className={cn(
                  "text-2xl font-bold",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {formatCurrency(monthlyPayment)}
                </div>
              </div>

              {/* Total Payment */}
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? "bg-gray-700" : "bg-green-50"
              )}>
                <div className={cn(
                  "text-sm mb-1",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  Total Payment
                </div>
                <div className={cn(
                  "text-2xl font-bold",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {formatCurrency(totalPayment)}
                </div>
                <div className="flex items-center mt-2 text-xs">
                  <ArrowRight size={12} className="mr-1" />
                  <span className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"}>
                    Principal: {formatCurrency(loanAmount)}
                  </span>
                </div>
              </div>

              {/* Total Interest */}
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? "bg-gray-700" : "bg-yellow-50"
              )}>
                <div className={cn(
                  "text-sm mb-1",
                  theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
                )}>
                  Total Interest
                </div>
                <div className={cn(
                  "text-2xl font-bold",
                  theme === 'dark' ? "text-white" : "text-loan-gray-800"
                )}>
                  {formatCurrency(totalInterest)}
                </div>
                <div className="flex items-center mt-2 text-xs">
                  <ArrowRight size={12} className="mr-1" />
                  <span className={theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"}>
                    {(totalInterest / loanAmount * 100).toFixed(2)}% of principal
                  </span>
                </div>
              </div>
            </div>

            <div className={cn(
              "mt-6 p-4 rounded-lg text-sm",
              theme === 'dark' ? "bg-blue-900/30 text-blue-300" : "bg-loan-blue/10 text-loan-blue"
            )}>
              <p>This is an estimate based on the information you provided. Actual loan terms may vary.</p>
            </div>
          </div>
        </div>

        {/* Loan Tips */}
        <div className={cn(
          "mt-12 p-6 rounded-xl",
          theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white shadow-lg"
        )}>
          <h2 className={cn(
            "text-xl font-semibold mb-4",
            theme === 'dark' ? "text-white" : "text-loan-gray-800"
          )}>
            Tips to Get the Best Loan Rates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={cn(
              "p-4 rounded-lg",
              theme === 'dark' ? "bg-gray-700" : "bg-loan-gray-50"
            )}>
              <h3 className={cn(
                "font-medium mb-2",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                Maintain a Good Credit Score
              </h3>
              <p className={cn(
                "text-sm",
                theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
              )}>
                A credit score above 750 can help you secure loans at lower interest rates.
              </p>
            </div>
            <div className={cn(
              "p-4 rounded-lg",
              theme === 'dark' ? "bg-gray-700" : "bg-loan-gray-50"
            )}>
              <h3 className={cn(
                "font-medium mb-2",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                Compare Multiple Lenders
              </h3>
              <p className={cn(
                "text-sm",
                theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
              )}>
                Shop around and compare offers from different banks and financial institutions.
              </p>
            </div>
            <div className={cn(
              "p-4 rounded-lg",
              theme === 'dark' ? "bg-gray-700" : "bg-loan-gray-50"
            )}>
              <h3 className={cn(
                "font-medium mb-2",
                theme === 'dark' ? "text-white" : "text-loan-gray-800"
              )}>
                Opt for a Shorter Loan Term
              </h3>
              <p className={cn(
                "text-sm",
                theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
              )}>
                Shorter loan terms often come with lower interest rates, saving you money in the long run.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 