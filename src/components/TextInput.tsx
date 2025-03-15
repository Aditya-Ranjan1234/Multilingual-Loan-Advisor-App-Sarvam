
import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApiUrl } from '@/contexts/ApiUrlContext';
import { submitTextQuery } from '@/services/api';

type TextInputProps = {
  onResponseReceived: (response: string, shouldPlayAudio: boolean) => void;
  setLoading: (loading: boolean) => void;
};

const TextInput = ({ onResponseReceived, setLoading }: TextInputProps) => {
  const { currentLanguage } = useLanguage();
  const { customApiUrl } = useApiUrl();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    try {
      setLoading(true);
      const response = await submitTextQuery({
        text: text.trim(),
        language: currentLanguage.code,
      }, customApiUrl);
      
      onResponseReceived(response, false); // Text input should not auto-play audio
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

  const getPlaceholder = () => {
    if (currentLanguage.code === 'en-IN') return `Ask about loans in English...`;
    if (currentLanguage.code === 'hi-IN') return `हिंदी में ऋण के बारे में पूछें...`;
    if (currentLanguage.code === 'bn-IN') return `বাংলায় ঋণ সম্পর্কে জিজ্ঞাসা করুন...`;
    if (currentLanguage.code === 'gu-IN') return `ગુજરાતીમાં લોન વિશે પૂછો...`;
    if (currentLanguage.code === 'kn-IN') return `ಕನ್ನಡದಲ್ಲಿ ಸಾಲಗಳ ಬಗ್ಗೆ ಕೇಳಿ...`;
    if (currentLanguage.code === 'ml-IN') return `മലയാളത്തിൽ വായ്പകളെക്കുറിച്ച് ചോദിക്കൂ...`;
    if (currentLanguage.code === 'mr-IN') return `मराठीत कर्जाबद्दल विचारा...`;
    if (currentLanguage.code === 'od-IN') return `ଓଡିଆରେ ଋଣ ବିଷୟରେ ପଚାରନ୍ତୁ...`;
    if (currentLanguage.code === 'pa-IN') return `ਪੰਜਾਬੀ ਵਿੱਚ ਲੋਨ ਬਾਰੇ ਪੁੱਛੋ...`;
    if (currentLanguage.code === 'ta-IN') return `தமிழில் கடன்கள் பற்றி கேளுங்கள்...`;
    if (currentLanguage.code === 'te-IN') return `తెలుగులో రుణాల గురించి అడగండి...`;
    return `Ask about loans in ${currentLanguage.name}...`;
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm transition-all focus-within:shadow-md">
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={getPlaceholder()}
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
