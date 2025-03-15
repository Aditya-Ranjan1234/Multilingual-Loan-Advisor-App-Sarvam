
import React, { useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type ResponseDisplayProps = {
  response: string;
  loading: boolean;
};

const ResponseDisplay = ({ response, loading }: ResponseDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useLanguage();
  
  useEffect(() => {
    if (containerRef.current && response) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  if (!response && !loading) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <p className="text-gray-400 text-center">
          Your response will appear here
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`w-full p-6 rounded-xl glass-morphism transition-all duration-500 ${
        loading ? 'opacity-70' : 'animate-reveal'
      }`}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center h-32">
          <div className="w-8 h-8 rounded-full border-4 border-loan-blue/30 border-t-loan-blue animate-spin"></div>
          <p className="mt-4 text-gray-500">Processing your request...</p>
        </div>
      ) : (
        <div className="prose prose-blue max-w-none">
          <p className="font-medium text-lg" dir={currentLanguage.code === 'ar' ? 'rtl' : 'ltr'}>
            {response}
          </p>
          <div className="mt-4 text-xs text-gray-400 flex items-center">
            <span>Response in {currentLanguage.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;
