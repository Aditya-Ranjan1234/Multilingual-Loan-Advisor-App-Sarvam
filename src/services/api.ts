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

// Define the ApiResponse interface
export interface ApiResponse {
  response: string;
  shouldPlayAudio: boolean;
  audioUrl?: string;
  isMock?: boolean;
  isFallback?: boolean;
  isError?: boolean;
}

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

// Add a dedicated logging function for API calls
const logApiCall = (stage: 'REQUEST' | 'RESPONSE' | 'ERROR', details: {
  endpoint?: string;
  method?: string;
  url?: string;
  body?: any;
  headers?: any;
  status?: number;
  data?: any;
  error?: any;
}) => {
  const timestamp = new Date().toISOString();
  
  console.group(`🌐 API ${stage} [${timestamp}]`);
  
  if (details.endpoint) {
    console.log(`📍 Endpoint: ${details.endpoint}`);
  }
  
  if (details.method && details.url) {
    console.log(`📤 ${details.method} ${details.url}`);
  }
  
  if (details.headers) {
    console.log('📋 Headers:', details.headers);
  }
  
  if (details.body) {
    console.log('📦 Request Body:', typeof details.body === 'string' ? JSON.parse(details.body) : details.body);
  }
  
  if (details.status) {
    console.log(`🔢 Status: ${details.status}`);
  }
  
  if (details.data) {
    console.log('📥 Response Data:', details.data);
  }
  
  if (details.error) {
    console.error('❌ Error:', details.error);
  }
  
  console.groupEnd();
};

// Helper function to add CORS headers to fetch requests
const fetchWithCORS = async (url: string, options: RequestInit = {}) => {
  // First try with cors mode
  const corsOptions: RequestInit = {
    ...options,
    mode: 'cors',
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain',
    }
  };

  // Log the request
  logApiCall('REQUEST', {
    endpoint: url.split('/').pop() || url,
    method: options.method || 'GET',
    url,
    body: options.body,
    headers: corsOptions.headers
  });

  try {
    console.log(`Attempting request to ${url} with cors mode`);
    const response = await fetch(url, corsOptions);
    
    // Log the response status
    console.log(`Response status: ${response.status} ${response.statusText}`);
    console.log(`Response type: ${response.type}`);
    console.log(`Content-Type: ${response.headers.get('Content-Type')}`);
    
    if (!response.ok) {
      // Try to get error details
      let errorMessage = `Request failed with status ${response.status}`;
      let errorData: { message?: string } = {};
      
      try {
        // Try to parse as JSON first
        errorData = await response.json().catch(() => ({})) as { message?: string };
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        // If JSON parsing fails, try to get as text
        try {
          errorMessage = await response.text() || errorMessage;
        } catch (textError) {
          console.error('Could not parse error response as JSON or text', textError);
        }
      }
      
      // Log the error response
      logApiCall('ERROR', {
        endpoint: url.split('/').pop() || url,
        status: response.status,
        data: errorData
      });
      
      throw new Error(errorMessage);
    }
    
    // Check the content type to determine how to handle the response
    const contentType = response.headers.get('Content-Type') || '';
    
    // For text responses, just return the response as is
    if (contentType.includes('text/plain')) {
      console.log('Received text/plain response');
      
      // Clone the response to log it without consuming it
      const clonedResponse = response.clone();
      const responseText = await clonedResponse.text();
      
      // Log the successful text response
      logApiCall('RESPONSE', {
        endpoint: url.split('/').pop() || url,
        status: response.status,
        data: { text: responseText }
      });
      
      return response;
    }
    
    // For JSON responses, try to parse and log
    if (contentType.includes('application/json')) {
      // Clone the response to log it without consuming it
      const clonedResponse = response.clone();
      const responseData = await clonedResponse.json().catch(() => ({}));
      
      // Log the successful JSON response
      logApiCall('RESPONSE', {
        endpoint: url.split('/').pop() || url,
        status: response.status,
        data: responseData
      });
      
      return response;
    }
    
    // For other content types, just log the type
    console.log(`Received response with content type: ${contentType}`);
    logApiCall('RESPONSE', {
      endpoint: url.split('/').pop() || url,
      status: response.status,
      data: { contentType }
    });
    
    return response;
        } catch (error) {
    console.error('API request with cors mode failed:', error);
    
    // If it's a CORS error, try with no-cors mode
    if (error instanceof TypeError && error.message.includes('has been blocked by CORS policy')) {
      console.log('CORS error detected, trying with no-cors mode');
      
      // Try with no-cors mode
      const noCorsOptions: RequestInit = {
        ...options,
        mode: 'no-cors',
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain',
        }
      };
      
      // Log the no-cors request attempt
      logApiCall('REQUEST', {
        endpoint: url.split('/').pop() || url,
        method: options.method || 'GET',
        url,
        body: options.body,
        headers: noCorsOptions.headers
      });
      
      try {
        console.log(`Attempting request to ${url} with no-cors mode`);
        const noCorsResponse = await fetch(url, noCorsOptions);
        
        // Log the no-cors response
        console.log(`No-CORS response type: ${noCorsResponse.type}, status: ${noCorsResponse.status}`);
        
        // Note: With no-cors, the response will be opaque and we can't read its contents
        // We'll need to handle this specially in the calling function
        return noCorsResponse;
      } catch (noCorsError) {
        console.error('API request with no-cors mode also failed:', noCorsError);
        
        // Log the no-cors error
        logApiCall('ERROR', {
          endpoint: url.split('/').pop() || url,
          error: noCorsError
        });
        
        // If both modes fail, fall back to a mock response
        console.log('Falling back to mock response');
        const requestData = options.body ? JSON.parse(options.body as string) : {};
        const mockQuestion = requestData.question || '';
        const mockResponse = getMockResponse(mockQuestion);
        
        const mockResponseBody = JSON.stringify({
          response: mockResponse,
          shouldPlayAudio: false
        });
        
        // Log the mock response
        logApiCall('RESPONSE', {
          endpoint: url.split('/').pop() || url,
          status: 200,
          data: { response: mockResponse, shouldPlayAudio: false, isMock: true }
        });
        
        return new Response(mockResponseBody, {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }
    
    // For non-CORS errors, rethrow
    throw error;
  }
};

// Update all API functions to use the fetchWithCORS helper
export const sendMessage = async (message: string, apiUrl: string, language: string): Promise<ApiResponse> => {
  try {
    console.group('📨 sendMessage Function');
    console.log(`Original message: "${message}"`);
    console.log(`Language: ${language}`);
    console.log(`API URL: ${apiUrl}`);
    
    // If the language is not English, translate the message to English first
    let translatedMessage = message;
    if (language !== 'en-IN') {
      console.log('Translating message to English before sending to API');
      translatedMessage = await translateText(message, language, 'en-IN');
      console.log(`Translated message: "${translatedMessage}"`);
    }
    
    // Prepare the request body
    const requestBody = JSON.stringify({
      question: translatedMessage
    });
    
    console.log(`Request endpoint: ${apiUrl}/ask`);
    console.log(`Request body: ${requestBody}`);
    
    // Send only the English translated text to the custom API
    // Use /ask endpoint instead of /chat
    const response = await fetchWithCORS(`${apiUrl}/ask`, {
      method: 'POST',
      body: requestBody
    });
    
    // Check if the response is opaque (from no-cors mode)
    if (response.type === 'opaque') {
      console.log('Received opaque response from no-cors mode, using mock response');
      const mockResponse: ApiResponse = {
        response: getMockResponse(translatedMessage),
        shouldPlayAudio: false,
        isMock: true
      };
      
      // If the original language was not English, translate the mock response
      if (language !== 'en-IN') {
        console.log('Translating mock response to original language');
        mockResponse.response = await translateText(mockResponse.response, 'en-IN', language);
        console.log(`Translated mock response: "${mockResponse.response}"`);
      }
      
      console.log('Final mock response:', mockResponse);
      console.groupEnd();
      return mockResponse;
    }
    
    // Try to parse the response as JSON first
    let responseText = '';
    let apiResponse: ApiResponse;
    
    try {
      // First, get the response as text
      const responseTextContent = await response.clone().text();
      console.log('Raw response text:', responseTextContent);
      
      // Try to parse as JSON
      const responseData = await response.json();
      console.log('Parsed as JSON:', responseData);
      
      // Check if the response is a string or an object with a response property
        if (typeof responseData === 'string') {
        console.log('API returned a string response');
          responseText = responseData;
        apiResponse = {
          response: responseData,
          shouldPlayAudio: false
        };
      } else if (responseData && typeof responseData.response === 'string') {
        console.log('API returned an object with a response property');
        responseText = responseData.response;
        apiResponse = responseData as ApiResponse;
        } else {
        console.log('API returned an unexpected format, using the entire response as text');
          responseText = JSON.stringify(responseData);
        apiResponse = {
          response: responseText,
          shouldPlayAudio: false
        };
      }
    } catch (parseError) {
      // If JSON parsing fails, treat the response as plain text
      console.log('Failed to parse response as JSON, treating as plain text');
      responseText = await response.clone().text();
      console.log('Plain text response:', responseText);
      
      apiResponse = {
        response: responseText,
        shouldPlayAudio: false
      };
    }
    
    console.log('Processed API response:', apiResponse);
    
    // If the original language was not English, translate the response back
    if (language !== 'en-IN' && apiResponse.response) {
      console.log('Translating response back to original language');
      const originalResponse = apiResponse.response;
      apiResponse.response = await translateText(apiResponse.response, 'en-IN', language);
      console.log(`Original response: "${originalResponse}"`);
      console.log(`Translated response: "${apiResponse.response}"`);
    }
    
    console.log('Final response:', apiResponse);
    console.groupEnd();
    return apiResponse;
    } catch (error) {
    console.error('Error sending message:', error);
    
    // Log the error
    logApiCall('ERROR', {
      endpoint: 'sendMessage',
      error
    });
    
    // Create a fallback response
    const fallbackResponse: ApiResponse = {
      response: 'Sorry, there was an error processing your request. Please try again later.',
      shouldPlayAudio: false,
      isFallback: true
    };
    
    // Try to translate the fallback message if needed
    if (language !== 'en-IN') {
      try {
        console.log('Translating fallback message to original language');
        fallbackResponse.response = await translateText(fallbackResponse.response, 'en-IN', language);
        console.log(`Translated fallback message: "${fallbackResponse.response}"`);
        } catch (translationError) {
        console.error('Error translating fallback message:', translationError);
      }
    }
    
    console.log('Final fallback response:', fallbackResponse);
    console.groupEnd();
    return fallbackResponse;
  }
};

export const sendAudio = async (audioBlob: Blob, apiUrl: string, language: string): Promise<ApiResponse> => {
  try {
    console.group('🎤 sendAudio Function');
    console.log(`Audio blob size: ${audioBlob.size} bytes`);
    console.log(`Audio blob type: ${audioBlob.type}`);
    console.log(`Language: ${language}`);
    console.log(`API URL: ${apiUrl}`);
    
    // First convert audio to text using Sarvam API
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('language', language);
    
    console.log('Sending audio to Sarvam STT API');
    
    // Log the STT request
    logApiCall('REQUEST', {
      endpoint: 'stt',
      method: 'POST',
      url: '/api/stt',
      body: { audio: `[Blob ${audioBlob.size} bytes]`, language }
    });
    
    // Use the speech-to-text endpoint from Sarvam
    const sttResponse = await fetch('/api/stt', {
      method: 'POST',
      body: formData
    });
    
    if (!sttResponse.ok) {
      const errorText = await sttResponse.text().catch(() => 'Unknown error');
      console.error(`Speech-to-text request failed with status ${sttResponse.status}: ${errorText}`);
      
      // Log the STT error
      logApiCall('ERROR', {
        endpoint: 'stt',
        status: sttResponse.status,
        data: errorText
      });
      
      throw new Error(`Speech-to-text request failed with status ${sttResponse.status}`);
    }
    
    const sttData = await sttResponse.json();
    
    // Log the STT response
    logApiCall('RESPONSE', {
      endpoint: 'stt',
      status: sttResponse.status,
      data: sttData
    });
    
    const transcribedText = sttData.text || '';
    console.log(`Transcribed text: "${transcribedText}"`);
    
    if (!transcribedText) {
      console.error('Could not transcribe audio: Empty transcription');
      throw new Error('Could not transcribe audio');
    }
    
    // Now send the transcribed text to the API using the sendMessage function
    console.log('Sending transcribed text to custom API');
    const messageResponse = await sendMessage(transcribedText, apiUrl, language);
    
    console.log('Final audio processing response:', messageResponse);
    console.groupEnd();
    return messageResponse;
  } catch (error) {
    console.error('Error sending audio:', error);
    
    // Log the error
    logApiCall('ERROR', {
      endpoint: 'sendAudio',
      error
    });
    
    const errorResponse = {
      response: 'Sorry, there was an error processing your audio. Please try again later.',
      shouldPlayAudio: false,
      isError: true
    };
    
    console.log('Error response:', errorResponse);
    console.groupEnd();
    return errorResponse;
  }
};
