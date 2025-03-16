import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Loader2, Volume2, VolumeX, Trash2, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { textToSpeechUrl } from '@/services/sarvamAI';

type Message = {
  role: 'user' | 'bot';
  content: string;
  audioUrl?: string;
  isStreaming?: boolean;
  fullContent?: string;
};

type ResponseDisplayProps = {
  response: string;
  loading: boolean;
  shouldPlayAudio?: boolean;
  onClearConversation?: () => void;
};

const CONVERSATION_STORAGE_KEY = 'loan-advisor-conversation';

const ResponseDisplay = ({ 
  response, 
  loading, 
  shouldPlayAudio = false,
  onClearConversation 
}: ResponseDisplayProps) => {
  const { currentLanguage, translate } = useLanguage();
  const { theme } = useTheme();
  const [conversation, setConversation] = useState<Message[]>([]);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(400); // Default height
  const resizeRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const startHeightRef = useRef<number>(height);

  // Load conversation from localStorage on initial render
  useEffect(() => {
    try {
      const savedConversation = localStorage.getItem(CONVERSATION_STORAGE_KEY);
      if (savedConversation) {
        setConversation(JSON.parse(savedConversation));
      }
    } catch (error) {
      console.error('Error loading conversation from localStorage:', error);
    }
  }, []);

  // Add new messages to the conversation with streaming effect
  useEffect(() => {
    if (response && !loading) {
      // Check if we already have a bot message that's streaming
      const lastMessage = conversation[conversation.length - 1];
      
      if (lastMessage && lastMessage.role === 'bot' && lastMessage.isStreaming) {
        // Update the existing streaming message
        setConversation(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: response,
            isStreaming: false,
            fullContent: response
          };
          
          // Save to localStorage
          try {
            localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(updated));
          } catch (error) {
            console.error('Error saving conversation to localStorage:', error);
          }
          
          return updated;
        });
      } else {
        // Start a new streaming message
        const newMessage: Message = { 
          role: 'bot', 
          content: '', 
          isStreaming: true,
          fullContent: response
        };
        
        setConversation(prev => {
          const updatedConversation = [...prev, newMessage];
          // Save to localStorage
          try {
            localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(updatedConversation));
          } catch (error) {
            console.error('Error saving conversation to localStorage:', error);
          }
          return updatedConversation;
        });
        
        // Start streaming the content
        streamText(response);
      }
    }
  }, [response, loading]);

  // Function to stream text character by character
  const streamText = (text: string) => {
    let index = 0;
    const streamInterval = setInterval(() => {
      if (index <= text.length) {
        setConversation(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          
          if (lastIndex >= 0 && updated[lastIndex].isStreaming) {
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: text.substring(0, index)
            };
            
            // Save to localStorage
            try {
              localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(updated));
            } catch (error) {
              console.error('Error saving conversation to localStorage:', error);
            }
          }
          
          return updated;
        });
        
        index++;
      } else {
        // Streaming complete
        setConversation(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          
          if (lastIndex >= 0 && updated[lastIndex].isStreaming) {
            updated[lastIndex] = {
              ...updated[lastIndex],
              isStreaming: false
            };
            
            // Save to localStorage
            try {
              localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(updated));
            } catch (error) {
              console.error('Error saving conversation to localStorage:', error);
            }
          }
          
          return updated;
        });
        
        clearInterval(streamInterval);
      }
    }, 15); // Adjust speed as needed
  };

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

  // Setup resize handlers
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      startYRef.current = e.clientY;
      startHeightRef.current = height;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (startYRef.current !== null) {
        const deltaY = e.clientY - startYRef.current;
        const newHeight = Math.max(200, startHeightRef.current + deltaY);
        setHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      startYRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const resizeHandle = resizeRef.current;
    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (resizeHandle) {
        resizeHandle.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [height]);

  // Play audio for a specific message
  const playAudio = async (text: string, index: number, audioUrl?: string) => {
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
        
        // Use provided audioUrl if available (for user messages with recorded audio)
        if (audioUrl) {
          audioRef.current.src = audioUrl;
          await audioRef.current.play();
          return;
        }
        
        // For bot messages, use Sarvam API for text-to-speech
        const ttsUrl = await textToSpeechUrl(text, currentLanguage.code);
        
        // Set the source and play
        audioRef.current.src = ttsUrl;
        await audioRef.current.play();
        
        // Clean up the blob URL when audio finishes playing
        audioRef.current.onended = () => {
          URL.revokeObjectURL(ttsUrl);
          setAudioPlaying(false);
          setCurrentPlayingIndex(null);
        };
      } catch (error) {
        console.error('Error playing audio:', error);
        setAudioPlaying(false);
        setCurrentPlayingIndex(null);
        toast({
          title: "Audio Playback Failed",
          description: "Could not play the audio. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Listen for userMessage events
  useEffect(() => {
    const handleUserMessage = (event: CustomEvent) => {
      if (event.detail && event.detail.text) {
        const newMessage: Message = { 
          role: 'user', 
          content: event.detail.text,
          audioUrl: event.detail.audioUrl
        };
        
        setConversation(prev => {
          const updatedConversation = [...prev, newMessage];
          // Save to localStorage
          try {
            localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(updatedConversation));
          } catch (error) {
            console.error('Error saving conversation to localStorage:', error);
          }
          return updatedConversation;
        });
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

  // Clear conversation
  const clearConversation = () => {
    setConversation([]);
    localStorage.removeItem(CONVERSATION_STORAGE_KEY);
    if (onClearConversation) {
      onClearConversation();
    }
  };

  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={cn(
        "flex flex-col border rounded-lg overflow-hidden transition-all duration-300",
        theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
        isExpanded ? "fixed inset-4 z-50" : "relative"
      )}
      style={{ height: isExpanded ? 'auto' : `${height}px` }}
    >
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
        <div className="flex items-center space-x-2">
          <div className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            theme === 'dark' ? "bg-blue-900 text-blue-300" : "bg-loan-blue/20 text-loan-blue"
          )}>
            {currentLanguage.name}
          </div>
          {conversation.length > 0 && (
            <button
              onClick={clearConversation}
              className={cn(
                "p-1 rounded-full hover:bg-opacity-20 flex items-center",
                theme === 'dark' 
                  ? "hover:bg-gray-600 text-gray-300" 
                  : "hover:bg-gray-200 text-gray-500"
              )}
              title={translate('conversation.clear') || "Clear conversation"}
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={toggleExpanded}
            className={cn(
              "p-1 rounded-full hover:bg-opacity-20 flex items-center",
              theme === 'dark' 
                ? "hover:bg-gray-600 text-gray-300" 
                : "hover:bg-gray-200 text-gray-500"
            )}
            title={isExpanded ? translate('ui.minimize') : translate('ui.maximize')}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
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
                  <div className="space-y-2">
                    <p>{message.content}</p>
                    {message.audioUrl && (
                      <div className="flex justify-end items-center mt-1">
                        <button 
                          onClick={() => playAudio(message.content, index, message.audioUrl)}
                          className={cn(
                            "p-1 rounded-full hover:bg-opacity-20",
                            theme === 'dark' 
                              ? "hover:bg-blue-800" 
                              : "hover:bg-blue-700",
                            currentPlayingIndex === index && audioPlaying
                              ? "text-white" 
                              : "text-blue-200"
                          )}
                          title={audioPlaying && currentPlayingIndex === index ? translate('audio.stop') : translate('audio.replay')}
                        >
                          {audioPlaying && currentPlayingIndex === index ? (
                            <VolumeX size={16} />
                          ) : (
                            <Volume2 size={16} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div 
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: formatText(message.content) }}
                    />
                    {message.isStreaming && (
                      <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" title={translate('ui.typing')}></span>
                    )}
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
                        title={audioPlaying && currentPlayingIndex === index ? translate('audio.stop') : translate('audio.listen')}
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
              <span className={theme === 'dark' ? "text-gray-300 ml-2 text-sm" : "text-loan-gray-600 ml-2 text-sm"}>
                {translate('processing') || 'Processing...'}
              </span>
            </div>
          </div>
        )}
        
        <div ref={conversationEndRef} />
      </div>
      
      {!isExpanded && (
        <div 
          ref={resizeRef}
          className={cn(
            "h-2 cursor-ns-resize w-full",
            theme === 'dark' ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
          )}
          title={translate('ui.resize')}
        />
      )}
    </div>
  );
};

export default ResponseDisplay;

