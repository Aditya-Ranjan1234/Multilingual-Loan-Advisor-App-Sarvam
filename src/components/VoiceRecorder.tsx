import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useApiUrl } from '@/contexts/ApiUrlContext';
import { Mic, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sendMessage } from '@/services/api';
import { speechToText } from '@/services/sarvamAI';

type VoiceRecorderProps = {
  onResponseReceived: (text: string, playAudio: boolean) => void;
  setLoading: (loading: boolean) => void;
};

const VoiceRecorder = ({ onResponseReceived, setLoading }: VoiceRecorderProps) => {
  const { currentLanguage } = useLanguage();
  const { theme } = useTheme();
  const { apiUrl } = useApiUrl();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;
    
    try {
      setIsProcessing(true);
      setLoading(true);
      
      // First, use Sarvam API to convert speech to text
      const transcribedText = await speechToText({
        audio: audioBlob,
        languageCode: currentLanguage.code
      });
      
      // Dispatch an event to add the user message to the conversation
      document.dispatchEvent(new CustomEvent('userMessage', { 
        detail: { 
          text: transcribedText || "🎤 Voice message", 
          audioUrl: audioUrl 
        } 
      }));
      
      if (transcribedText) {
        // Now send the transcribed text to the custom API
        const response = await sendMessage(transcribedText, apiUrl, currentLanguage.code);
        
        // Show response
        onResponseReceived(response.response, false);
      } else {
        // Handle case where speech-to-text failed
        onResponseReceived('Sorry, I could not understand the audio. Please try again or type your message.', false);
      }
      
      // Reset audio state
      setAudioBlob(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      onResponseReceived('Sorry, there was an error processing your audio. Please try again later.', false);
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center">
      {!isRecording && !audioBlob && (
        <button
          onClick={startRecording}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
            theme === 'dark'
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-loan-blue hover:bg-loan-blue/90 text-white"
          )}
        >
          <Mic size={24} />
        </button>
      )}
      
      {isRecording && (
        <div className="flex flex-col items-center">
          <div className="text-center mb-2">
            <div className={cn(
              "text-lg font-medium",
              theme === 'dark' ? "text-white" : "text-loan-gray-800"
            )}>
              {formatTime(recordingTime)}
            </div>
            <div className={cn(
              "text-sm",
              theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"
            )}>
              Recording...
            </div>
          </div>
          
          <button
            onClick={stopRecording}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
              theme === 'dark'
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            )}
          >
            <Square size={24} />
          </button>
        </div>
      )}
      
      {!isRecording && audioBlob && (
        <div className="flex flex-col items-center">
          <div className="text-center mb-2">
            <div className={cn(
              "text-sm",
              theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"
            )}>
              {isProcessing ? 'Processing audio...' : 'Recording complete'}
            </div>
          </div>
          
          <div className="flex space-x-4">
            {isProcessing ? (
              <div className="flex items-center">
                <Loader2 className="animate-spin mr-2" size={20} />
                <span>Converting speech to text...</span>
              </div>
            ) : (
              <>
                <button
                  onClick={startRecording}
                  className={cn(
                    "px-4 py-2 rounded-lg transition-colors",
                    theme === 'dark'
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-loan-gray-100 hover:bg-loan-gray-200 text-loan-gray-800"
                  )}
                >
                  Record Again
                </button>
                
                <button
                  onClick={handleSubmit}
                  className={cn(
                    "px-4 py-2 rounded-lg transition-colors",
                    theme === 'dark'
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-loan-blue hover:bg-loan-blue/90 text-white"
                  )}
                >
                  Send
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
