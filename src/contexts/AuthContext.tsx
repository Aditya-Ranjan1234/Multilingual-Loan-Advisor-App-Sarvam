
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

// Mock user type - this would be replaced with Supabase auth
export type User = {
  id: string;
  email: string;
  name: string;
  accountNumber?: string;
  panNumber?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUserDetails: (details: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - would be replaced with Supabase auth
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    accountNumber: '1234567890',
    panNumber: 'ABCDE1234F',
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    accountNumber: '9876543210',
    panNumber: 'ZYXWV9876U',
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved auth in localStorage
    const savedUser = localStorage.getItem('loanUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem('loanUser');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock authentication - would be replaced with Supabase
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('loanUser', JSON.stringify(foundUser));
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('loanUser');
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const updateUserDetails = (details: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...details };
      setUser(updatedUser);
      localStorage.setItem('loanUser', JSON.stringify(updatedUser));
      toast({
        title: "Profile updated",
        description: "Your profile details have been updated.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
