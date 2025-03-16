import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, Send, AlertCircle } from 'lucide-react';
import TranslatableText from '@/components/TranslatableText';
import { usePageTranslation } from '@/hooks/usePageTranslation';
import { Skeleton } from '@/components/ui/skeleton';

const Contact = () => {
  const { theme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  } | null>(null);

  // Set isClient to true after component mounts to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define content to be translated
  const pageContent = {
    pageTitle: 'Contact Us',
    getInTouchTitle: 'Get In Touch',
    getInTouchDescription: 'Have questions about our loan information services? We\'re here to help! Reach out to us using any of the methods below.',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    addressLabel: 'Address',
    businessHoursTitle: 'Business Hours',
    mondayToFriday: 'Monday - Friday:',
    saturday: 'Saturday:',
    sunday: 'Sunday:',
    mondayToFridayHours: '9:00 AM - 6:00 PM',
    saturdayHours: '10:00 AM - 4:00 PM',
    sundayHours: 'Closed',
    sendMessageTitle: 'Send Us a Message',
    nameLabel: 'Name',
    emailInputLabel: 'Email',
    phoneInputLabel: 'Phone',
    subjectLabel: 'Subject',
    messageLabel: 'Message',
    generalInquiry: 'General Inquiry',
    loanInformation: 'Loan Information',
    technicalSupport: 'Technical Support',
    feedback: 'Feedback',
    other: 'Other',
    submitButton: 'Submit Message',
    requiredField: 'Required field',
    errorMessage: 'Please fill in all required fields.',
    successMessage: 'Thank you for your message! We will get back to you soon.'
  };

  // Use the custom hook to translate the content
  const { translatedContent, isLoading } = usePageTranslation(pageContent);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: true,
        success: false,
        message: isClient && !isLoading ? translatedContent.errorMessage : pageContent.errorMessage
      });
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: isClient && !isLoading ? translatedContent.successMessage : pageContent.successMessage
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  // Loading skeleton for text
  const TextSkeleton = ({ width = 'w-full', height = 'h-6', className = '' }: { width?: string, height?: string, className?: string }) => (
    <Skeleton className={`${width} ${height} ${className} rounded-md`} />
  );

  return (
    <div className={cn(
      "container mx-auto px-4 py-8",
      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
    )}>
      <h1 className={cn(
        "text-3xl font-bold mb-8",
        theme === 'dark' ? 'text-white' : 'text-loan-blue'
      )}>
        {isClient ? (
          isLoading ? <TextSkeleton width="w-1/4" /> : translatedContent.pageTitle
        ) : pageContent.pageTitle}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className={cn(
            "p-6 rounded-lg mb-6",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          )}>
            <h2 className={cn(
              "text-xl font-semibold mb-4",
              theme === 'dark' ? 'text-blue-400' : 'text-loan-blue'
            )}>
              {isClient ? (
                isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.getInTouchTitle
              ) : pageContent.getInTouchTitle}
            </h2>
            <p className="mb-6">
              {isClient ? (
                isLoading ? (
                  <>
                    <TextSkeleton className="mb-2" />
                    <TextSkeleton width="w-5/6" />
                  </>
                ) : translatedContent.getInTouchDescription
              ) : pageContent.getInTouchDescription}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className={cn(
                  "h-5 w-5 mt-1 mr-3",
                  theme === 'dark' ? 'text-blue-400' : 'text-loan-blue'
                )} />
                <div>
                  <h3 className="font-medium">
                    {isClient ? (
                      isLoading ? "Email" : translatedContent.emailLabel
                    ) : pageContent.emailLabel}
                  </h3>
                  <p>info@loansarvam.com</p>
                  <p>support@loansarvam.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className={cn(
                  "h-5 w-5 mt-1 mr-3",
                  theme === 'dark' ? 'text-blue-400' : 'text-loan-blue'
                )} />
                <div>
                  <h3 className="font-medium">
                    {isClient ? (
                      isLoading ? "Phone" : translatedContent.phoneLabel
                    ) : pageContent.phoneLabel}
                  </h3>
                  <p>+91 1234 567 890</p>
                  <p>+91 9876 543 210</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className={cn(
                  "h-5 w-5 mt-1 mr-3",
                  theme === 'dark' ? 'text-blue-400' : 'text-loan-blue'
                )} />
                <div>
                  <h3 className="font-medium">
                    {isClient ? (
                      isLoading ? "Address" : translatedContent.addressLabel
                    ) : pageContent.addressLabel}
                  </h3>
                  <p>123 Financial District</p>
                  <p>Hyderabad, Telangana 500032</p>
                  <p>India</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "p-6 rounded-lg",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          )}>
            <h2 className={cn(
              "text-xl font-semibold mb-4",
              theme === 'dark' ? 'text-blue-400' : 'text-loan-blue'
            )}>
              {isClient ? (
                isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.businessHoursTitle
              ) : pageContent.businessHoursTitle}
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  {isClient ? (
                    isLoading ? "Monday - Friday:" : translatedContent.mondayToFriday
                  ) : pageContent.mondayToFriday}
                </span>
                <span>
                  {isClient ? (
                    isLoading ? "9:00 AM - 6:00 PM" : translatedContent.mondayToFridayHours
                  ) : pageContent.mondayToFridayHours}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  {isClient ? (
                    isLoading ? "Saturday:" : translatedContent.saturday
                  ) : pageContent.saturday}
                </span>
                <span>
                  {isClient ? (
                    isLoading ? "10:00 AM - 4:00 PM" : translatedContent.saturdayHours
                  ) : pageContent.saturdayHours}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  {isClient ? (
                    isLoading ? "Sunday:" : translatedContent.sunday
                  ) : pageContent.sunday}
                </span>
                <span>
                  {isClient ? (
                    isLoading ? "Closed" : translatedContent.sundayHours
                  ) : pageContent.sundayHours}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className={cn(
            "p-6 rounded-lg",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          )}>
            <h2 className={cn(
              "text-xl font-semibold mb-4",
              theme === 'dark' ? 'text-blue-400' : 'text-loan-blue'
            )}>
              {isClient ? (
                isLoading ? <TextSkeleton width="w-3/4" /> : translatedContent.sendMessageTitle
              ) : pageContent.sendMessageTitle}
            </h2>
            
            {formStatus && (
              <div className={cn(
                "p-4 mb-6 rounded-md flex items-start",
                formStatus.success 
                  ? (theme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800') 
                  : (theme === 'dark' ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800')
              )}>
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                <p>{formStatus.message}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block mb-1 font-medium">
                    {isClient ? (
                      isLoading ? "Name" : translatedContent.nameLabel
                    ) : pageContent.nameLabel}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-2 rounded-md border",
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:outline-none' 
                        : 'bg-white border-gray-300 focus:border-loan-blue focus:outline-none'
                    )}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-1 font-medium">
                    {isClient ? (
                      isLoading ? "Email" : translatedContent.emailInputLabel
                    ) : pageContent.emailInputLabel}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-2 rounded-md border",
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:outline-none' 
                        : 'bg-white border-gray-300 focus:border-loan-blue focus:outline-none'
                    )}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="phone" className="block mb-1 font-medium">
                    {isClient ? (
                      isLoading ? "Phone" : translatedContent.phoneInputLabel
                    ) : pageContent.phoneInputLabel}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-2 rounded-md border",
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:outline-none' 
                        : 'bg-white border-gray-300 focus:border-loan-blue focus:outline-none'
                    )}
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-1 font-medium">
                    {isClient ? (
                      isLoading ? "Subject" : translatedContent.subjectLabel
                    ) : pageContent.subjectLabel}
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-2 rounded-md border",
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:outline-none' 
                        : 'bg-white border-gray-300 focus:border-loan-blue focus:outline-none'
                    )}
                  >
                    <option value="">
                      {isClient ? (
                        isLoading ? "Select a subject" : "-- " + translatedContent.subjectLabel + " --"
                      ) : "-- " + pageContent.subjectLabel + " --"}
                    </option>
                    <option value="general">
                      {isClient ? (
                        isLoading ? "General Inquiry" : translatedContent.generalInquiry
                      ) : pageContent.generalInquiry}
                    </option>
                    <option value="loan">
                      {isClient ? (
                        isLoading ? "Loan Information" : translatedContent.loanInformation
                      ) : pageContent.loanInformation}
                    </option>
                    <option value="support">
                      {isClient ? (
                        isLoading ? "Technical Support" : translatedContent.technicalSupport
                      ) : pageContent.technicalSupport}
                    </option>
                    <option value="feedback">
                      {isClient ? (
                        isLoading ? "Feedback" : translatedContent.feedback
                      ) : pageContent.feedback}
                    </option>
                    <option value="other">
                      {isClient ? (
                        isLoading ? "Other" : translatedContent.other
                      ) : pageContent.other}
                    </option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="block mb-1 font-medium">
                  {isClient ? (
                    isLoading ? "Message" : translatedContent.messageLabel
                  ) : pageContent.messageLabel}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={cn(
                    "w-full px-4 py-2 rounded-md border",
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:outline-none' 
                      : 'bg-white border-gray-300 focus:border-loan-blue focus:outline-none'
                  )}
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={cn(
                    "px-6 py-2 rounded-md flex items-center font-medium",
                    theme === 'dark' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-loan-blue text-white hover:bg-loan-blue/90'
                  )}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isClient ? (
                    isLoading ? "Submit Message" : translatedContent.submitButton
                  ) : pageContent.submitButton}
                </button>
              </div>
              
              <p className={cn(
                "text-xs mt-4",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                <span className="text-red-500">*</span> {isClient ? (
                  isLoading ? "Required field" : translatedContent.requiredField
                ) : pageContent.requiredField}
              </p>
            </form>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="mt-12">
        <h2 className={cn(
          "text-2xl font-bold mb-6",
          theme === 'dark' ? 'text-white' : 'text-loan-blue'
        )}>Our Location</h2>
        <div className={cn(
          "rounded-lg overflow-hidden h-96",
          theme === 'dark' ? 'border border-gray-700' : 'shadow-md'
        )}>
          {/* Placeholder for map - in a real application, you would integrate Google Maps or similar */}
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <p className="text-gray-600 text-lg font-medium">Interactive Map Would Be Displayed Here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 