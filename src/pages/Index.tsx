import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';
import TextInput from '@/components/TextInput';
import VoiceRecorder from '@/components/VoiceRecorder';
import ResponseDisplay from '@/components/ResponseDisplay';
import ApiUrlInput from '@/components/ApiUrlInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Building, Cpu, Database, Globe, Info, Landmark, Server, Shield } from 'lucide-react';

const Index = () => {
  const { currentLanguage, translate } = useLanguage();
  const { theme } = useTheme();
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [shouldPlayAudio, setShouldPlayAudio] = useState(false);

  const handleResponseReceived = (text: string, playAudio: boolean = false) => {
    setResponse(text);
    setShouldPlayAudio(playAudio);
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors",
      theme === 'dark' ? "bg-gray-900" : "bg-loan-gray-50"
    )}>
      <header className={cn(
        "py-4 px-6 border-b flex items-center justify-between",
        theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center">
          <h1 className={cn(
            "text-2xl font-bold mr-4",
            theme === 'dark' ? "text-white" : "text-loan-gray-800"
          )}>
            {translate('app.name')}
          </h1>
          <p className={cn(
            "hidden md:block text-sm",
            theme === 'dark' ? "text-gray-300" : "text-loan-gray-600"
          )}>
            {translate('app.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Information */}
          <div className="space-y-6">
            <div className={cn(
              "p-6 rounded-xl border shadow-sm",
              theme === 'dark' ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"
            )}>
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <Info className="mr-2" size={20} />
                {translate('about.title') || "About Loan Advisor"}
              </h2>
              <p className="mb-4">
                Loan Advisor is a multilingual chatbot designed to provide information about personal loans, 
                eligibility criteria, interest rates, and application processes. It supports multiple Indian 
                languages to make loan information accessible to everyone.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className={cn(
                  "p-4 rounded-lg border flex items-start",
                  theme === 'dark' ? "bg-gray-700 border-gray-600" : "bg-loan-gray-50 border-gray-200"
                )}>
                  <Globe className={cn("mr-3 mt-1", theme === 'dark' ? "text-blue-400" : "text-loan-blue")} size={18} />
                  <div>
                    <h3 className="font-medium mb-1">Multilingual Support</h3>
                    <p className="text-sm">Communicate in 11 Indian languages including Hindi, Bengali, Tamil, and more.</p>
                  </div>
                </div>
                <div className={cn(
                  "p-4 rounded-lg border flex items-start",
                  theme === 'dark' ? "bg-gray-700 border-gray-600" : "bg-loan-gray-50 border-gray-200"
                )}>
                  <Cpu className={cn("mr-3 mt-1", theme === 'dark' ? "text-purple-400" : "text-loan-indigo")} size={18} />
                  <div>
                    <h3 className="font-medium mb-1">AI-Powered</h3>
                    <p className="text-sm">Utilizes advanced RAG models to provide accurate and helpful loan information.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={cn(
              "p-6 rounded-xl border shadow-sm",
              theme === 'dark' ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"
            )}>
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <Server className="mr-2" size={20} />
                {translate('how.works') || "How It Works"}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                    theme === 'dark' ? "bg-blue-900 text-blue-300" : "bg-loan-blue/20 text-loan-blue"
                  )}>1</div>
                  <div>
                    <h3 className="font-medium">Custom API Integration</h3>
                    <p className="text-sm">The application connects to a custom API endpoint hosted on ngrok that uses RAG (Retrieval Augmented Generation) to provide accurate loan information.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                    theme === 'dark' ? "bg-blue-900 text-blue-300" : "bg-loan-blue/20 text-loan-blue"
                  )}>2</div>
                  <div>
                    <h3 className="font-medium">Multilingual Processing</h3>
                    <p className="text-sm">Your queries are translated to English, processed by the AI, and the responses are translated back to your preferred language.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                    theme === 'dark' ? "bg-blue-900 text-blue-300" : "bg-loan-blue/20 text-loan-blue"
                  )}>3</div>
                  <div>
                    <h3 className="font-medium">Voice & Text Support</h3>
                    <p className="text-sm">Interact using text or voice in your preferred language, with text-to-speech capabilities for responses.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={cn(
              "p-6 rounded-xl border shadow-sm",
              theme === 'dark' ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"
            )}>
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <Landmark className="mr-2" size={20} />
                {translate('bank.details') || "Bank Information"}
              </h2>
              <div className="space-y-4">
                <div className={cn(
                  "p-4 rounded-lg border",
                  theme === 'dark' ? "bg-gray-700 border-gray-600" : "bg-loan-gray-50 border-gray-200"
                )}>
                  <div className="flex items-center mb-2">
                    <Building className={cn("mr-2", theme === 'dark' ? "text-yellow-400" : "text-yellow-600")} size={18} />
                    <h3 className="font-medium">HDFC Bank</h3>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Personal Loan Interest Rate: 10.5% - 16%</li>
                    <li>• Loan Amount: ₹50,000 - ₹40,00,000</li>
                    <li>• Tenure: 12 - 60 months</li>
                    <li>• Processing Fee: Up to 2.5% of loan amount</li>
                  </ul>
                </div>
                <div className={cn(
                  "p-4 rounded-lg border",
                  theme === 'dark' ? "bg-gray-700 border-gray-600" : "bg-loan-gray-50 border-gray-200"
                )}>
                  <div className="flex items-center mb-2">
                    <Building className={cn("mr-2", theme === 'dark' ? "text-green-400" : "text-green-600")} size={18} />
                    <h3 className="font-medium">SBI</h3>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Personal Loan Interest Rate: 9.6% - 16.4%</li>
                    <li>• Loan Amount: ₹1,00,000 - ₹20,00,000</li>
                    <li>• Tenure: 6 - 72 months</li>
                    <li>• Processing Fee: 1% - 2% of loan amount</li>
                  </ul>
                </div>
                <div className={cn(
                  "p-4 rounded-lg border",
                  theme === 'dark' ? "bg-gray-700 border-gray-600" : "bg-loan-gray-50 border-gray-200"
                )}>
                  <div className="flex items-center mb-2">
                    <Building className={cn("mr-2", theme === 'dark' ? "text-blue-400" : "text-blue-600")} size={18} />
                    <h3 className="font-medium">IOB</h3>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Personal Loan Interest Rate: 11.15% - 15%</li>
                    <li>• Loan Amount: ₹50,000 - ₹15,00,000</li>
                    <li>• Tenure: 12 - 60 months</li>
                    <li>• Processing Fee: 0.5% - 1% of loan amount</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* API URL Input */}
            <ApiUrlInput />
          </div>

          {/* Right side - Chatbot */}
          <div className="space-y-6">
            <div className="h-[500px] min-h-[500px]">
              <ResponseDisplay 
                response={response} 
                loading={loading}
                shouldPlayAudio={shouldPlayAudio}
              />
            </div>
            
            <Tabs defaultValue="text" className={cn(
              "w-full rounded-xl overflow-hidden border shadow-sm",
              theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            )}>
              <TabsList className={cn(
                "w-full grid grid-cols-2 p-0 h-12",
                theme === 'dark' ? "bg-gray-700" : "bg-loan-gray-100"
              )}>
                <TabsTrigger 
                  value="text" 
                  className={cn(
                    "data-[state=active]:shadow-none rounded-none h-full",
                    theme === 'dark' 
                      ? "data-[state=active]:bg-gray-800 data-[state=active]:text-white" 
                      : "data-[state=active]:bg-white"
                  )}
                >
                  {translate('input.text')}
                </TabsTrigger>
                <TabsTrigger 
                  value="voice" 
                  className={cn(
                    "data-[state=active]:shadow-none rounded-none h-full",
                    theme === 'dark' 
                      ? "data-[state=active]:bg-gray-800 data-[state=active]:text-white" 
                      : "data-[state=active]:bg-white"
                  )}
                >
                  {translate('input.voice')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="p-4">
                <TextInput 
                  onResponseReceived={handleResponseReceived} 
                  setLoading={setLoading}
                />
              </TabsContent>
              <TabsContent value="voice" className="p-6 flex justify-center">
                <VoiceRecorder 
                  onResponseReceived={handleResponseReceived} 
                  setLoading={setLoading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
