import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import ResponseDisplay from './ResponseDisplay';
import TextInput from './TextInput';
import VoiceRecorder from './VoiceRecorder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

const FloatingChatbot = () => {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [shouldPlayAudio, setShouldPlayAudio] = useState(false);

  // Open the chatbot on first visit after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleResponseReceived = (text: string, playAudio: boolean = false) => {
    setResponse(text);
    setShouldPlayAudio(false);
    // Ensure the chat is open when a response is received
    setIsOpen(true);
    setIsMinimized(false);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className={cn(
            "flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all",
            theme === 'dark' ? "bg-blue-600 hover:bg-blue-700" : "bg-loan-blue hover:bg-loan-blue/90"
          )}
        >
          <MessageCircle size={24} className="text-white" />
        </button>
      )}

      {/* Chat interface */}
      {isOpen && (
        <div
          className={cn(
            "flex flex-col rounded-xl shadow-xl transition-all duration-300 transform",
            isMinimized ? "w-72 h-16" : "w-[380px] h-[600px]",
            theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
          )}
        >
          {/* Chat header */}
          <div
            className={cn(
              "flex items-center justify-between p-4 border-b cursor-pointer",
              theme === 'dark' ? "bg-gray-700 border-gray-600" : "bg-loan-blue text-white"
            )}
            onClick={isMinimized ? toggleMinimize : undefined}
          >
            <div className="flex items-center">
              <MessageCircle size={20} className={theme === 'dark' ? "text-blue-400 mr-2" : "text-white mr-2"} />
              <h3 className={theme === 'dark' ? "font-medium text-white" : "font-medium"}>
                {translate('app.name') || "Loan Advisor"}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              {!isMinimized && (
                <button onClick={toggleMinimize} className="text-gray-100 hover:text-white">
                  <Minimize2 size={18} />
                </button>
              )}
              {isMinimized && (
                <button onClick={toggleMinimize} className="text-gray-100 hover:text-white">
                  <Maximize2 size={18} />
                </button>
              )}
              <button onClick={toggleChat} className="text-gray-100 hover:text-white">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat content */}
          {!isMinimized && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <ResponseDisplay
                  response={response}
                  loading={loading}
                  shouldPlayAudio={shouldPlayAudio}
                />
              </div>

              <div className="p-3 border-t">
                <Tabs defaultValue="text" className={cn(
                  "w-full",
                  theme === 'dark' ? "border-gray-700" : "border-gray-200"
                )}>
                  <TabsList className={cn(
                    "w-full grid grid-cols-2 h-10 mb-2",
                    theme === 'dark' ? "bg-gray-700" : "bg-loan-gray-100"
                  )}>
                    <TabsTrigger
                      value="text"
                      className={cn(
                        "data-[state=active]:shadow-none rounded-none h-full",
                        theme === 'dark'
                          ? "data-[state=active]:bg-gray-600 data-[state=active]:text-white"
                          : "data-[state=active]:bg-white"
                      )}
                    >
                      {translate('input.text') || "Text"}
                    </TabsTrigger>
                    <TabsTrigger
                      value="voice"
                      className={cn(
                        "data-[state=active]:shadow-none rounded-none h-full",
                        theme === 'dark'
                          ? "data-[state=active]:bg-gray-600 data-[state=active]:text-white"
                          : "data-[state=active]:bg-white"
                      )}
                    >
                      {translate('input.voice') || "Voice"}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-0">
                    <TextInput
                      onResponseReceived={handleResponseReceived}
                      setLoading={setLoading}
                    />
                  </TabsContent>
                  <TabsContent value="voice" className="mt-0 flex justify-center">
                    <VoiceRecorder
                      onResponseReceived={handleResponseReceived}
                      setLoading={setLoading}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot; 