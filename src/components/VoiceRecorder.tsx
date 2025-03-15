
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApiUrl } from '@/contexts/ApiUrlContext';
import { submitAudioQuery } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

type VoiceRecorderProps = {
  onResponseReceived: (response: string, shouldPlayAudio: boolean) => void;
  setLoading: (loading: boolean) => void;
};

const VoiceRecorder = ({ onResponseReceived, setLoading }: VoiceRecorderProps) => {
  const { currentLanguage } = useLanguage();
  const { customApiUrl } = useApiUrl();
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
            const result = await submitAudioQuery({
              audio: audioBlob,
              language: currentLanguage.code,
            }, customApiUrl);
            
            onResponseReceived(result.text, result.shouldGenerateAudio);
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

  const getRecordingText = () => {
    if (currentLanguage.code === 'en-IN') return "Recording...";
    if (currentLanguage.code === 'hi-IN') return "रिकॉर्डिंग...";
    if (currentLanguage.code === 'bn-IN') return "রেকর্ডিং হচ্ছে...";
    if (currentLanguage.code === 'gu-IN') return "રેકોર્ડિંગ...";
    if (currentLanguage.code === 'kn-IN') return "ರೆಕಾರ್ಡಿಂಗ್...";
    if (currentLanguage.code === 'ml-IN') return "റെക്കോർഡിംഗ്...";
    if (currentLanguage.code === 'mr-IN') return "रेकॉर्डिंग...";
    if (currentLanguage.code === 'od-IN') return "ରେକର୍ଡିଂ...";
    if (currentLanguage.code === 'pa-IN') return "ਰਿਕਾਰਡਿੰਗ...";
    if (currentLanguage.code === 'ta-IN') return "பதிவு செய்கிறது...";
    if (currentLanguage.code === 'te-IN') return "రికార్డింగ్...";
    return "Recording...";
  };

  const getClickToRecordText = () => {
    if (currentLanguage.code === 'en-IN') return `Click to record in English`;
    if (currentLanguage.code === 'hi-IN') return `हिंदी में रिकॉर्ड करने के लिए क्लिक करें`;
    if (currentLanguage.code === 'bn-IN') return `বাংলায় রেকর্ড করতে ক্লিক করুন`;
    if (currentLanguage.code === 'gu-IN') return `ગુજરાતીમાં રેકોર્ડ કરવા માટે ક્લિક કરો`;
    if (currentLanguage.code === 'kn-IN') return `ಕನ್ನಡದಲ್ಲಿ ರೆಕಾರ್ಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ`;
    if (currentLanguage.code === 'ml-IN') return `മലയാളത്തിൽ റെക്കോർഡ് ചെയ്യാൻ ക്ലിക്ക് ചെയ്യുക`;
    if (currentLanguage.code === 'mr-IN') return `मराठीत रेकॉर्ड करण्यासाठी क्लिक करा`;
    if (currentLanguage.code === 'od-IN') return `ଓଡିଆରେ ରେକର୍ଡ କରିବାକୁ କ୍ଲିକ୍ କରନ୍ତୁ`;
    if (currentLanguage.code === 'pa-IN') return `ਪੰਜਾਬੀ ਵਿੱਚ ਰਿਕਾਰਡ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ`;
    if (currentLanguage.code === 'ta-IN') return `தமிழில் பதிவு செய்ய கிளிக் செய்யவும்`;
    if (currentLanguage.code === 'te-IN') return `తెలుగులో రికార్డ్ చేయడానికి క్లిక్ చేయండి`;
    return `Click to record in ${currentLanguage.name}`;
  };

  const getMicrophoneDeniedText = () => {
    if (currentLanguage.code === 'en-IN') return "Microphone access denied";
    if (currentLanguage.code === 'hi-IN') return "माइक्रोफोन एक्सेस अस्वीकृत";
    if (currentLanguage.code === 'bn-IN') return "মাইক্রোফোন অ্যাক্সেস অস্বীকৃত";
    if (currentLanguage.code === 'gu-IN') return "માઇક્રોફોન ઍક્સેસ નકારી";
    if (currentLanguage.code === 'kn-IN') return "ಮೈಕ್ರೋಫೋನ್ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ";
    if (currentLanguage.code === 'ml-IN') return "മൈക്രോഫോൺ ആക്സസ് നിഷേധിച്ചു";
    if (currentLanguage.code === 'mr-IN') return "मायक्रोफोन ऍक्सेस नाकारले";
    if (currentLanguage.code === 'od-IN') return "ମାଇକ୍ରୋଫୋନ୍ ଆକ୍ସେସ୍ ପ୍ରତ୍ୟାଖ୍ୟାନ କରାଗଲା";
    if (currentLanguage.code === 'pa-IN') return "ਮਾਈਕ੍ਰੋਫੋਨ ਪਹੁੰਚ ਤੋਂ ਇਨਕਾਰ ਕੀਤਾ ਗਿਆ";
    if (currentLanguage.code === 'ta-IN') return "மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது";
    if (currentLanguage.code === 'te-IN') return "మైక్రోఫోన్ యాక్సెస్ నిరాకరించబడింది";
    return "Microphone access denied";
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
          {getRecordingText()} {formatTime(recordingTime)}
        </div>
      )}
      
      {!isRecording && !permissionDenied && (
        <div className="mt-2 text-xs text-gray-500">
          {getClickToRecordText()}
        </div>
      )}
      
      {permissionDenied && (
        <div className="mt-2 text-xs text-loan-red">
          {getMicrophoneDeniedText()}
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
