import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProgressStepper } from '@/components/ui/progress-stepper';
import { Card } from '@/components/ui/card';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const QualificationDocuments = () => {
  const navigate = useNavigate();
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const steps = [
    { title: 'Agreements', completed: true, current: false },
    { title: 'Main information', completed: true, current: false },
    { title: 'Wallet address', completed: true, current: false },
    { title: 'Upload documents', completed: false, current: true }
  ];

  const requiredDocuments = [
    'Identity Document (Passport or ID Card)',
    'Proof of Address',
    'Bank Statement',
    'Source of Funds Documentation'
  ];

  const handleFileUpload = (docType: string) => {
    // Simulate file upload
    if (!uploadedDocs.includes(docType)) {
      setUploadedDocs(prev => [...prev, docType]);
    }
  };

  const handleComplete = () => {
    navigate('/qualification/complete');
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
          <div className="bg-purple-500 text-white p-6 rounded-lg mb-8">
            <h3 className="font-medium mb-2">
              These are the documents specified by the Issuer as mandatory for your investor qualification process. Please proceed to upload the required documents.
            </h3>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm">43 of 51</span>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm">←</Button>
                <Button variant="secondary" size="sm">→</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>
            <p className="text-gray-600">
              Please upload the following documents to complete your qualification:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requiredDocuments.map((doc, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-gray-400" />
                      <div>
                        <h4 className="font-medium text-sm">{doc}</h4>
                        <p className="text-xs text-gray-500">Required</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {uploadedDocs.includes(doc) ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Button
                          size="sm"  
                          variant="outline"
                          onClick={() => handleFileUpload(doc)}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> At this stage, the Issuer can choose to proceed without activation or opt to activate one of the integrated third-party KYC solutions.
            </p>
          </div>

          <div className="flex justify-between">
            <Button variant="outline">Save and close</Button>
            <Button 
              onClick={handleComplete}
              disabled={uploadedDocs.length < requiredDocuments.length}
              className="px-8"
            >
              Complete Application
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QualificationDocuments;
