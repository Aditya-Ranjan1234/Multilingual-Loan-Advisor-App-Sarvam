import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApiUrl } from '@/contexts/ApiUrlContext';
import { submitTextQuery } from '@/services/api';
import { translateText } from '@/services/sarvamAI';

type TextInputProps = {
  onResponseReceived: (response: string, shouldPlayAudio: boolean) => void;
  setLoading: (loading: boolean) => void;
  toggleCalculator?: () => void;
};

const TextInput = ({ onResponseReceived, setLoading, toggleCalculator }: TextInputProps) => {
  const { currentLanguage, translate, translateDynamic } = useLanguage();
  const { customApiUrl } = useApiUrl();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if text contains eligibility-related keywords
  const checkForEligibilityKeywords = async (inputText: string): Promise<boolean> => {
    try {
      // If the text is already in English, check directly
      if (currentLanguage.code === 'en-IN') {
        const lowerText = inputText.toLowerCase();
        return lowerText.includes('eligib') || 
               lowerText.includes('qualify') || 
               lowerText.includes('calculator') ||
               lowerText.includes('loan amount') ||
               lowerText.includes('how much loan');
      }
      
      // Otherwise, translate to English first and then check
      const translatedToEnglish = await translateText({
        text: inputText,
        sourceLanguage: currentLanguage.code,
        targetLanguage: 'en-IN'
      });
      
      const lowerTranslated = translatedToEnglish.toLowerCase();
      return lowerTranslated.includes('eligib') || 
             lowerTranslated.includes('qualify') || 
             lowerTranslated.includes('calculator') ||
             lowerTranslated.includes('loan amount') ||
             lowerTranslated.includes('how much loan');
    } catch (error) {
      console.error('Error checking eligibility keywords:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    try {
      setLoading(true);
      
      // Check if the text is related to loan eligibility
      const isEligibilityQuery = await checkForEligibilityKeywords(text.trim());
      
      // Submit the query to get a response
      const response = await submitTextQuery({
        text: text.trim(),
        language: currentLanguage.code,
      }, customApiUrl);
      
      // If it's an eligibility query, show the calculator and add a suggestion
      if (isEligibilityQuery && toggleCalculator) {
        // Show the calculator
        toggleCalculator();
        
        // Add a suggestion to use the calculator
        const calculatorSuggestion = await translateDynamic(
          "I see you're asking about loan eligibility. Please use the Eligibility Calculator at the top of the page to get a personalized estimate based on your income.",
          currentLanguage.code
        );
        
        // Combine the suggestion with the original response
        const combinedResponse = `${calculatorSuggestion}\n\n${response}`;
        onResponseReceived(combinedResponse, false);
      } else {
        // Just show the normal response
        onResponseReceived(response, false);
      }
      
      setText('');
    } catch (error) {
      console.error('Error submitting text:', error);
    } finally {
      setLoading(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm transition-all focus-within:shadow-md">
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={translate('input.placeholder') || `Ask about loans in ${currentLanguage.name}...`}
        className="resize-none min-h-[100px] p-4 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="absolute bottom-3 right-3 rounded-full w-10 h-10 p-0 bg-loan-blue hover:bg-loan-blue/90"
        aria-label={translate('input.send') || "Send message"}
      >
        <Send size={18} className="text-white" />
      </Button>
    </div>
  );
};

export default TextInput;
