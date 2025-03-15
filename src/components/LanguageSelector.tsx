
import React, { useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, Language, languages } from '@/contexts/LanguageContext';

const LanguageSelector = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center">
            <Globe size={18} className="mr-2 text-loan-blue" />
            <span className="font-medium">
              {currentLanguage.nativeName}
            </span>
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[200px] p-2 bg-white/90 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg animate-slide-up"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              currentLanguage.code === language.code 
                ? 'bg-loan-blue/10 text-loan-blue font-medium' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => {
              setLanguage(language);
              setIsOpen(false);
            }}
          >
            <div className="flex flex-col">
              <span className="text-sm">{language.nativeName}</span>
              <span className="text-xs text-gray-500">{language.name}</span>
            </div>
            {currentLanguage.code === language.code && (
              <Check size={16} className="text-loan-blue" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
