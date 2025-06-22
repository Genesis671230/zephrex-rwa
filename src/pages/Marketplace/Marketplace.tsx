
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/layout/Layout';
import { Button } from '@/components/ui/button';
import { InvestmentCard } from '@/components/ui/Investment-Card';

const investmentOpportunities = [
  {
    symbol: 'SCR',
    name: 'Stellar Cash Reserve',
    description: 'Stellar Cash Reserve - bridging the traditional and digital financial realms',
    type: 'Fund',
    status: 'Open' as const,
    qualified: false,
    startDate: '21 Nov 2023',
    endDate: '20 Dec 2027'
  },
  {
    symbol: 'ACP',
    name: 'Apex Capital Partners',
    description: 'Apex Capital Partners - where opportunity meets innovation',
    type: 'Fund',
    status: 'Open' as const,
    qualified: false,
    startDate: '1 Nov 2023',
    endDate: '30 Nov 2035'
  },
  {
    symbol: 'GBB',
    name: 'Green Brew Bond',
    description: 'The Green Brew Bond is a tokenized debt instrument designed to support sustainable coffee production and farming',
    type: 'Debt',
    status: 'Open' as const,
    qualified: false,
    startDate: '20 May 2024',
    endDate: '21 May 2028'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleDetailsClick = (symbol: string) => {
    navigate(`/project/${symbol.toLowerCase()}`);
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Investment Opportunities</h1>
          <p className="text-gray-600">
            The 'Invest' tab offers an overview of all the Issuer's projects and your qualification status for each project at a glance.
          </p>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-lg mb-8">
          <h3 className="font-medium mb-2">
            The 'Invest' tab offers an overview of all the Issuer's projects and your qualification status for each project at a glance.
          </h3>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm">13 of 51</span>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">←</Button>
              <Button variant="secondary" size="sm">→</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investmentOpportunities.map((opportunity) => (
            <InvestmentCard
              key={opportunity.symbol}
              {...opportunity}
              onDetailsClick={() => handleDetailsClick(opportunity.symbol)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
