
import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { textToSpeech } from '@/services/sarvamAI';
import { Button } from '@/components/ui/button';

type ResponseDisplayProps = {
  response: string;
  loading: boolean;
  shouldPlayAudio?: boolean;
};

const ResponseDisplay = ({ response, loading, shouldPlayAudio = false }: ResponseDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useLanguage();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (containerRef.current && response) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  useEffect(() => {
    // Clean up previous audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    // Generate new audio if we have a response and shouldPlayAudio is true
    if (response && !loading && shouldPlayAudio) {
      generateSpeech();
    }
    
    // Cleanup on unmount
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [response, loading, shouldPlayAudio]);

  const generateSpeech = async () => {
    if (!response) return;
    
    try {
      const audioBlob = await textToSpeech({
        input: response,
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

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error('Audio playback failed:', err));
    }
  };

  const getEmptyStateMessage = () => {
    if (currentLanguage.code === 'en-IN') return 'Your response will appear here';
    if (currentLanguage.code === 'hi-IN') return 'आपका उत्तर यहां दिखाई देगा';
    if (currentLanguage.code === 'bn-IN') return 'আপনার প্রতিক্রিয়া এখানে প্রদর্শিত হবে';
    if (currentLanguage.code === 'gu-IN') return 'તમારો જવાબ અહીં દેખાશે';
    if (currentLanguage.code === 'kn-IN') return 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ';
    if (currentLanguage.code === 'ml-IN') return 'നിങ്ങളുടെ പ്രതികരണം ഇവിടെ ദൃശ്യമാകും';
    if (currentLanguage.code === 'mr-IN') return 'तुमचा प्रतिसाद येथे दिसेल';
    if (currentLanguage.code === 'od-IN') return 'ଆପଣଙ୍କ ପ୍ରତିକ୍ରିୟା ଏଠାରେ ଦେଖାଯିବ';
    if (currentLanguage.code === 'pa-IN') return 'ਤੁਹਾਡਾ ਜਵਾਬ ਇੱਥੇ ਦਿਖਾਈ ਦੇਵੇਗਾ';
    if (currentLanguage.code === 'ta-IN') return 'உங்கள் பதில் இங்கே தோன்றும்';
    if (currentLanguage.code === 'te-IN') return 'మీ ప్రతిస్పందన ఇక్కడ కనిపిస్తుంది';
    return 'Your response will appear here';
  };

  const getProcessingMessage = () => {
    if (currentLanguage.code === 'en-IN') return 'Processing your request...';
    if (currentLanguage.code === 'hi-IN') return 'आपके अनुरोध पर कार्रवाई हो रही है...';
    if (currentLanguage.code === 'bn-IN') return 'আপনার অনুরোধ প্রক্রিয়া করা হচ্ছে...';
    if (currentLanguage.code === 'gu-IN') return 'તમારી વિનંતી પર પ્રક્રિયા ચાલી રહી છે...';
    if (currentLanguage.code === 'kn-IN') return 'ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...';
    if (currentLanguage.code === 'ml-IN') return 'നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ്സ് ചെയ്യുന്നു...';
    if (currentLanguage.code === 'mr-IN') return 'आपल्या विनंतीवर प्रक्रिया सुरू आहे...';
    if (currentLanguage.code === 'od-IN') return 'ଆପଣଙ୍କ ଅନୁରୋଧ ପ୍ରକ୍ରିୟାକରଣ ହେଉଛି...';
    // Fix: Use double quotes to wrap the string containing a single quote
    if (currentLanguage.code === 'pa-IN') return "ਤੁਹਾਡੀ ਬੇਨਤੀ 'ਤੇ ਕਾਰਵਾਈ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...";
    if (currentLanguage.code === 'ta-IN') return 'உங்கள் கோரிக்கை செயலாக்கப்படுகிறது...';
    if (currentLanguage.code === 'te-IN') return 'మీ అభ్యర్థనను ప్రాసెస్ చేస్తోంది...';
    return 'Processing your request...';
  };

  const getResponseInText = () => {
    if (currentLanguage.code === 'en-IN') return 'Response in English';
    if (currentLanguage.code === 'hi-IN') return 'हिंदी में उत्तर';
    if (currentLanguage.code === 'bn-IN') return 'বাংলায় প্রতিক্রিয়া';
    if (currentLanguage.code === 'gu-IN') return 'ગુજરાતીમાં જવાબ';
    if (currentLanguage.code === 'kn-IN') return 'ಕನ್ನಡದಲ್ಲಿ ಪ್ರತಿಕ್ರಿಯೆ';
    if (currentLanguage.code === 'ml-IN') return 'മലയാളത്തിൽ പ്രതികരണം';
    if (currentLanguage.code === 'mr-IN') return 'मराठीत प्रतिसाद';
    if (currentLanguage.code === 'od-IN') return 'ଓଡିଆରେ ପ୍ରତିକ୍ରିୟା';
    if (currentLanguage.code === 'pa-IN') return 'ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ';
    if (currentLanguage.code === 'ta-IN') return 'தமிழில் பதில்';
    if (currentLanguage.code === 'te-IN') return 'తెలుగులో ప్రతిస్పందన';
    return `Response in ${currentLanguage.name}`;
  };

  if (!response && !loading) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <p className="text-gray-400 text-center">
          {getEmptyStateMessage()}
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`w-full p-6 rounded-xl glass-morphism transition-all duration-500 ${
        loading ? 'opacity-70' : 'animate-reveal'
      }`}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center h-32">
          <div className="w-8 h-8 rounded-full border-4 border-loan-blue/30 border-t-loan-blue animate-spin"></div>
          <p className="mt-4 text-gray-500">{getProcessingMessage()}</p>
        </div>
      ) : (
        <div className="prose prose-blue max-w-none">
          <p className="font-medium text-lg" dir={currentLanguage.code === 'ar' ? 'rtl' : 'ltr'}>
            {response}
          </p>
          <div className="mt-4 text-xs text-gray-400 flex items-center justify-between">
            <span>{getResponseInText()}</span>
            
            {audioUrl && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full w-8 h-8 p-0"
                onClick={toggleAudio}
              >
                {isPlaying ? (
                  <Volume2 size={16} className="text-loan-blue" />
                ) : (
                  <Volume1 size={16} />
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;
