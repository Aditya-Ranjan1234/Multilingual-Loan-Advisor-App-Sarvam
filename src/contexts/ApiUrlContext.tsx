
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ApiUrlContextType = {
  customApiUrl: string;
  setCustomApiUrl: (url: string) => void;
};

const ApiUrlContext = createContext<ApiUrlContextType | undefined>(undefined);

export const ApiUrlProvider = ({ children }: { children: ReactNode }) => {
  const [customApiUrl, setCustomApiUrl] = useState<string>('https://api.example.com');

  return (
    <ApiUrlContext.Provider value={{ customApiUrl, setCustomApiUrl }}>
      {children}
    </ApiUrlContext.Provider>
  );
};

export const useApiUrl = () => {
  const context = useContext(ApiUrlContext);
  if (context === undefined) {
    throw new Error('useApiUrl must be used within an ApiUrlProvider');
  }
  return context;
};
