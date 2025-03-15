import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Home, Search, HelpCircle } from 'lucide-react';

const NotFound = () => {
  const { theme } = useTheme();

  return (
    <div className={cn(
      "container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] text-center",
      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
    )}>
      <div className={cn(
        "text-9xl font-bold mb-4",
        theme === 'dark' ? 'text-blue-500' : 'text-loan-blue'
      )}>
        404
      </div>
      
      <h1 className={cn(
        "text-3xl font-bold mb-4",
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      )}>
        Page Not Found
      </h1>
      
      <p className="text-lg mb-8 max-w-lg">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Link 
          to="/" 
          className={cn(
            "px-6 py-3 rounded-md font-medium flex items-center justify-center",
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-loan-blue hover:bg-blue-700 text-white'
          )}
        >
          <Home className="h-5 w-5 mr-2" />
          Go to Home
        </Link>
        
        <Link 
          to="/contact" 
          className={cn(
            "px-6 py-3 rounded-md font-medium flex items-center justify-center",
            theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          )}
        >
          <HelpCircle className="h-5 w-5 mr-2" />
          Contact Support
        </Link>
      </div>
      
      <div className={cn(
        "p-6 rounded-lg max-w-2xl",
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
      )}>
        <h2 className={cn(
          "text-xl font-semibold mb-4 flex items-center justify-center",
          theme === 'dark' ? 'text-blue-400' : 'text-loan-blue'
        )}>
          <Search className="h-5 w-5 mr-2" />
          Looking for loan information?
        </h2>
        
        <p className="mb-6">
          You can explore our website to find information about various loan products, use our loan calculator, or chat with our multilingual assistant.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link 
            to="/loans" 
            className={cn(
              "px-4 py-3 rounded-md font-medium text-center",
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            )}
          >
            Loan Products
          </Link>
          
          <Link 
            to="/calculator" 
            className={cn(
              "px-4 py-3 rounded-md font-medium text-center",
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            )}
          >
            Loan Calculator
          </Link>
          
          <Link 
            to="/about" 
            className={cn(
              "px-4 py-3 rounded-md font-medium text-center",
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            )}
          >
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
