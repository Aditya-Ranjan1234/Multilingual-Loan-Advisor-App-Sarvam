import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Volume2, Volume1, VolumeX, User, Bot, Trash2 } from 'lucide-react';
import { textToSpeech } from '@/services/sarvamAI';
import { Button } from '@/components/ui/button';
import { ConversationMessage, getConversationContext, clearConversation } from '@/services/api';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

type ConversationDisplayProps = {
  response: string;
  loading: boolean;
  shouldPlayAudio?: boolean;
};

const ConversationDisplay = ({ response, loading, shouldPlayAudio = false }: ConversationDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentLanguage, translate } = useLanguage();
  const { theme } = useTheme();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  
  // Load conversation history from localStorage
  useEffect(() => {
    const context = getConversationContext();
    setConversation(context.messages);
  }, [response]); // Reload when response changes
  
  // Scroll to bottom when conversation updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [conversation, loading]);

  useEffect(() => {
    // Clean up previous audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    // Generate new audio if we have a response and shouldPlayAudio is true
    if (response && !loading && shouldPlayAudio) {
      generateSpeech(response);
    }
    
    // Cleanup on unmount
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [response, loading, shouldPlayAudio]);

  const generateSpeech = async (text: string) => {
    if (!text) return;
    
    try {
      const audioBlob = await textToSpeech({
        input: text,
        languageCode: currentLanguage.code
      });
      
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      // Auto-play audio
      if (shouldPlayAudio) {
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
        audio.onpause = () => setIsPlaying(false);
        audio.play().catch(err => console.error('Audio playback failed:', err));
      }
    } catch (error) {
      console.error('Error generating speech:', error);
    }
  };

  const toggleAudio = (text: string) => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error('Audio playback failed:', err));
      }
    } else {
      generateSpeech(text);
    }
  };

  const handleClearConversation = () => {
    clearConversation();
    setConversation([]);
  };

  // Function to format message content with basic formatting
  const formatMessageContent = (content: string, role: 'user' | 'assistant') => {
    // For user messages, just return the plain text
    if (role === 'user') {
      return <div className="whitespace-pre-wrap">{content}</div>;
    }
    
    // For assistant messages, add some basic formatting
    // Replace ** text ** with bold text
    const formattedContent = content
      .split('\n')
      .map((line, i) => {
        // Apply bold formatting
        const boldFormatted = line.replace(
          /\*\*(.*?)\*\*/g, 
          '<strong>$1</strong>'
        );
        
        // Apply code formatting
        const codeFormatted = boldFormatted.replace(
          /`(.*?)`/g, 
          `<code class="${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} px-1 py-0.5 rounded text-xs font-mono">$1</code>`
        );
        
        return codeFormatted;
      })
      .join('<br />');
    
    return <div 
      className="whitespace-pre-wrap" 
      dangerouslySetInnerHTML={{ __html: formattedContent }} 
    />;
  };

  return (
    <div className={cn(
      "w-full rounded-xl overflow-hidden backdrop-blur-sm border shadow-sm transition-all",
      theme === 'dark' 
        ? "bg-gray-800/90 border-gray-700 text-white" 
        : "bg-white/90 border-gray-200"
    )}>
      <div className={cn(
        "flex justify-between items-center p-4 border-b",
        theme === 'dark' ? "border-gray-700" : "border-gray-100"
      )}>
        <h3 className={cn(
          "font-medium",
          theme === 'dark' ? "text-white" : "text-loan-gray-700"
        )}>{translate('conversation.title')}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearConversation}
          className={cn(
            "flex items-center gap-1",
            theme === 'dark' ? "text-gray-300 hover:text-white" : "text-loan-gray-500 hover:text-loan-gray-700"
          )}
        >
          <Trash2 size={14} />
          <span>{translate('conversation.clear')}</span>
        </Button>
      </div>
      
      <div 
        className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto" 
        ref={containerRef}
      >
        {conversation.length === 0 ? (
          <div className={cn(
            "h-full flex items-center justify-center text-center p-6",
            theme === 'dark' ? "text-gray-400" : "text-loan-gray-400"
          )}>
            {translate('conversation.empty') || 'Start a conversation by typing a message below'}
          </div>
        ) : (
          <div className="space-y-4">
            {conversation.map((message, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex gap-3 p-3 rounded-lg",
                  message.role === 'user' 
                    ? "ml-auto max-w-[80%] bg-loan-blue/10 text-loan-gray-800" 
                    : "max-w-[90%]",
                  message.role === 'assistant' && theme === 'dark'
                    ? "bg-gray-700 border-gray-600 text-white shadow-sm"
                    : message.role === 'assistant'
                    ? "bg-white border border-gray-200 shadow-sm"
                    : "",
                  message.role === 'user' && theme === 'dark'
                    ? "bg-loan-blue/30 text-white"
                    : ""
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  message.role === 'user' ? "bg-loan-blue/20" : "bg-loan-indigo/20"
                )}>
                  {message.role === 'user' 
                    ? <User size={16} className="text-loan-blue" /> 
                    : <Bot size={16} className="text-loan-indigo" />
                  }
                </div>
                <div className="flex-1">
                  <div className={cn(
                    "text-sm",
                    theme === 'dark' && message.role === 'assistant' ? "text-white" : "",
                    theme === 'dark' && message.role === 'user' ? "text-white" : ""
                  )}>
                    {formatMessageContent(message.content, message.role)}
                  </div>
                  {message.role === 'assistant' && (
                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAudio(message.content)}
                        className="h-6 w-6 p-0 rounded-full"
                      >
                        {isPlaying ? (
                          <VolumeX size={14} className={theme === 'dark' ? "text-gray-300" : "text-loan-gray-500"} />
                        ) : (
                          <Volume1 size={14} className={theme === 'dark' ? "text-gray-300" : "text-loan-gray-500"} />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className={cn(
                "flex gap-3 p-3 rounded-lg max-w-[90%]",
                theme === 'dark'
                  ? "bg-gray-700 border-gray-600 shadow-sm"
                  : "bg-white border border-gray-200 shadow-sm"
              )}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-loan-indigo/20 flex items-center justify-center">
                  <Bot size={16} className="text-loan-indigo" />
                </div>
                <div className="flex-1">
                  <div className={cn(
                    "text-sm",
                    theme === 'dark' ? "text-gray-300" : "text-loan-gray-500"
                  )}>{translate('conversation.processing') || 'Processing your request...'}</div>
                  <div className="mt-1 flex space-x-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full animate-bounce",
                      theme === 'dark' ? "bg-gray-500" : "bg-loan-gray-300"
                    )} style={{ animationDelay: '0ms' }}></div>
                    <div className={cn(
                      "w-2 h-2 rounded-full animate-bounce",
                      theme === 'dark' ? "bg-gray-500" : "bg-loan-gray-300"
                    )} style={{ animationDelay: '150ms' }}></div>
                    <div className={cn(
                      "w-2 h-2 rounded-full animate-bounce",
                      theme === 'dark' ? "bg-gray-500" : "bg-loan-gray-300"
                    )} style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationDisplay; 