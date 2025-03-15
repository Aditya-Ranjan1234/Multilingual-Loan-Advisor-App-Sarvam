import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApiUrl } from '@/contexts/ApiUrlContext';
import { submitAudioQuery } from '@/services/api';
import { speechToText, translateText } from '@/services/sarvamAI';
import { toast } from '@/components/ui/use-toast';

type VoiceRecorderProps = {
  onResponseReceived: (response: string, shouldPlayAudio: boolean) => void;
  setLoading: (loading: boolean) => void;
  toggleCalculator?: () => void;
};

const VoiceRecorder = ({ onResponseReceived, setLoading, toggleCalculator }: VoiceRecorderProps) => {
  const { currentLanguage, translate, translateDynamic } = useLanguage();
  const { customApiUrl } = useApiUrl();
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

  // Check if text contains eligibility-related keywords
  const checkForEligibilityKeywords = async (inputText: string): Promise<boolean> => {
    try {
      // If the text is already in English, check directly
      if (currentLanguage.code === 'en-IN') {
        const lowerText = inputText.toLowerCase();
        return lowerText.includes('eligib') || 
               lowerText.includes('qualify') || 
               lowerText.includes('calculator') ||
               lowerText.includes('loan amount') ||
               lowerText.includes('how much loan') ||
               lowerText.includes('how much can i borrow') ||
               lowerText.includes('loan limit');
      }
      
      // Otherwise, translate to English first and then check
      const translatedToEnglish = await translateText({
        text: inputText,
        sourceLanguage: currentLanguage.code,
        targetLanguage: 'en-IN'
      });
      
      const lowerTranslated = translatedToEnglish.toLowerCase();
      return lowerTranslated.includes('eligib') || 
             lowerTranslated.includes('qualify') || 
             lowerTranslated.includes('calculator') ||
             lowerTranslated.includes('loan amount') ||
             lowerTranslated.includes('how much loan') ||
             lowerTranslated.includes('how much can i borrow') ||
             lowerTranslated.includes('loan limit');
    } catch (error) {
      console.error('Error checking eligibility keywords:', error);
      return false;
    }
  };

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
            
            // First, convert speech to text in the user's language
            let transcribedText = "";
            try {
              transcribedText = await speechToText({
                audio: audioBlob,
                languageCode: currentLanguage.code
              });
              console.log('Transcribed text:', transcribedText);
            } catch (transcriptionError) {
              console.error('Error transcribing audio:', transcriptionError);
              // If transcription fails, we'll still have a default response from speechToText
            }
            
            // Check if the transcribed text is related to loan eligibility
            const isEligibilityQuery = await checkForEligibilityKeywords(transcribedText);
            
            // Then, submit the transcribed text to get a response
            setLoading(true);
            const result = await submitAudioQuery({
              audio: audioBlob,
              language: currentLanguage.code,
              text: transcribedText // Pass the transcribed text
            }, customApiUrl);
            
            // If it's an eligibility query, show the calculator and add a suggestion
            if (isEligibilityQuery && toggleCalculator) {
              // Show the calculator
              toggleCalculator();
              
              // Add a suggestion to use the calculator with a prominent message
              const calculatorSuggestion = await translateDynamic(
                "I see you're asking about loan eligibility. I've opened our Loan Eligibility Calculator for you above. Please use it to get a personalized estimate based on your income and other factors.",
                currentLanguage.code
              );
              
              // Combine the suggestion with the original response
              const combinedResponse = `**${calculatorSuggestion}**\n\n${result.text}`;
              onResponseReceived(combinedResponse, true);
            } else {
              // Show the response with audio playback enabled
              onResponseReceived(result.text, true);
            }
          } catch (error) {
            console.error('Error processing audio:', error);
            
            // Instead of showing an error toast, provide a helpful response
            const errorMessage = await translateDynamic(
              "I couldn't process your audio properly, but I'm here to help with your loan-related questions. Please try again or type your question.",
              currentLanguage.code
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
    <div className="flex flex-col items-center">
      {permissionDenied ? (
        <div className="text-red-500 mb-4 flex items-center">
          <MicOff size={18} className="mr-2" />
          {translate('voice.denied') || 'Microphone access denied'}
        </div>
      ) : processingAudio ? (
        <div className="text-loan-blue mb-4 flex items-center">
          <Loader2 size={18} className="mr-2 animate-spin" />
          {translate('voice.processing') || 'Processing audio...'}
        </div>
      ) : isRecording ? (
        <div className="text-loan-blue mb-4 animate-pulse">
          {translate('voice.recording').replace('{time}', formatTime(recordingTime)) || `Recording... ${formatTime(recordingTime)}`}
        </div>
      ) : (
        <div className="text-loan-gray-500 mb-4">
          {translate('voice.prompt') || 'Click to record'}
        </div>
      )}
      
      <Button
        onClick={toggleRecording}
        disabled={permissionDenied || processingAudio}
        className={`rounded-full w-16 h-16 p-0 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-loan-blue hover:bg-loan-blue/90'
        }`}
        aria-label={isRecording ? (translate('voice.stop') || 'Stop recording') : (translate('voice.start') || 'Start recording')}
      >
        <Mic size={24} className="text-white" />
      </Button>
    </div>
  );
};

export default VoiceRecorder;
