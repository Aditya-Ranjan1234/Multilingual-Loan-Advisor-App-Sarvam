import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApiUrl } from '@/contexts/ApiUrlContext';
import { submitTextQuery } from '@/services/api';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

type TextInputProps = {
  onResponseReceived: (response: string, shouldPlayAudio: boolean) => void;
  setLoading: (loading: boolean) => void;
};

const TextInput = ({ onResponseReceived, setLoading }: TextInputProps) => {
  const { currentLanguage, translate } = useLanguage();
  const { customApiUrl } = useApiUrl();
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    try {
      // Dispatch an event to add the user message to the conversation
      const userMessage = text.trim();
      document.dispatchEvent(new CustomEvent('userMessage', { 
        detail: { text: userMessage } 
      }));
      
      setLoading(true);
      
      // Submit the query to get a response
      const response = await submitTextQuery(
        userMessage,
        customApiUrl,
        currentLanguage
      );
      
      // Show the normal response
      onResponseReceived(response.text, response.shouldPlayAudio);
      
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
    <div className={cn(
      "relative w-full rounded-xl overflow-hidden border shadow-sm transition-all",
      theme === 'dark' 
        ? "bg-gray-700 border-gray-600" 
        : "bg-white border-gray-200"
    )}>
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={translate('input.placeholder') || `Ask about loans in ${currentLanguage.name}...`}
        className={cn(
          "resize-none min-h-[100px] p-4 focus-visible:ring-0 focus-visible:ring-offset-0",
          theme === 'dark' 
            ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" 
            : "bg-white border-none text-loan-gray-800"
        )}
      />
      <Button
        onClick={handleSubmit}
        disabled={!text.trim()}
        className={cn(
          "absolute bottom-3 right-3 rounded-full w-10 h-10 p-0",
          theme === 'dark' 
            ? "bg-blue-600 hover:bg-blue-700" 
            : "bg-loan-blue hover:bg-loan-blue/90"
        )}
        aria-label={translate('input.send') || "Send message"}
      >
        <Send size={18} className="text-white" />
      </Button>
    </div>
  );
};

export default TextInput;
