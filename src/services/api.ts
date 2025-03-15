
import { toast } from '@/components/ui/use-toast';

// API endpoint placeholder - to be replaced with actual endpoint
const API_ENDPOINT = 'MY_API_ENDPOINT';

// Mock API responses
const mockResponses = [
  "Your loan application has been received. Our team will review it shortly.",
  "Based on the information provided, you may qualify for our premium loan program.",
  "Thank you for your inquiry. Your loan eligibility analysis is in progress.",
  "Your current credit score meets our initial criteria for loan approval.",
  "We've received your application and will contact you within 24 hours.",
  "Your loan request is being processed. Please check your email for updates.",
];

// Type for the form data
export type LoanQueryData = {
  text?: string;
  audio?: Blob;
  language: string;
};

// Function to get a random mock response
const getMockResponse = () => {
  const randomIndex = Math.floor(Math.random() * mockResponses.length);
  return mockResponses[randomIndex];
};

// Function to submit text query
export const submitTextQuery = async (data: LoanQueryData): Promise<string> => {
  try {
    // Log the data being sent
    console.log('Submitting text query:', data);
    
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For now, return a mock response
    return getMockResponse();
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
export const submitAudioQuery = async (data: LoanQueryData): Promise<string> => {
  try {
    // Log the data being sent
    console.log('Submitting audio query:', data);
    
    if (!data.audio) {
      throw new Error('No audio data provided');
    }
    
    // Create FormData to send audio file
    const formData = new FormData();
    formData.append('audio', data.audio);
    formData.append('language', data.language);
    
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For now, return a mock response
    return getMockResponse();
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
