import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const EmailVerification = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');

  const handleConfirm = () => {
    // Simulate verification process
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white text-lg font-bold mx-auto mb-4">
            T
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600 mb-4">
            We've sent a verification code to your email address. Please check your inbox and enter the code below.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
          </div>

          <Button 
            onClick={handleConfirm}
            disabled={verificationCode.length !== 6}
            className="w-full mt-6"
          >
            Confirm
          </Button>

          <div className="text-center mt-6">
            <Button variant="ghost" className="text-purple-600">
              Resend Code
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmailVerification;
