import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ArrowLeft } from 'lucide-react';
// import { getSTData } from '@/hooks/use-ST';

// const projectData = {
//   gbb: {
//     symbol: 'GBB',
//     name: 'Green Brew Bond',
//     balance: 'GBB 0.00',
//     status: 'Not qualified',
//     startDate: '21 Nov 2023',
//     endDate: '20 Dec 2027',
//     offeringStatus: 'Open',
//     allowedCountries: '222 countries',
//     jurisdiction: 'Luxembourg',
//     tokenAddress: '0x702b8F142f137F...106',
//     tokenSymbol: 'SCR',
//     tokenStatus: 'Active',
//     pricePerToken: '-',
//     instrumentType: 'FUND',
//     tokenName: 'Stellar Cash Reserve',
//     tokenStandard: 'T-REX v3.1',
//     blockchainNetwork: 'Amoy',
//     team: [
//       { name: 'Luc Falempin', role: 'CEO', image: '/api/placeholder/64/64' },
//       { name: 'Daniel Coheaur', role: 'Chief Commercial Officer', image: '/api/placeholder/64/64' },
//       { name: 'Liam Karwan', role: 'Director of Business Development', image: '/api/placeholder/64/64' }
//     ],
//     description: `The Green Brew Bond represents a groundbreaking approach to financing sustainable coffee production and farming. In an era where environmental sustainability and social responsibility are paramount, this tokenized debt instrument offers a unique opportunity for investors to support positive change in the coffee industry.

// At its core, the Green Brew Bond functions as a financial vehicle for channeling funds into eco-friendly initiatives within the coffee supply chain. These initiatives encompass a wide range of activities aimed at promoting sustainability, including the adoption of organic farming practices, the implementation of fair trade certifications, and the support of community development projects in coffee-growing regions.

// Investors who purchase Green Brew Bonds not only provide vital capital for these initiatives but also gain access to a diversified investment opportunity. The bonds offer competitive financial returns, combining the stability of fixed-income securities with the potential for growth associated with sustainable investments. Furthermore, the tokenized nature of the bonds ensures liquidity and accessibility, allowing investors of all sizes to participate in supporting sustainable coffee production.

// Through the issuance of Green Brew Bonds, coffee producers and farmers can access much-needed financing to implement sustainable practices, improve their livelihoods, and mitigate the environmental impact of coffee cultivation. By fostering a more sustainable and equitable coffee industry, the bonds contribute to the achievement of broader environmental and social goals.`
//   }
// };

// const ProjectDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//     const [securityToken, setSecurityToken] = useState()
//     const handleDetailsClick = (symbol: string) => {
//       navigate(`/project/${symbol.toLowerCase()}`);
//     };
  
//   const run =async () => { 
//     const stdata =  await getSTData()
//     console.log(stdata)


//     // setSecurityTokens(stdata.content.filter((contract)=>contract.symbol === id))
//     console.log(stdata.content.filter((contract)=>contract.symbol.toLowerCase() === id))
//     const securityTokenContract = stdata.content.filter((contract)=>contract.symbol.toLowerCase() === id)
//     console.log(securityTokenContract[0])
//     setSecurityToken(securityTokenContract[0])
//     return stdata
//    }
  
//     useEffect(()=>{
//         const res=run() 
//         console.log(res)
//     },[])
  
//   const project = projectData["gbb"];

//   if (!project||!securityToken) {
//     return <div>Project not found</div>;
//   }

//   const handleQualifyClick = () => {
//     navigate('/qualification/start');
//   };



//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       <div className="p-8">
//         <div className="flex items-center space-x-4 mb-6">
//           <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
//             <ArrowLeft className="w-4 h-4" />
//           </Button>
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
//               {securityToken?.symbol}
//             </div>
//             <span className="text-gray-600">{project.name}</span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <div className="bg-green-600 h-64 rounded-lg mb-6 relative overflow-hidden">
//               <img 
//                 src={securityToken?.logo}
//                 alt="Coffee farming" 
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             <Tabs defaultValue="overview" className="w-full">
//               <TabsList className="grid w-full grid-cols-3">
//                 <TabsTrigger value="overview">Overview</TabsTrigger>
//                 <TabsTrigger value="documents">Documents</TabsTrigger>
//                 <TabsTrigger value="token-details">Token details</TabsTrigger>
//               </TabsList>
              

//               <TabsContent value="token-details" className="space-y-6">
  

//   <div>
//     <h3 className="text-lg font-semibold mb-4">Required Claims to Mint</h3>
//     <ul className="list-disc pl-6 text-sm text-gray-700">
//       <li>KYC - Required from Onfido</li>
//       {/* Add more claims here if needed */}
//     </ul>
//   </div>
// </TabsContent>


//               <TabsContent value="overview" className="space-y-6">

//                 {securityToken?.claimData && (
//   <>
//     <h3 className="text-lg font-semibold mb-4">Trusted Issuers</h3>
//     <ul className="list-disc pl-6 text-sm text-gray-700">
//       {securityToken?.claimData?.data?.map((claim, i) => (
//         <li key={i}>
//           <strong>Name:</strong> {claim.issuer}<br />
//           <strong>Claim:</strong> {claim.name}<br />
//           <strong>Contract:</strong> {claim.contract}
//         </li>
//       ))}
//     </ul>

//     <h3 className="text-lg font-semibold mb-4 mt-6">Required Claims to Mint</h3>
//     <ul className="list-disc pl-6 text-sm text-gray-700">
//       {securityToken?.claimData?.data?.map((claim, i) => (
//         <li key={i}>{claim.name} - Required from {claim.issuer}</li>
//       ))}
//     </ul>
//   </>
// )}
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">Team</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     {project.team.map((member, index) => (
//                       <div key={index} className="text-center">
//                         <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
//                         <h4 className="font-medium">{member.name}</h4>
//                         <p className="text-sm text-gray-600">{member.role}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">Token details</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
//                     <div>
//                       <span className="text-gray-500">Token address</span>
//                       <p className="font-medium text-blue-600">{securityToken?.tokenAddress?.slice(0,6)}...{securityToken?.tokenAddress?.slice(-6)}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Token symbol</span>
//                       <p className="font-medium">{securityToken?.symbol}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Token status</span>
//                       <p className="font-medium text-green-600">{securityToken?.status}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Price per token</span>
//                       <p className="font-medium">{project.pricePerToken}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Instrument type</span>
//                       <p className="font-medium">{project.instrumentType}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Open to secondary trading</span>
//                       <p className="font-medium">Yes</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Token name</span>
//                       <p className="font-medium">{securityToken.name}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Token standard</span>
//                       <p className="font-medium">{project.tokenStandard}</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Blockchain network</span>
//                       <p className="font-medium text-purple-600">{project.blockchainNetwork}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-gray-700 leading-relaxed">{securityToken.description}</p>
//                 </div>
//               </TabsContent>
              
//               <TabsContent value="documents">
//                 <p>Documents will be displayed here.</p>
//               </TabsContent>
              
//               <TabsContent value="token-details">
//                 <p>Detailed token information will be displayed here.</p>
//               </TabsContent>
//             </Tabs>
//           </div>

//           <div className="space-y-6">
//             <div className="bg-white border border-gray-200 rounded-lg p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <span className="text-gray-600">Your balance</span>
//                 <Badge variant="destructive">{project.status}</Badge>
//               </div>
//               <div className="text-xl font-bold mb-6">{project.balance}</div>
              
//               <p className="text-gray-600 text-sm mb-6">
//                 You need to verify your identity to invest in this offering. You can create your first order after you are qualified to invest.
//               </p>
              
//               <Button onClick={handleQualifyClick} className="w-full bg-gray-900 hover:bg-gray-800">
//                 Get qualified and invest
//               </Button>
//             </div>





//             <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="text-gray-500">Start date</span>
//                   <p className="font-medium">{project?.startDate}</p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">End date</span>
//                   <p className="font-medium">{project?.endDate}</p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Offering status</span>
//                   <p className="font-medium">{project?.offeringStatus}</p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Allowed countries</span>
//                   <p className="font-medium">{project?.allowedCountries}</p>
//                 </div>
//                 <div className="col-span-2">
//                   <span className="text-gray-500">Jurisdiction</span>
//                   <p className="font-medium">{project?.jurisdiction}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-purple-500 text-white p-6 rounded-lg mt-8">
//           <h4 className="font-medium mb-2">
//             After you have read the project overview, click 'Get qualified and invest' to proceed.
//           </h4>
//           <div className="flex items-center justify-between mt-4">
//             <span className="text-sm">18 of 51</span>
//             <div className="flex space-x-2">
//               <Button variant="secondary" size="sm">←</Button>
//               <Button variant="secondary" size="sm">→</Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectDetails;



import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Shield,
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  Network,
  Hash,
  Target,
  Database,
  Settings,
} from "lucide-react"
import { getSTData } from "@/hooks/use-ST"

// Static project data that complements the API data
const projectData = {
  tds: {
    team: [
      { name: "Alex Thompson", role: "Platform Architect", avatar: "/placeholder.svg?height=80&width=80" },
      { name: "Sarah Chen", role: "Blockchain Developer", avatar: "/placeholder.svg?height=80&width=80" },
      { name: "Marcus Rodriguez", role: "Product Manager", avatar: "/placeholder.svg?height=80&width=80" },
    ],
    pricePerToken: "$0.10",
    instrumentType: "Utility Token",
    balance: "$0.00",
    status: "Not Qualified",
    startDate: "May 15, 2023",
    endDate: "Dec 31, 2024",
    offeringStatus: "Active",
    allowedCountries: "Global",
    jurisdiction: "Switzerland",
    totalRaised: "$850K",
    targetAmount: "$2.0M",
    investors: 234,
    minInvestment: "$100",
  },
  gbb: {
    team: [
      { name: "Maria Rodriguez", role: "Plantation Manager", avatar: "/placeholder.svg?height=80&width=80" },
      { name: "Carlos Santos", role: "Agricultural Expert", avatar: "/placeholder.svg?height=80&width=80" },
      { name: "Ana Gutierrez", role: "Sustainability Director", avatar: "/placeholder.svg?height=80&width=80" },
    ],
    pricePerToken: "$50.00",
    instrumentType: "Security Token",
    balance: "$0.00",
    status: "Not Qualified",
    startDate: "Apr 10, 2023",
    endDate: "Dec 31, 2024",
    offeringStatus: "Active",
    allowedCountries: "US, CA, UK, EU",
    jurisdiction: "Delaware, USA",
    totalRaised: "$2.4M",
    targetAmount: "$5.0M",
    investors: 156,
    minInvestment: "$1,000",
  },
}

const ProjectDetails =()=> {
  const params = useParams()
const navigate = useNavigate();
  const [securityToken, setSecurityToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const id = params?.id as string

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching ST data for ID:", id)
        const stdata = await getSTData()
        console.log("ST data received:", stdata)

        // Filter the data based on the symbol from URL params
        const filteredTokens = stdata.content.filter((contract) => contract.symbol.toLowerCase() === id?.toLowerCase())

        console.log("Filtered tokens:", filteredTokens)

        if (filteredTokens.length > 0) {
          const securityTokenContract = filteredTokens[0]
          console.log("Selected security token:", securityTokenContract)
          setSecurityToken(securityTokenContract)
        } else {
          console.log("No token found for symbol:", id)
          setError("Token not found")
        }
      } catch (err) {
        console.error("Error fetching token data:", err)
        setError("Failed to load token data")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTokenData()
    }
  }, [id])

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Get project data based on the token symbol
  const project = projectData[id?.toLowerCase() as keyof typeof projectData]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading token details...</p>
        </div>
      </div>
    )
  }

  if (error || !securityToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{error || "Token Not Found"}</h2>
            <p className="text-gray-600 mb-6">
              {error === "Token not found"
                ? `No token found with symbol "${id?.toUpperCase()}". Available tokens: TDS, GBB`
                : "There was an error loading the token details. Please try again."}
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Use project data if available, otherwise create defaults
  const projectInfo = project || {
    team: [],
    pricePerToken: "TBD",
    instrumentType: "Utility Token",
    balance: "$0.00",
    status: "Not Qualified",
    startDate: new Date(securityToken.createdAt).toLocaleDateString(),
    endDate: "TBD",
    offeringStatus: "Active",
    allowedCountries: "Global",
    jurisdiction: "TBD",
    totalRaised: "TBD",
    targetAmount: "TBD",
    investors: 0,
    minInvestment: "$100",
  }

  const maxBalance = securityToken.modules?.data?.MaxBalanceModule?.[0] || 0
  const progressPercentage = project
    ? (Number.parseFloat(project.totalRaised.replace("$", "").replace("K", "").replace("M", "")) /
        Number.parseFloat(project.targetAmount.replace("$", "").replace("K", "").replace("M", ""))) *
      100
    : 0

  return (
    <div className="min-h-screen pt-[5%] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="hover:bg-white/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                {securityToken?.symbol}
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{securityToken?.name}</h1>
              <p className="text-gray-600">{securityToken?.objective}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Hero Image */}
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="relative h-80 bg-gradient-to-r from-blue-600 to-purple-800">
                <img
                  src={securityToken?.logo || "/placeholder.svg?height=400&width=600"}
                  alt="Token visualization"
                  className="w-full h-full object-cover mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center space-x-4 mb-2">
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Active Token
                    </Badge>
                    <Badge variant="outline" className="border-white text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      {securityToken?.network?.name}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-semibold">{securityToken?.name}</h2>
                  <p className="text-sm text-gray-200 mt-1">{securityToken?.prefix}</p>
                </div>
              </div>
            </Card>

            {/* Progress Card - Only show if we have project data */}
            {project && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Funding Progress</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {project.totalRaised} <span className="text-lg text-gray-500">/ {project.targetAmount}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{project.investors} investors</p>
                      <p className="text-lg font-semibold text-blue-600">{progressPercentage.toFixed(1)}% funded</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Min Investment</p>
                      <p className="font-semibold">{project.minInvestment}</p>
                    </div>
                    <div>
                      <Database className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Max Balance</p>
                      <p className="font-semibold">{maxBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <Hash className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Decimals</p>
                      <p className="font-semibold">{securityToken.decimals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs */}
            <Card className="border-0 shadow-lg">
              <Tabs defaultValue="overview" className="w-full">
                <CardHeader className="pb-4">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="technical"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Technical Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="compliance"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Compliance
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="space-y-8">
                  <TabsContent value="overview" className="space-y-8 mt-0">
                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-blue-600" />
                        Token Objective
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg mb-4">{securityToken.objective}</p>
                      <p className="text-gray-600 leading-relaxed">{securityToken.description}</p>
                    </div>

                    <Separator />

                    {/* Team - Only show if we have team data */}
                    

                    {/* Token Information Grid */}
                    <div>
                      <h3 className="text-xl font-semibold mb-6 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-blue-600" />
                        Token Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Token Address</p>
                                <p className="font-mono text-sm font-medium text-blue-700">
                                  {securityToken?.tokenAddress?.slice(0, 6)}...{securityToken?.tokenAddress?.slice(-6)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(securityToken?.tokenAddress)}
                                className="h-8 w-8 p-0"
                              >
                                {copied ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-emerald-50 to-emerald-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Token Symbol</p>
                            <p className="font-semibold text-emerald-700">{securityToken?.symbol}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Token Name</p>
                            <p className="font-semibold text-purple-700">{securityToken?.name}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Network</p>
                            <p className="font-semibold text-orange-700">{securityToken?.network?.name}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-pink-50 to-pink-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Chain ID</p>
                            <p className="font-semibold text-pink-700">{securityToken?.network?.chainId}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-indigo-50 to-indigo-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Decimals</p>
                            <p className="font-semibold text-indigo-700">{securityToken?.decimals}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Max Balance</p>
                            <p className="font-semibold text-green-700">{maxBalance.toLocaleString()}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Created</p>
                            <p className="font-semibold text-yellow-700">
                              {new Date(securityToken?.createdAt).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Last Updated</p>
                            <p className="font-semibold text-red-700">
                              {new Date(securityToken?.updatedAt).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="technical" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-blue-600" />
                        Contract Suite
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(securityToken?.contractSuite?.data || {}).map(([key, value]) => (
                          <Card key={key} className="border-0 bg-gradient-to-r from-gray-50 to-gray-100">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900 capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </p>
                                  <p className="text-xs text-gray-500 font-mono">{value as string}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(value as string)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Network className="w-5 h-5 mr-2 text-purple-600" />
                        Network Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Network Name</p>
                            <p className="font-semibold text-purple-700">{securityToken?.network?.name}</p>
                          </CardContent>
                        </Card>
                        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Chain ID</p>
                            <p className="font-semibold text-blue-700">{securityToken?.network?.chainId}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Database className="w-5 h-5 mr-2 text-green-600" />
                        Agent Addresses
                      </h3>
                      <div className="space-y-4">
                        <Card className="border-0 bg-gradient-to-r from-green-50 to-green-100">
                          <CardContent className="p-4">
                            <p className="font-semibold text-gray-900">Owner Address</p>
                            <p className="text-xs text-gray-500 font-mono">{securityToken?.ownerAddress}</p>
                          </CardContent>
                        </Card>
                        {securityToken?.tokenAgentAddress?.data?.map((address, index) => (
                          <Card key={index} className="border-0 bg-gradient-to-r from-blue-50 to-blue-100">
                            <CardContent className="p-4">
                              <p className="font-semibold text-gray-900">Token Agent Address {index + 1}</p>
                              <p className="text-xs text-gray-500 font-mono">{address}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="compliance" className="space-y-6 mt-0">
                    {securityToken?.claimData && (
                      <>
                        <div>
                          <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-blue-600" />
                            Required Claims
                          </h3>
                          <div className="space-y-4">
                            {securityToken?.claimData?.data?.map((claim, i) => (
                              <Card key={i} className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-semibold text-gray-900">{claim.issuer}</p>
                                      <p className="text-sm text-gray-600">{claim.name}</p>
                                      <p className="text-xs text-gray-500 font-mono">{claim.contract}</p>
                                    </div>
                                    <Badge className="bg-blue-100 text-blue-800">Required</Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
                            Compliance Requirements
                          </h3>
                          <div className="space-y-3">
                            {securityToken?.claimData?.data?.map((claim, i) => (
                              <div
                                key={i}
                                className="flex items-center p-4 bg-emerald-50 rounded-lg border border-emerald-200"
                              >
                                <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
                                <div>
                                  <p className="font-medium text-gray-900">{claim.name}</p>
                                  <p className="text-sm text-gray-600">Required from {claim.issuer}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Your Investment</CardTitle>
                  <Badge variant={projectInfo.status === "Not Qualified" ? "destructive" : "default"}>
                    {projectInfo.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                  <p className="text-3xl font-bold text-gray-900">{projectInfo.balance}</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Qualification Required</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Complete identity verification to start investing in this token.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => navigate(`/qualification/kyc-enhanced/${securityToken?.symbol}`)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  Get Qualified & Invest
                </Button>
              </CardContent>
            </Card>

            {/* Token Details */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Hash className="w-5 h-5 mr-2 text-gray-600" />
                  Token Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Symbol</p>
                    <p className="font-semibold text-gray-900">{securityToken?.symbol}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Prefix</p>
                    <p className="font-semibold text-gray-900">{securityToken?.prefix}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Decimals</p>
                    <p className="font-semibold text-gray-900">{securityToken?.decimals}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Max Balance</p>
                    <p className="font-semibold text-gray-900">{maxBalance.toLocaleString()}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Network</p>
                  <div className="flex items-center">
                    <Network className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="font-semibold text-gray-900">{securityToken?.network?.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Ready to Invest?
                </h4>
                <p className="text-purple-100 text-sm mb-4">
                  Complete your qualification process to unlock investment opportunities in this token.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-200">Step 1 of 3</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProjectDetails