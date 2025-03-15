
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import Header from '@/components/Header';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-loan-gray-100">
      <Header />
      
      <div className="container pt-24 px-4">
        <div className="max-w-md mx-auto pt-10">
          <h1 className="text-3xl font-display font-bold text-center mb-2 text-loan-gray-800">
            Loan Genius
          </h1>
          <p className="text-center text-loan-gray-500 mb-8">
            Sign in to access your account
          </p>
          
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
