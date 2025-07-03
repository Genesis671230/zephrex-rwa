import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';

const projectData = {
  gbb: {
    symbol: 'GBB',
    name: 'Green Brew Bond',
    balance: 'GBB 0.00',
    status: 'Not qualified',
    startDate: '21 Nov 2023',
    endDate: '20 Dec 2027',
    offeringStatus: 'Open',
    allowedCountries: '222 countries',
    jurisdiction: 'Luxembourg',
    tokenAddress: '0x702b8F142f137F...106',
    tokenSymbol: 'SCR',
    tokenStatus: 'Active',
    pricePerToken: '-',
    instrumentType: 'FUND',
    tokenName: 'Stellar Cash Reserve',
    tokenStandard: 'T-REX v3.1',
    blockchainNetwork: 'Amoy',
    team: [
      { name: 'Luc Falempin', role: 'CEO', image: '/api/placeholder/64/64' },
      { name: 'Daniel Coheaur', role: 'Chief Commercial Officer', image: '/api/placeholder/64/64' },
      { name: 'Liam Karwan', role: 'Director of Business Development', image: '/api/placeholder/64/64' }
    ],
    description: `The Green Brew Bond represents a groundbreaking approach to financing sustainable coffee production and farming. In an era where environmental sustainability and social responsibility are paramount, this tokenized debt instrument offers a unique opportunity for investors to support positive change in the coffee industry.

At its core, the Green Brew Bond functions as a financial vehicle for channeling funds into eco-friendly initiatives within the coffee supply chain. These initiatives encompass a wide range of activities aimed at promoting sustainability, including the adoption of organic farming practices, the implementation of fair trade certifications, and the support of community development projects in coffee-growing regions.

Investors who purchase Green Brew Bonds not only provide vital capital for these initiatives but also gain access to a diversified investment opportunity. The bonds offer competitive financial returns, combining the stability of fixed-income securities with the potential for growth associated with sustainable investments. Furthermore, the tokenized nature of the bonds ensures liquidity and accessibility, allowing investors of all sizes to participate in supporting sustainable coffee production.

Through the issuance of Green Brew Bonds, coffee producers and farmers can access much-needed financing to implement sustainable practices, improve their livelihoods, and mitigate the environmental impact of coffee cultivation. By fostering a more sustainable and equitable coffee industry, the bonds contribute to the achievement of broader environmental and social goals.`
  }
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const project = projectData[id as keyof typeof projectData];

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleQualifyClick = () => {
navigate(`/qualification/kyc-enhanced/${id?.symbol}`)
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              {project.symbol}
            </div>
            <span className="text-gray-600">{project.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-green-600 h-64 rounded-lg mb-6 relative overflow-hidden">
              <img 
                src="/lovable-uploads/1d157aa8-ad0c-4a48-89f4-0f059f1af7f2.png" 
                alt="Coffee farming" 
                className="w-full h-full object-cover"
              />
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="token-details">Token details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Team</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {project.team.map((member, index) => (
                      <div key={index} className="text-center">
                        <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Token details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <span className="text-gray-500">Token address</span>
                      <p className="font-medium text-blue-600">{project.tokenAddress}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Token symbol</span>
                      <p className="font-medium">{project.tokenSymbol}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Token status</span>
                      <p className="font-medium text-green-600">{project.tokenStatus}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Price per token</span>
                      <p className="font-medium">{project.pricePerToken}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Instrument type</span>
                      <p className="font-medium">{project.instrumentType}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Open to secondary trading</span>
                      <p className="font-medium">Yes</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Token name</span>
                      <p className="font-medium">{project.tokenName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Token standard</span>
                      <p className="font-medium">{project.tokenStandard}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Blockchain network</span>
                      <p className="font-medium text-purple-600">{project.blockchainNetwork}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="documents">
                <p>Documents will be displayed here.</p>
              </TabsContent>
              
              <TabsContent value="token-details">
                <p>Detailed token information will be displayed here.</p>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Your balance</span>
                <Badge variant="destructive">{project.status}</Badge>
              </div>
              <div className="text-xl font-bold mb-6">{project.balance}</div>
              
              <p className="text-gray-600 text-sm mb-6">
                You need to verify your identity to invest in this offering. You can create your first order after you are qualified to invest.
              </p>
              
              <Button onClick={handleQualifyClick} className="w-full bg-gray-900 hover:bg-gray-800">
                Get qualified and invest
              </Button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Start date</span>
                  <p className="font-medium">{project.startDate}</p>
                </div>
                <div>
                  <span className="text-gray-500">End date</span>
                  <p className="font-medium">{project.endDate}</p>
                </div>
                <div>
                  <span className="text-gray-500">Offering status</span>
                  <p className="font-medium">{project.offeringStatus}</p>
                </div>
                <div>
                  <span className="text-gray-500">Allowed countries</span>
                  <p className="font-medium">{project.allowedCountries}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Jurisdiction</span>
                  <p className="font-medium">{project.jurisdiction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-lg mt-8">
          <h4 className="font-medium mb-2">
            After you have read the project overview, click 'Get qualified and invest' to proceed.
          </h4>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm">18 of 51</span>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">←</Button>
              <Button variant="secondary" size="sm">→</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetails;
