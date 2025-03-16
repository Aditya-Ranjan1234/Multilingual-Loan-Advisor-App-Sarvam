import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useApiUrl } from '@/contexts/ApiUrlContext';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sendMessage } from '@/services/api';

type TextInputProps = {
  onResponseReceived: (text: string, playAudio: boolean) => void;
  setLoading: (loading: boolean) => void;
};

const TextInput = ({ onResponseReceived, setLoading }: TextInputProps) => {
  const { currentLanguage } = useLanguage();
  const { theme } = useTheme();
  const { apiUrl } = useApiUrl();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Dispatch event for user message
    const userMessageEvent = new CustomEvent('userMessage', {
      detail: { text: input }
    });
    document.dispatchEvent(userMessageEvent);
    
    // Clear input
    setInput('');
    
    // Set loading state
    setLoading(true);
    
    try {
      // Send message to API
      const response = await sendMessage(input, apiUrl, currentLanguage.code);
      
      // Show response
      onResponseReceived(response.response, false);
    } catch (error) {
      console.error('Error sending message:', error);
      onResponseReceived('Sorry, there was an error processing your request. Please try again later.', false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className={cn(
          "flex-1 p-3 rounded-l-lg resize-none min-h-[80px] max-h-[200px] focus:outline-none",
          theme === 'dark' 
            ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500" 
            : "bg-white text-gray-900 border-gray-300 focus:border-loan-blue"
        )}
        rows={3}
      />
      <button
        type="submit"
        className={cn(
          "p-3 h-[80px] rounded-r-lg",
          theme === 'dark'
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-loan-blue text-white hover:bg-loan-blue/90"
        )}
        disabled={!input.trim()}
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default TextInput;
