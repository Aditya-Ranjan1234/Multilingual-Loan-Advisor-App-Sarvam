import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const ThemeToggle = () => {
  const { toggleTheme, isDarkMode } = useTheme();
  const { translate } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9"
      aria-label={isDarkMode ? translate('theme.light') || 'Switch to light mode' : translate('theme.dark') || 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun size={18} className="text-yellow-400" />
      ) : (
        <Moon size={18} className="text-loan-blue" />
      )}
    </Button>
  );
};

export default ThemeToggle; 