"use client"

import { useEffect, useState } from "react"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Label } from "../../../components/ui/label"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { Progress } from "../../../components/ui/progress"
import { Textarea } from "../../../components/ui/textarea"
import { Separator } from "../../../components/ui/separator"
import {
  BarChart3,
  Bell,
  Copy,
  Eye,
  FileText,
  MoreHorizontal,
  PieChart,
  Shield,
  TrendingUp,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Key,
  Plus,
  Loader2,
  ShoppingCart,
  Send,
  DollarSign,
  Filter,
  Search,
  Users,
  RefreshCw,
  Download,
  Wallet,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../../../components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { getInvestorList, getSTData } from "../../../hooks/use-ST"
import { useAppKit, useAppKitAccount } from "@reown/appkit/react"
import { toast } from "sonner"
import { ethers } from "ethers"
import identityAbi from "@/abis/identityAbi.json"
import { useWalletClient } from "wagmi"
import InvestmentModal from "./InvestmentModal"
import { Link } from "react-router"
import { Layout } from "@/pages/Dashboards/InvestorDashboard/Layout"

// Types
interface InvestorDetails {
  accreditedInvestorStatus: boolean
  countryCode: string
  countryOfResidence: string
  email: string
  fullName: string
  identityDocuments: {
    bankProof: string
    identityProof: string
    otherDocs: string[]
    proofOfAddress: string
    proofOfIncome: string
  }
  walletAddress: string
}

interface ClaimData {
  contract: string
  issuer: string
  name: string
}

interface ClaimForUser {
  data: string
  identity: string
  issuer: string
  scheme: number
  signature: string
  topic: string
  uri: string
}

interface ClaimStatus {
  accreditationVerified: boolean
  amlVerified: boolean
  jurisdictionCompliant: boolean
  kycVerified: boolean
  termsAccepted: boolean
}

interface InvestorData {
  investorId: string
  InvestorDetails: InvestorDetails
  tokenAddress: string
  investorAddress: string
  claimData: {
    data: ClaimData[]
  }
  investorIdentityAddress: string
  claimStatus: ClaimStatus
  status: string
  claimForUser: {
    data: ClaimForUser[]
  }
  piMetadata: {
    updationTimeMS: number
    creationTimeMS: number
    entityId: string
    tenantID: string
    transactionId: string
  }
  tokens: MarketplaceToken[]
}

interface MarketplaceToken {
  id: string
  symbol: string
  name: string
  price: number
  totalSupply: string
  availableSupply: string
  minInvestment: number
  maxInvestment: number
  apy: string
  maturity: string
  issuer: string
  description: string
  riskLevel: "Low" | "Medium" | "High"
  type: "DEBT" | "EQUITY" | "HYBRID"
  compliance: string[]
  documents: string[]
  tokenAddress: string
  issuerAddress: string
  decimals?: number
  logo?: string
  claimData?: {
    data: Array<{
      contract: string
      issuer: string
      name: string
    }>
  }
  network?: {
    chainId: string
    name: string
    rpcUrl: string
  }
}

interface Transaction {
  id: string
  type: "investment" | "transfer" | "mint" | "burn" | "claim"
  tokenSymbol: string
  tokenName?: string
  amount: string
  value: string
  currency: string
  status: "pending" | "processing" | "completed" | "failed"
  date: string
  txHash?: string
  fromAddress?: string
  toAddress?: string
  expectedCompletion?: string
  fees?: string
  investmentAmount?: string
  tokenPrice?: string
  paymentMethod?: string
  apy?: string
  issuer?: string
  maturity?: string
  referenceId?: string
  notes?: string
  riskLevel?: string
}

interface InvestmentOrder {
  id: string
  tokenId: string
  amount: number
  currency: string
  totalValue: number
  status: "draft" | "pending" | "processing" | "completed" | "failed"
  createdAt: string
  expectedTokens: number
  fees: number
  paymentMethod: string
}

const mockMarketplaceTokens: MarketplaceToken[] = [
  {
    id: "1",
    symbol: "GBB",
    name: "Green Brew Bond",
    price: 10.43,
    totalSupply: "1,000,000",
    availableSupply: "750,000",
    minInvestment: 1000,
    maxInvestment: 100000,
    apy: "8.5%",
    maturity: "2025-12-31",
    issuer: "EcoFinance Corp",
    description: "Sustainable coffee production bonds with quarterly interest payments",
    riskLevel: "Low",
    type: "DEBT",
    compliance: ["KYC", "AML", "ACCREDITED"],
    documents: ["Prospectus", "Financial Statements", "Legal Opinion"],
    tokenAddress: "0x97C1E24C5A5D5F5b5e5D5c5B5a5F5E5d5C5b5A5f",
    issuerAddress: "0x1234567890ABCDEFabcdef1234567890ABCDEF12",
    decimals: 18,
    logo: "https://ui-avatars.com/api/?name=GBB&background=6366f1&color=fff",
    claimData: {
      data: [
        { contract: "0x1234567890ABCDEFabcdef1234567890ABCDEF12", issuer: "EcoFinance Corp", name: "KYC" },
        { contract: "0x234567890ABCDEFabcdef1234567890ABCDEF12", issuer: "AML Compliance", name: "AML" },
        { contract: "0x34567890ABCDEFabcdef1234567890ABCDEF12", issuer: "Accredited Investor", name: "ACCREDITED" },
      ],
    },
    network: {
      chainId: "11155111",
      name: "Ethereum Sepolia",
      rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    },
  },
  {
    id: "2",
    symbol: "REIT",
    name: "Royal Real Estate Token",
    price: 25.67,
    totalSupply: "500,000",
    availableSupply: "320,000",
    minInvestment: 2500,
    maxInvestment: 250000,
    apy: "12.3%",
    maturity: "Perpetual",
    issuer: "Royal Properties LLC",
    description: "Diversified real estate portfolio with monthly dividend distributions",
    riskLevel: "Medium",
    type: "EQUITY",
    compliance: ["KYC", "AML", "QUALIFIED_INVESTOR"],
    documents: ["REIT Prospectus", "Property Valuations", "Management Report"],
    tokenAddress: "0x87C1E24C5A5D5F5b5e5D5c5B5a5F5E5d5C5b5A5f",
    issuerAddress: "0x2234567890ABCDEFabcdef1234567890ABCDEF12",
    decimals: 18,
    logo: "https://ui-avatars.com/api/?name=REIT&background=6366f1&color=fff",
    claimData: {
      data: [
        { contract: "0x4567890ABCDEFabcdef1234567890ABCDEF12", issuer: "KYC Compliance", name: "KYC" },
        { contract: "0x567890ABCDEFabcdef1234567890ABCDEF12", issuer: "AML Compliance", name: "AML" },
        { contract: "0x67890ABCDEFabcdef1234567890ABCDEF12", issuer: "Qualified Investor", name: "QUALIFIED_INVESTOR" },
      ],
    },
    network: {
      chainId: "11155111",
      name: "Ethereum Sepolia",
      rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    },
  },
]

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "investment",
    tokenSymbol: "GBB",
    tokenName: "Green Brew Bond",
    amount: "100",
    value: "1,043.00",
    currency: "USDC",
    status: "completed",
    date: "2024-01-15",
    txHash: "0x1234...5678",
    toAddress: "0x97C1E24C5A5D5F5b5e5D5c5B5a5F5E5d5C5b5A5f",
    fees: "5.00",
    investmentAmount: "1000",
    tokenPrice: "10.43",
    paymentMethod: "wallet",
    apy: "8.5%",
    issuer: "EcoFinance Corp",
    maturity: "2025-12-31",
    riskLevel: "Low",
  },
  {
    id: "2",
    type: "transfer",
    tokenSymbol: "REIT",
    tokenName: "Royal Real Estate Token",
    amount: "25",
    value: "641.75",
    currency: "ETH",
    status: "processing",
    date: "2024-01-20",
    fromAddress: "0xc688cFCE83948...",
    toAddress: "0x9876543210ABCDEFabcdef9876543210ABCDEFab",
    expectedCompletion: "2024-01-21",
    fees: "0.002",
  },
]

const currencies = [
  { symbol: "USDC", name: "USD Coin", icon: "💵" },
  { symbol: "USDT", name: "Tether USD", icon: "💰" },
  { symbol: "ETH", name: "Ethereum", icon: "⟠" },
  { symbol: "DAI", name: "Dai Stablecoin", icon: "🏛️" },
]

const AdvancedInvestorPortfolio = () => {
  const [investorData, setInvestorData] = useState<InvestorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [signerKeyApproved, setSignerKeyApproved] = useState(false)
  const [approvingSignerKey, setApprovingSignerKey] = useState(false)
  const [addingClaim, setAddingClaim] = useState<string | null>(null)
  const [selectedClaims, setSelectedClaims] = useState<string[]>(["KYC", "AML", "ACCREDITED"])
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [investmentOrders, setInvestmentOrders] = useState<InvestmentOrder[]>([])
  const [selectedToken, setSelectedToken] = useState<MarketplaceToken | null>(null)
  const [p2pDrawerOpen, setP2pDrawerOpen] = useState(false)
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false)
  const [tokens,setTokens] = useState<MarketplaceToken[]>(mockMarketplaceTokens)
  const [walletTokens, setWalletTokens] = useState<Set<string>>(new Set())
  const [checkingWalletTokens, setCheckingWalletTokens] = useState(false)
  // Investment form state
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("USDC")
  const [paymentMethod, setPaymentMethod] = useState("wallet")

  // P2P transfer state
  const [p2pRecipient, setP2pRecipient] = useState("")
  const [p2pTokenSymbol, setP2pTokenSymbol] = useState("")
  const [p2pAmount, setP2pAmount] = useState("")
  const [p2pMessage, setP2pMessage] = useState("")

  const { address: appKitAddress, isConnected } = useAppKitAccount()
  const { open } = useAppKit()
  const { data: walletClient } = useWalletClient()

  const fetchInvestorData = async () => {
    try {
      setLoading(true)
      const res = await getInvestorList()
      console.log("API Response:", res)

      if (!isConnected) {
        open()
        return
      }

      if (appKitAddress) {
        const investorDetails = res.content.filter(
          (investor: any) => investor.investorAddress.toLowerCase() === appKitAddress.toLowerCase(),
        )
        const allTokens = investorDetails.map((investor: any) => investor.tokenAddress)

        const tokens = await getSTData()
        const filteredTokens = tokens.content.filter((token: any) => allTokens.includes(token.tokenAddress))  
        console.log("Tokens:", filteredTokens)
        setTokens(filteredTokens)
        const details = {...investorDetails[0], tokens: filteredTokens} 
        console.log("Filtered investor details:", details)
        setInvestorData(details)
        setSignerKeyApproved(details.claimStatus?.kycVerified||true)

      }
    } catch (error) {
      console.error("Error fetching investor data:", error)
      toast.error("Failed to fetch investor data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvestorData()
  }, [appKitAddress])

  useEffect(() => {
    if (isConnected && tokens.length > 0) {
      getWalletTokens()
    }
  }, [isConnected, tokens])

  const handleApproveSignerKey = async (issuerAddress: string) => {
    if (!investorData || !walletClient) return

    setApprovingSignerKey(true)
    try {
      toast.loading("Approving ClaimIssuer signer key...", { id: "approve-signer" })

      const provider = new ethers.BrowserProvider(walletClient)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(investorData.investorIdentityAddress, identityAbi, signer)

      const issuerSignerKey = ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["address"], [issuerAddress]))

      const tx = await contract.addKey(issuerSignerKey, 3, 1, { gasLimit: 1000000 })
      await tx.wait()

      setSignerKeyApproved(true)
      toast.success("ClaimIssuer signer key approved successfully!", { id: "approve-signer" })
    } catch (error) {
      console.error("Error approving signer key:", error)
      toast.error("Failed to approve signer key", { id: "approve-signer" })
    } finally {
      setApprovingSignerKey(false)
    }
  }

  const handleAddClaim = async (issuerAddress: string, claimTopic: string, claimForUser: ClaimForUser) => {
    if (!investorData || !walletClient) return

    setAddingClaim(claimTopic)
    try {
      toast.loading(`Adding ${claimTopic} claim...`, { id: `add-claim-${claimTopic}` })

      const provider = new ethers.BrowserProvider(walletClient)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(investorData.investorIdentityAddress, identityAbi, signer)

      const tx = await contract.addClaim(
        claimTopic,
        1,
        issuerAddress,
        claimForUser.signature,
        claimForUser.data,
        claimForUser.uri,
      )
      await tx.wait()

      setSelectedClaims((prev) => [...prev, claimTopic])
      toast.success(`${claimTopic} claim added successfully!`, { id: `add-claim-${claimTopic}` })
    } catch (error) {
      console.error("Error adding claim:", error)
      toast.error(`Failed to add ${claimTopic} claim`, { id: `add-claim-${claimTopic}` })
    } finally {
      setAddingClaim(null)
    }
  }

  const handleP2PTransfer = async () => {
    if (!p2pRecipient || !p2pTokenSymbol || !p2pAmount) return

    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "transfer",
      tokenSymbol: p2pTokenSymbol,
      amount: p2pAmount,
      value: (Number.parseFloat(p2pAmount) * 25.67).toFixed(2), // Mock price
      currency: "USD",
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      fromAddress: appKitAddress,
      toAddress: p2pRecipient,
      expectedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().split("T")[0],
      fees: "0.001",
    }

    setTransactions((prev) => [transaction, ...prev])
    setP2pDrawerOpen(false)
    setP2pRecipient("")
    setP2pTokenSymbol("")
    setP2pAmount("")
    setP2pMessage("")

    toast.success(`P2P transfer initiated for ${p2pAmount} ${p2pTokenSymbol} tokens`)

    // Simulate processing
    setTimeout(() => {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === transaction.id ? { ...tx, status: "completed", txHash: "0x" + Math.random().toString(16) } : tx,
        ),
      )
      toast.success("P2P transfer completed successfully!")
    }, 5000)
  }

  const getOnChainIDStatus = () => {
    if (!investorData) return "loading"
    if (!investorData.investorIdentityAddress || investorData.investorIdentityAddress === "0x0") {
      return "pending"
    }
    return "active"
  }

  const getComplianceScore = () => {
    if (!investorData?.claimStatus) return 0
    const statuses = Object.values(investorData.claimStatus)
    const trueCount = statuses.filter(Boolean).length
    return Math.round((trueCount / statuses.length) * 100)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const canInvestInToken = (token: MarketplaceToken) => {
    // if (!signerKeyApproved || selectedClaims.length === 0) return false
    // return token.compliance.every((requirement) => selectedClaims.includes(requirement))
    return true
  }

  // Check if token exists in MetaMask wallet
  const checkTokenInWallet = async (tokenAddress: string): Promise<boolean> => {
    if (!window.ethereum) return false
    
    try {
      // Get the current network
      const chainId = await (window.ethereum as any).request({ method: 'eth_chainId' })
      
      // Check if we have this token in our tracked list
      return walletTokens.has(tokenAddress.toLowerCase())
    } catch (error) {
      console.error("Error checking token in wallet:", error)
      return false
    }
  }

  // Get tokens from MetaMask wallet
  const getWalletTokens = async () => {
    if (!window.ethereum || !isConnected) return

    setCheckingWalletTokens(true)
    try {
      // Get the current network
      const chainId = await (window.ethereum as any).request({ method: 'eth_chainId' })
      
      // Get account
      const accounts = await (window.ethereum as any).request({ method: 'eth_accounts' })
      if (!accounts || accounts.length === 0) return

      const account = accounts[0]
      
      // Get token balances for the current account
      // Note: This is a simplified approach. In a real implementation, you might want to
      // track tokens that have been added to MetaMask more comprehensively
      const tokenAddresses = new Set<string>()
      
      // For now, we'll check if any of our marketplace tokens are in the wallet
      // In a real implementation, you might want to query the blockchain for all ERC20 tokens
      for (const token of tokens) {
        try {
          const balance = await (window.ethereum as any).request({
            method: 'eth_call',
            params: [{
              to: token.tokenAddress,
              data: '0x70a08231' + '000000000000000000000000' + account.slice(2), // balanceOf(address)
            }, 'latest']
          })
          
          // If balance is greater than 0, token exists in wallet
          if (balance && balance !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
            tokenAddresses.add(token.tokenAddress.toLowerCase())
          }
        } catch (error) {
          // Token might not exist or contract might be invalid
          console.log(`Token ${token.symbol} not found in wallet`)
        }
      }
      
      setWalletTokens(tokenAddresses)
    } catch (error) {
      console.error("Error getting wallet tokens:", error)
    } finally {
      setCheckingWalletTokens(false)
    }
  }

  // Add to MetaMask function
  const addTokenToMetaMask = async (token: any) => {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed")
      return
    }

    try {
      const wasAdded = await (window.ethereum as any).request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token.tokenAddress,
            symbol: token.symbol,
            decimals: token.decimals || 18,
            image: token.logo || `https://ui-avatars.com/api/?name=${token.symbol}&background=6366f1&color=fff`,
          },
        },
      })

      if (wasAdded) {
        toast.success(`${token.symbol} token added to MetaMask successfully!`)
        // Add to our tracked tokens
        setWalletTokens(prev => new Set([...prev, token.tokenAddress.toLowerCase()]))
      } else {
        toast.error("Failed to add token to MetaMask")
      }
    } catch (error) {
      console.error("Error adding token to MetaMask:", error)
      toast.error("Failed to add token to MetaMask")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p>Loading investor portfolio...</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>Please connect your wallet to view your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => open()} className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!investorData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CardTitle>No Investor Data</CardTitle>
            <CardDescription>No investor profile found for this wallet address</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchInvestorData} className="w-full">
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const onChainIDStatus = getOnChainIDStatus()
  const complianceScore = getComplianceScore()

  return (

    <Layout>

    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
    

      <div className="flex mt-[10%] m-4">
        {/* Sidebar */}


        {/* Main Content */}
        <main className="flex-1 ">
          {/* OnChainID Status Banner */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {onChainIDStatus === "pending" ? (
                    <Clock className="h-5 w-5 text-amber-600" />
                  ) : onChainIDStatus === "active" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  )}
                  <div>
                    <p className="font-medium">
                      OnChainID Status:{" "}
                      {onChainIDStatus === "pending"
                        ? "Pending"
                        : onChainIDStatus === "active"
                          ? "Active"
                          : "Loading..."}
                    </p>
                    {onChainIDStatus === "active" && (
                      <div className="flex items-center space-x-2">
                        <p className="font-mono text-sm text-gray-600">
                          {investorData.investorIdentityAddress.slice(0, 10)}...
                          {investorData.investorIdentityAddress.slice(-8)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(investorData.investorIdentityAddress)}
                        >
                          <Copy className="h-3 w-3" />
                          
                        </Button>

                        <a href={`https://sepolia.etherscan.io/address/${investorData.investorIdentityAddress}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                          <Button variant="ghost" size="sm" className="text-purple-700">
                          <ExternalLink className="text-purple-700 mr-2 h-4 w-4" />
                          View on Sepolia Scan
                          </Button>
                        </a>

                      </div>
                    )}
                  </div>
                </div>
                {onChainIDStatus === "active" && !signerKeyApproved && (
                  <Button
                    onClick={() => handleApproveSignerKey(investorData.claimData.data[0].contract)}
                    disabled={approvingSignerKey}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {approvingSignerKey ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Approve ClaimIssuer
                      </>
                    )}
                  </Button>
                )}
                {signerKeyApproved && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    ClaimIssuer Approved
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Overview */}
          <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
                <DollarSign className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450.75</div>
                <p className="text-xs opacity-80">+8.2% this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Across 2 tokens</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Claims Added</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedClaims.length}</div>
                <p className="text-xs text-muted-foreground">of {investorData.claimData?.data?.length} available</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{complianceScore}%</div>
                <Progress value={complianceScore} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="marketplace" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="holdings">Holdings</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="identity">Identity</TabsTrigger>
              <TabsTrigger value="p2p">P2P Transfer</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Marketplace Tab */}
            <TabsContent value="marketplace" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Token Marketplace</h2>
                  <p className="text-muted-foreground">Discover and invest in security tokens</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {investorData.tokens.map((token:any) => (
                  <Card key={token.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                            {token.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{token.symbol}</CardTitle>
                            <CardDescription>{token.issuer}</CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${token.riskLevel === "Low" ? "border-green-300 text-green-700" : token.riskLevel === "Medium" ? "border-yellow-300 text-yellow-700" : "border-red-300 text-red-700"}`}
                        >
                          {token.riskLevel}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Price</span>
                            <p className="font-mono font-medium">${token.price}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">APY</span>
                            <Badge variant="secondary" className="text-green-700 bg-green-100">
                              {token.apy}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Type</span>
                            <p className="font-medium">{token.type}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Maturity</span>
                            <p className="text-sm">{token.maturity}</p>
                          </div>
                        </div>

                        <div>
                          <span className="text-muted-foreground text-sm">Available Supply</span>
                          <div className="flex items-center space-x-2">
                            {/* <Progress
                              value={
                                ((Number.parseInt(token.totalSupply.replace(/,/g, "")) -
                                  Number.parseInt(token.availableSupply.replace(/,/g, ""))) /
                                  Number.parseInt(token.totalSupply.replace(/,/g, ""))) *
                                100
                              }
                              className="flex-1"
                            /> */}
                            <span className="text-xs text-muted-foreground">{token.availableSupply}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-muted-foreground text-sm">Required Claims</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {token.claimData?.data?.map((req: any) => (
                              <Badge
                                key={req.name}
                                variant={selectedClaims.includes(req.name) ? "default" : "outline"}
                                className={selectedClaims.includes(req.name) ? "bg-green-100 text-green-700" : ""}
                              >
                                {req.name}
                              </Badge>
                            )) || (
                              <p className="text-sm text-muted-foreground">No compliance requirements specified</p>
                            )}
                          </div>
                        </div>

                        <Separator />

                        <div className="flex space-x-2">
                          <InvestmentModal
                            isOpen={investmentModalOpen}
                            onClose={() => setInvestmentModalOpen(false)}
                            token={selectedToken as any}
                            investorData={investorData}
                            onInvestmentComplete={(transaction:any) => {
                              setTransactions((prev) => [transaction, ...prev])
                              toast.success(
                                `Investment of ${transaction.amount} ${transaction.tokenSymbol} tokens submitted successfully!`,
                              )
                            }}
                          />
                          <Button
                            className="flex-1"
                            disabled={!canInvestInToken(token)}
                            onClick={() => {
                              setSelectedToken(token)
                              setInvestmentModalOpen(true)
                            }}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Invest
                          </Button>

                          {!walletTokens.has(token.tokenAddress.toLowerCase()) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addTokenToMetaMask(token)}
                              className="flex items-center space-x-1"
                              disabled={checkingWalletTokens}
                            >
                              {checkingWalletTokens ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Wallet className="mr-2 h-4 w-4" />
                              )}
                              Add to Wallet
                            </Button>
                          )}

                          {walletTokens.has(token.tokenAddress.toLowerCase()) && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              In Wallet
                            </Badge>
                          )}

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="mr-2 h-4 w-4" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{token.name}</DialogTitle>
                                <DialogDescription>Comprehensive token information</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Token Symbol</Label>
                                    <p className="font-mono">{token.symbol}</p>
                                  </div>
                                  <div>
                                    <Label>Token Type</Label>
                                    <p>{token.type}</p>
                                  </div>
                                  <div>
                                    <Label>Issuer</Label>
                                    <p>{token.issuer}</p>
                                  </div>
                                  <div>
                                    <Label>Maturity</Label>
                                    <p>{token.maturity}</p>
                                  </div>
                                  <div>
                                    <Label>Token Address</Label>
                                    <div className="flex items-center space-x-2">
                                      <p className="font-mono text-sm">{token.tokenAddress}</p>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(token.tokenAddress)}
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Network</Label>
                                    <p className="text-sm">{token.network?.name || "Ethereum Sepolia"}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <p className="text-sm text-muted-foreground">{token.description}</p>
                                </div>
                                <div>
                                  <Label>Investment Range</Label>
                                  <p className="text-sm">
                                    ${token.minInvestment?.toLocaleString() || "N/A"} - ${token.maxInvestment?.toLocaleString() || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <Label>Compliance Requirements</Label>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {token.claimData?.data?.map((req: any) => (
                                      <Badge key={req.name} variant="outline" className="text-green-700 border-green-300">
                                        <Shield className="mr-1 h-3 w-3" />
                                        {req.name}
                                      </Badge>
                                    )) || (
                                      <p className="text-sm text-muted-foreground">No compliance requirements specified</p>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <Label>Available Documents</Label>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {token.documents?.map((doc: string) => (
                                      <Button key={doc} variant="outline" size="sm">
                                        <FileText className="mr-2 h-4 w-4" />
                                        {doc}
                                      </Button>
                                    )) || (
                                      <p className="text-sm text-muted-foreground">No documents available</p>
                                    )}
                                  </div>
                                </div>
                                                                 <div className="flex space-x-2 pt-4">
                                   {!walletTokens.has(token.tokenAddress.toLowerCase()) ? (
                                     <Button
                                       onClick={() => addTokenToMetaMask(token)}
                                       className="flex-1"
                                       variant="outline"
                                       disabled={checkingWalletTokens}
                                     >
                                       {checkingWalletTokens ? (
                                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                       ) : (
                                         <Wallet className="mr-2 h-4 w-4" />
                                       )}
                                       Add to MetaMask
                                     </Button>
                                   ) : (
                                     <Button
                                       className="flex-1"
                                       variant="outline"
                                       disabled
                                     >
                                       <CheckCircle className="mr-2 h-4 w-4" />
                                       Already in Wallet
                                     </Button>
                                   )}
                                   <Button
                                     variant="outline"
                                     onClick={() => window.open(`https://sepolia.etherscan.io/token/${token.tokenAddress}`, "_blank")}
                                   >
                                     <ExternalLink className="mr-2 h-4 w-4" />
                                     View on Etherscan
                                   </Button>
                                 </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Holdings Tab */}
            <TabsContent value="holdings" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Token Holdings</CardTitle>
                      <CardDescription>Your security token portfolio</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>24h Change</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                              GB
                            </div>
                            <div>
                              <div className="font-medium">GBB</div>
                              <div className="text-sm text-muted-foreground">Green Brew Bond</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">125.50</TableCell>
                        <TableCell className="font-mono">$10.43</TableCell>
                        <TableCell className="font-mono font-medium">$1,308.97</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 text-sm">+2.3%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Sheet open={p2pDrawerOpen} onOpenChange={setP2pDrawerOpen}>
                              <SheetTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setP2pTokenSymbol("GBB")}>
                                  <Send className="mr-2 h-4 w-4" />
                                  Transfer
                                </Button>
                              </SheetTrigger>
                            </Sheet>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy Address
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Export Data
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Transaction History</h2>
                  <p className="text-muted-foreground">All your token transactions and transfers</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Token</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <Badge
                              variant={
                                tx.type === "investment" ? "default" : tx.type === "transfer" ? "secondary" : "outline"
                              }
                            >
                              {tx.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono">{tx.tokenSymbol}</TableCell>
                          <TableCell className="font-mono">{tx.amount}</TableCell>
                          <TableCell className="font-mono">
                            {tx.value} {tx.currency}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {tx.status === "pending" && <Clock className="h-4 w-4 text-amber-600" />}
                              {tx.status === "processing" && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                              {tx.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                              {tx.status === "failed" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                              <Badge
                                variant={
                                  tx.status === "completed"
                                    ? "default"
                                    : tx.status === "failed"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className={
                                  tx.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : tx.status === "processing"
                                      ? "bg-blue-100 text-blue-700"
                                      : ""
                                }
                              >
                                {tx.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{tx.date}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Transaction Details</DialogTitle>
                                  <DialogDescription>Complete transaction information</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6">
                                  {/* Transaction Overview */}
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-lg flex items-center space-x-2">
                                        {tx.type === "investment" && <ShoppingCart className="h-5 w-5" />}
                                        {tx.type === "transfer" && <Send className="h-5 w-5" />}
                                        <span className="capitalize">{tx.type} Transaction</span>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Transaction ID</Label>
                                          <p className="font-mono text-sm">{tx.id}</p>
                                        </div>
                                        <div>
                                          <Label>Status</Label>
                                          <div className="flex items-center space-x-2">
                                            {tx.status === "pending" && <Clock className="h-4 w-4 text-amber-600" />}
                                            {tx.status === "processing" && (
                                              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                            )}
                                            {tx.status === "completed" && (
                                              <CheckCircle className="h-4 w-4 text-green-600" />
                                            )}
                                            {tx.status === "failed" && (
                                              <AlertTriangle className="h-4 w-4 text-red-600" />
                                            )}
                                            <Badge
                                              variant={
                                                tx.status === "completed"
                                                  ? "default"
                                                  : tx.status === "failed"
                                                    ? "destructive"
                                                    : "secondary"
                                              }
                                            >
                                              {tx.status}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div>
                                          <Label>Token</Label>
                                          <p className="font-mono">{tx.tokenSymbol}</p>
                                          {tx.tokenName && (
                                            <p className="text-sm text-muted-foreground">{tx.tokenName}</p>
                                          )}
                                        </div>
                                        <div>
                                          <Label>Amount</Label>
                                          <p className="font-mono">
                                            {tx.amount} {tx.tokenSymbol}
                                          </p>
                                        </div>
                                        <div>
                                          <Label>Value</Label>
                                          <p className="font-mono">
                                            {tx.value} {tx.currency}
                                          </p>
                                        </div>
                                        <div>
                                          <Label>Date</Label>
                                          <p>{tx.date}</p>
                                        </div>
                                      </div>

                                      {/* Investment specific details */}
                                      {tx.type === "investment" && (
                                        <>
                                          <Separator />
                                          <div className="grid grid-cols-2 gap-4">
                                            {tx.investmentAmount && (
                                              <div>
                                                <Label>Investment Amount</Label>
                                                <p className="font-mono">${tx.investmentAmount}</p>
                                              </div>
                                            )}
                                            {tx.tokenPrice && (
                                              <div>
                                                <Label>Token Price</Label>
                                                <p className="font-mono">${tx.tokenPrice}</p>
                                              </div>
                                            )}
                                            {tx.paymentMethod && (
                                              <div>
                                                <Label>Payment Method</Label>
                                                <p className="capitalize">{tx.paymentMethod.replace("_", " ")}</p>
                                              </div>
                                            )}
                                            {tx.apy && (
                                              <div>
                                                <Label>Expected APY</Label>
                                                <p className="text-green-600 font-medium">{tx.apy}</p>
                                              </div>
                                            )}
                                            {tx.issuer && (
                                              <div>
                                                <Label>Issuer</Label>
                                                <p>{tx.issuer}</p>
                                              </div>
                                            )}
                                            {tx.maturity && (
                                              <div>
                                                <Label>Maturity</Label>
                                                <p>{tx.maturity}</p>
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      )}

                                      {/* Transfer specific details */}
                                      {tx.type === "transfer" && (
                                        <>
                                          <Separator />
                                          <div className="grid grid-cols-1 gap-4">
                                            {tx.fromAddress && (
                                              <div>
                                                <Label>From Address</Label>
                                                <div className="flex items-center space-x-2">
                                                  <p className="font-mono text-sm">{tx.fromAddress}</p>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(tx.fromAddress!)}
                                                  >
                                                    <Copy className="h-3 w-3" />
                                                  </Button>
                                                </div>
                                              </div>
                                            )}
                                            {tx.toAddress && (
                                              <div>
                                                <Label>To Address</Label>
                                                <div className="flex items-center space-x-2">
                                                  <p className="font-mono text-sm">{tx.toAddress}</p>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(tx.toAddress!)}
                                                  >
                                                    <Copy className="h-3 w-3" />
                                                  </Button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      )}

                                      {/* Common transaction details */}
                                      <Separator />
                                      <div className="grid grid-cols-2 gap-4">
                                        {tx.txHash && (
                                          <div className="col-span-2">
                                            <Label>Transaction Hash</Label>
                                            <div className="flex items-center space-x-2">
                                              <p className="font-mono text-sm break-all">{tx.txHash}</p>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(tx.txHash!)}
                                              >
                                                <Copy className="h-3 w-3" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                  window.open(`https://sepolia.etherscan.io/tx/${tx.txHash}`, "_blank")
                                                }
                                              >
                                                <ExternalLink className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                        {tx.fees && (
                                          <div>
                                            <Label>Fees</Label>
                                            <p className="font-mono text-sm">
                                              {tx.fees} {tx.currency}
                                            </p>
                                          </div>
                                        )}
                                        {tx.expectedCompletion && (
                                          <div>
                                            <Label>Expected Completion</Label>
                                            <p className="text-sm">{tx.expectedCompletion}</p>
                                          </div>
                                        )}
                                        {tx.referenceId && (
                                          <div>
                                            <Label>Reference ID</Label>
                                            <p className="font-mono text-sm">{tx.referenceId}</p>
                                          </div>
                                        )}
                                        {tx.notes && (
                                          <div className="col-span-2">
                                            <Label>Notes</Label>
                                            <p className="text-sm">{tx.notes}</p>
                                          </div>
                                        )}
                                      </div>

                                      {/* Risk and compliance info for investments */}
                                      {tx.type === "investment" && tx.riskLevel && (
                                        <>
                                          <Separator />
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <Label>Risk Level</Label>
                                              <Badge
                                                variant="outline"
                                                className={`ml-2 ${
                                                  tx.riskLevel === "Low"
                                                    ? "border-green-300 text-green-700"
                                                    : tx.riskLevel === "Medium"
                                                      ? "border-yellow-300 text-yellow-700"
                                                      : "border-red-300 text-red-700"
                                                }`}
                                              >
                                                {tx.riskLevel}
                                              </Badge>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Identity Tab */}
            <TabsContent value="identity" className="space-y-6">
              {/* Claims Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Claims</CardTitle>
                  <CardDescription>
                    {signerKeyApproved
                      ? "Select claims to add to your OnChainID"
                      : "Approve ClaimIssuer first to manage claims"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!signerKeyApproved && (
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        You need to approve the ClaimIssuer signer key before you can add claims to your identity.
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-4">
                    {investorData?.claimData?.data?.map((claim, index) => {
                      const claimForUser = investorData.claimForUser?.data[index]
                      const isAdded = selectedClaims.includes(claim.name)
                      const isAdding = addingClaim === claim.name

                      return (
                        <div
                          key={claim.name}
                          className={`flex items-center justify-between rounded-lg border p-4 ${
                            isAdded ? "border-green-200 bg-green-50" : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {isAdded ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                            )}
                            <div>
                              <h4 className="font-medium">{claim.name}</h4>
                              <p className="text-muted-foreground text-sm">Issued by: {claim.issuer}</p>
                              <p className="text-muted-foreground font-mono text-xs">
                                Contract: {claim.contract.slice(0, 10)}...{claim.contract.slice(-8)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isAdded ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Added
                              </Badge>
                            ) : (
                              <Button
                                onClick={() => handleAddClaim(claim.contract, claim.name, claimForUser)}
                                disabled={!signerKeyApproved || isAdding}
                                size="sm"
                              >
                                {isAdding ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                  </>
                                ) : (
                                  <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Claim
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* P2P Transfer Tab */}
            <TabsContent value="p2p" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Peer-to-Peer Transfer</h2>
                  <p className="text-muted-foreground">Transfer tokens directly to other verified investors</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Send Tokens</CardTitle>
                  <CardDescription>Transfer your security tokens to another investor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      P2P transfers are only allowed between verified investors with valid claims for the specific
                      token.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="p2p-recipient">Recipient Address</Label>
                        <Input
                          id="p2p-recipient"
                          placeholder="0x..."
                          value={p2pRecipient}
                          onChange={(e) => setP2pRecipient(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter the OnChainID or wallet address of the recipient
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="p2p-token">Token</Label>
                        <Select value={p2pTokenSymbol} onValueChange={setP2pTokenSymbol}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select token" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GBB">
                              <div className="flex items-center space-x-2">
                                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500" />
                                <span>GBB - Green Brew Bond</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="REIT">
                              <div className="flex items-center space-x-2">
                                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                                <span>REIT - Royal Real Estate Token</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="p2p-amount">Amount</Label>
                        <Input
                          id="p2p-amount"
                          type="number"
                          placeholder="0.00"
                          value={p2pAmount}
                          onChange={(e) => setP2pAmount(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Available: 125.50 {p2pTokenSymbol || "tokens"}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="p2p-message">Message (Optional)</Label>
                        <Textarea
                          id="p2p-message"
                          placeholder="Add a note for the recipient..."
                          value={p2pMessage}
                          onChange={(e) => setP2pMessage(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Transfer Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Token</span>
                            <span className="font-mono">{p2pTokenSymbol || "—"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Amount</span>
                            <span className="font-mono">{p2pAmount || "0"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Estimated Value</span>
                            <span className="font-mono">
                              ${p2pAmount ? (Number.parseFloat(p2pAmount) * 25.67).toFixed(2) : "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Network Fee</span>
                            <span className="font-mono">~0.001 ETH</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Recipient</span>
                            <span className="font-mono text-xs">
                              {p2pRecipient ? `${p2pRecipient.slice(0, 6)}...${p2pRecipient.slice(-4)}` : "—"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Button
                        onClick={handleP2PTransfer}
                        disabled={!p2pRecipient || !p2pTokenSymbol || !p2pAmount}
                        className="w-full"
                        size="lg"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Transfer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent P2P Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent P2P Activity</CardTitle>
                  <CardDescription>Your recent peer-to-peer transfers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions
                      .filter((tx) => tx.type === "transfer")
                      .slice(0, 5)
                      .map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                              <Send className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">
                                Sent {tx.amount} {tx.tokenSymbol}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                To: {tx.toAddress?.slice(0, 10)}...{tx.toAddress?.slice(-8)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-sm">
                              {tx.value} {tx.currency}
                            </p>
                            <Badge
                              variant={tx.status === "completed" ? "default" : "secondary"}
                              className={tx.status === "completed" ? "bg-green-100 text-green-700" : ""}
                            >
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Identity Documents</CardTitle>
                  <CardDescription>Your uploaded verification documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Object.entries(investorData?.InvestorDetails?.identityDocuments).map(([key, value]) => {
                      if (key === "otherDocs") return null
                      const stringValue = typeof value === "string" ? value : Array.isArray(value) ? value[0] || "" : ""

                      return (
                        <div key={key} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</h4>
                              <p className="text-muted-foreground text-sm">IPFS: {stringValue.slice(0, 20)}...</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => window.open(stringValue, "_blank")}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* P2P Transfer Sheet */}
      <Sheet open={p2pDrawerOpen} onOpenChange={setP2pDrawerOpen}>
        <SheetContent className="w-[500px] sm:w-[500px]">
          <SheetHeader>
            <SheetTitle>P2P Token Transfer</SheetTitle>
            <SheetDescription>Send tokens directly to another verified investor</SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                Transfers are only allowed between investors with valid claims for the specific token.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="sheet-recipient">Recipient Address</Label>
                <Input
                  id="sheet-recipient"
                  placeholder="0x... or ENS name"
                  value={p2pRecipient}
                  onChange={(e) => setP2pRecipient(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="sheet-amount">Amount</Label>
                <Input
                  id="sheet-amount"
                  type="number"
                  placeholder="0.00"
                  value={p2pAmount}
                  onChange={(e) => setP2pAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Available: 125.50 {p2pTokenSymbol}</p>
              </div>

              <div>
                <Label htmlFor="sheet-message">Message (Optional)</Label>
                <Textarea
                  id="sheet-message"
                  placeholder="Add a note..."
                  value={p2pMessage}
                  onChange={(e) => setP2pMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Amount</span>
                      <span className="font-mono">
                        {p2pAmount || "0"} {p2pTokenSymbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Value</span>
                      <span className="font-mono">
                        ${p2pAmount ? (Number.parseFloat(p2pAmount) * 25.67).toFixed(2) : "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network Fee</span>
                      <span className="font-mono">~0.001 ETH</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleP2PTransfer} disabled={!p2pRecipient || !p2pAmount} className="w-full" size="lg">
                <Send className="mr-2 h-4 w-4" />
                Send Transfer
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
    </Layout>

  )
}

export default AdvancedInvestorPortfolio
