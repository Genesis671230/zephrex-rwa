import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Globe,
  Lock,
  Unlock,
  Activity,
  BarChart3,
  FileText,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Building,
  Wallet,
  Zap,
  Star,
  AlertTriangle,
  Info,
} from "lucide-react"
import { getSTData } from "@/hooks/use-ST"

// Define proper TypeScript interfaces
interface TokenMetrics {
  totalTransactions: number;
  totalHolders: number;
  totalVolume: string;
}

interface TokenStats {
  totalHolders: number;
  totalTransfers: number;
  totalMinted: string;
  totalBurned: string;
  lastUpdated: string;
}

interface ComplianceModule {
  complianceSettings: any[];
  status: string;
  _id: string;
  address: string;
  name: string;
  settings: string;
  deployedAt: string;
}

interface SecurityToken {
  metrics: TokenMetrics;
  ownerJurisdiction: string;
  initialPrice: string;
  currency: string;
  minInvestment: string;
  maxInvestment: string;
  kycRequired: boolean;
  amlRequired: boolean;
  accreditedOnly: boolean;
  requiredClaims: any[];
  circulatingSupply: string;
  assetCurrency: string;
  jurisdiction: string;
  socialLinks: Record<string, any>;
  isActive: boolean;
  isPublic: boolean;
  isTradeable: boolean;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  owner: string;
  agents: string[];
  paused: boolean;
  deploymentSalt: string;
  claimTopics: any[];
  complianceModules: ComplianceModule[];
  stats: TokenStats;
  documents: any[];
  status: string;
  createdAt: string;
  updatedAt: string;
  tokenAgents: any[];
  id: string;
  // Additional properties that might exist
  logo?: string;
  objective?: string;
  description?: string;
  network?: {
    name: string;
    chainId: number;
  };
  prefix?: string;
  tokenAddress?: string;
  ownerAddress?: string;
  tokenAgentAddress?: {
    data: string[];
  };
  contractSuite?: {
    data: Record<string, any>;
  };
  claimData?: {
    data: Array<{
      issuer: string;
      name: string;
      contract: string;
    }>;
  };
  modules?: {
    data: {
      MaxBalanceModule?: number[];
    };
  };
}

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

const ProjectDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [securityToken, setSecurityToken] = useState<SecurityToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const id = params?.id as string;

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching ST data for ID:", id);
        const stdata = await getSTData();
        console.log("ST data received:", stdata);

        // Filter the data based on the symbol from URL params
        const filteredTokens = stdata.filter((contract: any) => contract.symbol.toLowerCase() === id?.toLowerCase());

        console.log("Filtered tokens:", filteredTokens);

        if (filteredTokens.length > 0) {
          const securityTokenContract = filteredTokens[0];
          console.log("Selected security token:", securityTokenContract);
          setSecurityToken(securityTokenContract);
        } else {
          console.log("No token found for symbol:", id);
          setError("Token not found");
        }
      } catch (err) {
        console.error("Error fetching token data:", err);
        setError("Failed to load token data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTokenData();
    }
  }, [id]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get project data based on the token symbol
  const project = projectData[id?.toLowerCase() as keyof typeof projectData];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading token details...</p>
        </div>
      </div>
    );
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
    );
  }

  // Use project data if available, otherwise create defaults
  const projectInfo = project || {
    team: [],
    pricePerToken: securityToken.initialPrice ? `$${securityToken.initialPrice}` : "TBD",
    instrumentType: "Security Token",
    balance: "$0.00",
    status: "Not Qualified",
    startDate: new Date(securityToken.createdAt).toLocaleDateString(),
    endDate: "TBD",
    offeringStatus: securityToken.isActive ? "Active" : "Inactive",
    allowedCountries: "Global",
    jurisdiction: securityToken.jurisdiction || "TBD",
    totalRaised: "TBD",
    targetAmount: "TBD",
    investors: securityToken.metrics.totalHolders,
    minInvestment: `$${securityToken.minInvestment}`,
  };

  const maxBalance = securityToken.complianceModules?.find(m => m.name === "MaxBalanceModule")?.settings || "0";
  const progressPercentage = project
    ? (Number.parseFloat(project.totalRaised.replace("$", "").replace("K", "").replace("M", "")) /
        Number.parseFloat(project.targetAmount.replace("$", "").replace("K", "").replace("M", ""))) *
      100
    : 0;

  const formatNumber = (num: string | number) => {
    const n = typeof num === 'string' ? parseFloat(num) : num;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <p className="text-gray-600">{securityToken?.objective || "Security Token"}</p>
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
                    <Badge className={`${getStatusColor(securityToken.status)}`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {securityToken.status}
                    </Badge>
                    <Badge variant="outline" className="border-white text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      {securityToken.jurisdiction}
                    </Badge>
                    {securityToken.isTradeable && (
                      <Badge variant="outline" className="border-green-400 text-green-400">
                        <Zap className="w-3 h-3 mr-1" />
                        Tradeable
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold">{securityToken?.name}</h2>
                  <p className="text-sm text-gray-200 mt-1">{securityToken?.prefix || securityToken.symbol}</p>
                </div>
              </div>
            </Card>

            {/* Token Metrics */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(securityToken.metrics.totalHolders)}</p>
                    <p className="text-sm text-gray-600">Total Holders</p>
                  </div>
                  <div className="text-center">
                    <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(securityToken.metrics.totalTransactions)}</p>
                    <p className="text-sm text-gray-600">Transactions</p>
                  </div>
                  <div className="text-center">
                    <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">${formatNumber(securityToken.metrics.totalVolume)}</p>
                    <p className="text-sm text-gray-600">Total Volume</p>
                  </div>
                  <div className="text-center">
                    <Database className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(securityToken.totalSupply)}</p>
                    <p className="text-sm text-gray-600">Total Supply</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card className="border-0 shadow-lg">
              <Tabs defaultValue="overview" className="w-full">
                <CardHeader className="pb-4">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-100">
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
                      Technical
                    </TabsTrigger>
                    <TabsTrigger
                      value="compliance"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Compliance
                    </TabsTrigger>
                    <TabsTrigger
                      value="investment"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Investment
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="space-y-8">
                  <TabsContent value="overview" className="space-y-8 mt-0">
                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-blue-600" />
                        Token Overview
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg mb-4">
                        {securityToken.description || `${securityToken.name} is a security token with advanced compliance features and regulatory oversight.`}
                      </p>
                    </div>

                    <Separator />

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
                                  {securityToken?.address?.slice(0, 6)}...{securityToken?.address?.slice(-6)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => securityToken?.address && copyToClipboard(securityToken.address)}
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
                            <p className="text-sm text-gray-600">Jurisdiction</p>
                            <p className="font-semibold text-orange-700">{securityToken?.jurisdiction}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-pink-50 to-pink-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Decimals</p>
                            <p className="font-semibold text-pink-700">{securityToken?.decimals}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-indigo-50 to-indigo-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Initial Price</p>
                            <p className="font-semibold text-indigo-700">${securityToken?.initialPrice}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Circulating Supply</p>
                            <p className="font-semibold text-green-700">{formatNumber(securityToken?.circulatingSupply)}</p>
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
                        Contract Details
                      </h3>
                      <div className="space-y-4">
                        <Card className="border-0 bg-gradient-to-r from-gray-50 to-gray-100">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">Owner Address</p>
                                <p className="text-xs text-gray-500 font-mono">{securityToken?.owner}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => securityToken?.owner && copyToClipboard(securityToken.owner)}
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-r from-blue-50 to-blue-100">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">Deployment Salt</p>
                                <p className="text-xs text-gray-500 font-mono">{securityToken?.deploymentSalt}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => securityToken?.deploymentSalt && copyToClipboard(securityToken.deploymentSalt)}
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        {securityToken?.agents?.map((agent, index) => (
                          <Card key={index} className="border-0 bg-gradient-to-r from-green-50 to-green-100">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">Agent Address {index + 1}</p>
                                  <p className="text-xs text-gray-500 font-mono">{agent}</p>
                                </div>
                                                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={() => agent && copyToClipboard(agent)}
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
                        Token Status
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                              {securityToken?.paused ? (
                                <Lock className="w-5 h-5 text-red-600" />
                              ) : (
                                <Unlock className="w-5 h-5 text-green-600" />
                              )}
                              <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <p className="font-semibold text-purple-700">
                                  {securityToken?.paused ? "Paused" : "Active"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                              {securityToken?.isPublic ? (
                                <Eye className="w-5 h-5 text-blue-600" />
                              ) : (
                                <EyeOff className="w-5 h-5 text-gray-600" />
                              )}
                              <div>
                                <p className="text-sm text-gray-600">Visibility</p>
                                <p className="font-semibold text-blue-700">
                                  {securityToken?.isPublic ? "Public" : "Private"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="compliance" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-blue-600" />
                        Compliance Requirements
                      </h3>
                      <div className="space-y-4">
                        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {securityToken?.kycRequired ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                                )}
                                <div>
                                  <p className="font-semibold text-gray-900">KYC Required</p>
                                  <p className="text-sm text-gray-600">
                                    {securityToken?.kycRequired ? "Identity verification required" : "No KYC required"}
                                  </p>
                                </div>
                              </div>
                              <Badge className={securityToken?.kycRequired ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                {securityToken?.kycRequired ? "Required" : "Not Required"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-r from-purple-50 to-purple-100">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {securityToken?.amlRequired ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                                )}
                                <div>
                                  <p className="font-semibold text-gray-900">AML Required</p>
                                  <p className="text-sm text-gray-600">
                                    {securityToken?.amlRequired ? "Anti-money laundering checks required" : "No AML required"}
                                  </p>
                                </div>
                              </div>
                              <Badge className={securityToken?.amlRequired ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                {securityToken?.amlRequired ? "Required" : "Not Required"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-r from-emerald-50 to-emerald-100">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {securityToken?.accreditedOnly ? (
                                  <Star className="w-5 h-5 text-yellow-600" />
                                ) : (
                                  <Users className="w-5 h-5 text-gray-400" />
                                )}
                                <div>
                                  <p className="font-semibold text-gray-900">Accredited Investors Only</p>
                                  <p className="text-sm text-gray-600">
                                    {securityToken?.accreditedOnly ? "Limited to accredited investors" : "Open to all investors"}
                                  </p>
                                </div>
                              </div>
                              <Badge className={securityToken?.accreditedOnly ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}>
                                {securityToken?.accreditedOnly ? "Accredited Only" : "Open to All"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Database className="w-5 h-5 mr-2 text-green-600" />
                        Compliance Modules
                      </h3>
                      <div className="space-y-4">
                        {securityToken?.complianceModules?.map((module, index) => (
                          <Card key={index} className="border-0 bg-gradient-to-r from-green-50 to-green-100">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">{module.name}</p>
                                  <p className="text-sm text-gray-600">Status: {module.status}</p>
                                  <p className="text-xs text-gray-500 font-mono">{module.address}</p>
                                </div>
                                <div className="text-right">
                                  <Badge className="bg-green-100 text-green-800">{module.status}</Badge>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(module.deployedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="investment" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                        Investment Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Minimum Investment</p>
                            <p className="text-2xl font-bold text-green-700">${securityToken?.minInvestment}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Maximum Investment</p>
                            <p className="text-2xl font-bold text-blue-700">${formatNumber(securityToken?.maxInvestment)}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Initial Price</p>
                            <p className="text-2xl font-bold text-purple-700">${securityToken?.initialPrice}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Currency</p>
                            <p className="text-2xl font-bold text-orange-700">{securityToken?.currency}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                        Token Statistics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-0 bg-gradient-to-br from-indigo-50 to-indigo-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Total Holders</p>
                            <p className="text-2xl font-bold text-indigo-700">{securityToken?.stats?.totalHolders}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-pink-50 to-pink-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Total Transfers</p>
                            <p className="text-2xl font-bold text-pink-700">{securityToken?.stats?.totalTransfers}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-emerald-50 to-emerald-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Total Minted</p>
                            <p className="text-2xl font-bold text-emerald-700">{formatNumber(securityToken?.stats?.totalMinted)}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">Total Burned</p>
                            <p className="text-2xl font-bold text-red-700">{formatNumber(securityToken?.stats?.totalBurned)}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
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
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Decimals</p>
                    <p className="font-semibold text-gray-900">{securityToken?.decimals}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Initial Price</p>
                    <p className="font-semibold text-gray-900">${securityToken?.initialPrice}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Min Investment</p>
                    <p className="font-semibold text-gray-900">${securityToken?.minInvestment}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Jurisdiction</p>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="font-semibold text-gray-900">{securityToken?.jurisdiction}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
                  <div className="flex items-center">
                    {securityToken?.paused ? (
                      <Lock className="w-4 h-4 text-red-400 mr-2" />
                    ) : (
                      <Unlock className="w-4 h-4 text-green-400 mr-2" />
                    )}
                    <p className="font-semibold text-gray-900">
                      {securityToken?.paused ? "Paused" : "Active"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-gray-600" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">KYC Required</span>
                    <Badge className={securityToken?.kycRequired ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {securityToken?.kycRequired ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">AML Required</span>
                    <Badge className={securityToken?.amlRequired ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {securityToken?.amlRequired ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Accredited Only</span>
                    <Badge className={securityToken?.accreditedOnly ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}>
                      {securityToken?.accreditedOnly ? "Yes" : "No"}
                    </Badge>
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
  );
};

export default ProjectDetails;