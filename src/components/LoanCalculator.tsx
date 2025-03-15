import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';

interface LoanCalculatorProps {
  onBack?: () => void;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ onBack }) => {
  const { translate } = useLanguage();
  const { theme } = useTheme();
  
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [loanTenure, setLoanTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(10);
  const [otherEMIs, setOtherEMIs] = useState(0);
  const [eligibleAmount, setEligibleAmount] = useState(0);
  const [monthlyEMI, setMonthlyEMI] = useState(0);

  useEffect(() => {
    calculateEligibility();
  }, [monthlyIncome, loanTenure, interestRate, otherEMIs]);

  const calculateEligibility = () => {
    // Maximum EMI a person can pay (50% of monthly income)
    const maxEMI = monthlyIncome * 0.5;
    
    // Available EMI capacity after deducting existing EMIs
    const availableEMI = maxEMI - otherEMIs;
    
    if (availableEMI <= 0) {
      setEligibleAmount(0);
      setMonthlyEMI(0);
      return;
    }
    
    // Monthly interest rate
    const monthlyInterestRate = interestRate / 12 / 100;
    
    // Total number of months
    const totalMonths = loanTenure * 12;
    
    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    // Solving for P (Principal) when EMI is known
    const numerator = availableEMI * (1 - Math.pow(1 + monthlyInterestRate, -totalMonths));
    const denominator = monthlyInterestRate;
    
    const eligibleLoanAmount = numerator / denominator;
    
    setEligibleAmount(Math.round(eligibleLoanAmount));
    setMonthlyEMI(Math.round(availableEMI));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`p-4 rounded-lg shadow-md w-full max-w-md mx-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      {onBack && (
        <button 
          onClick={onBack}
          className="mb-4 flex items-center text-primary hover:text-primary/80"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {translate('conversation.back') || 'Back'}
        </button>
      )}
      
      <h2 className="text-xl font-bold mb-6 text-center">{translate('calculator.title')}</h2>
      
      <div className="space-y-6">
        <p className="text-center text-sm text-muted-foreground mb-6">
          {translate('calculator.subtitle')}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="block text-sm font-medium">{translate('calculator.income')}</label>
            <span className="text-sm font-medium text-primary">{formatCurrency(monthlyIncome)}</span>
          </div>
          <Slider
            value={[monthlyIncome]}
            min={10000}
            max={500000}
            step={5000}
            onValueChange={(value) => setMonthlyIncome(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹10,000</span>
            <span>₹5,00,000</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="block text-sm font-medium">{translate('calculator.tenure')}</label>
            <span className="text-sm font-medium text-primary">{loanTenure} {translate('calculator.years')}</span>
          </div>
          <Slider
            value={[loanTenure]}
            min={1}
            max={30}
            step={1}
            onValueChange={(value) => setLoanTenure(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 {translate('calculator.years')}</span>
            <span>30 {translate('calculator.years')}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="block text-sm font-medium">{translate('calculator.interest')}</label>
            <span className="text-sm font-medium text-primary">{interestRate}%</span>
          </div>
          <Slider
            value={[interestRate]}
            min={5}
            max={20}
            step={0.5}
            onValueChange={(value) => setInterestRate(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5%</span>
            <span>20%</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="block text-sm font-medium">{translate('calculator.emi')}</label>
            <span className="text-sm font-medium text-primary">{formatCurrency(otherEMIs)}</span>
          </div>
          <Slider
            value={[otherEMIs]}
            min={0}
            max={100000}
            step={1000}
            onValueChange={(value) => setOtherEMIs(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹0</span>
            <span>₹1,00,000</span>
          </div>
        </div>
        
        <div className={`mt-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-muted'}`}>
          <h3 className="text-lg font-semibold mb-2">{translate('calculator.result')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{translate('calculator.eligibility')}</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(eligibleAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{translate('calculator.monthly')}</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(monthlyEMI)}</p>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          {translate('calculator.note')}
        </p>
      </div>
    </div>
  );
};

export default LoanCalculator; 