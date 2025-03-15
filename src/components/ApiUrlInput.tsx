
import React, { useState } from 'react';
import { Edit2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApiUrl } from '@/contexts/ApiUrlContext';
import { useLanguage } from '@/contexts/LanguageContext';

const ApiUrlInput = () => {
  const { customApiUrl, setCustomApiUrl } = useApiUrl();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(customApiUrl);
  const { currentLanguage } = useLanguage();

  const handleSave = () => {
    if (inputValue.trim()) {
      setCustomApiUrl(inputValue.trim());
      setIsEditing(false);
    }
  };

  const getLabel = () => {
    if (currentLanguage.code === 'en-IN') return 'Custom API URL:';
    if (currentLanguage.code === 'hi-IN') return 'कस्टम API यूआरएल:';
    if (currentLanguage.code === 'bn-IN') return 'কাস্টম API URL:';
    if (currentLanguage.code === 'gu-IN') return 'કસ્ટમ API URL:';
    if (currentLanguage.code === 'kn-IN') return 'ಕಸ್ಟಮ್ API URL:';
    if (currentLanguage.code === 'ml-IN') return 'കസ്റ്റം API URL:';
    if (currentLanguage.code === 'mr-IN') return 'कस्टम API URL:';
    if (currentLanguage.code === 'od-IN') return 'କଷ୍ଟମ API URL:';
    if (currentLanguage.code === 'pa-IN') return 'ਕਸਟਮ API URL:';
    if (currentLanguage.code === 'ta-IN') return 'விருப்ப API URL:';
    if (currentLanguage.code === 'te-IN') return 'కస్టమ్ API URL:';
    return 'Custom API URL:';
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-loan-gray-600">{getLabel()}</span>
        {isEditing ? (
          <>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
              placeholder="https://your-api-url.com/api"
            />
            <Button 
              size="sm" 
              onClick={handleSave}
              className="bg-loan-blue hover:bg-loan-blue/90"
            >
              <Check size={16} />
            </Button>
          </>
        ) : (
          <>
            <span className="flex-1 truncate text-sm">{customApiUrl}</span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={16} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ApiUrlInput;
