import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LanguageSelector from '@/components/LanguageSelector';
import TextInput from '@/components/TextInput';
import VoiceRecorder from '@/components/VoiceRecorder';
import ConversationDisplay from '@/components/ConversationDisplay';
import ApiUrlInput from '@/components/ApiUrlInput';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { initializeSarvamAI } from '@/services/sarvamAI';
import LoanCalculator from '@/components/LoanCalculator';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

// Initialize SarvamAI
initializeSarvamAI();

// Main content component that uses the language context
const Index = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [shouldPlayAudio, setShouldPlayAudio] = useState(false);
  // State to control calculator visibility
  const [showCalculator, setShowCalculator] = useState(false);
  const { translate } = useLanguage();

  const handleResponseReceived = (newResponse: string, playAudio: boolean = false) => {
    setResponse(newResponse);
    setShouldPlayAudio(playAudio);
  };

  const toggleCalculator = () => {
    setShowCalculator(!showCalculator);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      
      <main className="container pt-24 px-4 pb-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="inline-block">
              <div className="bg-primary/10 text-primary text-xs font-semibold py-1 px-3 rounded-full mb-2">
                {translate('app.multilingual')}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {!showCalculator && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1" 
                  onClick={toggleCalculator}
                >
                  <Calculator size={16} />
                  <span className="hidden sm:inline">{translate('calculator.button')}</span>
                </Button>
              )}
            </div>
          </div>
          
          <div className="text-center mb-8 animate-slide-down">
            <h1 className="text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              {translate('app.title')}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {translate('app.subtitle')}
            </p>
          </div>
          
          <div className="mb-8 max-w-xs mx-auto">
            <LanguageSelector />
          </div>
          
          {showCalculator ? (
            <div className="my-8 animate-fade-in">
              <LoanCalculator onBack={toggleCalculator} />
            </div>
          ) : (
            <>
              <div className="mt-8">
                <ConversationDisplay 
                  response={response} 
                  loading={loading} 
                  shouldPlayAudio={shouldPlayAudio}
                />
              </div>
              
              <Tabs defaultValue="text" className="w-full mt-8">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 rounded-xl bg-muted p-1 shadow-inner">
                  <TabsTrigger 
                    value="text" 
                    className="rounded-lg font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    {translate('input.text')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="voice" 
                    className="rounded-lg font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    {translate('input.voice')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="mt-6">
                  <TextInput 
                    onResponseReceived={handleResponseReceived}
                    setLoading={setLoading}
                    toggleCalculator={toggleCalculator}
                  />
                </TabsContent>
                
                <TabsContent value="voice" className="mt-6 flex justify-center">
                  <VoiceRecorder 
                    onResponseReceived={handleResponseReceived}
                    setLoading={setLoading}
                    toggleCalculator={toggleCalculator}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
          
          <div className="mt-8">
            <ApiUrlInput />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
