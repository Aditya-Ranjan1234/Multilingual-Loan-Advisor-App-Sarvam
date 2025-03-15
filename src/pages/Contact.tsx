import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, Send, AlertCircle } from 'lucide-react';

const Contact = () => {
  const { theme } = useTheme();
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
        message: 'Please fill in all required fields.'
      });
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
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

  return (
    <div className={cn(
      "container mx-auto px-4 py-8",
      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
    )}>
      <h1 className={cn(
        "text-3xl font-bold mb-8",
        theme === 'dark' ? 'text-white' : 'text-loan-blue'
      )}>Contact Us</h1>

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
            )}>Get In Touch</h2>
            <p className="mb-6">
              Have questions about our loan information services? We're here to help! Reach out to us using any of the methods below.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className={cn(
                  "h-5 w-5 mt-1 mr-3",
                  theme === 'dark' ? 'text-blue-400' : 'text-loan-blue'
                )} />
                <div>
                  <h3 className="font-medium">Email</h3>
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
                  <h3 className="font-medium">Phone</h3>
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
                  <h3 className="font-medium">Address</h3>
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
            )}>Business Hours</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
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
            )}>Send Us a Message</h2>
            
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
                    Name <span className="text-red-500">*</span>
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
                    Email <span className="text-red-500">*</span>
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
                    Phone
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
                    Subject
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
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="API Integration">API Integration</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="block mb-1 font-medium">
                  Message <span className="text-red-500">*</span>
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
                ></textarea>
              </div>
              
              <button
                type="submit"
                className={cn(
                  "px-6 py-2 rounded-md font-medium flex items-center",
                  theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-loan-blue hover:bg-blue-700 text-white'
                )}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </button>
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