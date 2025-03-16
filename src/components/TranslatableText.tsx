import React from 'react';
import { useTextTranslation } from '../hooks/usePageTranslation';
import { Loader2 } from 'lucide-react';
import { getHardcodedTranslation } from '../utils/hardcodedTranslations';
import { useLanguage } from '../contexts/LanguageContext';

interface TranslatableTextProps {
  text: string;
  sourceLanguage?: string;
  as?: React.ElementType;
  showLoader?: boolean;
  className?: string;
  dangerouslySetInnerHTML?: boolean;
  children?: React.ReactNode;
}

/**
 * Component for displaying text that is automatically translated to the user's selected language
 */
export const TranslatableText: React.FC<TranslatableTextProps> = ({
  text,
  sourceLanguage = 'en-IN',
  as: Component = 'span',
  showLoader = true,
  className = '',
  dangerouslySetInnerHTML = false,
  children,
}) => {
  const { currentLanguage } = useLanguage();
  
  // Check for hardcoded translation first
  const hardcodedTranslation = getHardcodedTranslation(text, currentLanguage.toString());
  
  // If we have a hardcoded translation and it's different from the original text, use it
  const useHardcodedTranslation = hardcodedTranslation !== text;
  
  // Only use the translation hook if we don't have a hardcoded translation
  const { translatedText, isLoading } = useTextTranslation(
    useHardcodedTranslation ? '' : text, 
    sourceLanguage
  );
  
  // Use hardcoded translation if available, otherwise use the API translation
  const finalText = useHardcodedTranslation ? hardcodedTranslation : translatedText;

  if (isLoading && showLoader && !useHardcodedTranslation) {
    return (
      <Component className={`inline-flex items-center ${className}`}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>{text}</span>
      </Component>
    );
  }

  if (dangerouslySetInnerHTML) {
    return <Component className={className} dangerouslySetInnerHTML={{ __html: finalText }} />;
  }

  return <Component className={className}>{finalText || children || text}</Component>;
}; 