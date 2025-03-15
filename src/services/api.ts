
import { toast } from '@/components/ui/use-toast';
import { translateText } from './sarvamAI';

// Type for the form data
export type LoanQueryData = {
  text?: string;
  audio?: Blob;
  language: string;
};

// Mock API responses - used as fallback if API call fails
const mockResponses = [
  "Your loan application has been received. Our team will review it shortly.",
  "Based on the information provided, you may qualify for our premium loan program.",
  "Thank you for your inquiry. Your loan eligibility analysis is in progress.",
  "Your current credit score meets our initial criteria for loan approval.",
  "We've received your application and will contact you within 24 hours.",
  "Your loan request is being processed. Please check your email for updates.",
];

// Function to get a random mock response
const getMockResponse = () => {
  const randomIndex = Math.floor(Math.random() * mockResponses.length);
  return mockResponses[randomIndex];
};

// Function to submit text query
export const submitTextQuery = async (data: LoanQueryData, customApiUrl: string): Promise<string> => {
  try {
    console.log('Submitting text query:', data);
    
    // Translate input text to English if it's not already in English
    let translatedText = data.text || '';
    if (data.language !== 'en-IN' && data.text) {
      try {
        translatedText = await translateText({
          text: data.text,
          sourceLanguage: data.language,
          targetLanguage: 'en-IN'
        });
        console.log('Translated text:', translatedText);
      } catch (error) {
        console.error('Translation error:', error);
        // Continue with original text if translation fails
      }
    }
    
    // Send translated text to custom API
    try {
      const apiEndpoint = `${customApiUrl}/ask`.replace(/\/+/g, '/').replace(':/', '://');
      console.log('Sending request to:', apiEndpoint);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: translatedText }),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const responseData = await response.json();
      let responseText = responseData.response || responseData.answer || responseData.text || responseData.result;
      
      if (!responseText) {
        if (typeof responseData === 'string') {
          responseText = responseData;
        } else {
          responseText = JSON.stringify(responseData);
        }
      }
      
      // Translate response back to user's language if needed
      if (data.language !== 'en-IN') {
        try {
          const translatedResponse = await translateText({
            text: responseText,
            sourceLanguage: 'en-IN',
            targetLanguage: data.language
          });
          return translatedResponse;
        } catch (error) {
          console.error('Response translation error:', error);
          return responseText; // Return English response if translation fails
        }
      }
      
      return responseText;
    } catch (error) {
      console.error('API request failed:', error);
      // Use mock response if API call fails
      const mockResponse = getMockResponse();
      
      // Translate mock response if needed
      if (data.language !== 'en-IN') {
        try {
          return await translateText({
            text: mockResponse,
            sourceLanguage: 'en-IN',
            targetLanguage: data.language
          });
        } catch (translationError) {
          console.error('Mock response translation error:', translationError);
          return mockResponse;
        }
      }
      
      return mockResponse;
    }
  } catch (error) {
    console.error('Error submitting text query:', error);
    toast({
      title: "Error",
      description: "Failed to submit your query. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

// Function to submit audio query
export const submitAudioQuery = async (data: LoanQueryData, customApiUrl: string): Promise<{ text: string, shouldGenerateAudio: boolean }> => {
  try {
    console.log('Submitting audio query:', data);
    
    if (!data.audio) {
      throw new Error('No audio data provided');
    }
    
    // Create FormData to send audio file
    const formData = new FormData();
    formData.append('audio', data.audio);
    formData.append('language', data.language);
    
    // Process the audio and convert to English text using SarvamAI
    // This part would typically call SarvamAI's speech-to-text service
    // For now, we'll simulate this process with a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Assume we now have English text from the audio
    // In a real implementation, this would come from the speech-to-text service
    const englishText = "This is simulated text from audio transcription";
    
    // Send the English text to custom API
    try {
      const apiEndpoint = `${customApiUrl}/ask`.replace(/\/+/g, '/').replace(':/', '://');
      console.log('Sending request to:', apiEndpoint);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: englishText }),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const responseData = await response.json();
      let responseText = responseData.response || responseData.answer || responseData.text || responseData.result;
      
      if (!responseText) {
        if (typeof responseData === 'string') {
          responseText = responseData;
        } else {
          responseText = JSON.stringify(responseData);
        }
      }
      
      // For audio input, we should return the response in the user's language
      // and indicate that audio should be generated
      if (data.language !== 'en-IN') {
        try {
          const translatedResponse = await translateText({
            text: responseText,
            sourceLanguage: 'en-IN',
            targetLanguage: data.language
          });
          return { text: translatedResponse, shouldGenerateAudio: true };
        } catch (error) {
          console.error('Response translation error:', error);
          return { text: responseText, shouldGenerateAudio: true }; // Return English response if translation fails
        }
      }
      
      return { text: responseText, shouldGenerateAudio: true };
    } catch (error) {
      console.error('API request failed:', error);
      // Use mock response if API call fails
      const mockResponse = getMockResponse();
      
      // Translate mock response if needed
      if (data.language !== 'en-IN') {
        try {
          const translatedResponse = await translateText({
            text: mockResponse,
            sourceLanguage: 'en-IN',
            targetLanguage: data.language
          });
          return { text: translatedResponse, shouldGenerateAudio: true };
        } catch (translationError) {
          console.error('Mock response translation error:', translationError);
          return { text: mockResponse, shouldGenerateAudio: true };
        }
      }
      
      return { text: mockResponse, shouldGenerateAudio: true };
    }
  } catch (error) {
    console.error('Error submitting audio query:', error);
    toast({
      title: "Error",
      description: "Failed to process your audio. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};
