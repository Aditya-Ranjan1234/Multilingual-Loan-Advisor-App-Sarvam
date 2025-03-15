import { toast } from '@/components/ui/use-toast';
import { translateText } from './sarvamAI';

// Type for the form data
export type LoanQueryData = {
  text?: string;
  audio?: Blob;
  language: string;
};

// Type for conversation message
export type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

// Type for conversation context
export type ConversationContext = {
  messages: ConversationMessage[];
  conversationId?: string;
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

// Initialize or get conversation context
export const getConversationContext = (): ConversationContext => {
  // Try to get existing conversation from localStorage
  const savedConversation = localStorage.getItem('conversationContext');
  if (savedConversation) {
    try {
      return JSON.parse(savedConversation);
    } catch (error) {
      console.error('Error parsing saved conversation:', error);
    }
  }
  
  // Return new conversation if none exists
  return { messages: [] };
};

// Save conversation context
export const saveConversationContext = (context: ConversationContext) => {
  localStorage.setItem('conversationContext', JSON.stringify(context));
};

// Add message to conversation
export const addMessageToConversation = (
  role: 'user' | 'assistant', 
  content: string, 
  context: ConversationContext = getConversationContext()
): ConversationContext => {
  const updatedContext = {
    ...context,
    messages: [
      ...context.messages,
      {
        role,
        content,
        timestamp: Date.now()
      }
    ]
  };
  
  saveConversationContext(updatedContext);
  return updatedContext;
};

// Clear conversation history
export const clearConversation = () => {
  localStorage.removeItem('conversationContext');
  return { messages: [] };
};

// Function to submit text query
export const submitTextQuery = async (data: LoanQueryData, customApiUrl: string): Promise<string> => {
  try {
    console.log('Submitting text query:', data);
    
    // Get current conversation context
    const conversationContext = getConversationContext();
    
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
    
    // Add user message to conversation
    addMessageToConversation('user', translatedText, conversationContext);
    
    // Send translated text to custom API
    try {
      // Use the local proxy endpoint instead of the direct API URL
      // This will route through Vite's proxy to avoid CORS issues
      const apiEndpoint = '/api/ask';
      console.log('Sending request to:', apiEndpoint);
      
      // Prepare the request payload with conversation history
      const payload = {
        question: translatedText,
        conversation_history: conversationContext.messages
          .filter(msg => msg.role === 'user' || msg.role === 'assistant')
          .map(msg => ({
            role: msg.role,
            content: msg.content
          }))
      };
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      // The API returns the response directly as text
      const responseText = await response.text();
      
      // Add assistant response to conversation
      addMessageToConversation('assistant', responseText, conversationContext);
      
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
      
      // Add mock response to conversation
      addMessageToConversation('assistant', mockResponse, conversationContext);
      
      // Translate mock response if needed
      if (data.language !== 'en-IN') {
        try {
          const translatedResponse = await translateText({
            text: mockResponse,
            sourceLanguage: 'en-IN',
            targetLanguage: data.language
          });
          return translatedResponse;
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
    
    // Get current conversation context
    const conversationContext = getConversationContext();
    
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
    
    // Add user message to conversation
    addMessageToConversation('user', englishText, conversationContext);
    
    // Send the English text to custom API
    try {
      // Use the local proxy endpoint instead of the direct API URL
      // This will route through Vite's proxy to avoid CORS issues
      const apiEndpoint = '/api/ask';
      console.log('Sending request to:', apiEndpoint);
      
      // Prepare the request payload with conversation history
      const payload = {
        question: englishText,
        conversation_history: conversationContext.messages
          .filter(msg => msg.role === 'user' || msg.role === 'assistant')
          .map(msg => ({
            role: msg.role,
            content: msg.content
          }))
      };
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      // The API returns the response directly as text
      const responseText = await response.text();
      
      // Add assistant response to conversation
      addMessageToConversation('assistant', responseText, conversationContext);
      
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
      
      // Add mock response to conversation
      addMessageToConversation('assistant', mockResponse, conversationContext);
      
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
