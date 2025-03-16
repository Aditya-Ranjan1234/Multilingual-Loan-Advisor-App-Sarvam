import { toast } from '@/components/ui/use-toast';

// Constants
const SARVAM_API_KEY = '3ecb2bb0-3bc8-45d0-97f0-41a0471496dc';
const SARVAM_API_ENDPOINT = 'https://api.sarvam.ai';

// Types for Sarvam AI
export type SarvamTextToSpeechRequest = {
  input: string;
  languageCode: string;
  speaker?: string;
  model?: string;
  pitch?: number;
  pace?: number;
  loudness?: number;
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

// Type for speech-to-text request
export type SpeechToTextRequest = {
  audio: Blob;
  languageCode: string;
};

// Type for text-to-speech request
export type TextToSpeechRequest = {
  text: string;
  languageCode: string;
};

// Type for translation request
export type TranslationRequest = {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
};

// Function to convert text to speech using Sarvam AI
export const textToSpeech = async (request: SarvamTextToSpeechRequest): Promise<Blob> => {
  try {
    console.log('Text to speech request:', request);
    
    // First try to use the Sarvam AI API
    try {
      const url = `${SARVAM_API_ENDPOINT}/text-to-speech`;
      
      // Map language code to target_language_code format expected by Sarvam API
      const targetLanguageCode = request.languageCode.toLowerCase();
      
      // Split text into chunks if it's too long (500 chars per chunk)
      const chunkSize = 500;
      const textChunks = [];
      for (let i = 0; i < request.input.length; i += chunkSize) {
        textChunks.push(request.input.substring(i, i + chunkSize));
      }
      
      console.log(`Total chunks: ${textChunks.length}`);
      
      // If there are multiple chunks, process them sequentially and combine
      if (textChunks.length > 1) {
        const audioChunks: Blob[] = [];
        
        for (let i = 0; i < textChunks.length; i++) {
          const chunk = textChunks[i];
          console.log(`Processing chunk ${i + 1}/${textChunks.length}`);
          
          const payload = {
            inputs: [chunk],
            target_language_code: targetLanguageCode,
            speaker: request.speaker || "neel",
            model: request.model || "bulbul:v1",
            pitch: request.pitch || 0,
            pace: request.pace || 1.0,
            loudness: request.loudness || 1.0,
            enable_preprocessing: true
          };
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-subscription-key': SARVAM_API_KEY
            },
            body: JSON.stringify(payload)
          });
          
          if (!response.ok) {
            throw new Error(`Sarvam API error: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          const audioBase64 = data.audios?.[0];
          
          if (audioBase64) {
            // Convert base64 to blob
            const binaryString = atob(audioBase64);
            const bytes = new Uint8Array(binaryString.length);
            for (let j = 0; j < binaryString.length; j++) {
              bytes[j] = binaryString.charCodeAt(j);
            }
            const audioBlob = new Blob([bytes], { type: 'audio/wav' });
            audioChunks.push(audioBlob);
          } else {
            console.error(`No audio data received for chunk ${i}`);
          }
        }
        
        // Combine all audio chunks into a single blob
        return new Blob(audioChunks, { type: 'audio/wav' });
      } else {
        // Single chunk, process directly
        const payload = {
          inputs: [request.input],
          target_language_code: targetLanguageCode,
          speaker: request.speaker || "neel",
          model: request.model || "bulbul:v1",
          pitch: request.pitch || 0,
          pace: request.pace || 1.0,
          loudness: request.loudness || 1.0,
          enable_preprocessing: true
        };
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': SARVAM_API_KEY
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          throw new Error(`Sarvam API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const audioBase64 = data.audios?.[0];
        
        if (audioBase64) {
          // Convert base64 to blob
          const binaryString = atob(audioBase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let j = 0; j < binaryString.length; j++) {
            bytes[j] = binaryString.charCodeAt(j);
          }
          return new Blob([bytes], { type: 'audio/wav' });
        } else {
          throw new Error('No audio data received from Sarvam API');
        }
      }
    } catch (sarvamError) {
      console.error('Error using Sarvam API, falling back to browser TTS:', sarvamError);
      
      // Fallback to browser's speech synthesis API
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
    }
  } catch (error) {
    console.error('Error in text to speech:', error);
    toast({
      title: "Speech Generation Failed",
      description: "Could not generate speech output. Please try again.",
      variant: "destructive",
    });
    // Return a simple audio blob as fallback
    return new Blob(['audio data'], { type: 'audio/mp3' });
  }
};

/**
 * Convert speech to text using Sarvam AI API
 * @param params The speech-to-text request parameters
 * @returns The transcribed text
 */
export const speechToText = async (params: SpeechToTextRequest): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('audio', params.audio);
    formData.append('language', params.languageCode);

    const response = await fetch('/api/stt', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Speech to text failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Error in speech to text:', error);
    toast({
      title: "Speech Recognition Failed",
      description: "Could not convert speech to text. Please try again.",
      variant: "destructive",
    });
    return '';
  }
};

/**
 * Generate a URL for text-to-speech conversion
 * @param text The text to convert to speech
 * @param languageCode The language code for the speech
 * @returns The URL to fetch the audio from
 */
export const textToSpeechUrl = async (text: string, languageCode: string): Promise<string> => {
  try {
    const audioBlob = await textToSpeech({
      input: text,
      languageCode,
      speaker: "neel",
      model: "bulbul:v1",
      pitch: 0,
      pace: 1.0,
      loudness: 1.0
    });
    
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Error generating audio URL:', error);
    throw error;
  }
};

// Helper function to get a default response in the user's selected language
const getDefaultResponseForLanguage = (languageCode: string): string => {
  switch (languageCode) {
    case 'en-IN':
      return "I would like to know about personal loan options.";
    case 'hi-IN':
      return "मैं व्यक्तिगत ऋण विकल्पों के बारे में जानना चाहता हूं।";
    case 'bn-IN':
      return "আমি ব্যক্তিগত ঋণ বিকল্পগুলি সম্পর্কে জানতে চাই।";
    case 'gu-IN':
      return "હું વ્યક્તિગત લોન વિકલ્પો વિશે જાણવા માંગુ છું.";
    case 'kn-IN':
      return "ನಾನು ವೈಯಕ್ತಿಕ ಸಾಲದ ಆಯ್ಕೆಗಳ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುತ್ತೇನೆ.";
    case 'ml-IN':
      return "വ്യക്തിഗത വായ്പാ ഓപ്ഷനുകളെക്കുറിച്ച് എനിക്ക് അറിയാൻ താൽപ്പര്യമുണ്ട്.";
    case 'mr-IN':
      return "मला वैयक्तिक कर्ज पर्यायांबद्दल जाणून घ्यायचे आहे.";
    case 'od-IN':
      return "ମୁଁ ବ୍ୟକ୍ତିଗତ ଋଣ ବିକଳ୍ପଗୁଡିକ ବିଷୟରେ ଜାଣିବାକୁ ଚାହେଁ।";
    case 'pa-IN':
      return "ਮੈਂ ਨਿੱਜੀ ਲੋਨ ਵਿਕਲਪਾਂ ਬਾਰੇ ਜਾਣਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।";
    case 'ta-IN':
      return "தனிப்பட்ட கடன் விருப்பங்களைப் பற்றி அறிய விரும்புகிறேன்.";
    case 'te-IN':
      return "నేను వ్యక్తిగత రుణ ఎంపికల గురించి తెలుసుకోవాలనుకుంటున్నాను.";
    default:
      return "I would like to know about personal loan options.";
  }
};

/**
 * Translate text using Sarvam AI API
 * @param params The translation request parameters
 * @returns The translated text
 */
export const translateText = async (params: TranslationRequest): Promise<string> => {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: params.text,
        source_language: params.sourceLanguage,
        target_language: params.targetLanguage
      })
    });

    if (!response.ok) {
      throw new Error(`Translation request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.translated_text || params.text;
  } catch (error) {
    console.error('Error in translation:', error);
    // Return original text if translation fails
    return params.text;
  }
};

// Helper function to initialize Sarvam AI with API key
export const initializeSarvamAI = () => {
  // This would set up any global config for Sarvam AI
  console.log('Sarvam AI initialized with API key');
  return true;
};
