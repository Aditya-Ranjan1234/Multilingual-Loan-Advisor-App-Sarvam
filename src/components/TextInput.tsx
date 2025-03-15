
import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { submitTextQuery } from '@/services/api';

type TextInputProps = {
  onResponseReceived: (response: string) => void;
  setLoading: (loading: boolean) => void;
};

const TextInput = ({ onResponseReceived, setLoading }: TextInputProps) => {
  const { currentLanguage } = useLanguage();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    try {
      setLoading(true);
      const response = await submitTextQuery({
        text: text.trim(),
        language: currentLanguage.code,
      });
      onResponseReceived(response);
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
        placeholder={`Ask about loans in ${currentLanguage.name}...`}
        className="resize-none min-h-[100px] p-4 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="absolute bottom-3 right-3 rounded-full w-10 h-10 p-0 bg-loan-blue hover:bg-loan-blue/90"
      >
        <Send size={18} className="text-white" />
      </Button>
    </div>
  );
};

export default TextInput;
