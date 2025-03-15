import React, { useState } from 'react';
import Header from '@/components/Header';
import LanguageSelector from '@/components/LanguageSelector';
import TextInput from '@/components/TextInput';
import VoiceRecorder from '@/components/VoiceRecorder';
import ConversationDisplay from '@/components/ConversationDisplay';
import ApiUrlInput from '@/components/ApiUrlInput';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { ApiUrlProvider } from '@/contexts/ApiUrlContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { initializeSarvamAI } from '@/services/sarvamAI';

// Initialize SarvamAI
initializeSarvamAI();

// Main content component that uses the language context
const MainContent = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [shouldPlayAudio, setShouldPlayAudio] = useState(false);
  const { translate } = useLanguage();

  const handleResponseReceived = (newResponse: string, playAudio: boolean = false) => {
    setResponse(newResponse);
    setShouldPlayAudio(playAudio);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-loan-gray-100">
      <Header />
      
      <main className="container pt-24 px-4 pb-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 animate-slide-down">
            <div className="inline-block">
              <div className="bg-loan-blue/10 text-loan-blue text-xs font-semibold py-1 px-3 rounded-full mb-2">
                {translate('app.multilingual')}
              </div>
            </div>
            <h1 className="text-4xl font-display font-bold mb-2 bg-gradient-to-r from-loan-blue to-loan-indigo bg-clip-text text-transparent">
              {translate('app.title')}
            </h1>
            <p className="text-loan-gray-600 max-w-lg mx-auto">
              {translate('app.subtitle')}
            </p>
          </div>
          
          <div className="mb-8 max-w-xs mx-auto">
            <LanguageSelector />
          </div>
          
          <div className="mt-8">
            <ConversationDisplay 
              response={response} 
              loading={loading} 
              shouldPlayAudio={shouldPlayAudio}
            />
          </div>
          
          <Tabs defaultValue="text" className="w-full mt-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 rounded-xl bg-loan-gray-100 p-1 shadow-inner">
              <TabsTrigger 
                value="text" 
                className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:text-loan-blue data-[state=active]:shadow-sm"
              >
                {translate('input.text')}
              </TabsTrigger>
              <TabsTrigger 
                value="voice" 
                className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:text-loan-blue data-[state=active]:shadow-sm"
              >
                {translate('input.voice')}
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
            <ApiUrlInput />
          </div>
        </div>
      </main>
    </div>
  );
};

// Wrapper component that provides the context
const Index = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ApiUrlProvider>
          <MainContent />
        </ApiUrlProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default Index;
