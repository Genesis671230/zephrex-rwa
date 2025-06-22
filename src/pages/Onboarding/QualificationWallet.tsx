import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProgressStepper } from '@/components/ui/progress-stepper';
import { useAppKit } from '@reown/appkit/react';
import TokenizationForm from '@/components/TokenCard/TokenizationForm';

const QualificationWallet = () => {
  const navigate = useNavigate();
  const [walletConnected, setWalletConnected] = useState(false);
  const { open } = useAppKit();
  const steps = [
    { title: 'Agreements', completed: true, current: false },
    { title: 'Main information', completed: true, current: false },
    { title: 'Wallet address', completed: false, current: true },
    { title: 'Upload documents', completed: false, current: false }
  ];

  const handleWalletConnect = (type: 'external' | 'integrated') => {
    setWalletConnected(true);
  };

  const handleNext = () => {
    navigate('/qualification/documents');
  };

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              GBB
            </div>
            <span className="text-gray-600">Green Brew Bond</span>
            <span className="text-gray-400">› Qualification</span>
          </div>
          
          <ProgressStepper steps={steps} />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <Button onClick={()=>{
            open({
              view: 'Account'
            });
          }}>
            Connect Wallet
          </Button>
          <TokenizationForm/>

          {walletConnected && (
            <div className="flex justify-between mt-8">
              <Button variant="outline">Save and close</Button>
              <Button onClick={handleNext} className="px-8">
                Next: Upload documents →
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default QualificationWallet;
