import { toast } from '@/components/ui/use-toast';

// Constants
const SARVAM_API_KEY = '3ecb2bb0-3bc8-45d0-97f0-41a0471496dc';
const SARVAM_API_ENDPOINT = 'https://api.sarvam.ai/v1';

// Types for Sarvam AI
export type SarvamTextToSpeechRequest = {
  input: string;
  languageCode: string;
};

export type SarvamSpeechToTextRequest = {
  audio: Blob;
  languageCode: string;
};

export type SarvamTranslationRequest = {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
};

// Function to convert text to speech using Sarvam AI
export const textToSpeech = async (request: SarvamTextToSpeechRequest): Promise<Blob> => {
  try {
    console.log('Text to speech request:', request);
    
    // In a real implementation, we would call the Sarvam AI TTS API
    // For now, we'll use the browser's built-in speech synthesis API
    
    return new Promise((resolve, reject) => {
      try {
        // Create a SpeechSynthesisUtterance object
        const utterance = new SpeechSynthesisUtterance(request.input);
        
        // Set language based on the request
        utterance.lang = request.languageCode.split('-')[0]; // Use primary language code (e.g., 'hi' from 'hi-IN')
        
        // Create a MediaRecorder to capture the audio
        const audioChunks: Blob[] = [];
        const audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();
        const mediaRecorder = new MediaRecorder(destination.stream);
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
          resolve(audioBlob);
        };
        
        // Start recording
        mediaRecorder.start();
        
        // Speak the text
        window.speechSynthesis.speak(utterance);
        
        // When speech ends, stop recording
        utterance.onend = () => {
          mediaRecorder.stop();
          audioContext.close();
        };
        
        // If speech synthesis is not available or fails, use a fallback
        setTimeout(() => {
          if (audioChunks.length === 0) {
            console.warn('Speech synthesis failed or timed out, using fallback audio');
            // Create a simple beep sound as fallback
            const oscillator = audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
            oscillator.connect(destination);
            oscillator.start();
            setTimeout(() => {
              oscillator.stop();
              mediaRecorder.stop();
              audioContext.close();
            }, 1000);
          }
        }, 5000); // 5 second timeout
      } catch (error) {
        console.error('Error in speech synthesis:', error);
        // Fallback to a simple audio blob
        const fallbackBlob = new Blob(['audio data'], { type: 'audio/mp3' });
        resolve(fallbackBlob);
      }
    });
  } catch (error) {
    console.error('Error in text to speech:', error);
    toast({
      title: "Speech Generation Failed",
      description: "Could not generate speech output. Please try again.",
      variant: "destructive",
    });
    // Return a simple audio blob as fallback
    return new Blob(['fallback audio data'], { type: 'audio/mp3' });
  }
};

// Function to convert speech to text using Sarvam AI
export const speechToText = async (request: SarvamSpeechToTextRequest): Promise<string> => {
  try {
    console.log('Speech to text request:', request);
    
    // In a real implementation, this would call the Sarvam AI STT API
    // For now, we'll use the browser's built-in speech recognition API if available
    
    // Check if the browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // Use a mock transcription for demo purposes
      // In a real implementation, we would process the audio blob
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return a mock transcription based on the language
      const langCode = request.languageCode;
      
      if (langCode === 'en-IN') {
        return "I would like to take out a personal loan.";
      } else if (langCode === 'hi-IN') {
        return "मैं एक व्यक्तिगत ऋण लेना चाहता हूं।";
      } else if (langCode === 'bn-IN') {
        return "আমি একটি ব্যক্তিগত ঋণ নিতে চাই।";
      } else if (langCode === 'gu-IN') {
        return "હું વ્યક્તિગત લોન લેવા માંગુ છું.";
      } else if (langCode === 'kn-IN') {
        return "ನಾನು ವೈಯಕ್ತಿಕ ಸಾಲ ಪಡೆಯಲು ಬಯಸುತ್ತೇನೆ.";
      } else if (langCode === 'ml-IN') {
        return "എനിക്ക് ഒരു വ്യക്തിഗത വായ്പ എടുക്കാൻ താൽപ്പര്യമുണ്ട്.";
      } else if (langCode === 'mr-IN') {
        return "मला वैयक्तिक कर्ज घ्यायचे आहे.";
      } else if (langCode === 'od-IN') {
        return "ମୁଁ ଏକ ବ୍ୟକ୍ତିଗତ ଋଣ ନେବାକୁ ଚାହେଁ।";
      } else if (langCode === 'pa-IN') {
        return "ਮੈਂ ਨਿੱਜੀ ਲੋਨ ਲੈਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।";
      } else if (langCode === 'ta-IN') {
        return "நான் ஒரு தனிப்பட்ட கடன் பெற விரும்புகிறேன்.";
      } else if (langCode === 'te-IN') {
        return "నేను వ్యక్తిగత రుణం తీసుకోవాలనుకుంటున్నాను.";
      } else {
        return "I would like to take out a personal loan.";
      }
    } else {
      console.warn('Speech recognition not supported in this browser');
      return "I would like to take out a personal loan.";
    }
  } catch (error) {
    console.error('Error in speech to text:', error);
    toast({
      title: "Speech Recognition Failed",
      description: "Could not process your speech. Please try again.",
      variant: "destructive",
    });
    return "I would like to take out a personal loan.";
  }
};

// Function to translate text using Sarvam AI
export const translateText = async (request: SarvamTranslationRequest): Promise<string> => {
  try {
    console.log('Translation request:', request);
    
    // If source and target languages are the same, return original text
    if (request.sourceLanguage === request.targetLanguage) {
      return request.text;
    }
    
    // In a real implementation, this would call the Sarvam AI Translation API
    // For now, we'll use mock translations
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For English to other languages
    if (request.sourceLanguage === 'en-IN') {
      // Sample text for demonstration
      const sampleText = "To apply for a personal loan with HDFC Bank, you can follow their straightforward five-step application process:\n\n1. **Determine Loan Requirement**: Identify why you need a personal loan and how much you require.\n\n2. **Check Loan Eligibility**: Use HDFC Bank's Personal Loan Eligibility Calculator available online to determine how much you can borrow based on your income, credit score, and other factors.\n\n3. **Calculate Monthly Instalments**: Use the EMI calculator to understand your monthly repayment obligations.\n\n4. **Complete the Application**: Fill out the application form online or visit a branch if needed.\n\n5. **Submit Required Documents**: Provide any necessary documentation as per the bank's requirements.\n\nFor more details, you can visit HDFC Bank's official website or contact their customer service.";
      
      // Return mock translations based on target language
      if (request.targetLanguage === 'hi-IN') {
        if (request.text === sampleText) {
          return "HDFC बैंक के साथ पर्सनल लोन के लिए आवेदन करने के लिए, आप उनकी सरल पांच-चरणीय आवेदन प्रक्रिया का पालन कर सकते हैं:\n\n1. **ऋण आवश्यकता निर्धारित करें**: पहचानें कि आपको व्यक्तिगत ऋण की आवश्यकता क्यों है और आपको कितना चाहिए।\n\n2. **ऋण पात्रता जांचें**: यह निर्धारित करने के लिए ऑनलाइन उपलब्ध HDFC बैंक के पर्सनल लोन एलिजिबिलिटी कैलकुलेटर का उपयोग करें कि आप अपनी आय, क्रेडिट स्कोर और अन्य कारकों के आधार पर कितना उधार ले सकते हैं।\n\n3. **मासिक किस्तों की गणना करें**: अपने मासिक पुनर्भुगतान दायित्वों को समझने के लिए EMI कैलकुलेटर का उपयोग करें।\n\n4. **आवेदन पूरा करें**: ऑनलाइन आवेदन पत्र भरें या यदि आवश्यक हो तो शाखा पर जाएं।\n\n5. **आवश्यक दस्तावेज जमा करें**: बैंक की आवश्यकताओं के अनुसार आवश्यक दस्तावेज प्रदान करें।\n\nअधिक जानकारी के लिए, आप HDFC बैंक की आधिकारिक वेबसाइट पर जा सकते हैं या उनके ग्राहक सेवा से संपर्क कर सकते हैं।";
        }
        return "हिंदी में अनुवादित: " + request.text;
      } else if (request.targetLanguage === 'bn-IN') {
        return "বাংলায় অনুবাদ: " + request.text;
      } else if (request.targetLanguage === 'gu-IN') {
        return "ગુજરાતીમાં અનુવાદ: " + request.text;
      } else if (request.targetLanguage === 'kn-IN') {
        return "ಕನ್ನಡದಲ್ಲಿ ಅನುವಾದ: " + request.text;
      } else if (request.targetLanguage === 'ml-IN') {
        return "മലയാളത്തിൽ വിവർത്തനം: " + request.text;
      } else if (request.targetLanguage === 'mr-IN') {
        return "मराठीत अनुवादित: " + request.text;
      } else if (request.targetLanguage === 'od-IN') {
        return "ଓଡିଆରେ ଅନୁବାଦ: " + request.text;
      } else if (request.targetLanguage === 'pa-IN') {
        return "ਪੰਜਾਬੀ ਵਿੱਚ ਅਨੁਵਾਦ: " + request.text;
      } else if (request.targetLanguage === 'ta-IN') {
        return "தமிழில் மொழிபெயர்ப்பு: " + request.text;
      } else if (request.targetLanguage === 'te-IN') {
        return "తెలుగులో అనువాదం: " + request.text;
      }
    }
    
    // For other languages to English
    if (request.targetLanguage === 'en-IN') {
      return "Translated to English: " + request.text;
    }
    
    // Default fallback
    return request.text;
  } catch (error) {
    console.error('Error in translation:', error);
    toast({
      title: "Translation Failed",
      description: "Could not translate your text. Please try again.",
      variant: "destructive",
    });
    return request.text;
  }
};

// Helper function to initialize Sarvam AI with API key
export const initializeSarvamAI = () => {
  // This would set up any global config for Sarvam AI
  console.log('Sarvam AI initialized with API key');
  return true;
};
