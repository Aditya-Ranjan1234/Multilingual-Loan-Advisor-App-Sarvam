import React, { useState } from 'react';
import { Edit2, Check, AlertCircle, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApiUrl } from '@/contexts/ApiUrlContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ApiUrlInput = () => {
  const { customApiUrl, setCustomApiUrl } = useApiUrl();
  const { translate } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(customApiUrl);
  const [error, setError] = useState('');
  const [showCorsInfo, setShowCorsInfo] = useState(false);

  // Validate URL format
  const validateUrl = (url: string): boolean => {
    try {
      // Check if it's a valid URL
      new URL(url);
      setError('');
      return true;
    } catch (e) {
      setError('Please enter a valid URL');
      return false;
    }
  };

  const handleSave = () => {
    if (!inputValue.trim()) {
      setError('URL cannot be empty');
      return;
    }

    if (validateUrl(inputValue)) {
      setCustomApiUrl(inputValue);
      setIsEditing(false);
      toast({
        title: "API URL Updated",
        description: `API requests will now be sent to ${inputValue}/ask`,
      });
    }
  };

  return (
    <div className="mb-6 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-loan-gray-700">
          {translate('api.customUrl')}
        </div>
        {!isEditing && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowCorsInfo(!showCorsInfo)}
            className="text-xs text-loan-blue"
          >
            <Info size={14} className="mr-1" />
            CORS Info
          </Button>
        )}
      </div>

      {showCorsInfo && (
        <Alert className="bg-blue-50 text-blue-800 border-blue-200 text-xs">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>About CORS and API Format</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-1">Due to browser security restrictions (CORS), API requests to external domains may be blocked.</p>
            <p className="mb-1">This app uses CORS proxies to handle these restrictions, but for best results:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ensure your API server has CORS enabled</li>
              <li>For ngrok endpoints, use <code className="bg-blue-100 px-1 rounded">ngrok http --cors-enabled 8000</code></li>
              <li>If using a custom server, add appropriate CORS headers</li>
            </ul>
            <p className="mt-1">If CORS issues persist, the app will use fallback responses.</p>
            
            <div className="mt-3 border-t border-blue-200 pt-2">
              <p className="font-medium mb-1">Expected API Format:</p>
              <p className="mb-1">Request:</p>
              <pre className="bg-blue-100 p-1 rounded text-xs overflow-auto mb-2">
                {`POST ${customApiUrl}/ask
{
  "question": "user input text",
  "conversation_context": { ... }
}`}
              </pre>
              <p className="mb-1">Response:</p>
              <pre className="bg-blue-100 p-1 rounded text-xs overflow-auto">
                {`{
  "answer": "API response text",
  "should_play_audio": true
}`}
              </pre>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={translate('api.placeholder')}
            className={error ? "border-red-500" : ""}
          />
          {error && (
            <div className="text-red-500 text-xs flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {error}
            </div>
          )}
          <div className="text-xs text-loan-gray-500">
            API requests will be sent to <span className="font-mono bg-gray-100 px-1 rounded">{inputValue || 'your-url'}/ask</span>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setIsEditing(false);
                setInputValue(customApiUrl);
                setError('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded truncate max-w-[80%]">
            {customApiUrl}
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsEditing(true)}
          >
            {translate('api.edit')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApiUrlInput;
