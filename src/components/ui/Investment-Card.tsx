// import React from 'react';
// import { Button } from './button';
// import { Badge } from './badge';

// interface InvestmentCardProps {
//   symbol: string;
//   name: string;
//   description: string;
//   type: string;
//   status: 'Open' | 'Registered';
//   qualified: boolean;
//   startDate?: string;
//   endDate?: string;
//   onDetailsClick: () => void;
// }

// export const InvestmentCard: React.FC<InvestmentCardProps> = ({
//   symbol,
//   name,
//   description,
//   type,
//   status,
//   qualified,
//   startDate,
//   endDate,
//   onDetailsClick
// }) => {
//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center space-x-3">
//           <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
//             {symbol}
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-900">{name}</h3>
//             <Badge variant="secondary">{type}</Badge>
//           </div>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Badge variant={status === 'Open' ? 'default' : 'secondary'}>
//             {status}
//           </Badge>
//           <Badge variant={qualified ? 'default' : 'destructive'}>
//             {qualified ? 'Qualified' : 'Not qualified'}
//           </Badge>
//         </div>
//       </div>
      
//       <h4 className="font-medium text-gray-900 mb-2">{name}</h4>
//       <p className="text-gray-600 text-sm mb-4">{description}</p>
      
//       {startDate && endDate && (
//         <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
//           <div>
//             <span className="text-gray-500">Start date</span>
//             <p className="font-medium">{startDate}</p>
//           </div>
//           <div>
//             <span className="text-gray-500">End date</span>
//             <p className="font-medium">{endDate}</p>
//           </div>
//         </div>
//       )}
      
//       <Button onClick={onDetailsClick} className="w-full">
//         Details
//       </Button>
//     </div>
//   );
// };


import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { motion } from "framer-motion";
import { useState } from "react";

const investments = [
  {
    name: "Stellar Cash Reserve",
    symbol: "SCR",
    type: "Fund",
    status: "Open",
    startDate: "21 Nov 2023",
    endDate: "20 Dec 2027",
    description:
      "Stellar Cash Reserve - bridging the traditional and digital financial realms.",
    image: "/placeholders/stellar.jpg",
    creators: ["Stellar Financial Group", "Galaxy Digital"],
    contractAddress: "0x8d12A197cB00D4747a1fe03395095ce2A5CC6819",
    supply: "1,000,000 SCR",
    purpose:
      "To offer high-liquidity reserve-backed crypto investments for stable yield.",
    claimsRequired: ["KYC", "AML"],
    compliance: ["Reg D", "MiCA"],
  },
  {
    name: "Apex Capital Partners",
    symbol: "ACP",
    type: "Fund",
    status: "Open",
    startDate: "1 Nov 2023",
    endDate: "30 Nov 2035",
    description:
      "Apex Capital Partners - where opportunity meets innovation.",
    image: "/placeholders/apex.jpg",
    creators: ["Apex Holdings Ltd."],
    contractAddress: "0xaC24e68b8657c56A4578fFb69c03F1bC9Fc0f865",
    supply: "5,000,000 ACP",
    purpose: "To invest in frontier markets, AI startups, and renewable tech.",
    claimsRequired: ["KYC", "Accredited Investor Proof"],
    compliance: ["SEC 506(c)", "MAS"],
  },
  {
    name: "Green Brew Bond",
    symbol: "GBB",
    type: "Debt",
    status: "Open",
    startDate: "20 May 2024",
    endDate: "21 May 2028",
    description:
      "A tokenized debt instrument designed to support sustainable coffee production.",
    image: "/placeholders/greenbrew.jpg",
    creators: ["Green Bean Ventures", "EarthChain"],
    contractAddress: "0x23B987D96D37Fc8C6c8C3c9621bEb12f8B4182Bc",
    supply: "750,000 GBB",
    purpose:
      "To fund fair-trade certified coffee farming in Latin America and Africa.",
    claimsRequired: ["KYC", "Impact Investor Declaration"],
    compliance: ["ESG Standards", "EU Green Bond Regulation"],
  },
];

const InvestmentCard = ({props}: {props: any}) => {
  const [selected, setSelected] = useState<any>(null);

  const item = props;
  return (
    // <motion.div
    //   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
    //   initial={{ opacity: 0, y: 40 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   transition={{ duration: 0.6 }}
    // >
    //   {investments.map((item, index) => (
    //     <motion.div
    //       key={index}
    //       whileHover={{ scale: 1.03 }}
    //       whileTap={{ scale: 0.98 }}
    //       className="rounded-2xl shadow-xl overflow-hidden border border-gray-200"
    //     >
          <Card {...props}>
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover"
            />
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">{item.name}</h2>
                <Badge variant="outline">{item.symbol}</Badge>
              </div>
              <Badge variant="secondary">{item.type}</Badge>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <div className="text-xs text-muted-foreground">
                <p>
                  <strong>Start:</strong> {item.startDate}
                </p>
                <p>
                  <strong>End:</strong> {item.endDate}
                </p>
              </div>
              <ul className="text-xs mt-2 space-y-1 text-muted-foreground">
                <li>
                  <strong>Contract:</strong> {item.contractAddress}
                </li>
                <li>
                  <strong>Supply:</strong> {item.supply}
                </li>
                <li>
                  <strong>Purpose:</strong> {item.purpose}
                </li>
                <li>
                  <strong>Creators:</strong> {item.creators.join(", ")}
                </li>
                <li>
                  <strong>Claims:</strong> {item.claimsRequired.join(", ")}
                </li>
                <li>
                  <strong>Compliance:</strong> {item.compliance.join(", ")}
                </li>
              </ul>
              <Button className="w-full mt-4" onClick={() => setSelected(item as any)}>
                Get qualified and invest
              </Button>
            </CardContent>
          </Card>
        // </motion.div>
      // ))}
    // </motion.div>
  );
}
export default InvestmentCard;