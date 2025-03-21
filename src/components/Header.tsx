import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { TranslatableText } from './TranslatableText';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { translate } = useLanguage();

  return (
    <header className="w-full py-4 px-6 bg-background/80 backdrop-blur-md border-b border-border fixed top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">L</span>
          </div>
          <h1 className="font-display text-xl font-semibold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            <TranslatableText text={translate('app.name') || 'Loan Advisor'} />
          </h1>
        </div>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center text-muted-foreground hover:text-primary transition-colors"
              onClick={() => navigate('/dashboard')}
            >
              <User size={18} className="mr-2" />
              <span>{user.name}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-destructive transition-colors"
              onClick={signOut}
            >
              <LogOut size={18} />
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 transition-colors"
            onClick={() => navigate('/login')}
          >
            <TranslatableText text={translate('auth.login') || 'Login'} />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
