import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Loader2, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'bot';
  content: string;
};

type ResponseDisplayProps = {
  response: string;
  loading: boolean;
  shouldPlayAudio?: boolean;
};

const ResponseDisplay = ({ response, loading, shouldPlayAudio = false }: ResponseDisplayProps) => {
  const { currentLanguage, translate } = useLanguage();
  const { theme } = useTheme();
  const [conversation, setConversation] = useState<Message[]>([]);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Add new messages to the conversation
  useEffect(() => {
    if (response && !loading) {
      setConversation(prev => [...prev, { role: 'bot', content: response }]);
    }
  }, [response, loading]);

  // Scroll to the bottom when conversation updates
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, loading]);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setAudioPlaying(false);
        setCurrentPlayingIndex(null);
      };
    }
  }, []);

  // Play audio for a specific message
  const playAudio = async (text: string, index: number) => {
    if (audioRef.current) {
      try {
        // Stop current audio if playing
        if (audioPlaying) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setAudioPlaying(false);
          
          // If clicking on the same message that's already playing, just stop it
          if (currentPlayingIndex === index) {
            setCurrentPlayingIndex(null);
            return;
          }
        }
        
        setAudioPlaying(true);
        setCurrentPlayingIndex(index);
        
        // Create a URL for the audio
        const url = `/api/tts?text=${encodeURIComponent(text)}&lang=${currentLanguage.code}`;
        
        // Set the source and play
        audioRef.current.src = url;
        await audioRef.current.play();
      } catch (error) {
        console.error('Error playing audio:', error);
        setAudioPlaying(false);
        setCurrentPlayingIndex(null);
      }
    }
  };

  // Listen for userMessage events
  useEffect(() => {
    const handleUserMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.text) {
        setConversation(prev => [...prev, { role: 'user', content: event.detail.text }]);
      }
    };

    document.addEventListener('userMessage', handleUserMessage as EventListener);
    return () => document.removeEventListener('userMessage', handleUserMessage as EventListener);
  }, []);

  // Format text with basic styling
  const formatText = (text: string) => {
    // Replace ** text ** with bold text
    const withBold = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace * text * with italic text
    const withItalic = withBold.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace ` text ` with code text
    const withCode = withItalic.replace(/`(.*?)`/g, 
      `<code class="${theme === 'dark' ? 'bg-gray-600 text-gray-100' : 'bg-gray-100 text-gray-800'} px-1 py-0.5 rounded text-xs font-mono">$1</code>`
    );
    
    // Replace URLs with links
    const withLinks = withCode.replace(
      /(https?:\/\/[^\s]+)/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">$1</a>'
    );
    
    // Replace newlines with <br>
    return withLinks.split('\n').join('<br />');
  };

  return (
    <div className="h-full flex flex-col">
      <div className={cn(
        "p-3 border-b flex items-center justify-between",
        theme === 'dark' ? "bg-gray-700 border-gray-600" : "bg-loan-gray-50 border-gray-200"
      )}>
        <h2 className={cn(
          "text-sm font-medium",
          theme === 'dark' ? "text-white" : "text-loan-gray-800"
        )}>
          {translate('conversation.title') || 'Conversation'}
        </h2>
        <div className={cn(
          "text-xs px-2 py-0.5 rounded-full",
          theme === 'dark' ? "bg-blue-900 text-blue-300" : "bg-loan-blue/20 text-loan-blue"
        )}>
          {currentLanguage.name}
        </div>
      </div>
      
      <div className={cn(
        "flex-1 overflow-y-auto p-3 space-y-3",
        theme === 'dark' ? "bg-gray-800" : "bg-white"
      )}>
        {conversation.length === 0 ? (
          <div className={cn(
            "h-full flex flex-col items-center justify-center text-center p-4",
            theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"
          )}>
            <p className="mb-2 text-base font-medium">
              {translate('conversation.empty.title') || 'Welcome to Loan Advisor'}
            </p>
            <p className="text-sm max-w-md">
              {translate('conversation.empty.subtitle') || 
                'Ask me anything about personal loans, eligibility, interest rates, or application processes in your preferred language.'}
            </p>
          </div>
        ) : (
          conversation.map((message, index) => (
            <div 
              key={index} 
              className={cn(
                "flex",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] rounded-lg p-2 text-sm",
                message.role === 'user' 
                  ? theme === 'dark' 
                    ? "bg-blue-600 text-white" 
                    : "bg-loan-blue text-white"
                  : theme === 'dark'
                    ? "bg-gray-700 text-gray-100"
                    : "bg-loan-gray-100 text-loan-gray-800"
              )}>
                {message.role === 'user' ? (
                  <p>{message.content}</p>
                ) : (
                  <div className="space-y-2">
                    <div 
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: formatText(message.content) }}
                    />
                    <div className="flex justify-end items-center mt-1">
                      <button 
                        onClick={() => playAudio(message.content, index)}
                        className={cn(
                          "p-1 rounded-full hover:bg-opacity-20",
                          theme === 'dark' 
                            ? "hover:bg-gray-600" 
                            : "hover:bg-gray-200",
                          currentPlayingIndex === index && audioPlaying
                            ? theme === 'dark' ? "text-blue-400" : "text-loan-blue"
                            : theme === 'dark' ? "text-gray-400" : "text-gray-500"
                        )}
                        title={audioPlaying && currentPlayingIndex === index ? "Stop audio" : "Play audio"}
                      >
                        {audioPlaying && currentPlayingIndex === index ? (
                          <VolumeX size={16} />
                        ) : (
                          <Volume2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex justify-start">
            <div className={cn(
              "max-w-[85%] rounded-lg p-3",
              theme === 'dark' ? "bg-gray-700" : "bg-loan-gray-100"
            )}>
              <Loader2 className={cn(
                "h-4 w-4 animate-spin",
                theme === 'dark' ? "text-blue-400" : "text-loan-blue"
              )} />
            </div>
          </div>
        )}
        
        <div ref={conversationEndRef} />
      </div>
    </div>
  );
};

export default ResponseDisplay;

