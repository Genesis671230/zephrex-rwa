
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/layout/Layout';
import { Button } from '@/components/ui/button';
import InvestmentCard from '@/components/ui/Investment-Card';
import { motion } from 'framer-motion';
import { getSTData } from '@/hooks/use-ST';

const investmentOpportunities = [
	{
		name: "Stellar Cash Reserve",
		symbol: "SCR",
		type: "Fund",
		status: "Open",
		startDate: "21 Nov 2023",
		endDate: "20 Dec 2027",
		description:
			"Stellar Cash Reserve - bridging the traditional and digital financial realms.",
		image: "https://www.designyourway.net/blog/wp-content/uploads/2023/08/3-32.jpg",
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
		image: "https://media.licdn.com/dms/image/v2/D4E22AQFXdhaZY1lFIA/feedshare-shrink_800/feedshare-shrink_800/0/1719510764247?e=2147483647&v=beta&t=Gamv2uPWJS2ge6kG1_REGUW7gY9r9ETpUlccInMHScs",
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
		image: "https://www.manhattanstreetcapital.com/sites/default/files/nasdaq_crypto_ecosystem.jpg",
		creators: ["Green Bean Ventures", "EarthChain"],
		contractAddress: "0x23B987D96D37Fc8C6c8C3c9621bEb12f8B4182Bc",
		supply: "750,000 GBB",
		purpose:
			"To fund fair-trade certified coffee farming in Latin America and Africa.",
		claimsRequired: ["KYC", "Impact Investor Declaration"],
		compliance: ["ESG Standards", "EU Green Bond Regulation"],
	},
];

// const investmentOpportunities = [
// {
// symbol: 'SCR',
// name: 'Stellar Cash Reserve',
// description: 'Stellar Cash Reserve - bridging the traditional and digital financial realms',
// type: 'Fund',
// status: 'Open' as const,
// qualified: false,
// startDate: '21 Nov 2023',
// endDate: '20 Dec 2027'
// },
// {
// symbol: 'ACP',
// name: 'Apex Capital Partners',
// description: 'Apex Capital Partners - where opportunity meets innovation',
// type: 'Fund',
// status: 'Open' as const,
// qualified: false,
// startDate: '1 Nov 2023',
// endDate: '30 Nov 2035'
// },
// {
// symbol: 'GBB',
// name: 'Green Brew Bond',
// description: 'The Green Brew Bond is a tokenized debt instrument designed to support sustainable coffee production and farming',
// type: 'Debt',
// status: 'Open' as const,
// qualified: false,
// startDate: '20 May 2024',
// endDate: '21 May 2028'
// }
// ];

const Dashboard = () => {
	const navigate = useNavigate();
	const [securityTokens, setSecurityTokens] = useState([])
	const handleDetailsClick = (symbol: string) => {
		navigate(`/project/${symbol.toLowerCase()}`);
	};

const run =async () => { 
	const stdata =  await getSTData()
	console.log(stdata)
	setSecurityTokens(stdata.content)
	return stdata
 }

	useEffect(()=>{
			const res=run() 
			console.log(res)
	},[])

	return (
		// <Layout>
			<div className="p-8 bg-white pt-[10%]">
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

				<div className="flex justify-center">
					<Button variant="secondary" size="sm" className='bg-black hover:bg-sky-950 text-white'>
						<Link to="/issuer/dashboard" className='text-white'>
				    Tokenize Asset
					</Link>
					</Button>
				</div>


				{/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
				<motion.div
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
		>

			

				{securityTokens?.map((item, index) => (
  <motion.div
    key={index}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className="rounded-2xl shadow-xl overflow-hidden border border-gray-200"
  >
    <InvestmentCard
      props={{
        name: item.name,
        symbol: item.symbol,
        type: "Token", // or item.type if available
        status: "Open",
        startDate: new Date(item.createdAt).toLocaleDateString(),
        endDate: "N/A", // or a placeholder/fallback
        description: item.description,
        image: item.logo,
        creators: [item.ownerAddress],
        contractAddress: item.tokenAddress,
        supply: item.modules?.data?.MaxBalanceModule?.[0] + " " + item.symbol,
        purpose: item.objective,
        claimsRequired: item.claimData?.data?.map(claim => claim.name) || [],
        compliance: [], // Add if exists in the data
        // handleDetailsClick: () => handleDetailsClick(item.symbol)
      }}
    />
  </motion.div>
))}

				</motion.div>
				</div>

	);
};

export default Dashboard;
