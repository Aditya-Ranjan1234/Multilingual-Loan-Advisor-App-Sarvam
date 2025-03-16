import React, { createContext, useContext, useState, ReactNode } from 'react';

type ApiUrlContextType = {
  customApiUrl: string;
  apiUrl: string;
  setCustomApiUrl: (url: string) => void;
};

const ApiUrlContext = createContext<ApiUrlContextType | undefined>(undefined);

export const ApiUrlProvider = ({ children }: { children: ReactNode }) => {
  const [customApiUrl, setCustomApiUrl] = useState<string>('https://eab2-103-246-194-81.ngrok-free.app');

  const apiUrl = customApiUrl.endsWith('/') ? customApiUrl.slice(0, -1) : customApiUrl;

  return (
    <ApiUrlContext.Provider value={{ customApiUrl, apiUrl, setCustomApiUrl }}>
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
