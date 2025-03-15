import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { IndianRupee } from 'lucide-react';

const LoanCalculator = () => {
  const { translate } = useLanguage();
  
  // State for form inputs
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [loanTenure, setLoanTenure] = useState<number>(5);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [otherEMIs, setOtherEMIs] = useState<number>(0);
  
  // State for calculation result
  const [eligibilityAmount, setEligibilityAmount] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Calculate loan eligibility
  const calculateEligibility = () => {
    // Standard calculation: 50% of income can go to EMIs
    const maxEMICapacity = monthlyIncome * 0.5;
    
    // Subtract existing EMIs
    const availableEMICapacity = maxEMICapacity - otherEMIs;
    
    if (availableEMICapacity <= 0) {
      setEligibilityAmount(0);
      setShowResult(true);
      return;
    }
    
    // Convert annual interest rate to monthly
    const monthlyInterestRate = interestRate / 12 / 100;
    
    // Convert tenure to months
    const tenureInMonths = loanTenure * 12;
    
    // Calculate loan amount using EMI formula
    // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    // Solving for P: P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
    const numerator = availableEMICapacity * ((Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1));
    const denominator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureInMonths);
    
    const eligibility = numerator / denominator;
    
    // Round down to nearest thousand
    const roundedEligibility = Math.floor(eligibility / 1000) * 1000;
    
    setEligibilityAmount(roundedEligibility);
    setShowResult(true);
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{translate('calculator.title')}</CardTitle>
        <CardDescription>
          {translate('calculator.subtitle') || 'Calculate how much loan you are eligible for based on your income.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">
            {translate('calculator.income')}
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <IndianRupee className="h-4 w-4 text-gray-500" />
            </div>
            <Input
              id="monthlyIncome"
              type="number"
              className="pl-10"
              placeholder="50000"
              value={monthlyIncome || ''}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="loanTenure">
            {translate('calculator.tenure')}
          </Label>
          <Input
            id="loanTenure"
            type="number"
            placeholder="5"
            value={loanTenure || ''}
            onChange={(e) => setLoanTenure(Number(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="interestRate">
            {translate('calculator.interest')}
          </Label>
          <Input
            id="interestRate"
            type="number"
            step="0.1"
            placeholder="10.5"
            value={interestRate || ''}
            onChange={(e) => setInterestRate(Number(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="otherEMIs">
            {translate('calculator.emi')}
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <IndianRupee className="h-4 w-4 text-gray-500" />
            </div>
            <Input
              id="otherEMIs"
              type="number"
              className="pl-10"
              placeholder="0"
              value={otherEMIs || ''}
              onChange={(e) => setOtherEMIs(Number(e.target.value))}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button 
          className="w-full" 
          onClick={calculateEligibility}
          disabled={!monthlyIncome || !loanTenure || !interestRate}
        >
          {translate('calculator.calculate')}
        </Button>
        
        {showResult && (
          <div className="mt-4 w-full">
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-2">
              {translate('calculator.result')}
            </h3>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm text-muted-foreground mb-1">
                {translate('calculator.eligibility')}:
              </p>
              <p className="text-2xl font-bold">
                {eligibilityAmount !== null ? formatCurrency(eligibilityAmount) : '-'}
              </p>
              {eligibilityAmount && eligibilityAmount > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {translate('calculator.monthly')}: {formatCurrency(eligibilityAmount * (interestRate / 12 / 100) * Math.pow(1 + interestRate / 12 / 100, loanTenure * 12) / (Math.pow(1 + interestRate / 12 / 100, loanTenure * 12) - 1))}
                </p>
              )}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default LoanCalculator; 