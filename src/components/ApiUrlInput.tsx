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
  const { translate } = useLanguage();

  const handleSave = () => {
    if (inputValue.trim()) {
      setCustomApiUrl(inputValue.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-loan-gray-600">{translate('api.customUrl') || 'Custom API URL:'}</span>
        {isEditing ? (
          <>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
              placeholder={translate('api.placeholder') || "https://your-api-url.com/api"}
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
              aria-label={translate('api.edit') || "Edit API URL"}
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
