
import React, { useState } from 'react';
import Header from '@/components/Header';
import LanguageSelector from '@/components/LanguageSelector';
import TextInput from '@/components/TextInput';
import VoiceRecorder from '@/components/VoiceRecorder';
import ResponseDisplay from '@/components/ResponseDisplay';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { initializeSarvamAI } from '@/services/sarvamAI';

// Initialize SarvamAI
initializeSarvamAI();

const Index = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResponseReceived = (newResponse: string) => {
    setResponse(newResponse);
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-gradient-to-br from-white to-loan-gray-100">
          <Header />
          
          <main className="container pt-24 px-4 pb-10">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8 animate-slide-down">
                <div className="inline-block">
                  <div className="bg-loan-blue/10 text-loan-blue text-xs font-semibold py-1 px-3 rounded-full mb-2">
                    Multilingual Assistance
                  </div>
                </div>
                <h1 className="text-4xl font-display font-bold mb-2 bg-gradient-to-r from-loan-blue to-loan-indigo bg-clip-text text-transparent">
                  Loan Genius
                </h1>
                <p className="text-loan-gray-600 max-w-lg mx-auto">
                  Ask questions about loans in your preferred language. Use text or voice to communicate.
                </p>
              </div>
              
              <div className="mb-8 max-w-xs mx-auto">
                <LanguageSelector />
              </div>
              
              <Tabs defaultValue="text" className="w-full mb-8">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 rounded-xl bg-loan-gray-100 p-1 shadow-inner">
                  <TabsTrigger 
                    value="text" 
                    className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:text-loan-blue data-[state=active]:shadow-sm"
                  >
                    Text
                  </TabsTrigger>
                  <TabsTrigger 
                    value="voice" 
                    className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:text-loan-blue data-[state=active]:shadow-sm"
                  >
                    Voice
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="mt-6">
                  <TextInput 
                    onResponseReceived={handleResponseReceived}
                    setLoading={setLoading}
                  />
                </TabsContent>
                
                <TabsContent value="voice" className="mt-6 flex justify-center">
                  <VoiceRecorder 
                    onResponseReceived={handleResponseReceived}
                    setLoading={setLoading}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="mt-8">
                <ResponseDisplay response={response} loading={loading} />
              </div>
            </div>
          </main>
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default Index;
