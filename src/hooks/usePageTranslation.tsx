import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getHardcodedTranslation } from '../utils/hardcodedTranslations';

// Cache for storing translations to reduce API calls
const translationCache: Record<string, string> = {};

// Create a cache key based on text and language codes
const createCacheKey = (text: string, sourceLanguage: string, targetLanguage: string): string => {
  return `${sourceLanguage}:${targetLanguage}:${text}`;
};

/**
 * Custom hook for translating page content
 * @param content The content to translate
 * @param sourceLanguage The source language of the content
 * @returns The translated content and loading state
 */
export function usePageTranslation<T>(
  content: T,
  sourceLanguage: string = 'en-IN'
): {
  translatedContent: T;
  isLoading: boolean;
} {
  const { currentLanguage, translateDynamic, isTranslating } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState<T>(content);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // If the content is empty or the current language is the same as the source language,
    // use the original content
    if (!content || currentLanguage.code === sourceLanguage) {
      setTranslatedContent(content);
      setIsLoading(false);
      return;
    }

    // Function to translate the content
    const translate = async () => {
      try {
        setIsLoading(true);
        
        // Check if the content is a string or an object
        if (typeof content === 'string') {
          // Check for hardcoded translation first
          const hardcodedTranslation = getHardcodedTranslation(content, currentLanguage.code);
          
          // If we have a hardcoded translation and it's different from the original content, use it
          if (hardcodedTranslation !== content) {
            setTranslatedContent(hardcodedTranslation as unknown as T);
            setIsLoading(false);
            return;
          }
          
          // Check cache for existing translation
          const cacheKey = createCacheKey(content, sourceLanguage, currentLanguage.code);
          if (translationCache[cacheKey]) {
            setTranslatedContent(translationCache[cacheKey] as unknown as T);
            setIsLoading(false);
            return;
          }
          
          // If not in cache, translate and store in cache
          const translated = await translateDynamic(content, sourceLanguage);
          translationCache[cacheKey] = translated;
          setTranslatedContent(translated as unknown as T);
        } else if (content && typeof content === 'object') {
          // Handle object content by translating each string property
          const translatedObj = { ...content };
          
          for (const key in translatedObj) {
            if (typeof translatedObj[key] === 'string') {
              // Check for hardcoded translation first
              const text = translatedObj[key] as string;
              const hardcodedTranslation = getHardcodedTranslation(text, currentLanguage.code);
              
              // If we have a hardcoded translation and it's different from the original text, use it
              if (hardcodedTranslation !== text) {
                translatedObj[key] = hardcodedTranslation as any;
                continue;
              }
              
              // Check cache for existing translation
              const cacheKey = createCacheKey(text, sourceLanguage, currentLanguage.code);
              if (translationCache[cacheKey]) {
                translatedObj[key] = translationCache[cacheKey] as any;
                continue;
              }
              
              // If not in cache, translate and store in cache
              const translated = await translateDynamic(text, sourceLanguage);
              translationCache[cacheKey] = translated;
              translatedObj[key] = translated as any;
            }
          }
          
          setTranslatedContent(translatedObj as T);
        }
      } catch (error) {
        console.error('Translation error:', error);
        // If there's an error, use the original content
        setTranslatedContent(content);
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [content, currentLanguage, sourceLanguage, translateDynamic]);

  return { 
    translatedContent, 
    isLoading: isLoading || isTranslating 
  };
}

/**
 * Custom hook for translating text
 * @param text The text to translate
 * @param sourceLanguage The source language of the text
 * @returns The translated text and loading state
 */
export function useTextTranslation(
  text: string,
  sourceLanguage: string = 'en-IN'
): {
  translatedText: string;
  isLoading: boolean;
} {
  const { currentLanguage, translateDynamic, isTranslating } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const translate = useCallback(async () => {
    // If the text is empty, skip translation
    if (!text) {
      setTranslatedText('');
      setIsLoading(false);
      return;
    }
    
    // If the current language is the same as the source language, use the original text
    if (currentLanguage.code === sourceLanguage) {
      setTranslatedText(text);
      setIsLoading(false);
      return;
    }
    
    // Check for hardcoded translation first
    const hardcodedTranslation = getHardcodedTranslation(text, currentLanguage.code);
    
    // If we have a hardcoded translation and it's different from the original text, use it
    if (hardcodedTranslation !== text) {
      setTranslatedText(hardcodedTranslation);
      setIsLoading(false);
      return;
    }
    
    // Check cache for existing translation
    const cacheKey = createCacheKey(text, sourceLanguage, currentLanguage.code);
    if (translationCache[cacheKey]) {
      setTranslatedText(translationCache[cacheKey]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const translated = await translateDynamic(text, sourceLanguage);
      translationCache[cacheKey] = translated;
      setTranslatedText(translated);
    } catch (error) {
      console.error('Translation error:', error);
      // If there's an error, use the original text
      setTranslatedText(text);
    } finally {
      setIsLoading(false);
    }
  }, [text, currentLanguage, sourceLanguage, translateDynamic]);

  useEffect(() => {
    translate();
  }, [translate]);

  return { 
    translatedText, 
    isLoading: isLoading || isTranslating 
  };
} 