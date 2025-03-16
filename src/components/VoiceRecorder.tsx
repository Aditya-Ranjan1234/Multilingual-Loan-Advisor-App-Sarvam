import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApiUrl } from '@/contexts/ApiUrlContext';
import { submitAudioQuery } from '@/services/api';
import { speechToText } from '@/services/sarvamAI';
import { toast } from '@/components/ui/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

type VoiceRecorderProps = {
  onResponseReceived: (response: string, shouldPlayAudio: boolean) => void;
  setLoading: (loading: boolean) => void;
};

const VoiceRecorder = ({ onResponseReceived, setLoading }: VoiceRecorderProps) => {
  const { currentLanguage, translate, translateDynamic } = useLanguage();
  const { customApiUrl } = useApiUrl();
  const { theme } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [processingAudio, setProcessingAudio] = useState(false);

  // Request microphone permission
  useEffect(() => {
    // Clean up when component unmounts
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  // Handle recording timer
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    setAudioChunks([]);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        if (audioBlob.size > 0) {
          try {
            setProcessingAudio(true);
            
            // Create an object URL for the audio blob for playback
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // First, convert speech to text in the user's language
            let transcribedText = "";
            try {
              transcribedText = await speechToText({
                audio: audioBlob,
                languageCode: currentLanguage.code
              });
              console.log('Transcribed text:', transcribedText);
              
              // Dispatch an event to add the user message to the conversation
              if (transcribedText) {
                document.dispatchEvent(new CustomEvent('userMessage', { 
                  detail: { 
                    text: transcribedText,
                    audioUrl: audioUrl
                  } 
                }));
              }
            } catch (transcriptionError) {
              console.error('Error transcribing audio:', transcriptionError);
              // If transcription fails, we'll still have a default response from speechToText
            }
            
            // Then, submit the transcribed text to get a response
            setLoading(true);
            const result = await submitAudioQuery(
              audioBlob,
              customApiUrl,
              currentLanguage,
              transcribedText // Pass the transcribed text
            );
            
            // Show the response with audio playback disabled
            onResponseReceived(result.text, false);
          } catch (error) {
            console.error('Error processing audio:', error);
            
            // Instead of showing an error toast, provide a helpful response
            const errorMessage = await translateDynamic(
              "I couldn't process your audio properly, but I'm here to help with your loan-related questions. Please try again or type your question."
            );
            
            onResponseReceived(errorMessage, false);
            
            toast({
              title: translate('error.title') || "Error",
              description: translate('error.audio') || "Could not process your audio. Please try again.",
              variant: "destructive",
            });
          } finally {
            setProcessingAudio(false);
            setLoading(false);
          }
        }
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setPermissionDenied(false);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setPermissionDenied(true);
      toast({
        title: translate('error.title') || "Error",
        description: translate('error.microphone') || "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center p-4",
      theme === 'dark' ? "text-gray-200" : "text-loan-gray-800"
    )}>
      {permissionDenied ? (
        <div className={cn(
          "mb-4 flex items-center",
          theme === 'dark' ? "text-red-400" : "text-red-500"
        )}>
          <MicOff size={18} className="mr-2" />
          {translate('voice.denied') || 'Microphone access denied'}
        </div>
      ) : processingAudio ? (
        <div className={cn(
          "mb-4 flex items-center",
          theme === 'dark' ? "text-blue-400" : "text-loan-blue"
        )}>
          <Loader2 size={18} className="mr-2 animate-spin" />
          {translate('voice.processing') || 'Processing audio...'}
        </div>
      ) : isRecording ? (
        <div className={cn(
          "mb-4 animate-pulse",
          theme === 'dark' ? "text-blue-400" : "text-loan-blue"
        )}>
          {translate('voice.recording').replace('{time}', formatTime(recordingTime)) || `Recording... ${formatTime(recordingTime)}`}
        </div>
      ) : (
        <div className={cn(
          "mb-4",
          theme === 'dark' ? "text-gray-400" : "text-loan-gray-500"
        )}>
          {translate('voice.prompt') || 'Click to record'}
        </div>
      )}
      
      <Button
        onClick={toggleRecording}
        disabled={permissionDenied || processingAudio}
        className={cn(
          "rounded-full w-16 h-16 p-0",
          isRecording 
            ? theme === 'dark' ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
            : theme === 'dark' ? "bg-blue-600 hover:bg-blue-700" : "bg-loan-blue hover:bg-loan-blue/90"
        )}
        aria-label={isRecording ? (translate('voice.stop') || 'Stop recording') : (translate('voice.start') || 'Start recording')}
      >
        <Mic size={24} className="text-white" />
      </Button>
    </div>
  );
};

export default VoiceRecorder;
