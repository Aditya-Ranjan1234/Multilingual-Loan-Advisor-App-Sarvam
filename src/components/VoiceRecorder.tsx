import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApiUrl } from '@/contexts/ApiUrlContext';
import { submitAudioQuery } from '@/services/api';
import { speechToText } from '@/services/sarvamAI';
import { toast } from '@/components/ui/use-toast';

type VoiceRecorderProps = {
  onResponseReceived: (response: string, shouldPlayAudio: boolean) => void;
  setLoading: (loading: boolean) => void;
};

const VoiceRecorder = ({ onResponseReceived, setLoading }: VoiceRecorderProps) => {
  const { currentLanguage, translate } = useLanguage();
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
            const transcribedText = await speechToText({
              audio: audioBlob,
              languageCode: currentLanguage.code
            });
            
            // Then, submit the transcribed text to get a response
            setLoading(true);
            const result = await submitAudioQuery({
              audio: audioBlob,
              language: currentLanguage.code,
              text: transcribedText // Pass the transcribed text
            }, customApiUrl);
            
            // Show the response with audio playback enabled
            onResponseReceived(result.text, true);
          } catch (error) {
            console.error('Error processing audio:', error);
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
