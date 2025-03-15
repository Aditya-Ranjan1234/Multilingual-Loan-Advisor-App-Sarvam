
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthForm = () => {
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setFormError('Please enter both email and password');
      return;
    }
    
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is already handled in the auth context
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-display font-semibold text-center mb-6">Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="bg-white border border-gray-200 focus:border-loan-blue transition-colors"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white border border-gray-200 focus:border-loan-blue transition-colors"
              required
            />
          </div>
          
          {formError && (
            <div className="text-loan-red text-sm">{formError}</div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-loan-blue hover:bg-loan-blue/90"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>For demo purposes, use:</p>
            <p className="font-medium">user@example.com / password</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
