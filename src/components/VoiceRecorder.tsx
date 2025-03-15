
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { submitAudioQuery } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

type VoiceRecorderProps = {
  onResponseReceived: (response: string) => void;
  setLoading: (loading: boolean) => void;
};

const VoiceRecorder = ({ onResponseReceived, setLoading }: VoiceRecorderProps) => {
  const { currentLanguage } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);

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
            setLoading(true);
            const response = await submitAudioQuery({
              audio: audioBlob,
              language: currentLanguage.code,
            });
            onResponseReceived(response);
          } catch (error) {
            console.error('Error processing audio:', error);
          } finally {
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
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice recording.",
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
      <Button
        onClick={toggleRecording}
        className={`rounded-full w-14 h-14 flex items-center justify-center transition-all ${
          isRecording 
            ? 'bg-loan-red hover:bg-loan-red/90 animate-pulse-soft' 
            : 'bg-loan-blue hover:bg-loan-blue/90'
        }`}
        disabled={permissionDenied}
      >
        {isRecording ? (
          <MicOff size={24} className="text-white" />
        ) : (
          <Mic size={24} className="text-white" />
        )}
      </Button>
      
      {isRecording && (
        <div className="mt-2 text-sm font-medium text-loan-red animate-pulse-soft">
          Recording... {formatTime(recordingTime)}
        </div>
      )}
      
      {!isRecording && !permissionDenied && (
        <div className="mt-2 text-xs text-gray-500">
          Click to record in {currentLanguage.name}
        </div>
      )}
      
      {permissionDenied && (
        <div className="mt-2 text-xs text-loan-red">
          Microphone access denied
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
