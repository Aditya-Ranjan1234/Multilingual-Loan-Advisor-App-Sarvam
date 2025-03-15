
import React, { useState } from 'react';
import { useAuth, User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Check, X } from 'lucide-react';

const CustomerDetails = () => {
  const { user, updateUserDetails } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    accountNumber: user?.accountNumber || '',
    panNumber: user?.panNumber || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserDetails(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      accountNumber: user?.accountNumber || '',
      panNumber: user?.panNumber || '',
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <Card className="w-full bg-white/80 backdrop-blur-lg border border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-medium flex justify-between items-center">
          <span>Customer Details</span>
          {!isEditing && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="text-loan-blue hover:text-loan-indigo hover:bg-loan-blue/10"
            >
              <Edit size={16} className="mr-1" /> Edit
            </Button>
          )}
        </CardTitle>
        <CardDescription>Your personal and account information</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={user.name} 
                disabled 
                className="bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={user.email} 
                disabled 
                className="bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input 
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : "bg-white"}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input 
                id="panNumber"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : "bg-white"}
              />
            </div>
          </div>
          
          {isEditing && (
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleCancel}
                className="text-loan-gray-600"
              >
                <X size={16} className="mr-1" /> Cancel
              </Button>
              <Button 
                type="submit" 
                size="sm"
                className="bg-loan-green hover:bg-loan-green/90 text-white"
              >
                <Check size={16} className="mr-1" /> Save
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerDetails;
