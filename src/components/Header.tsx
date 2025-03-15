
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full py-4 px-6 bg-white/80 backdrop-blur-md border-b border-gray-100 fixed top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-loan-blue to-loan-indigo flex items-center justify-center">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <h1 className="font-display text-xl font-semibold bg-gradient-to-r from-loan-blue to-loan-indigo bg-clip-text text-transparent">
            Loan Genius
          </h1>
        </div>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center text-loan-gray-600 hover:text-loan-blue transition-colors"
              onClick={() => navigate('/dashboard')}
            >
              <User size={18} className="mr-2" />
              <span>{user.name}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-loan-gray-600 hover:text-loan-red transition-colors"
              onClick={signOut}
            >
              <LogOut size={18} />
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost"
            size="sm"
            className="text-loan-blue hover:text-loan-indigo transition-colors"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
