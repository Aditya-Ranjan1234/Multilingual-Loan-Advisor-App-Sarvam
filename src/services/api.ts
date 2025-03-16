import { toast } from '@/components/ui/use-toast';
import { Language } from '@/contexts/LanguageContext';
import { translateText as sarvamTranslateText } from '@/services/sarvamAI';

// Type for the form data
export type LoanQueryData = {
  text?: string;
  audio?: Blob;
  language: string;
};

// Type for conversation messages
export type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// Type for conversation context
export type ConversationContext = {
  messages: ConversationMessage[];
};

// CORS proxy options to use if direct requests fail
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://thingproxy.freeboard.io/fetch/',
  'https://cors.bridged.cc/',
  'https://corsproxy.io/?'
];

// Function to try a request with different CORS proxies
const fetchWithCorsProxy = async (url: string, options: RequestInit): Promise<Response> => {
  // First try direct request with no-cors mode
  try {
    console.log('Trying direct request to:', url);
    
    // Clone the options to avoid modifying the original
    const directOptions = { ...options };
    
    // Add CORS headers to the request
    directOptions.headers = {
      ...directOptions.headers as Record<string, string>,
      'Origin': window.location.origin,
      'Access-Control-Request-Method': directOptions.method || 'POST',
      'Access-Control-Request-Headers': 'Content-Type, Accept'
    };
    
    // Try the direct request
    const response = await fetch(url, directOptions);
    
    if (response.ok) {
      console.log('Direct request succeeded');
      return response;
    }
  } catch (directError) {
    console.log('Direct request failed:', directError);
  }
  
  // If direct request fails, try with CORS proxies
  console.log('Using CORS proxies for request to:', url);
  
  // Try each proxy in sequence until one works
  let lastError: Error | null = null;
  
  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      console.log(`Trying with proxy: ${proxy}`);
      
      // Clone the options to avoid modifying the original
      const proxyOptions = { ...options };
      
      // Remove problematic headers that might cause CORS issues
      if (proxyOptions.headers) {
        const safeHeaders: Record<string, string> = {};
        const originalHeaders = proxyOptions.headers as Record<string, string>;
        
        // Only keep safe headers
        if (originalHeaders['Content-Type']) {
          safeHeaders['Content-Type'] = originalHeaders['Content-Type'];
        }
        if (originalHeaders['Accept']) {
          safeHeaders['Accept'] = originalHeaders['Accept'];
        }
        
        proxyOptions.headers = safeHeaders;
      }
      
      // Set mode to cors explicitly
      proxyOptions.mode = 'cors';
      
      // Make the request through the proxy
      const response = await fetch(proxyUrl, proxyOptions);
      
      if (response.ok) {
        console.log(`Request succeeded with proxy: ${proxy}`);
        return response;
      } else {
        console.warn(`Proxy ${proxy} returned status ${response.status}`);
        lastError = new Error(`Proxy ${proxy} returned status ${response.status}`);
      }
    } catch (proxyError) {
      console.error(`Proxy ${proxy} failed:`, proxyError);
      lastError = proxyError as Error;
    }
  }
  
  // If we get here, all proxies failed
  console.error('All CORS proxies failed, falling back to mock response');
  
  // Create a mock response that indicates failure but can be handled gracefully
  const mockResponseBody = JSON.stringify({
    error: 'CORS_ERROR',
    message: 'Could not access the API due to CORS restrictions. Using fallback response.',
    fallback: true,
    answer: getMockResponse()
  });
  
  // Return a Response object that our code can handle
  return new Response(mockResponseBody, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
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

// Helper function to translate text using the correct function signature
const translateText = async (text: string, sourceLanguageCode: string, targetLanguageCode: string): Promise<string> => {
  return sarvamTranslateText({
    text,
    sourceLanguage: sourceLanguageCode,
    targetLanguage: targetLanguageCode
  });
};

// Function to get mock response
const getMockResponse = (query: string = ""): string => {
  // Generate a mock response based on the query
  if (query.toLowerCase().includes('loan')) {
    return "I can help you with loan information. We offer personal loans with competitive interest rates starting from 10.5% per annum. The loan amount ranges from ₹50,000 to ₹40,00,000 with flexible repayment tenure of 12-60 months. Would you like to know more about eligibility criteria or application process?";
  } else if (query.toLowerCase().includes('eligibility')) {
    return "To be eligible for a personal loan, you need to be between 23-58 years of age, have a minimum monthly income of ₹25,000, and a good credit score (preferably above 750). Salaried individuals should have at least 2 years of work experience with 1 year in the current organization. Self-employed professionals should have at least 3 years of business continuity.";
  } else if (query.toLowerCase().includes('interest')) {
    return "Our personal loan interest rates start from 10.5% per annum and can go up to 18% depending on your credit profile, income, employment status, and relationship with the bank. The exact rate will be determined after your application assessment.";
  } else if (query.toLowerCase().includes('document')) {
    return "For a personal loan application, you'll need to submit: 1) Identity proof (Aadhaar, PAN, Passport, Voter ID), 2) Address proof (Utility bills, Rental agreement), 3) Income proof (Salary slips for the last 3 months, Form 16, Income Tax Returns for self-employed), and 4) Bank statements for the last 6 months.";
  } else {
    return "Thank you for your query. I'm your personal loan assistant. I can provide information about loan options, eligibility criteria, interest rates, documentation requirements, and application processes. How can I assist you today?";
  }
};

// Initialize or get conversation context
export const getConversationContext = (): ConversationContext => {
  // Try to get existing conversation from sessionStorage (not localStorage)
  const savedConversation = sessionStorage.getItem('conversationContext');
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
  // Store in memory only for the current session
  // We're intentionally not using localStorage to prevent persistence across reloads
  // This is a temporary in-memory storage that will be cleared on page reload
  sessionStorage.setItem('conversationContext', JSON.stringify(context));
};

// Function to add a message to the conversation
export const addMessageToConversation = (message: ConversationMessage): void => {
  const context = getConversationContext();
  context.messages.push(message);
  saveConversationContext(context);
};

// Clear conversation history
export const clearConversation = () => {
  localStorage.removeItem('conversationContext');
  sessionStorage.removeItem('conversationContext');
  return { messages: [] };
};

// Function to submit text query
export const submitTextQuery = async (
  input: string,
  customApiUrl: string,
  language: Language
): Promise<{ text: string; shouldPlayAudio: boolean }> => {
  try {
    // Translate input to English if not already in English
    const translatedInput = language.code === 'en' ? input : await translateText(input, language.code, 'en');
    
    // Add user message to conversation
    addMessageToConversation({
      role: 'user',
      content: input
    });
    
    // Construct API endpoint
    let apiEndpoint = customApiUrl;
    if (!apiEndpoint.endsWith('/ask')) {
      apiEndpoint = apiEndpoint.endsWith('/') ? `${apiEndpoint}ask` : `${apiEndpoint}/ask`;
    }
    
    console.log(`Sending request to: ${apiEndpoint}`);
    
    // Prepare request payload
    const payload = {
      question: translatedInput,
      conversation_context: getConversationContext()
    };
    
    // Send request to API
    const response = await fetchWithCorsProxy(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    // Process response
    const data = await response.json();
    
    // Check if this is our fallback response from the CORS proxy
    if (data.fallback || data.error === 'CORS_ERROR') {
      console.log('Received fallback response due to CORS issues, using mock response');
      // Use mock response since we couldn't access the actual API
      const mockResponse = getMockResponse(translatedInput);
      
      // Add assistant message to conversation
      const translatedResponse = language.code === 'en' 
        ? mockResponse 
        : await translateText(mockResponse, 'en', language.code);
      
      addMessageToConversation({
        role: 'assistant',
        content: translatedResponse
      });
      
      return {
        text: translatedResponse,
        shouldPlayAudio: true
      };
    }
    
    // Process normal response
    console.log('API response:', data);
    
    // Get the response text from the answer field
    const responseText = data || "I'm sorry, I couldn't process your request.";
    
    // Translate response back to user's language if needed
    const translatedResponse = language.code === 'en' 
      ? responseText 
      : await translateText(responseText, 'en', language.code);
    
    // Add assistant message to conversation
    addMessageToConversation({
      role: 'assistant',
      content: translatedResponse
    });
    
    return {
      text: translatedResponse,
      shouldPlayAudio: data.should_play_audio ?? true
    };
  } catch (error) {
    console.error('Error in submitTextQuery:', error);
    
    // Use mock response as fallback
    const mockResponse = getMockResponse(input);
    
    // Translate mock response if needed
    const translatedResponse = language.code === 'en' 
      ? mockResponse 
      : await translateText(mockResponse, 'en', language.code);
    
    // Add assistant message to conversation
    addMessageToConversation({
      role: 'assistant',
      content: translatedResponse
    });
    
    return {
      text: translatedResponse,
      shouldPlayAudio: true
    };
  }
};

// Function to submit audio query
export const submitAudioQuery = async (
  audioBlob: Blob,
  customApiUrl: string,
  language: Language,
  transcribedText?: string
): Promise<{ text: string; shouldPlayAudio: boolean }> => {
  try {
    // If we already have transcribed text, use it directly
    if (transcribedText) {
      console.log('Using provided transcribed text:', transcribedText);
      
      // Add user message to conversation
      addMessageToConversation({
        role: 'user',
        content: transcribedText
      });
      
      // Process as a text query
      return submitTextQuery(transcribedText, customApiUrl, language);
    }
    
    // Simulate audio transcription (in a real app, you'd send the audio to a speech-to-text service)
    // For demo purposes, we'll just use a placeholder
    const simulatedTranscription = "This is a simulated transcription of audio input.";
    
    // Translate transcription to English if needed
    const translatedInput = language.code === 'en' 
      ? simulatedTranscription 
      : await translateText(simulatedTranscription, language.code, 'en');
    
    // Add user message to conversation
    addMessageToConversation({
      role: 'user',
      content: simulatedTranscription
    });
    
    // Construct API endpoint
    let apiEndpoint = customApiUrl;
    if (!apiEndpoint.endsWith('/ask')) {
      apiEndpoint = apiEndpoint.endsWith('/') ? `${apiEndpoint}ask` : `${apiEndpoint}/ask`;
    }
    
    console.log(`Sending request to: ${apiEndpoint}`);
    
    // Create FormData for audio upload
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');
    
    // Add question in the required format
    formData.append('question', translatedInput);
    
    // Add conversation context
    formData.append('conversation_context', JSON.stringify(getConversationContext()));
    
    // Send request to API
    const response = await fetchWithCorsProxy(apiEndpoint, {
      method: 'POST',
      body: formData
    });
    
    // Process response
    const data = await response.json();
    
    // Check if this is our fallback response from the CORS proxy
    if (data.fallback || data.error === 'CORS_ERROR') {
      console.log('Received fallback response due to CORS issues, using mock response');
      // Use mock response since we couldn't access the actual API
      const mockResponse = getMockResponse(translatedInput);
      
      // Add assistant message to conversation
      const translatedResponse = language.code === 'en' 
        ? mockResponse 
        : await translateText(mockResponse, 'en', language.code);
      
      addMessageToConversation({
        role: 'assistant',
        content: translatedResponse
      });
      
      return {
        text: translatedResponse,
        shouldPlayAudio: true
      };
    }
    
    // Process normal response
    console.log('API response:', data);
    
    // Get the response text from the answer field
    const responseText = data || "I'm sorry, I couldn't process your request.";
    
    // Translate response back to user's language if needed
    const translatedResponse = language.code === 'en' 
      ? responseText 
      : await translateText(responseText, 'en', language.code);
    
    // Add assistant message to conversation
    addMessageToConversation({
      role: 'assistant',
      content: translatedResponse
    });
    
    return {
      text: translatedResponse,
      shouldPlayAudio: data.should_play_audio ?? true
    };
  } catch (error) {
    console.error('Error in submitAudioQuery:', error);
    
    // Use mock response as fallback
    const mockResponse = getMockResponse("Audio query");
    
    // Translate mock response if needed
    const translatedResponse = language.code === 'en' 
      ? mockResponse 
      : await translateText(mockResponse, 'en', language.code);
    
    // Add assistant message to conversation
    addMessageToConversation({
      role: 'assistant',
      content: translatedResponse
    });
    
    return {
      text: translatedResponse,
      shouldPlayAudio: true
    };
  }
};
