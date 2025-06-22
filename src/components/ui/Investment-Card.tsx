import React from 'react';
import { Button } from './button';
import { Badge } from './badge';

interface InvestmentCardProps {
  symbol: string;
  name: string;
  description: string;
  type: string;
  status: 'Open' | 'Registered';
  qualified: boolean;
  startDate?: string;
  endDate?: string;
  onDetailsClick: () => void;
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({
  symbol,
  name,
  description,
  type,
  status,
  qualified,
  startDate,
  endDate,
  onDetailsClick
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
            {symbol}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <Badge variant="secondary">{type}</Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={status === 'Open' ? 'default' : 'secondary'}>
            {status}
          </Badge>
          <Badge variant={qualified ? 'default' : 'destructive'}>
            {qualified ? 'Qualified' : 'Not qualified'}
          </Badge>
        </div>
      </div>
      
      <h4 className="font-medium text-gray-900 mb-2">{name}</h4>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      {startDate && endDate && (
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Start date</span>
            <p className="font-medium">{startDate}</p>
          </div>
          <div>
            <span className="text-gray-500">End date</span>
            <p className="font-medium">{endDate}</p>
          </div>
        </div>
      )}
      
      <Button onClick={onDetailsClick} className="w-full">
        Details
      </Button>
    </div>
  );
};
