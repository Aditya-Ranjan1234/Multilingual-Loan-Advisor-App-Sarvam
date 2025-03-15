
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import CustomerDetails from '@/components/CustomerDetails';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-loan-blue/30 border-t-loan-blue animate-spin"></div>
      </div>
    );
  }
  
  if (!user) return null;
  
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-white to-loan-gray-100">
        <Header />
        
        <div className="container pt-24 px-4 pb-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-display font-bold mb-2 text-loan-gray-800">
              Welcome, {user.name}
            </h1>
            <p className="text-loan-gray-500 mb-8">
              Manage your account and loan inquiries
            </p>
            
            <div className="grid grid-cols-1 gap-6 mb-8">
              <CustomerDetails />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-lg border border-gray-100 shadow-sm hover:shadow-md transition-all card-hover">
                <CardHeader>
                  <CardTitle>Loan Assistant</CardTitle>
                  <CardDescription>Ask questions about loans in multiple languages</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end">
                  <Button 
                    onClick={() => navigate('/')} 
                    className="bg-loan-blue hover:bg-loan-blue/90"
                  >
                    Open Assistant <ArrowRight size={16} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-lg border border-gray-100 shadow-sm hover:shadow-md transition-all card-hover">
                <CardHeader>
                  <CardTitle>Loan History</CardTitle>
                  <CardDescription>View your past loan applications and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4 text-loan-gray-400">
                    No loan history available
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
};

export default Dashboard;
