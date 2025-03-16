import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Home, ArrowLeft } from 'lucide-react';
import TranslatableText from '@/components/TranslatableText';
import { usePageTranslation } from '@/hooks/usePageTranslation';
import { Skeleton } from '@/components/ui/skeleton';

const NotFound = () => {
  const { theme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define content to be translated
  const pageContent = {
    pageTitle: '404 - Page Not Found',
    pageDescription: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
    goHomeButton: 'Go to Homepage',
    goBackButton: 'Go Back'
  };

  // Use the custom hook to translate the content
  const { translatedContent, isLoading } = usePageTranslation(pageContent);

  // Loading skeleton for text
  const TextSkeleton = ({ width = 'w-full', height = 'h-6', className = '' }: { width?: string, height?: string, className?: string }) => (
    <Skeleton className={`${width} ${height} ${className} rounded-md`} />
  );

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <h1 className={cn(
          "text-9xl font-bold mb-4",
          theme === 'dark' ? "text-gray-700" : "text-gray-200"
        )}>
          404
        </h1>
        
        <div className="relative">
          <h2 className={cn(
            "text-2xl md:text-3xl font-bold mb-4 relative z-10",
            theme === 'dark' ? "text-white" : "text-loan-gray-800"
          )}>
            {isClient ? (
              isLoading ? <TextSkeleton width="w-3/4" className="mx-auto" /> : translatedContent.pageTitle
            ) : pageContent.pageTitle}
          </h2>
          <div className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full -z-10",
            theme === 'dark' ? "bg-blue-900/20" : "bg-loan-blue/10"
          )}></div>
        </div>
        
        <p className={cn(
          "max-w-md mx-auto mb-8",
          theme === 'dark' ? "text-gray-400" : "text-loan-gray-600"
        )}>
          {isClient ? (
            isLoading ? (
              <>
                <TextSkeleton className="mb-2 mx-auto" />
                <TextSkeleton width="w-5/6" className="mx-auto" />
              </>
            ) : translatedContent.pageDescription
          ) : pageContent.pageDescription}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className={cn(
              "px-6 py-2 rounded-lg flex items-center justify-center font-medium",
              theme === 'dark' 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "bg-loan-blue text-white hover:bg-loan-blue/90"
            )}
          >
            <Home className="mr-2 h-4 w-4" />
            {isClient ? (
              isLoading ? "Go to Homepage" : translatedContent.goHomeButton
            ) : pageContent.goHomeButton}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className={cn(
              "px-6 py-2 rounded-lg flex items-center justify-center font-medium",
              theme === 'dark' 
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600" 
                : "bg-loan-gray-100 text-loan-gray-700 hover:bg-loan-gray-200"
            )}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isClient ? (
              isLoading ? "Go Back" : translatedContent.goBackButton
            ) : pageContent.goBackButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
