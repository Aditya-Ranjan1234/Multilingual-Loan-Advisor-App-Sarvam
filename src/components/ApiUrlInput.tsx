import React, { useState } from 'react';
import { Edit2, Check, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApiUrl } from '@/contexts/ApiUrlContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';

const ApiUrlInput = () => {
  const { customApiUrl, setCustomApiUrl } = useApiUrl();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(customApiUrl);
  const [error, setError] = useState('');
  const { translate } = useLanguage();

  // Validate URL format
  const validateUrl = (url: string): boolean => {
    try {
      // Check if it's a valid URL
      new URL(url);
      return true;
    } catch (e) {
      setError('Please enter a valid URL (e.g., https://api.example.com)');
      return false;
    }
  };

  const handleSave = () => {
    if (inputValue.trim()) {
      if (validateUrl(inputValue.trim())) {
        setCustomApiUrl(inputValue.trim());
        setIsEditing(false);
        setError('');
        toast({
          title: "API URL Updated",
          description: `API URL has been set to: ${inputValue.trim()}`,
        });
      }
    } else {
      setError('API URL cannot be empty');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-loan-gray-600">{translate('api.customUrl') || 'Custom API URL:'}</span>
          {isEditing ? (
            <>
              <Input
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError('');
                }}
                className={`flex-1 ${error ? 'border-red-500' : ''}`}
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
        
        {error && (
          <div className="flex items-center text-red-500 text-xs mt-1">
            <AlertCircle size={12} className="mr-1" />
            {error}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-1">
          Note: API requests will be sent to {customApiUrl}/ask
        </div>
      </div>
    </div>
  );
};

export default ApiUrlInput;
