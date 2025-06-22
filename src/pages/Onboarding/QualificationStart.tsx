import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProgressStepper } from '@/components/ui/progress-stepper';
import { InvestorTypeSelector } from '@/components/Onboarding/InvestorTypeSelector';
import { CountrySelector } from '@/components/Onboarding/CountrySelector';

const QualificationStart = () => {
  const navigate = useNavigate();
  const [investorType, setInvestorType] = useState('individual');
  const [country, setCountry] = useState('');
  const [showCountrySelector, setShowCountrySelector] = useState(false);

  const steps = [
    { title: 'Agreements', completed: false, current: true },
    { title: 'Main information', completed: false, current: false },
    { title: 'Wallet address', completed: false, current: false },
    { title: 'Upload documents', completed: false, current: false }
  ];

  const handleContinue = () => {
    if (!showCountrySelector) {
      setShowCountrySelector(true);
    } else if (country) {
      navigate('/qualification/agreements');
    }
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
          {!showCountrySelector ? (
            <>
              <div className="bg-purple-500 text-white p-6 rounded-lg mb-8">
                <h3 className="font-medium mb-2">
                  Next, select your investor type: 'Individual' or 'Institution.' For this demo, we will proceed as 'Individual.'
                </h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm">19 of 51</span>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm">←</Button>
                    <Button variant="secondary" size="sm">→</Button>
                  </div>
                </div>
              </div>

              <InvestorTypeSelector value={investorType} onChange={setInvestorType} />
            </>
          ) : (
            <>
              <div className="bg-purple-500 text-white p-6 rounded-lg mb-8">
                <h3 className="font-medium mb-2">
                  Next, select your country of residency from the dropdown list.
                </h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm">20 of 51</span>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm">←</Button>
                    <Button variant="secondary" size="sm">→</Button>
                  </div>
                </div>
              </div>

              <CountrySelector value={country} onChange={setCountry} />
            </>
          )}

          <div className="flex justify-end mt-8">
            <Button 
              onClick={handleContinue}
              disabled={showCountrySelector && !country}
              className="px-8"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QualificationStart;
