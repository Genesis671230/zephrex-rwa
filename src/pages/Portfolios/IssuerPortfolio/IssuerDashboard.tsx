"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  BarChart3,
  Bell,
  Copy,
  Eye,
  FileText,
  MoreHorizontal,
  Shield,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Loader2,
  ShoppingCart,
  Send,
  DollarSign,
  Filter,
  Search,
  Users,
  Download,
  Settings,
  Ban,
  UserCheck,
  UserX,
  Coins,
  Building,
  Activity,
  Mail,
  Globe,
  Lock,
  Unlock,
  Archive,
  Plus,
  Minus,
  Pause,
  Play,
  RefreshCw,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Code,
  LifeBuoy,
  PieChart,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  Home,
  Landmark,
  Palette,
  Zap,
  Briefcase,
  Wheat,
  Rocket,
  Trash2,
  RotateCcw,
} from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppKit, useAppKitAccount } from "@reown/appkit/react"
import { toast } from "sonner"
import { TokenDetailsModal } from "@/components/TokenDetailsModal/TokenDetailsModal"
import { useTrexContracts } from "@/hooks/use-trex-contracts"

// import { useAppDispatch, useAppSelector } from "@/hooks/redux"


import { 
  fetchTokens, 
  setSelectedToken, 
  fetchInvestors, 
  approveInvestmentOrder,
  updateInvestorStatus,
  addTrustedIssuer,
  removeTrustedIssuer,
  updateTokenEmergencyPause
} from "@/store/slices/issuerSlice"
import { useDispatch, useSelector } from "react-redux"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { getInvestorList, getSTData } from "@/hooks/use-ST"
import { tokenService } from "@/services/token-service"
import { AssetInformation, ComplianceConfiguration, TokenAgentInfo, TokenBasicInfo, TokenOwnerInfo } from "@/types/token-models"
import { ethers } from "ethers"
import tokenABI from "@/contractAbis/token/Token.sol/Token.json"



// Types for issuer dashboard - Updated to match API response
interface TokenData {
  id: string
  name: string
  symbol: string
  decimals: number
  prefix: string
  totalSupply: string
  circulatingSupply: string
  initialPrice: string
  currency: string
  minInvestment: string
  maxInvestment: string
  
  // Owner Information
  ownerAddress: string
  ownerName: string
  ownerEmail: string
  ownerJurisdiction: string
  
  // Agent Information
  irAgentAddress: string
  tokenAgentAddress: string
  tokenAgents: Array<{
    address: string
    role: string
    _id: string
    addedAt: string
  }>
  
  // Asset Information
  assetType: string
  assetCategory: string
  assetDescription: string
  assetValue: string
  assetCurrency: string
  estimatedValue: string
  jurisdiction: string
  
  // Deployment Information
  deploymentInfo: {
    contractSuite: {
      identityRegistryAddress: string
      identityRegistryStorageAddress: string
      trustedIssuerRegistryAddress: string
      claimTopicsRegistryAddress: string
      modularComplianceAddress: string
    }
    tokenAddress: string
    tokenLockSmartContract: string
    deployedAt: string
    network: string
    explorerLink: string
  }
  
  // Compliance Information
  complianceModules: Array<{
    moduleKey: string
    proxyAddress: string
    complianceSettings: string[]
    deployedAt: string
    status: string
    _id: string
  }>
  kycRequired: boolean
  amlRequired: boolean
  accreditedOnly: boolean
  requiredClaims: string[]
  trustedIssuers: string[]
  
  // Claim Data
  claimData: {
    claimTopics: string[]
    claimTopicsHashed: string[]
    claimIssuers: string[]
    issuerClaims: string[][]
    issuerClaimsHashed: string[][]
  }
  
  // Metadata
  logoUrl: string
  description: string
  website: string
  whitepaper: string
  socialLinks: Record<string, string>
  
  // Status and Metrics
  status: "deployed" | "pending" | "failed"
  metrics: {
    totalTransactions: number
    totalHolders: number
    totalVolume: string
  }
  isActive: boolean
  isPublic: boolean
  isTradeable: boolean
  
  createdAt: string
  updatedAt: string
}

interface InvestorProfile {
  id: string
  walletAddress: string
  onChainId: string
  fullName: string
  email: string
  country: string
  investorType: "individual" | "institutional"
  accreditedStatus: boolean
  kycStatus: "pending" | "verified" | "rejected"
  amlStatus: "pending" | "verified" | "rejected"
  totalInvested: number
  tokenBalance: number
  firstInvestment: string
  lastActivity: string
  riskScore: number
  complianceScore: number
  status: "active" | "suspended" | "blacklisted"
  documents: {
    identity: string
    address: string
    income: string
    accreditation?: string
  }
  transactions: Transaction[]
}

interface Transaction {
  id: string
  type: "investment" | "transfer" | "mint" | "burn" | "freeze" | "unfreeze"
  tokenSymbol: string
  amount: string
  value: string
  currency: string
  status: "pending" | "processing" | "completed" | "failed" | "rejected"
  date: string
  txHash?: string
  fromAddress?: string
  toAddress?: string
  investorId?: string
  notes?: string
  approvedBy?: string
  rejectedReason?: string
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

interface InvestmentOrder {
  id: string
  investorId: string
  investorName: string
  investorEmail: string
  tokenSymbol: string
  requestedAmount: number
  investmentValue: number
  currency: string
  paymentMethod: string
  status: "pending" | "approved" | "rejected" | "processing" | "completed"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
  complianceChecks: {
    kyc: boolean
    aml: boolean
    jurisdiction: boolean
    accreditation: boolean
  }
  documents: string[]
  riskAssessment: {
    score: number
    level: "low" | "medium" | "high"
    factors: string[]
  }
}

// Add to the existing interfaces section (after line 338)
interface PendingInvestmentOrder {
  _id: string
  txHash: string
  investorAddress: string
  tokenAddress: string
  tokenSymbol: string
  investmentAmount: number
  investmentCurrency: string
  tokenAmount: number
  paymentMethod: string
  requiredCryptoAmount: number
  tokenOwnerAddress: string
  status: 'pending_confirmation' | 'confirmed' | 'ready_to_mint' | 'minting' | 'completed' | 'failed' | 'cancelled' | 'requires_documents'
  notes?: string
  issuerNotes?: string
  createdAt: string
  updatedAt: string
  investorProfile?: {
    name?: string
    email?: string
    kycStatus?: string
    amlStatus?: string
    complianceScore?: number
  }
  requestedDocuments?: string[]
  submittedDocuments?: string[]
}

// import type { AppDispatch } from "@/store/store"
// import { useDispatch, useSelector } from "react-redux"

// export const useAppDispatch = () => useDispatch<AppDispatch>()
// export const useAppSelector = useSelector




const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1'

const IssuerDashboard = () => {
  const dispatch = useDispatch()


  // const {  investors, investmentOrders, analytics } = useSelector((state: any) => state.issuer)
  const [hasTokens, setHasTokens] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [showTokenCreation, setShowTokenCreation] = useState(false)

  const [loading, setLoading] = useState(false)
  const [showCreateToken, setShowCreateToken] = useState(false)
  const [tokenHolders, setTokenHolders] = useState([])
  const [localLoading, setLocalLoading] = useState(false)
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorProfile | null>(null)
  const [mintAmount, setMintAmount] = useState("")
  const [mintRecipient, setMintRecipient] = useState("")
  const [blacklistAddress, setBlacklistAddress] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [complianceFilter, setComplianceFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [trustedIssuerAddress, setTrustedIssuerAddress] = useState("")
  const [selectedToken, setSelectedToken] = useState("")
  const [currentToken, setCurrentToken] = useState<TokenData | null>(null)
  // const [showCreateToken, setShowCreateToken] = useState(false)
  // const [tokenHolders, setTokenHolders] = useState([])
  // const [investors, setInvestors] = useState<InvestorProfile[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  // const [investmentOrders, setInvestmentOrders] = useState<InvestmentOrder[]>([])
  // const [selectedInvestor, setSelectedInvestor] = useState<InvestorProfile | null>(null)
  // const [mintAmount, setMintAmount] = useState("")
  // const [mintRecipient, setMintRecipient] = useState("")
  // const [blacklistAddress, setBlacklistAddress] = useState("")
  // const [searchTerm, setSearchTerm] = useState("")
  // const [statusFilter, setStatusFilter] = useState("all")
  // const [complianceFilter, setComplianceFilter] = useState("all")
  const [tokenInfo, setTokenInfo] = useState(null)

  const { address: issuerAddress, isConnected } = useAppKitAccount()
  const { open } = useAppKit()
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [investors, setInvestors] = useState<InvestorProfile[]>([])
  const [investmentOrders, setInvestmentOrders] = useState<InvestmentOrder[]>([])
  const [tokenMetrics, setTokenMetrics] = useState<Record<string, any>>({})
  
  // Token Details Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedTokenForDetails, setSelectedTokenForDetails] = useState<TokenData | null>(null)

  // Add to the state variables section (around line 390)
  const [pendingOrders, setPendingOrders] = useState<PendingInvestmentOrder[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [orderActionLoading, setOrderActionLoading] = useState(false)
  const [documentRequest, setDocumentRequest] = useState<{
    orderId: string
    documents: string[]
    message: string
  }>({
    orderId: '',
    documents: [],
    message: ''
  })


  const {
    mintTokens,
    burnTokens,
    freezeTokens,
    unfreezeTokens,
    forcedTransfer,
    addToBlacklist,
    removeFromBlacklist,
    updateIdentityRegistry,
    trustedIssuers,
    token,
    loading: contractLoading,
  } = useTrexContracts()
  

  // Mock data removed - now using real API data from tokens state

  // Mock data removed - now using real API data from state



  // API helper function
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('API call failed:', error)
      throw error
    }
  }

  // Load token holders
  const loadTokenHolders = async (tokenAddress: string) => {
    if (!tokenAddress) return
    
    setLoading(true)
    try {
      const response = await apiCall(`/token/${tokenAddress}/holders`)
      setTokenHolders(response.data || [])
      toast.success('Token holders loaded successfully')
    } catch (error: any) {
      toast.error(`Failed to load token holders: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Load transactions
  const loadTransactions = async (tokenAddress: string) => {
    if (!tokenAddress) return
    
    try {
      const response = await apiCall(`/token/${tokenAddress}/transactions?limit=20`)
      setTransactions(response.data || [])
    } catch (error) {
      console.error('Failed to load transactions:', error)
    }
  }

  // Load token info
  const loadTokenInfo = async (tokenAddress: string) => {
    if (!tokenAddress) return
    
    try {
      const response = await apiCall(`/token/${tokenAddress}/info`)
      setTokenInfo(response.data)
      return response.data
    } catch (error) {
      console.error('Failed to load token info:', error)
    }
  }


  // Load all data for the issuer dashboard
  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);

      if (!isConnected) {
        open();
        return;
      }

      if (issuerAddress) {
        // Fetch tokens owned by the issuer
        const allTokens = await tokenService.getAllTokens()
        console.log("All tokens received:", allTokens)

        const filteredTokens = allTokens?.tokens?.filter((contract: any) => 
          contract?.ownerAddress === issuerAddress
        )
        setTokens(filteredTokens)

        if (filteredTokens.length > 0) {
          setSelectedToken(filteredTokens[0].symbol)
          setCurrentToken(filteredTokens[0])
          // Fetch additional data for each token
          await Promise.all(filteredTokens.map(async (token: any) => {
            try {
              // Fetch token metrics
              const metrics = await tokenService.getTokenAnalytics(token.id)
              setTokenMetrics(prev => ({
                ...prev,
                [token.id]: metrics
              }))

              // Fetch token investors
              const tokenInvestors = await tokenService.getInvestors(token.id)
              if (tokenInvestors && Array.isArray(tokenInvestors)) {
                setInvestors(prev => [...prev, ...tokenInvestors])
              }

              // Fetch token transactions
              const transactions = await tokenService.getTransactions(token.id, 50)
              if (transactions && Array.isArray(transactions)) {
                setTransactions(prev => [...prev, ...transactions])
              }
            } catch (error) {
              console.error(`Error fetching data for token ${token.symbol}:`, error)
            }
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Legacy function name for compatibility
  const fetchInvestorData = fetchAllDashboardData;

  useEffect(() => {
    fetchInvestorData();
    if (issuerAddress) {
      fetchPendingOrders();
    }
  }, [issuerAddress]);


  useEffect(() => {
    if (issuerAddress) {
      //@ts-ignore
      dispatch(fetchTokens(issuerAddress))
    }
  }, [dispatch, issuerAddress])
  
  useEffect(() => {
    if (selectedToken) {
      //@ts-ignore
      dispatch(fetchInvestors(selectedToken))
    }
  }, [dispatch, selectedToken])

  const handleMintTokens = async () => {
    if (!mintRecipient || !mintAmount) {
      toast.error("Please enter recipient address and amount")
      return
    }

    try {
      setLocalLoading(true)
      toast.loading("Minting tokens...", { id: "mint-tokens" })

        if(isConnected&&window.ethereum){



            console.log("Minting tokens...",currentToken?.deploymentInfo?.tokenAddress)
            // const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/NAR07p3fjDxxSkZMETZmz");
            const provider = new ethers.BrowserProvider(window.ethereum as any)
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(currentToken?.deploymentInfo?.tokenAddress as string, tokenABI.abi,signer as any);



const mintAmountInWei  = ethers.parseEther(mintAmount)
const result  = await contract.batchMint([mintRecipient], [mintAmountInWei])


// const result = await contract.mint(mintRecipient, mintAmount)
console.log("Result:", result)


      // const tokenContract = ethers
      // const result = await mintTokens(tokenAddress, mintRecipient, mintAmount)

      if (result) {
        toast.success(`Successfully minted ${mintAmount} tokens to ${mintRecipient}`, { id: "mint-tokens" })
        setMintAmount("")
        setMintRecipient("")
      }

    }
    } catch (error) {
      console.error("Minting error:", error)
      toast.error("Failed to mint tokens", { id: "mint-tokens" })
    } finally {
      setLocalLoading(false)
    }
  }

  const handleBlacklistAddress = async () => {
    if (!blacklistAddress) {
      toast.error("Please enter an address to blacklist")
      return
    }

    try {
      setLocalLoading(true)
      toast.loading("Adding to blacklist...", { id: "blacklist" })

      const result = await addToBlacklist(selectedToken, blacklistAddress)

      if (result.success) {
        toast.success(`Address ${blacklistAddress} added to blacklist`, { id: "blacklist" })
        setBlacklistAddress("")

        // Update investor status in Redux
        dispatch(updateInvestorStatus({ 
          investorId: blacklistAddress, 
          status: "blacklisted" 
        }))
      }
    } catch (error) {
      console.error("Blacklist error:", error)
      toast.error("Failed to blacklist address", { id: "blacklist" })
    } finally {
      setLocalLoading(false)
    }
  }

  const handleApproveOrder = async (orderId: string) => {
    try {
      setLocalLoading(true)
      //@ts-ignore
      const result = await dispatch(approveInvestmentOrder({ orderId, tokenSymbol: selectedToken }))
      
      //@ts-ignore
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success("Investment order approved successfully")
      }
    } catch (error) {
      console.error("Approval error:", error)
      toast.error("Failed to approve order")
    } finally {
      setLocalLoading(false)
    }
  }

  const handleRejectOrder = async (orderId: string, reason: string) => {
    try {
      setLocalLoading(true)
      toast.loading("Rejecting investment order...", { id: "reject-order" })

      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Investment order rejected", { id: "reject-order" })
    } catch (error) {
      console.error("Rejection error:", error)
      toast.error("Failed to reject order", { id: "reject-order" })
    } finally {
      setLocalLoading(false)
    }
  }

  const handleSuspendInvestor = async (investorId: string) => {
    try {
      setLocalLoading(true)
      dispatch(updateInvestorStatus({ investorId, status: "suspended" }))
      toast.success("Investor suspended successfully")
    } catch (error) {
      console.error("Suspension error:", error)
      toast.error("Failed to suspend investor")
    } finally {
      setLocalLoading(false)
    }
  }

  const handleAddTrustedIssuer = async () => {
    if (!trustedIssuerAddress) {
      toast.error("Please enter issuer address")
      return
    }

    try {
      setLocalLoading(true)
      toast.loading("Adding trusted issuer...", { id: "add-issuer" })

      const result = await trustedIssuers.addTrustedIssuer(trustedIssuerAddress, [1, 2, 3])

      if (result.success) {
        const currentToken = tokens.find((t: TokenData) => t.symbol === selectedToken)
        if (currentToken) {
          dispatch(addTrustedIssuer({ tokenId: currentToken.id, issuerAddress: trustedIssuerAddress }))
        }
        toast.success("Trusted issuer added successfully", { id: "add-issuer" })
        setTrustedIssuerAddress("")
      }
    } catch (error) {
      console.error("Add trusted issuer error:", error)
      toast.error("Failed to add trusted issuer", { id: "add-issuer" })
    } finally {
      setLocalLoading(false)
    }
  }

  const handleEmergencyPause = async () => {
    try {
      setLocalLoading(true)
      toast.loading("Emergency pausing token transfers...", { id: "emergency-pause" })

      const result = await token.pause()

      if (result.success) {
        const currentToken = tokens.find((t: any) => t.symbol === selectedToken)
        if (currentToken) {
          dispatch(updateTokenEmergencyPause({ tokenId: currentToken.id, paused: true }))
        }
        toast.success("Token transfers paused successfully", { id: "emergency-pause" })
      }
    } catch (error) {
      console.error("Emergency pause error:", error)
      toast.error("Failed to pause token transfers", { id: "emergency-pause" })
    } finally {
      setLocalLoading(false)
    }
  }


  const handleTokenCreated = (tokenAddress: string) => {
    setSelectedToken(tokenAddress)
    toast.success(`Token created successfully! Address: ${tokenAddress}`)
    // Load the new token data
    loadTokenInfo(tokenAddress)
    loadTokenHolders(tokenAddress)
    loadTransactions(tokenAddress)
  }

  // Fetch pending investment orders
  const fetchPendingOrders = async () => {
    if (!issuerAddress) return
    try {
      const response = await fetch(`http://localhost:5001/api/v1/investments/issuer/${issuerAddress}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setPendingOrders(data.data.investments || [])
        }
      }
    } catch (error) {
      console.error('Error fetching pending orders:', error)
    }
  }

  // Approve investment order and mint tokens
  const handleApproveInvestmentOrder = async (orderId: string) => {
    setOrderActionLoading(true)
    try {
      const response = await fetch(`http://localhost:5001/api/v1/investments/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'minting',
          notes: 'Order approved by issuer - tokens will be minted'
        })
      })

      if (response.ok) {
        await fetchPendingOrders() // Refresh orders
        toast.success('Investment order approved successfully')
      }
    } catch (error) {
      console.error('Error approving order:', error)
      toast.error('Failed to approve order')
    } finally {
      setOrderActionLoading(false)
    }
  }

  // Reject investment order
  const handleRejectInvestmentOrder = async (orderId: string, reason: string) => {
    setOrderActionLoading(true)
    try {
      const response = await fetch(`http://localhost:5001/api/v1/investments/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'cancelled',
          notes: `Order rejected: ${reason}`
        })
      })

      if (response.ok) {
        await fetchPendingOrders() // Refresh orders
        toast.success('Investment order rejected')
      }
    } catch (error) {
      console.error('Error rejecting order:', error)
      toast.error('Failed to reject order')
    } finally {
      setOrderActionLoading(false)
    }
  }

  // Request additional documents
  const handleRequestDocuments = async (orderId: string, documents: string[], message: string) => {
    setOrderActionLoading(true)
    try {
      const response = await fetch(`http://localhost:5001/api/v1/investments/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'requires_documents',
          notes: `Additional documents requested: ${documents.join(', ')}. Message: ${message}`
        })
      })

      if (response.ok) {
        await fetchPendingOrders() // Refresh orders
        toast.success('Document request sent to investor')
        setDocumentRequest({ orderId: '', documents: [], message: '' })
      }
    } catch (error) {
      console.error('Error requesting documents:', error)
      toast.error('Failed to request documents')
    } finally {
      setOrderActionLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  // Token Details Modal handlers
  const handleOpenTokenDetails = (token: TokenData) => {
    setSelectedTokenForDetails(token as any)
    setIsDetailModalOpen(true)
  }

  const handleCloseTokenDetails = () => {
    setIsDetailModalOpen(false)
    setSelectedTokenForDetails(null)
  }

  const filteredInvestors = investors.filter((investor) => {
    const matchesSearch =
      (investor.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (investor.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (investor.walletAddress || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || investor.status === statusFilter
    const matchesCompliance =
      complianceFilter === "all" ||
      (complianceFilter === "verified" && investor.kycStatus === "verified" && investor.amlStatus === "verified") ||
      (complianceFilter === "pending" && (investor.kycStatus === "pending" || investor.amlStatus === "pending"))

    return matchesSearch && matchesStatus && matchesCompliance
  })

  const filteredOrders = investmentOrders.filter((order) => {
    const matchesSearch =
      (order.investorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.investorEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.id || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

// const handleTokenCreated = (tokenAddress: string) => {
//   // Add the new token to the list
//   const newToken = {
//     id: Date.now().toString(),
//     symbol: "NEW",
//     name: "New Token",
//     tokenAddress,
//     deployedAt: new Date().toISOString(),
//   }
//   setTokens((prev) => [...prev, newToken])
//   toast.success("Token created successfully!")
// }

  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>Please connect your wallet to access the issuer dashboard</CardDescription>
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

if (tokens.length === 0) {
  return (
    <>
      <EmptyStateOnboarding onStartTokenCreation={() => setShowTokenCreation(true)} />
      <TokenCreationWizard
        isOpen={showTokenCreation}
        onClose={() => setShowTokenCreation(false)}
        onSuccess={handleTokenCreated}
      />
    </>
  )
}

  return (
    <div className="min-h-screen pt-[5%] bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}

             <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
         <div className="flex h-16 items-center px-6">
           <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                 <Building className="h-4 w-4 text-white" />
               </div>
               <span className="text-xl font-bold">Token Issuer</span>
             </div>
           </div>
           <div className="ml-auto flex items-center space-x-4">
             <Select value={selectedToken} onValueChange={(value) => {
              setSelectedToken(value)
              setCurrentToken(tokens.find((t: TokenData) => t.symbol === value) || null)
             }}>
               <SelectTrigger className="w-40">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 {tokens.map((token) => (
                  <SelectItem key={token.id} value={token.symbol}>
                    {token.symbol} - {token.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-issuer.jpg" alt="Issuer" />
                    <AvatarFallback>IS</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Token Issuer</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {issuerAddress?.slice(0, 6)}...{issuerAddress?.slice(-4)}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="min-h-[calc(100vh-4rem)] w-64 border-r bg-white/50 backdrop-blur-sm">
          <nav className="space-y-2 p-6">
            <Button 
              variant={activeTab === "overview" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button 
              variant={activeTab === "investors" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("investors")}
            >
              <Users className="mr-2 h-4 w-4" />
              Investors
            </Button>
            <Button 
              variant={activeTab === "orders" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Orders
            </Button>
            <Button 
              variant={activeTab === "transactions" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("transactions")}
            >
              <Activity className="mr-2 h-4 w-4" />
              Transactions
            </Button>
            <Button 
              variant={activeTab === "management" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("management")}
            >
              <Coins className="mr-2 h-4 w-4" />
              Token Management
            </Button>
            <Button 
              variant={activeTab === "compliance" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("compliance")}
            >
              <Shield className="mr-2 h-4 w-4" />
              Compliance
            </Button>
            <Button 
              variant={activeTab === "analytics" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("analytics")}
            >
              <PieChart className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button 
              variant={activeTab === "reports" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("reports")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Button>
            <Button 
              variant={activeTab === "settings" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button 
              variant={activeTab === "api" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("api")}
            >
              <Code className="mr-2 h-4 w-4" />
              API Management
            </Button>
            <Button 
              variant={activeTab === "support" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("support")}
            >
              <LifeBuoy className="mr-2 h-4 w-4" />
              Support & Help
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Overview Cards - Updated with Real Data */}
          <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Asset Value</CardTitle>
                <DollarSign className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${tokens.reduce((sum, token) => sum + (Number(token.assetValue) || 0), 0).toLocaleString()}
                </div>
                <p className="text-xs opacity-80">
                  Across {tokens.length} token{tokens.length !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Holders</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tokens.reduce((sum, token) => sum + (token.metrics?.totalHolders || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {tokens.reduce((sum, token) => sum + (token.metrics?.totalTransactions || 0), 0)} total transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tokens</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tokens.filter(token => token.status === 'deployed' && token.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {tokens.filter(token => token.isTradeable).length} tradeable
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Token Price</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${tokens.length > 0 ? 
                    (tokens.reduce((sum, token) => sum + Number(token.initialPrice), 0) / tokens.length).toFixed(2) 
                    : '0.00'}
                </div>
                <p className="text-xs text-green-600">
                  {tokens.filter(token => token.status === 'deployed').length} deployed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Dynamic Content Based on Active Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Token Portfolio Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Your Token Portfolio
                  </h2>
                  <p className="text-muted-foreground">
                    Manage {tokens.length} token{tokens.length !== 1 ? 's' : ''} and track performance
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setShowTokenCreation(true)
                    setShowCreateToken(true)}}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Token
                </Button>
              </div>

              {/* Token Cards Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tokens.map((token: any, index: number) => (
                  <Card key={token.deploymentInfo?.tokenAddress || token.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm overflow-hidden">
                    {/* Token Header */}
                    <div className={`h-2 bg-gradient-to-r ${
                      index % 3 === 0 ? 'from-purple-500 to-blue-500' :
                      index % 3 === 1 ? 'from-blue-500 to-cyan-500' :
                      'from-cyan-500 to-green-500'
                    }`} />
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {token.logoUrl ? (
                            <img 
                              src={token.logoUrl} 
                              alt={token.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${
                              index % 3 === 0 ? 'from-purple-500 to-blue-500' :
                              index % 3 === 1 ? 'from-blue-500 to-cyan-500' :
                              'from-cyan-500 to-green-500'
                            } flex items-center justify-center`}>
                              <span className="text-white font-bold text-lg">
                                {token.symbol?.charAt(0) || 'T'}
                              </span>
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900">
                              {token.symbol || 'N/A'}
                            </CardTitle>
                            <CardDescription className="text-sm font-medium">
                              {token.name || 'Unknown Token'}
                            </CardDescription>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {token.assetCategory || 'N/A'}
                              </Badge>
                              {token.jurisdiction && (
                                <Badge variant="secondary" className="text-xs">
                                  {token.jurisdiction}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenTokenDetails(token)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyToClipboard(token.tokenAddress)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Address
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <a href={`https://sepolia.etherscan.io/address/${token.tokenAddress}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View on Explorer
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Token Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-white/60 rounded-lg">
                          <div className="text-lg font-bold text-gray-900">
                            {Number(token.totalSupply || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Total Supply</div>
                        </div>
                        <div className="text-center p-3 bg-white/60 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            ${Number(token.initialPrice || 0).toFixed(2)} {token.currency || 'USD'}
                          </div>
                          <div className="text-xs text-muted-foreground">Price</div>
                        </div>
                      </div>

                      {/* Asset Info */}
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-2">Asset Information</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <p className="font-medium capitalize">{token.assetType || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Value:</span>
                            <p className="font-medium">${Number(token.assetValue || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Min Investment:</span>
                            <p className="font-medium">${Number(token.minInvestment || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Max Investment:</span>
                            <p className="font-medium">${Number(token.maxInvestment || 0).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Compliance Status */}
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-sm font-medium text-green-800 mb-2">Compliance Status</div>
                        <div className="flex flex-wrap gap-1">
                          {token.kycRequired && (
                            <Badge variant="outline" className="bg-green-100 text-green-700 text-xs">
                              KYC Required
                            </Badge>
                          )}
                          {token.amlRequired && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-700 text-xs">
                              AML Required
                            </Badge>
                          )}
                          {token.accreditedOnly && (
                            <Badge variant="outline" className="bg-purple-100 text-purple-700 text-xs">
                              Accredited Only
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Contract Addresses */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-2">Contract Addresses</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-muted-foreground">Token Contract</div>
                              <div className="text-sm font-mono text-gray-700">
                                {token.deploymentInfo?.tokenAddress?.slice(0, 6)}...{token.deploymentInfo?.tokenAddress?.slice(-4)}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(token.deploymentInfo?.tokenAddress || '')}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`https://${token.deploymentInfo?.network === 'holesky' ? 'holesky.etherscan.io' : 'sepolia.etherscan.io'}/address/${token.deploymentInfo?.tokenAddress}`, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {token.deploymentInfo?.contractSuite?.identityRegistryAddress && (
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs text-muted-foreground">Identity Registry</div>
                                <div className="text-sm font-mono text-gray-700">
                                  {token.deploymentInfo.contractSuite.identityRegistryAddress.slice(0, 6)}...{token.deploymentInfo.contractSuite.identityRegistryAddress.slice(-4)}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(token.deploymentInfo?.contractSuite?.identityRegistryAddress || '')}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => {
                            setSelectedToken(token.symbol)
                            setActiveTab("management")
                          }}
                        >
                          <Coins className="w-3 h-3 mr-1" />
                          Mint
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => {
                            setSelectedToken(token.symbol)
                            setActiveTab("investors")
                          }}
                        >
                          <Users className="w-3 h-3 mr-1" />
                          Investors
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleOpenTokenDetails(token)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex gap-2">
                          <Badge 
                            variant={token.status === 'deployed' ? 'default' : 'secondary'}
                            className={token.status === 'deployed' ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                          >
                            {token.status === 'deployed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                            {token.status === 'deployed' ? 'Deployed' : 'Pending'}
                          </Badge>
                          {token.isActive && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-700">
                              Active
                            </Badge>
                          )}
                          {token.isTradeable && (
                            <Badge variant="outline" className="bg-purple-100 text-purple-700">
                              Tradeable
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {token.deploymentInfo?.deployedAt ? 
                            new Date(token.deploymentInfo.deployedAt).toLocaleDateString() :
                            new Date(token.createdAt || Date.now()).toLocaleDateString()
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add New Token Card */}
                <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-dashed border-gray-200 hover:border-purple-300 bg-gradient-to-br from-gray-50 to-white cursor-pointer" onClick={() => setShowCreateToken(true)}>
                  <CardContent className="flex flex-col items-center justify-center h-full py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Plus className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Token</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Launch another ERC-3643 compliant security token
                    </p>
                    <Badge variant="outline" className="border-purple-200 text-purple-700">
                      <Coins className="w-3 h-3 mr-1" />
                      Quick Setup
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Advanced Portfolio Analytics */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-blue-900">
                      <TrendingUp className="h-5 w-5" />
                      <span>Portfolio Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Total Asset Value</span>
                        <span className="font-bold text-blue-900">
                          ${tokens.reduce((acc: number, token: any) => acc + Number(token.assetValue || 0), 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Market Cap</span>
                        <span className="font-bold text-blue-900">
                          ${tokens.reduce((acc: number, token: any) => acc + (Number(token.initialPrice || 0) * Number(token.totalSupply || 0)), 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Deployed Tokens</span>
                        <span className="font-bold text-blue-900">
                          {tokens.filter(token => token.status === 'deployed').length}/{tokens.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Avg. Token Price</span>
                        <span className="font-bold text-blue-900">
                          ${tokens.length > 0 ? (tokens.reduce((acc: number, token: any) => acc + Number(token.initialPrice || 0), 0) / tokens.length).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-purple-900">
                      <PieChart className="h-5 w-5" />
                      <span>Asset Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        tokens.reduce((acc: Record<string, number>, token: any) => {
                          const category = token.assetCategory || 'other'
                          acc[category] = (acc[category] || 0) + 1
                          return acc
                        }, {})
                      ).map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                            <span className="text-sm text-purple-700 capitalize">{category}</span>
                          </div>
                          <span className="font-medium text-purple-900">{count}</span>
                        </div>
                      ))}
                      {tokens.length === 0 && (
                        <div className="text-center text-purple-600 py-4">
                          <PieChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No assets to display</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-900">
                      <Activity className="h-5 w-5" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tokens
                        .sort((a: any, b: any) => new Date(b.deploymentInfo?.deployedAt || b.createdAt).getTime() - new Date(a.deploymentInfo?.deployedAt || a.createdAt).getTime())
                        .slice(0, 4)
                        .map((token: any, index: number) => (
                        <div key={token.id} className="flex items-center space-x-3">
                          <div className={`h-2 w-2 rounded-full ${token.status === 'deployed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <span className="text-sm text-green-700">
                            {token.symbol} {token.status === 'deployed' ? 'deployed' : 'created'}
                          </span>
                          <span className="text-xs text-green-500 ml-auto">
                            {new Date(token.deploymentInfo?.deployedAt || token.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                      {tokens.length === 0 && (
                        <div className="text-center text-green-600 py-4">
                          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "investors" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Investor Management</h2>
                  <p className="text-muted-foreground">Manage your token investors and their compliance status</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search investors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="blacklisted">Blacklisted</SelectItem>
                    </SelectContent>
                  </Select>
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
                        <TableHead>Investor</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Investment</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Compliance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvestors.map((investor) => (
                        <TableRow key={investor.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{investor.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{investor.fullName}</div>
                                <div className="text-sm text-muted-foreground">{investor.email}</div>
                                <div className="text-xs text-muted-foreground font-mono">
                                  {investor.walletAddress.slice(0, 6)}...{investor.walletAddress.slice(-4)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <Badge variant={investor.investorType === "institutional" ? "default" : "secondary"}>
                                {investor.investorType}
                              </Badge>
                              {investor.accreditedStatus && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                  Accredited
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono">${investor.totalInvested.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">
                              Since {new Date(investor.firstInvestment).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono">
                              {investor.tokenBalance.toFixed(2)} {selectedToken}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={investor.kycStatus === "verified" ? "default" : "secondary"}
                                  className={investor.kycStatus === "verified" ? "bg-green-100 text-green-700" : ""}
                                >
                                  KYC: {investor.kycStatus}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">Score: {investor.complianceScore}%</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                investor.status === "active"
                                  ? "default"
                                  : investor.status === "suspended"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className={
                                investor.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : investor.status === "blacklisted"
                                    ? "bg-red-100 text-red-700"
                                    : ""
                              }
                            >
                              {investor.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedInvestor(investor)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Investor Profile: {investor.fullName}</DialogTitle>
                                    <DialogDescription>
                                      Complete investor information and compliance status
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedInvestor && (
                                    <div className="space-y-6">
                                      {/* Basic Information */}
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Basic Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <Label>Full Name</Label>
                                              <p className="font-medium">{selectedInvestor.fullName}</p>
                                            </div>
                                            <div>
                                              <Label>Email</Label>
                                              <p className="font-medium">{selectedInvestor.email}</p>
                                            </div>
                                            <div>
                                              <Label>Country</Label>
                                              <p className="font-medium">{selectedInvestor.country}</p>
                                            </div>
                                            <div>
                                              <Label>Investor Type</Label>
                                              <Badge
                                                variant={
                                                  selectedInvestor.investorType === "institutional"
                                                    ? "default"
                                                    : "secondary"
                                                }
                                              >
                                                {selectedInvestor.investorType}
                                              </Badge>
                                            </div>
                                            <div>
                                              <Label>Wallet Address</Label>
                                              <div className="flex items-center space-x-2">
                                                <p className="font-mono text-sm">{selectedInvestor.walletAddress}</p>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => copyToClipboard(selectedInvestor.walletAddress)}
                                                >
                                                  <Copy className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            </div>
                                            <div>
                                              <Label>OnChain ID</Label>
                                              <div className="flex items-center space-x-2">
                                                <p className="font-mono text-sm">{selectedInvestor.onChainId}</p>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => copyToClipboard(selectedInvestor.onChainId)}
                                                >
                                                  <Copy className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      {/* Documents */}
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Documents</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="grid grid-cols-2 gap-4">
                                            {Object.entries(selectedInvestor.documents).map(([key, value]) => (
                                              <div
                                                key={key}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                              >
                                                <div className="flex items-center space-x-3">
                                                  <FileText className="h-5 w-5 text-blue-600" />
                                                  <div>
                                                    <p className="font-medium capitalize">
                                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                      IPFS: {value.slice(0, 15)}...
                                                    </p>
                                                  </div>
                                                </div>
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => window.open(value, "_blank")}
                                                >
                                                  <ExternalLink className="mr-2 h-4 w-4" />
                                                  View
                                                </Button>
                                              </div>
                                            ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleSuspendInvestor(investor.id)}>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Suspend
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Ban className="mr-2 h-4 w-4" />
                                    Blacklist
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Message
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Investment Orders</h2>
                  <p className="text-muted-foreground">Review and approve pending crypto investment orders</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={fetchPendingOrders}
                    variant="outline"
                    size="sm"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Badge variant="secondary">
                    {pendingOrders.length} pending
                  </Badge>
                </div>
              </div>

              {pendingOrders.length === 0 ? (
                <Card className="p-12 text-center">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending orders</h3>
                  <p className="text-gray-600">
                    When investors submit crypto payments, their orders will appear here for review and token minting.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {pendingOrders.map((order) => (
                  <Card key={order._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {order.investorAddress.slice(2, 4).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {order.investorProfile?.name || `${order.investorAddress.slice(0, 6)}...${order.investorAddress.slice(-4)}`}
                            </CardTitle>
                            <CardDescription>
                              {order.investorProfile?.email || order.investorAddress}
                            </CardDescription>
                            <p className="text-sm text-muted-foreground">
                              Order ID: {order._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              order.status === "pending_confirmation" || order.status === "confirmed"
                                ? "secondary"
                                : order.status === "ready_to_mint" || order.status === "minting"
                                ? "default"
                                : order.status === "completed"
                                ? "default"
                                : "destructive"
                            }
                            className={
                              order.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "failed" || order.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : order.status === "ready_to_mint"
                                ? "bg-blue-100 text-blue-700"
                                : ""
                            }
                          >
                            {order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Investment Details */}
                        <Card className="bg-slate-50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Investment Details</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Amount:</span>
                              <span className="font-mono">{order.requestedAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Value:</span>
                              <span className="font-mono">${order.investmentValue.toLocaleString()}</span>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Compliance Checks */}
                        <Card className="bg-slate-50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Compliance</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {Object.entries(order.complianceChecks).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-sm capitalize">{key}:</span>
                                <Badge variant={value ? "default" : "secondary"}>
                                  {value ? "Passed" : "Failed"}
                                </Badge>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        {/* Risk Assessment */}
                        <Card className="bg-slate-50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Risk Assessment</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Risk Level:</span>
                              <Badge variant="outline">{order.riskAssessment.level}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {order.status === "pending" && (
                        <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() => handleRejectOrder(order.id, "Compliance issues")}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                          <Button
                            onClick={() => handleApproveOrder(order.id)}
                            disabled={localLoading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {localLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <UserCheck className="mr-2 h-4 w-4" />
                            )}
                            Approve & Mint
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              )}
            </div>
          )}

          



          {activeTab === "management" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Token Management</h2>
                  <p className="text-muted-foreground">Mint tokens, manage trusted issuers, and control token operations</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Mint Tokens */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Coins className="h-5 w-5" />
                      <span>Mint Tokens</span>
                    </CardTitle>
                    <CardDescription>Mint new tokens to approved investors</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="mint-recipient">Recipient Address</Label>
                      <Input
                        id="mint-recipient"
                        placeholder="0x..."
                        value={mintRecipient}
                        onChange={(e) => setMintRecipient(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mint-amount">Amount</Label>
                      <Input
                        id="mint-amount"
                        type="number"
                        placeholder="0.00"
                        value={mintAmount}
                        onChange={(e) => setMintAmount(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleMintTokens} disabled={localLoading || contractLoading} className="w-full">
                      {localLoading || contractLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Minting...
                        </>
                      ) : (
                        <>
                          <Coins className="mr-2 h-4 w-4" />
                          Mint Tokens
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Trusted Issuers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UserCheck className="h-5 w-5" />
                      <span>Trusted Issuers</span>
                    </CardTitle>
                    <CardDescription>Add or remove trusted issuers for compliance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="trusted-issuer">Issuer Address</Label>
                      <Input
                        id="trusted-issuer"
                        placeholder="0x..."
                        value={trustedIssuerAddress}
                        onChange={(e) => setTrustedIssuerAddress(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleAddTrustedIssuer}
                        disabled={localLoading || contractLoading}
                        className="flex-1"
                      >
                        {localLoading || contractLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="mr-2 h-4 w-4" />
                        )}
                        Add Issuer
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Minus className="mr-2 h-4 w-4" />
                        Remove Issuer
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Blacklist Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Ban className="h-5 w-5" />
                      <span>Blacklist Management</span>
                    </CardTitle>
                    <CardDescription>Add or remove addresses from blacklist</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="blacklist-address">Address to Blacklist</Label>
                      <Input
                        id="blacklist-address"
                        placeholder="0x..."
                        value={blacklistAddress}
                        onChange={(e) => setBlacklistAddress(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleBlacklistAddress}
                        disabled={localLoading || contractLoading}
                        variant="destructive"
                        className="flex-1"
                      >
                        {localLoading || contractLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Ban className="mr-2 h-4 w-4" />
                        )}
                        Blacklist
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Unlock className="mr-2 h-4 w-4" />
                        Remove Blacklist
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Emergency Controls</span>
                    </CardTitle>
                    <CardDescription>Emergency pause and resume token transfers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleEmergencyPause}
                        disabled={localLoading || contractLoading}
                        variant="destructive"
                        className="flex-1"
                      >
                        {localLoading || contractLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Pause className="mr-2 h-4 w-4" />
                        )}
                        Emergency Pause
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Play className="mr-2 h-4 w-4" />
                        Resume
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Token Operations */}
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Token Operations</CardTitle>
                  <CardDescription>Advanced operations for token management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Lock className="h-6 w-6 mb-2" />
                      <span>Freeze Address</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Unlock className="h-6 w-6 mb-2" />
                      <span>Unfreeze Address</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Send className="h-6 w-6 mb-2" />
                      <span>Forced Transfer</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Archive className="h-6 w-6 mb-2" />
                      <span>Burn Tokens</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}


          {activeTab === "transactions" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Transaction History</h2>
                  <p className="text-muted-foreground">All token transactions and operations</p>
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
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions found</p>
                    <p className="text-sm">Transaction history will appear here as operations are performed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "compliance" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Compliance Management</h2>
                  <p className="text-muted-foreground">Monitor and manage ERC-3643 compliance requirements and regulatory standards</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={selectedToken} onValueChange={setSelectedToken}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Token" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.id} value={token.symbol}>
                          {token.symbol} - {token.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Compliance Report
                  </Button>
                </div>
              </div>

              {/* Compliance Status Overview */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {investors.length > 0 ? 
                        Math.round((investors.filter(inv => inv.kycStatus === 'verified' && inv.amlStatus === 'verified').length / investors.length) * 100)
                        : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+2.3%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">KYC Verified</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {investors.filter(inv => inv.kycStatus === 'verified').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      of {investors.length} total investors
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">AML Cleared</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {investors.filter(inv => inv.amlStatus === 'verified').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{Math.max(0, investors.filter(inv => inv.amlStatus === 'verified').length - 5)}</span> new this week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {Math.max(0, Math.floor(Math.random() * 5))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-red-600">{Math.max(0, Math.floor(Math.random() * 3))}</span> high priority
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Compliance Module Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Compliance Modules</span>
                    </CardTitle>
                    <CardDescription>Configure ERC-3643 compliance modules for your tokens</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Current Token Compliance Modules */}
                    {tokens.find(t => t.symbol === selectedToken)?.complianceModules?.length > 0 ? (
                      tokens.find(t => t.symbol === selectedToken)?.complianceModules.map((module, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${module.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                              <span className="font-medium">{module.moduleKey}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {module.proxyAddress?.slice(0, 6)}...{module.proxyAddress?.slice(-4)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={module.status === 'active' ? 'default' : 'secondary'}>
                              {module.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Configure
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  {module.status === 'active' ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                                  {module.status === 'active' ? 'Deactivate' : 'Activate'}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No compliance modules configured</p>
                        <p className="text-sm text-muted-foreground">Add modules to enforce compliance rules</p>
                      </div>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Compliance Module
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Compliance Module</DialogTitle>
                          <DialogDescription>
                            Configure a new compliance module for token transfer restrictions
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Module Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select module type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="country-allow">Country Allow Module</SelectItem>
                                <SelectItem value="country-restrict">Country Restrict Module</SelectItem>
                                <SelectItem value="max-balance">Max Balance Module</SelectItem>
                                <SelectItem value="time-lock">Time Lock Module</SelectItem>
                                <SelectItem value="transfer-fees">Transfer Fees Module</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Configuration</Label>
                            <Textarea placeholder="Module-specific configuration parameters" rows={3} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button>Add Module</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                {/* Jurisdiction Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Jurisdiction Management</span>
                    </CardTitle>
                    <CardDescription>Configure jurisdiction-specific compliance rules</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="default" className="bg-green-100 text-green-700">Allowed</Badge>
                            <span className="font-medium">United States</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">SEC Regulation D compliance</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-green-600">{Math.floor(Math.random() * 50 + 10)} investors</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Configure Rules
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Ban className="mr-2 h-4 w-4" />
                                Restrict Access
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="default" className="bg-blue-100 text-blue-700">Allowed</Badge>
                            <span className="font-medium">European Union</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">MiFID II compliance</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-blue-600">{Math.floor(Math.random() * 30 + 5)} investors</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Configure Rules
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Ban className="mr-2 h-4 w-4" />
                                Restrict Access
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="destructive" className="bg-red-100 text-red-700">Restricted</Badge>
                            <span className="font-medium">Sanctioned Countries</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">OFAC sanctions list</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-red-600">0 investors</span>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Jurisdiction Rule
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Jurisdiction Rule</DialogTitle>
                          <DialogDescription>
                            Configure country-specific compliance requirements
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Country/Region</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country or region" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="canada">Canada</SelectItem>
                                <SelectItem value="australia">Australia</SelectItem>
                                <SelectItem value="singapore">Singapore</SelectItem>
                                <SelectItem value="japan">Japan</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Access Level</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select access level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="allowed">Allowed</SelectItem>
                                <SelectItem value="restricted">Restricted</SelectItem>
                                <SelectItem value="conditional">Conditional</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Compliance Requirements</Label>
                            <Textarea placeholder="Specific compliance requirements for this jurisdiction" rows={3} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button>Add Rule</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>

              {/* KYC/AML Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5" />
                    <span>KYC/AML Management</span>
                  </CardTitle>
                  <CardDescription>Monitor and manage investor verification processes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* KYC Status */}
                    <div className="space-y-3">
                      <h4 className="font-medium">KYC Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm">Verified</span>
                          </div>
                          <span className="font-medium">{investors.filter(inv => inv.kycStatus === 'verified').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm">Pending</span>
                          </div>
                          <span className="font-medium">{investors.filter(inv => inv.kycStatus === 'pending').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm">Rejected</span>
                          </div>
                          <span className="font-medium">{investors.filter(inv => inv.kycStatus === 'rejected').length}</span>
                        </div>
                      </div>
                    </div>

                    {/* AML Status */}
                    <div className="space-y-3">
                      <h4 className="font-medium">AML Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm">Cleared</span>
                          </div>
                          <span className="font-medium">{investors.filter(inv => inv.amlStatus === 'verified').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm">Under Review</span>
                          </div>
                          <span className="font-medium">{investors.filter(inv => inv.amlStatus === 'pending').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm">Flagged</span>
                          </div>
                          <span className="font-medium">{investors.filter(inv => inv.amlStatus === 'rejected').length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Risk Scores */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Risk Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm">Low Risk</span>
                          </div>
                          <span className="font-medium">{investors.filter(inv => (inv.riskScore || 0) < 30).length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm">Medium Risk</span>
                          </div>
                          <span className="font-medium">{investors.filter(inv => (inv.riskScore || 0) >= 30 && (inv.riskScore || 0) < 70).length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm">High Risk</span>
                          </div>
                          <span className="font-medium">{investors.filter(inv => (inv.riskScore || 0) >= 70).length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Audit Trail */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Compliance Audit Trail</span>
                  </CardTitle>
                  <CardDescription>Recent compliance events and actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'KYC_VERIFIED', investor: 'investor_123', time: '2 hours ago', status: 'success' },
                      { type: 'AML_SCREENING', investor: 'investor_456', time: '4 hours ago', status: 'pending' },
                      { type: 'TRANSFER_BLOCKED', transaction: 'tx_789', time: '6 hours ago', status: 'warning' },
                      { type: 'COMPLIANCE_MODULE', module: 'CountryRestrictModule', time: '1 day ago', status: 'info' },
                      { type: 'JURISDICTION_UPDATE', country: 'Canada', time: '2 days ago', status: 'info' },
                    ].map((event, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          event.status === 'success' ? 'bg-green-500' :
                          event.status === 'warning' ? 'bg-yellow-500' :
                          event.status === 'pending' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">
                                {event.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {event.investor && `Investor: ${event.investor}`}
                                {event.transaction && `Transaction: ${event.transaction}`}
                                {event.module && `Module: ${event.module}`}
                                {event.country && `Country: ${event.country}`}
                              </p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {event.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Full Audit Log
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Regulatory Reporting */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Regulatory Reporting</span>
                    </CardTitle>
                    <CardDescription>Generate reports for regulatory authorities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <Button variant="outline" className="justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        SEC Form D Filing Report
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        FATF Compliance Report
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        MiFID II Transaction Report
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        GDPR Data Processing Report
                      </Button>
                    </div>
                    <div className="pt-2 border-t">
                      <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Generate Custom Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Risk Monitoring</span>
                    </CardTitle>
                    <CardDescription>Real-time compliance risk alerts and monitoring</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-yellow-50">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-yellow-800">Medium Risk Alert</span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                          Unusual transaction pattern detected for investor_789
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Investigate
                        </Button>
                      </div>

                      <div className="p-3 border rounded-lg bg-blue-50">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Info</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          New jurisdiction rule update required for EU investors
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Review
                        </Button>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-sm text-muted-foreground mb-2">Risk Score Distribution</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Low Risk (0-30)</span>
                          <span>{Math.round((investors.filter(inv => (inv.riskScore || 0) < 30).length / Math.max(investors.length, 1)) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${Math.round((investors.filter(inv => (inv.riskScore || 0) < 30).length / Math.max(investors.length, 1)) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Advanced Analytics</h2>
                  <p className="text-muted-foreground">Comprehensive insights into token performance and investor behavior</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={selectedToken} onValueChange={setSelectedToken}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Token" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.id} value={token.symbol}>
                          {token.symbol} - {token.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </div>

              {/* Key Performance Indicators */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${(tokens.reduce((sum, token) => {
                        const supply = Number(token.totalSupply) || 0
                        const price = Number(token.initialPrice) || 0
                        return sum + (supply * price)
                      }, 0)).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+2.5%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Trading Volume</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${tokens.reduce((sum, token) => sum + (Number(token.metrics?.totalVolume) || 0), 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+8.1%</span> from last week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Investors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {investors.filter(inv => inv.status === 'active').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-blue-600">+{Math.round(investors.length * 0.12)}</span> new this month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {investors.length > 0 ? 
                        Math.round((investors.filter(inv => inv.kycStatus === 'verified' && inv.amlStatus === 'verified').length / investors.length) * 100)
                        : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+5.2%</span> improvement
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Analytics */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Token Performance Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Token Performance</span>
                    </CardTitle>
                    <CardDescription>Price trends and volume analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tokens.slice(0, 3).map((token, index) => (
                        <div key={token.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${
                                index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                              }`}></div>
                              <span className="text-sm font-medium">{token.symbol}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ${Number(token.initialPrice || 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                              }`}
                              style={{ width: `${Math.min((Number(token.initialPrice) || 0) / 100 * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                      
                      {tokens.length === 0 && (
                        <div className="text-center py-8">
                          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground">No token data available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Investor Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5" />
                      <span>Investor Distribution</span>
                    </CardTitle>
                    <CardDescription>Breakdown by investor type and status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Investor Type Distribution */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Institutional vs Individual</span>
                          <span>{investors.length} total</span>
                        </div>
                        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                          <div 
                            className="bg-blue-500"
                            style={{ 
                              width: `${investors.length > 0 ? 
                                (investors.filter(inv => inv.investorType === 'institutional').length / investors.length * 100) 
                                : 0}%` 
                            }}
                          ></div>
                          <div 
                            className="bg-green-500"
                            style={{ 
                              width: `${investors.length > 0 ? 
                                (investors.filter(inv => inv.investorType === 'individual').length / investors.length * 100) 
                                : 0}%` 
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Institutional ({investors.filter(inv => inv.investorType === 'institutional').length})</span>
                          <span>Individual ({investors.filter(inv => inv.investorType === 'individual').length})</span>
                        </div>
                      </div>

                      {/* Compliance Status */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Compliance Status</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              <span className="text-sm">Verified</span>
                            </div>
                            <span className="text-sm font-medium">
                              {investors.filter(inv => inv.kycStatus === 'verified' && inv.amlStatus === 'verified').length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <span className="text-sm">Pending</span>
                            </div>
                            <span className="text-sm font-medium">
                              {investors.filter(inv => inv.kycStatus === 'pending' || inv.amlStatus === 'pending').length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <span className="text-sm">Rejected</span>
                            </div>
                            <span className="text-sm font-medium">
                              {investors.filter(inv => inv.kycStatus === 'rejected' || inv.amlStatus === 'rejected').length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analytics */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Transaction Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Transaction Analytics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Transactions</span>
                        <span className="font-bold">{transactions.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Successful</span>
                        <span className="font-bold text-green-600">
                          {transactions.filter(tx => tx.status === 'completed').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pending</span>
                        <span className="font-bold text-yellow-600">
                          {transactions.filter(tx => tx.status === 'pending').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Failed</span>
                        <span className="font-bold text-red-600">
                          {transactions.filter(tx => tx.status === 'failed').length}
                        </span>
                      </div>
                      
                      {/* Transaction Volume */}
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Volume</span>
                          <span className="font-bold">
                            ${transactions.reduce((sum, tx) => sum + (Number(tx.value) || 0), 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Growth Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Growth Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Monthly Growth</span>
                          <span className="text-green-600">+{Math.round(Math.random() * 20 + 5)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Investor Retention</span>
                          <span className="text-blue-600">
                            {investors.length > 0 ? Math.round((investors.filter(inv => inv.status === 'active').length / investors.length) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${investors.length > 0 ? (investors.filter(inv => inv.status === 'active').length / investors.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Token Utilization</span>
                          <span className="text-purple-600">
                            {tokens.length > 0 ? Math.round((tokens.filter(token => token.isActive).length / tokens.length) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${tokens.length > 0 ? (tokens.filter(token => token.isActive).length / tokens.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Risk Assessment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Overall Risk Score</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Low Risk
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Compliance Risk</span>
                            <span className="text-green-600">Low</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Liquidity Risk</span>
                            <span className="text-yellow-600">Medium</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Market Risk</span>
                            <span className="text-blue-600">Low</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                          Last updated: {new Date().toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>Latest events and transactions across your tokens</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction, index) => (
                      <div key={transaction.id || index} className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${
                          transaction.status === 'completed' ? 'bg-green-500' :
                          transaction.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium capitalize">{transaction.type} Transaction</p>
                              <p className="text-xs text-muted-foreground">
                                {transaction.amount} {transaction.tokenSymbol} • ${Number(transaction.value || 0).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {transactions.length === 0 && (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No recent activity</p>
                        <p className="text-sm text-muted-foreground">Activity will appear here as transactions occur</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Reports & Documentation</h2>
                  <p className="text-muted-foreground">Generate compliance reports and export data</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Reports</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      KYC/AML Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Investor Activity Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Token Issuance Report
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Export</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Export Investor Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Export Transaction History
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Export Compliance Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Settings</h2>
                  <p className="text-muted-foreground">Configure your issuer dashboard and token settings</p>
                </div>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Token Settings</CardTitle>
                    <CardDescription>Configure token-specific settings and compliance rules</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Transfer Restrictions</Label>
                        <p className="text-sm text-muted-foreground">Enable transfer restrictions for compliance</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Automatic Compliance Checks</Label>
                        <p className="text-sm text-muted-foreground">Automatically verify investor compliance</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>New Investment Orders</Label>
                        <p className="text-sm text-muted-foreground">Get notified of new investment requests</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Compliance Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts for compliance issues</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">API Management</h2>
                  <p className="text-muted-foreground">Manage API keys, documentation, and integration settings</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <BookOpen className="mr-2 h-4 w-4" />
                    API Docs
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download SDK
                  </Button>
                </div>
              </div>

              {/* API Usage Overview */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,547</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+23%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
                    <Code className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-blue-600">2</span> production keys
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rate Limit</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85%</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-yellow-600">1,700</span> requests/hour used
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">99.8%</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">24</span> errors this month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* API Keys Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="h-5 w-5" />
                      <span>API Keys</span>
                    </CardTitle>
                    <CardDescription>Generate and manage API keys for external integrations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {/* Production Key */}
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="default" className="bg-green-100 text-green-700">Production</Badge>
                            <span className="text-sm font-medium">Primary API Key</span>
                          </div>
                          <p className="text-sm text-muted-foreground font-mono mt-1">
                            sk_prod_************************{Math.random().toString(36).slice(-4)}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>Created: Jan 15, 2024</span>
                            <span>Last used: 2 hours ago</span>
                            <span>Requests: 8,547</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard('sk_prod_...')}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Regenerate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Configure Scopes
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Test Key */}
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">Test</Badge>
                            <span className="text-sm font-medium">Development Key</span>
                          </div>
                          <p className="text-sm text-muted-foreground font-mono mt-1">
                            sk_test_************************{Math.random().toString(36).slice(-4)}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>Created: Jan 10, 2024</span>
                            <span>Last used: 5 minutes ago</span>
                            <span>Requests: 3,892</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard('sk_test_...')}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Regenerate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Configure Scopes
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Generate New API Key
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Generate New API Key</DialogTitle>
                          <DialogDescription>
                            Create a new API key with specific permissions and rate limits
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Key Name</Label>
                            <Input placeholder="e.g., Mobile App Integration" />
                          </div>
                          <div>
                            <Label>Environment</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select environment" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="production">Production</SelectItem>
                                <SelectItem value="test">Test</SelectItem>
                                <SelectItem value="development">Development</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Permissions</Label>
                            <div className="space-y-2 mt-2">
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" defaultChecked />
                                <span className="text-sm">Read token data</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" defaultChecked />
                                <span className="text-sm">Read investor data</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" />
                                <span className="text-sm">Write operations</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" />
                                <span className="text-sm">Administrative functions</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button>Generate Key</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                {/* API Usage Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Usage Analytics</span>
                    </CardTitle>
                    <CardDescription>API request statistics and performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Endpoint Usage */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Top Endpoints</span>
                          <span>Requests (24h)</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="text-sm font-mono">/api/tokens</span>
                            </div>
                            <span className="text-sm font-medium">4,847</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-sm font-mono">/api/investors</span>
                            </div>
                            <span className="text-sm font-medium">3,521</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                              <span className="text-sm font-mono">/api/transactions</span>
                            </div>
                            <span className="text-sm font-medium">2,179</span>
                          </div>
                        </div>
                      </div>

                      {/* Response Times */}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Response Times</span>
                          <span>Avg: 145ms</span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span> &lt; 100ms</span>
                              <span>76%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>100-500ms</span>
                              <span>22%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>&gt; 500ms</span>
                              <span>2%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-red-500 h-2 rounded-full" style={{ width: '2%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Error Rates */}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Error Rates (7 days)</span>
                          <span>0.2%</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>4xx Client Errors</span>
                            <span className="text-yellow-600">18</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>5xx Server Errors</span>
                            <span className="text-red-600">6</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Webhooks and Integration */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Webhook Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Webhooks</span>
                    </CardTitle>
                    <CardDescription>Configure webhooks for real-time notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium">Token Events</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            https://your-app.com/webhooks/tokens
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">token.minted</Badge>
                            <Badge variant="outline" className="text-xs">token.transferred</Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" />
                                Test
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span className="text-sm font-medium">Compliance Events</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            https://your-app.com/webhooks/compliance
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">investor.verified</Badge>
                            <Badge variant="outline" className="text-xs">compliance.failed</Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" />
                                Test
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Webhook Endpoint
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Webhook Endpoint</DialogTitle>
                          <DialogDescription>
                            Configure a new webhook to receive real-time notifications
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Endpoint URL</Label>
                            <Input placeholder="https://your-app.com/webhooks" />
                          </div>
                          <div>
                            <Label>Events</Label>
                            <div className="space-y-2 mt-2">
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" />
                                <span className="text-sm">Token minted</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" />
                                <span className="text-sm">Token transferred</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" />
                                <span className="text-sm">Investor verified</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" />
                                <span className="text-sm">Compliance events</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button>Add Webhook</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                {/* API Testing Console */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="h-5 w-5" />
                      <span>API Testing Console</span>
                    </CardTitle>
                    <CardDescription>Test API endpoints directly from the dashboard</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label>Endpoint</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select endpoint" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET /api/tokens">GET /api/tokens</SelectItem>
                            <SelectItem value="GET /api/investors">GET /api/investors</SelectItem>
                            <SelectItem value="POST /api/tokens/mint">POST /api/tokens/mint</SelectItem>
                            <SelectItem value="GET /api/transactions">GET /api/transactions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Request Body (JSON)</Label>
                        <Textarea 
                          placeholder='{\n  "tokenId": "token123",\n  "amount": "1000"\n}'
                          className="font-mono text-sm"
                          rows={4}
                        />
                      </div>
                      <Button className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Send Request
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <Label>Response</Label>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <pre className="text-xs text-muted-foreground">
                          {`{
  "status": "success",
  "data": {
    "tokens": [...],
    "total": 3
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Documentation and SDKs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Documentation & SDKs</span>
                  </CardTitle>
                  <CardDescription>Integration resources and development tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">API Documentation</h4>
                          <p className="text-sm text-muted-foreground">Complete API reference</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Docs
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Code className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">JavaScript SDK</h4>
                          <p className="text-sm text-muted-foreground">NPM package for web apps</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <HelpCircle className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Code Examples</h4>
                          <p className="text-sm text-muted-foreground">Integration tutorials</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        View Examples
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Quick Start</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Get started with our API in minutes using your preferred programming language.
                    </p>
                    <div className="bg-white p-3 rounded border">
                      <pre className="text-xs text-gray-800">
{`curl -X GET "https://api.mobius.com/v1/tokens" \\
  -H "Authorization: Bearer sk_prod_your_api_key" \\
  -H "Content-Type: application/json"`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "support" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Support & Help</h2>
                  <p className="text-muted-foreground">Get help and access documentation</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Documentation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Token Issuance Guide
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Compliance Best Practices
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      API Documentation
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <HelpCircle className="h-5 w-5" />
                      <span>Get Support</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Support Team
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Globe className="mr-2 h-4 w-4" />
                      Visit Help Center
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
        
      </div>

      {/* Token Details Modal */}
      <TokenDetailsModal
        token={selectedTokenForDetails}
        isOpen={isDetailModalOpen}
        onClose={handleCloseTokenDetails}
      />

      {/* Token Creation Stepper */}
      <TokenCreationWizard
        isOpen={showTokenCreation}
        onClose={() => {
          
          setShowTokenCreation(false)
          setShowCreateToken(false)
        }}
        onSuccess={handleTokenCreated}
      />
            {/* <TokenCreationStepper
        isOpen={showCreateToken}
        onClose={() => setShowCreateToken(false)}
        onSuccess={handleTokenCreated} */}
      {/* /> */}
    </div>
  )
}

export default IssuerDashboard







// Asset categories and types
const ASSET_CATEGORIES = {
  "real-estate": {
    name: "Real Estate",
    icon: Home,
    color: "from-blue-500 to-cyan-500",
    assets: [
      { id: "residential", name: "Residential Property", description: "Houses, apartments, condos" },
      { id: "commercial", name: "Commercial Real Estate", description: "Office spaces, retail, industrial" },
      { id: "reits", name: "Real Estate Investment Trusts", description: "Diversified property portfolios" },
      { id: "vacation-rentals", name: "Vacation Rentals", description: "Short-term rental properties" },
      { id: "co-living", name: "Co-Living Spaces", description: "Shared housing investments" },
      { id: "mixed-use", name: "Mixed-Use Developments", description: "Combined residential/commercial" },
      { id: "affordable-housing", name: "Affordable Housing", description: "Social housing projects" },
      { id: "land", name: "Land Parcels", description: "Undeveloped land investments" },
    ],
  },
  financial: {
    name: "Financial Instruments",
    icon: Landmark,
    color: "from-green-500 to-emerald-500",
    assets: [
      { id: "corporate-bonds", name: "Corporate Bonds", description: "Company debt securities" },
      { id: "municipal-bonds", name: "Municipal Bonds", description: "Government infrastructure funding" },
      { id: "government-securities", name: "Government Securities", description: "Treasury bills, sovereign debt" },
      { id: "asset-backed-securities", name: "Asset-Backed Securities", description: "Mortgage-backed securities" },
      { id: "etfs", name: "Exchange-Traded Funds", description: "Diversified investment funds" },
      { id: "debt-instruments", name: "Debt Instruments", description: "Loans and credit products" },
      { id: "green-bonds", name: "Green Bonds", description: "Environmental project funding" },
      { id: "stock-options", name: "Stock Options", description: "Equity compensation programs" },
    ],
  },
  alternative: {
    name: "Alternative Assets",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    assets: [
      { id: "art", name: "Art & Collectibles", description: "Fine art, rare books, manuscripts" },
      { id: "wine-spirits", name: "Wine & Spirits", description: "Rare wines and premium spirits" },
      { id: "precious-metals", name: "Precious Metals", description: "Gold, silver, platinum reserves" },
      { id: "gemstones", name: "Precious Gemstones", description: "Diamonds, emeralds, rare stones" },
      { id: "carbon-credits", name: "Carbon Credits", description: "Environmental offset trading" },
      { id: "intellectual-property", name: "Intellectual Property", description: "Patents, copyrights, trademarks" },
      { id: "music-royalties", name: "Music Royalties", description: "Artist revenue streams" },
      { id: "movie-rights", name: "Movie Production Rights", description: "Film funding and revenue" },
    ],
  },
  infrastructure: {
    name: "Infrastructure & Energy",
    icon: Zap,
    color: "from-orange-500 to-red-500",
    assets: [
      { id: "renewable-energy", name: "Renewable Energy", description: "Solar, wind, hydroelectric projects" },
      { id: "data-centers", name: "Data Centers", description: "Cloud and AI infrastructure" },
      { id: "transportation", name: "Transportation Systems", description: "Railways, airports, ports" },
      { id: "utilities", name: "Utilities", description: "Water, gas, electricity infrastructure" },
      { id: "telecommunications", name: "Telecommunications", description: "5G networks, fiber optics" },
      { id: "smart-cities", name: "Smart City Projects", description: "IoT-enabled urban development" },
      { id: "energy-storage", name: "Energy Storage", description: "Battery systems, grid storage" },
      { id: "oil-gas", name: "Oil & Gas Assets", description: "Wells, reserves, refineries" },
    ],
  },
  agriculture: {
    name: "Agriculture & Commodities",
    icon: Wheat,
    color: "from-green-600 to-lime-500",
    assets: [
      { id: "agricultural-land", name: "Agricultural Land", description: "Farmland and crop production" },
      { id: "livestock", name: "Livestock", description: "Cattle, dairy, poultry operations" },
      { id: "agritech", name: "AgriTech Projects", description: "Vertical farms, precision agriculture" },
      { id: "commodities-storage", name: "Commodities Storage", description: "Grain silos, cold storage" },
      { id: "fisheries", name: "Fisheries", description: "Fishing rights and aquaculture" },
      { id: "forestry", name: "Forestry", description: "Timber rights and forest conservation" },
      { id: "water-rights", name: "Water Rights", description: "Water resource allocation" },
      { id: "rare-earth", name: "Rare Earth Elements", description: "Critical minerals and metals" },
    ],
  },
  business: {
    name: "Business & Services",
    icon: Briefcase,
    color: "from-indigo-500 to-purple-500",
    assets: [
      { id: "small-business", name: "Small Business Loans", description: "Local business funding" },
      { id: "franchise", name: "Franchise Businesses", description: "Restaurant and retail franchises" },
      { id: "shared-workspace", name: "Shared Workspaces", description: "Coworking and office spaces" },
      { id: "hotels", name: "Hospitality", description: "Hotels, resorts, entertainment venues" },
      { id: "healthcare-facilities", name: "Healthcare Facilities", description: "Clinics, medical centers" },
      { id: "educational-institutions", name: "Educational Institutions", description: "Schools, training centers" },
      { id: "logistics", name: "Logistics & Shipping", description: "Warehouses, shipping containers" },
      { id: "waste-management", name: "Waste Management", description: "Recycling, waste-to-energy" },
    ],
  },
}

// Jurisdiction-specific document requirements
const JURISDICTION_REQUIREMENTS = {
  US: {
    name: "United States",
    generalDocs: ["Business License", "Tax ID (EIN)", "Articles of Incorporation", "Operating Agreement"],
    assetSpecific: {
      residential: [
        "Property Deed",
        "Property Tax Records",
        "Insurance Policy",
        "Property Appraisal",
        "Zoning Certificate",
      ],
      commercial: [
        "Commercial Property Deed",
        "Lease Agreements",
        "Environmental Assessment",
        "Building Permits",
        "Fire Safety Certificate",
      ],
      "corporate-bonds": [
        "SEC Registration",
        "Financial Statements (10-K)",
        "Credit Rating",
        "Prospectus",
        "Board Resolutions",
      ],
      art: ["Certificate of Authenticity", "Provenance Documentation", "Insurance Appraisal", "Conservation Report"],
      "renewable-energy": [
        "Environmental Impact Assessment",
        "Grid Connection Agreement",
        "Power Purchase Agreement",
        "Construction Permits",
      ],
    },
  },
  UK: {
    name: "United Kingdom",
    generalDocs: [
      "Companies House Registration",
      "VAT Registration",
      "Memorandum of Association",
      "Articles of Association",
    ],
    assetSpecific: {
      residential: [
        "Land Registry Title",
        "Energy Performance Certificate",
        "Building Regulations Approval",
        "Property Survey",
      ],
      commercial: [
        "Commercial Property Title",
        "Business Rates Assessment",
        "Planning Permission",
        "Health & Safety Certificate",
      ],
      "corporate-bonds": [
        "FCA Authorization",
        "Annual Accounts",
        "Prospectus",
        "Credit Assessment",
        "Listing Particulars",
      ],
      art: [
        "Export License (if applicable)",
        "Insurance Valuation",
        "Authenticity Certificate",
        "Conservation Assessment",
      ],
      "renewable-energy": [
        "Planning Permission",
        "Grid Connection Offer",
        "Environmental Permit",
        "Construction Certificate",
      ],
    },
  },
  EU: {
    name: "European Union",
    generalDocs: ["EU Business Registration", "VAT Number", "Company Statute", "Beneficial Ownership Register"],
    assetSpecific: {
      residential: ["Property Registration", "Energy Certificate", "Building Permit", "Municipal Approval"],
      commercial: ["Commercial Registration", "Zoning Permit", "Fire Safety Certificate", "Environmental Compliance"],
      "corporate-bonds": ["ESMA Registration", "MiFID II Compliance", "Prospectus Regulation", "Credit Rating"],
      art: ["Cultural Property Certificate", "Export Permit", "Insurance Documentation", "Authenticity Proof"],
      "renewable-energy": [
        "Environmental Impact Study",
        "Grid Code Compliance",
        "Renewable Energy Certificate",
        "Construction License",
      ],
    },
  },
  UAE: {
    name: "United Arab Emirates",
    generalDocs: ["Trade License", "Chamber of Commerce Certificate", "Memorandum of Association", "Emirates ID"],
    assetSpecific: {
      residential: ["Title Deed"],
      // residential: ["Title Deed", "DEWA Connection", "Municipality Approval", "Property Valuation"],
      commercial: ["Commercial License", "NOC from Authorities", "Fire & Safety Certificate", "Municipality Permit"],
      "corporate-bonds": [
        "SCA Registration",
        "Sharia Compliance (if applicable)",
        "Financial Statements",
        "Credit Rating",
      ],
      art: ["Cultural Heritage Permit", "Import/Export License", "Insurance Certificate", "Authenticity Document"],
      "renewable-energy": [
        "DEWA Approval",
        "Environmental Clearance",
        "Construction Permit",
        "Grid Connection Agreement",
      ],
    },
  },
}

interface CreateTokenFormData {
  // Basic Token Information
  basicInfo: {
    name: string
    symbol: string
    totalSupply: string
    initialPrice: string
    decimals: number
    prefix: string
    description?: string
    minInvestment?: string
    maxInvestment?: string
  }

  // Asset Information
  assetInfo: {
    category: string
    type: string
    description: string
    jurisdiction: string
    estimatedValue?: string
    currency?: string
  }

  // Compliance Configuration
  complianceConfig: {
    requiredClaims: string[]
    complianceModules: {
      CountryAllowModule: number[]
      CountryRestrictModule: number[]
      MaxBalanceModule: number[]
    }
    kycRequired: boolean
    amlRequired: boolean
    accreditedOnly: boolean
  }

  // Owner Information
  ownerInfo: {
    address: string
    name?: string
    email?: string
    jurisdiction: string
  }

  // Agent Information
  agentInfo: {
    irAgentAddress: string
    tokenAgentAddress: string
    trustedIssuers: string[]
  }

  // Document Management
  documents: File[]
  requiredDocuments: string[]
  uploadedDocuments: { [key: string]: File | null }

  // Claim Data
  claimData: {
    claimTopics: string[]
    claimIssuer: string[]
    issuerClaims: string[][]
  }

  // Additional Metadata
  metadata: {
    logoUrl?: string
    website?: string
    whitepaper?: string
    socialLinks?: Record<string, string>
  }
}

const TokenCreationWizard = ({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: (tokenAddress: string) => void
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const { address: issuerAddress, isConnected } = useAppKitAccount()

  const [formData, setFormData] = useState<CreateTokenFormData>({
    basicInfo: {
      name: "",
      symbol: "",
      totalSupply: "",
      initialPrice: "",
      decimals: 18,
      prefix: "",
      description: "",
      minInvestment: "",
      maxInvestment: ""
    },
    assetInfo: {
      category: "",
      type: "",
      description: "",
      jurisdiction: "",
      estimatedValue: "",
      currency: "USD"
    },
    complianceConfig: {
      requiredClaims: ["IDENTITY_CLAIM"],
      complianceModules: {
        CountryAllowModule: [840], // US by default
        CountryRestrictModule: [],
        MaxBalanceModule: [1000000],
      },
      kycRequired: true,
      amlRequired: true,
      accreditedOnly: false
    },
    ownerInfo: {
      address: issuerAddress || "",
      jurisdiction: "US"
    },
    agentInfo: {
      irAgentAddress: issuerAddress || "",
      tokenAgentAddress: issuerAddress || "",
      trustedIssuers: [issuerAddress || ""]
    },
    documents: [],
    requiredDocuments: [],
    uploadedDocuments: {},
    claimData: {
      claimTopics: ['IDENTITY_CLAIM'],
      claimIssuer: [issuerAddress || ''],
      issuerClaims: [[]]
    },
    metadata: {
      logoUrl: "",
      website: "",
      whitepaper: "",
      socialLinks: {}
    }
  })

  const steps = [
    { id: 1, title: "Token Details", description: "Basic token information" },
    { id: 2, title: "Asset Selection", description: "Choose your asset type" },
    { id: 3, title: "Jurisdiction & Compliance", description: "Legal requirements" },
    { id: 4, title: "Document Upload", description: "Required documentation" },
    { id: 5, title: "Agents & Addresses", description: "Configure addresses" },
    { id: 6, title: "Review & Deploy", description: "Final review and deployment" },
  ]

  useEffect(() => {
    if (issuerAddress) {
      setFormData((prev) => ({
        ...prev,
        ownerInfo: {
          ...prev.ownerInfo,
          address: issuerAddress,
        },
        agentInfo: {
          ...prev.agentInfo,
          irAgentAddress: issuerAddress,
          tokenAgentAddress: issuerAddress,
          trustedIssuers: [issuerAddress],
        },
        claimData: {
          ...prev.claimData,
          claimIssuer: [issuerAddress],
          issuerClaims: prev.claimData.issuerClaims?.length ? prev.claimData.issuerClaims : [[]],
        }
      }))
    }
  }, [issuerAddress])

  useEffect(() => {
    // Update required documents when jurisdiction and asset type change
    if (formData.assetInfo.jurisdiction && formData.assetInfo.type) {
      const jurisdictionReqs =
        JURISDICTION_REQUIREMENTS[formData.assetInfo.jurisdiction as keyof typeof JURISDICTION_REQUIREMENTS]
      if (jurisdictionReqs) {
        const generalDocs = jurisdictionReqs.generalDocs
        const assetDocs =
          jurisdictionReqs.assetSpecific[formData.assetInfo.type as keyof typeof jurisdictionReqs.assetSpecific] || []
        setFormData((prev) => ({
          ...prev,
          requiredDocuments: [...generalDocs, ...assetDocs],
        }))
      }
    }
  }, [formData.assetInfo.jurisdiction, formData.assetInfo.type])

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCreateToken = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    setLoading(true)
    try {
      toast.loading("Creating token...", { id: "create-token" })
      console.log("creating token", formData)

      // Ensure owner address is set
      const updatedFormData = {
        ...formData,
        ownerInfo: {
          ...formData.ownerInfo,
          address: issuerAddress || formData.ownerInfo.address
        },
        agentInfo: {
          ...formData.agentInfo,
          irAgentAddress: formData.agentInfo.irAgentAddress || issuerAddress || "",
          tokenAgentAddress: formData.agentInfo.tokenAgentAddress || issuerAddress || ""
        }
      }

      // Transform frontend form data to backend API format using tokenService
      const apiData = tokenService.transformFormDataToApiFormat(updatedFormData)

      // Create token using tokenService
      const result = await tokenService.createToken(apiData.tokenData, apiData.claimData)

      if (result.success) {
        toast.success("Token created successfully!", { id: "create-token" })
        onSuccess(result.data?.tokenAddress || result.tokenAddress)
        onClose()
        
        // Reset form
        setCurrentStep(1)
        setFormData({
          basicInfo: {
            name: "",
            symbol: "",
            totalSupply: "1000000",
            initialPrice: "1.00",
            decimals: 18,
            prefix: "",
            description: "",
            minInvestment: "",
            maxInvestment: ""
          },
          assetInfo: {
            category: "",
            type: "",
            description: "",
            jurisdiction: "US",
            estimatedValue: "",
            currency: "USD"
          },
          complianceConfig: {
            requiredClaims: ["IDENTITY_CLAIM"],
            complianceModules: {
              CountryAllowModule: [840],
              CountryRestrictModule: [],
              MaxBalanceModule: [1000000],
            },
            kycRequired: true,
            amlRequired: true,
            accreditedOnly: false
          },
          ownerInfo: {
            address: issuerAddress || "",
            jurisdiction: "US"
          },
          agentInfo: {
            irAgentAddress: issuerAddress || "",
            tokenAgentAddress: issuerAddress || "",
            trustedIssuers: [issuerAddress || ""]
          },
          documents: [],
          requiredDocuments: [],
          uploadedDocuments: {},
          claimData: {
            claimTopics: ['IDENTITY_CLAIM'],
            claimIssuer: [issuerAddress || ''],
            issuerClaims: [[]]
          },
          metadata: {
            logoUrl: "",
            website: "",
            whitepaper: "",
            socialLinks: {}
          }
        })
      } else {
        throw new Error(result.message || "Token creation failed")
      }
    } catch (error: any) {
      console.error("Token creation error:", error)
      toast.error(error.message || "Failed to create token", { id: "create-token" })
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (updates: Partial<CreateTokenFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.basicInfo.name && formData.basicInfo.symbol && formData.basicInfo.totalSupply && formData.basicInfo.initialPrice
      case 2:
        return formData.assetInfo.category && formData.assetInfo.type
      case 3:
        return formData.assetInfo.jurisdiction
      case 4:
        return (
          formData.requiredDocuments.length === 0 ||
          formData.requiredDocuments.every((doc) => formData.uploadedDocuments[doc])
        )
      case 5:
        return formData.ownerInfo.address && formData.agentInfo.irAgentAddress && formData.agentInfo.tokenAgentAddress
      default:
        return true
    }
  }

  const handleFileUpload = (docName: string, file: File) => {
    setFormData((prev) => ({
      ...prev,
      uploadedDocuments: {
        ...prev.uploadedDocuments,
        [docName]: file,
      },
    }))
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[32rem] sm:max-w-[32rem] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Create Your First Security Token
          </SheetTitle>
          <SheetDescription>
            Follow our guided process to tokenize your asset and launch your security token
          </SheetDescription>
        </SheetHeader>

        {/* Progress Steps */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`
                  flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium
                  ${currentStep >= step.id ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"}
                `}
                >
                  {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                    h-0.5 w-8 mx-2
                    ${currentStep > step.id ? "bg-purple-600" : "bg-gray-200"}
                  `}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="font-medium">{steps[currentStep - 1].title}</h3>
            <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Token Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Token Name *</Label>
                  <Input
                    id="name"
                    value={formData.basicInfo.name}
                    onChange={(e) => updateFormData({ 
                      basicInfo: { 
                        ...formData.basicInfo, 
                        name: e.target.value 
                      } 
                    })}
                    placeholder="e.g., Manhattan Office Building Token"
                  />
                </div>
                <div>
                  <Label htmlFor="symbol">Token Symbol *</Label>
                  <Input
                    id="symbol"
                    value={formData.basicInfo.symbol}
                    onChange={(e) => updateFormData({ 
                      basicInfo: { 
                        ...formData.basicInfo, 
                        symbol: e.target.value.toUpperCase() 
                      } 
                    })}
                    placeholder="e.g., MOBT"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalSupply">Total Supply *</Label>
                  <Input
                    id="totalSupply"
                    value={formData.basicInfo.totalSupply}
                    onChange={(e) => updateFormData({ 
                      basicInfo: { 
                        ...formData.basicInfo, 
                        totalSupply: e.target.value 
                      } 
                    })}
                    placeholder="1000000"
                  />
                </div>
                <div>
                  <Label htmlFor="tokenPrice">Token Price (USD) *</Label>
                  <Input
                    id="tokenPrice"
                    value={formData.basicInfo.initialPrice}
                    onChange={(e) => updateFormData({ 
                      basicInfo: { 
                        ...formData.basicInfo, 
                        initialPrice: e.target.value 
                      } 
                    })}
                    placeholder="10.00"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="decimals">Decimals</Label>
                <Input
                  id="decimals"
                  type="number"
                  value={formData.basicInfo.decimals}
                  onChange={(e) => updateFormData({ 
                    basicInfo: { 
                      ...formData.basicInfo, 
                      decimals: Number.parseInt(e.target.value) || 18 
                    } 
                  })}
                />
              </div>
              <div>
                <Label htmlFor="prefix">Deployment Salt *</Label>
                <Input
                  id="prefix"
                  value={formData.basicInfo.prefix}
                  onChange={(e) => updateFormData({ 
                    basicInfo: { 
                      ...formData.basicInfo, 
                      prefix: e.target.value 
                    } 
                  })}
                  placeholder="unique-identifier-123"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Unique identifier for deterministic contract deployment
                </p>
              </div>
              <div>
                <Label htmlFor="description">Token Description</Label>
                <Textarea
                  id="description"
                  value={formData.basicInfo.description || ""}
                  onChange={(e) => updateFormData({ 
                    basicInfo: { 
                      ...formData.basicInfo, 
                      description: e.target.value 
                    } 
                  })}
                  placeholder="Describe your token and its purpose..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minInvestment">Min Investment (USD)</Label>
                  <Input
                    id="minInvestment"
                    value={formData.basicInfo.minInvestment || ""}
                    onChange={(e) => updateFormData({ 
                      basicInfo: { 
                        ...formData.basicInfo, 
                        minInvestment: e.target.value 
                      } 
                    })}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="maxInvestment">Max Investment (USD)</Label>
                  <Input
                    id="maxInvestment"
                    value={formData.basicInfo.maxInvestment || ""}
                    onChange={(e) => updateFormData({ 
                      basicInfo: { 
                        ...formData.basicInfo, 
                        maxInvestment: e.target.value 
                      } 
                    })}
                    placeholder="1000000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Asset Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Select Asset Category</Label>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  {Object.entries(ASSET_CATEGORIES).map(([key, category]) => {
                    const IconComponent = category.icon
                    return (
                      <Card
                        key={key}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          formData.assetInfo.category === key ? "ring-2 ring-purple-500" : ""
                        }`}
                        onClick={() => updateFormData({ 
                          assetInfo: { 
                            ...formData.assetInfo, 
                            category: key, 
                            type: "" 
                          } 
                        })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`h-10 w-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}
                            >
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-medium">{category.name}</h3>
                              <p className="text-xs text-muted-foreground">{category.assets.length} asset types</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {formData.assetInfo.category && (
                <div>
                  <Label className="text-base font-medium">Select Specific Asset Type</Label>
                  <div className="grid gap-3 mt-3">
                    {ASSET_CATEGORIES[formData.assetInfo.category as keyof typeof ASSET_CATEGORIES].assets.map((asset) => (
                      <Card
                        key={asset.id}
                        className={`cursor-pointer transition-all hover:shadow-sm ${
                          formData.assetInfo.type === asset.id ? "ring-2 ring-purple-500 bg-purple-50" : ""
                        }`}
                        onClick={() => updateFormData({ 
                          assetInfo: { 
                            ...formData.assetInfo, 
                            type: asset.id 
                          } 
                        })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{asset.name}</h4>
                              <p className="text-sm text-muted-foreground">{asset.description}</p>
                            </div>
                            {formData.assetInfo.type === asset.id && <CheckCircle className="h-5 w-5 text-purple-600" />}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {formData.assetInfo.type && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="assetDescription">Asset Description</Label>
                    <Textarea
                      id="assetDescription"
                      value={formData.assetInfo.description}
                      onChange={(e) => updateFormData({ 
                        assetInfo: { 
                          ...formData.assetInfo, 
                          description: e.target.value 
                        } 
                      })}
                      placeholder="Provide detailed description of your asset..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estimatedValue">Estimated Value</Label>
                      <Input
                        id="estimatedValue"
                        value={formData.assetInfo.estimatedValue || ""}
                        onChange={(e) => updateFormData({ 
                          assetInfo: { 
                            ...formData.assetInfo, 
                            estimatedValue: e.target.value 
                          } 
                        })}
                        placeholder="1000000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={formData.assetInfo.currency || "USD"}
                        onValueChange={(value) => updateFormData({ 
                          assetInfo: { 
                            ...formData.assetInfo, 
                            currency: value 
                          } 
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Jurisdiction & Compliance */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Select Jurisdiction</Label>
                <Select
                  value={formData.assetInfo.jurisdiction}
                  onValueChange={(value) => updateFormData({ 
                    assetInfo: { 
                      ...formData.assetInfo, 
                      jurisdiction: value 
                    } 
                  })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose your jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(JURISDICTION_REQUIREMENTS).map(([key, jurisdiction]) => (
                      <SelectItem key={key} value={key}>
                        {jurisdiction.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">Claim Topics</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {["IDENTITY_CLAIM", "KYC_CLAIM", "AML_CLAIM", "ACCREDITATION_CLAIM"].map((topic) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox
                        id={topic}
                        checked={formData.claimData.claimTopics.includes(topic)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData({
                              claimData: {
                                ...formData.claimData,
                                claimTopics: [...formData.claimData.claimTopics, topic],
                              }
                            })
                          } else {
                            updateFormData({
                              claimData: {
                                ...formData.claimData,
                                claimTopics: formData.claimData.claimTopics.filter((t) => t !== topic),
                              }
                            })
                          }
                        }}
                      />
                      <Label htmlFor={topic} className="text-sm">
                        {topic}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Compliance Modules</Label>
                <div className="space-y-4 mt-2">
                  <div>
                    <Label className="text-sm">Allowed Countries (Country Codes)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        placeholder="e.g., 840 for US"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const value = Number.parseInt(e.currentTarget.value)
                            if (value && !formData.complianceConfig.complianceModules.CountryAllowModule.includes(value)) {
                              updateFormData({
                                complianceConfig: {
                                  ...formData.complianceConfig,
                                  complianceModules: {
                                    ...formData.complianceConfig.complianceModules,
                                    CountryAllowModule: [...formData.complianceConfig.complianceModules.CountryAllowModule, value],
                                  },
                                },
                              })
                              e.currentTarget.value = ""
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.complianceConfig.complianceModules.CountryAllowModule.map((code) => (
                        <Badge key={code} variant="secondary" className="flex items-center gap-1">
                          {code}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => {
                              updateFormData({
                                complianceConfig: {
                                  ...formData.complianceConfig,
                                  complianceModules: {
                                    ...formData.complianceConfig.complianceModules,
                                    CountryAllowModule: formData.complianceConfig.complianceModules.CountryAllowModule.filter(
                                      (c) => c !== code,
                                    ),
                                  },
                                },
                              })
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm">Maximum Balance Per Wallet</Label>
                    <Input
                      type="number"
                      value={formData.complianceConfig.complianceModules.MaxBalanceModule[0] || ""}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value) || 0
                        updateFormData({
                          complianceConfig: {
                            ...formData.complianceConfig,
                            complianceModules: {
                              ...formData.complianceConfig.complianceModules,
                              MaxBalanceModule: [value],
                            },
                          },
                        })
                      }}
                      placeholder="1000000"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Document Upload */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Required Documents</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on your jurisdiction ({formData.assetInfo.jurisdiction}) and asset type, the following documents are
                  required:
                </p>

                <div className="space-y-4">
                  {formData.requiredDocuments.map((docName) => (
                    <Card key={docName}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{docName}</p>
                              <p className="text-sm text-muted-foreground">
                                {formData.uploadedDocuments[docName]
                                  ? `Uploaded: ${formData.uploadedDocuments[docName]?.name}`
                                  : "Required document"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {formData.uploadedDocuments[docName] ? (
                              <Badge variant="default" className="bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Uploaded
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const input = document.createElement("input")
                                input.type = "file"
                                input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0]
                                  if (file) {
                                    handleFileUpload(docName, file)
                                    toast.success(`${docName} uploaded successfully`)
                                  }
                                }
                                input.click()
                              }}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {formData.uploadedDocuments[docName] ? "Replace" : "Upload"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {formData.requiredDocuments.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No specific documents required for this configuration.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Agents & Addresses */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="ownerAddress">Token Owner Address *</Label>
                <Input
                  id="ownerAddress"
                  value={formData.ownerInfo.address}
                  onChange={(e) => updateFormData({ 
                    ownerInfo: { 
                      ...formData.ownerInfo, 
                      address: e.target.value 
                    } 
                  })}
                  placeholder="0x..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerInfo.name || ""}
                    onChange={(e) => updateFormData({ 
                      ownerInfo: { 
                        ...formData.ownerInfo, 
                        name: e.target.value 
                      } 
                    })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="ownerEmail">Owner Email</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    value={formData.ownerInfo.email || ""}
                    onChange={(e) => updateFormData({ 
                      ownerInfo: { 
                        ...formData.ownerInfo, 
                        email: e.target.value 
                      } 
                    })}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="irAgentAddress">Identity Registry Agent *</Label>
                <Input
                  id="irAgentAddress"
                  value={formData.agentInfo.irAgentAddress}
                  onChange={(e) => updateFormData({ 
                    agentInfo: { 
                      ...formData.agentInfo, 
                      irAgentAddress: e.target.value 
                    } 
                  })}
                  placeholder="0x..."
                />
              </div>
              <div>
                <Label htmlFor="tokenAgentAddress">Token Agent *</Label>
                <Input
                  id="tokenAgentAddress"
                  value={formData.agentInfo.tokenAgentAddress}
                  onChange={(e) => updateFormData({ 
                    agentInfo: { 
                      ...formData.agentInfo, 
                      tokenAgentAddress: e.target.value 
                    } 
                  })}
                  placeholder="0x..."
                />
              </div>
              <div>
                <Label>Trusted Issuers</Label>
                <div className="space-y-2 mt-2">
                  {formData.agentInfo.trustedIssuers.map((issuer, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={issuer}
                        onChange={(e) => {
                          const newIssuers = [...formData.agentInfo.trustedIssuers]
                          newIssuers[index] = e.target.value
                          updateFormData({ 
                            agentInfo: { 
                              ...formData.agentInfo, 
                              trustedIssuers: newIssuers 
                            } 
                          })
                        }}
                        placeholder="0x..."
                      />
                      {formData.agentInfo.trustedIssuers.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            updateFormData({
                              agentInfo: {
                                ...formData.agentInfo,
                                trustedIssuers: formData.agentInfo.trustedIssuers.filter((_, i) => i !== index),
                              }
                            })
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateFormData({
                        agentInfo: {
                          ...formData.agentInfo,
                          trustedIssuers: [...formData.agentInfo.trustedIssuers, ""],
                        }
                      })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Trusted Issuer
                  </Button>
                </div>
              </div>
              
              <div>
                <Label>Claim Issuers</Label>
                          <div className="space-y-2 mt-2">
            {formData.claimData.claimIssuer.map((issuer, index) => (
              <div key={index} className="space-y-2 border rounded-md p-3">
                <div className="flex items-center space-x-2">
                  <Input
                    value={issuer}
                    onChange={(e) => {
                      const newIssuers = [...formData.claimData.claimIssuer]
                      newIssuers[index] = e.target.value
                      updateFormData({ 
                        claimData: { 
                          ...formData.claimData, 
                          claimIssuer: newIssuers 
                        } 
                      })
                    }}
                    placeholder="0x..."
                  />
                  {formData.claimData.claimIssuer.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        updateFormData({
                          claimData: {
                            ...formData.claimData,
                            claimIssuer: formData.claimData.claimIssuer.filter((_, i) => i !== index),
                            issuerClaims: (formData.claimData.issuerClaims || []).filter((_, i) => i !== index),
                          }
                        })
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Select claims for this issuer</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["IDENTITY_CLAIM", "KYC_CLAIM", "AML_CLAIM", "ACCREDITATION_CLAIM"].map((topic) => {
                      const selectedForIssuer = (formData.claimData.issuerClaims && formData.claimData.issuerClaims[index]) || []
                      const checked = selectedForIssuer.includes(topic)
                      return (
                        <div key={topic} className="flex items-center space-x-2">
                          <Checkbox
                            id={`issuer-${index}-${topic}`}
                            checked={checked}
                            onCheckedChange={(isChecked) => {
                              const issuerClaimsCopy = (formData.claimData.issuerClaims || []).map(arr => [...arr])
                              // Ensure array exists for this index
                              if (!issuerClaimsCopy[index]) issuerClaimsCopy[index] = []
                              if (isChecked) {
                                if (!issuerClaimsCopy[index].includes(topic)) {
                                  issuerClaimsCopy[index].push(topic)
                                }
                              } else {
                                issuerClaimsCopy[index] = issuerClaimsCopy[index].filter(t => t !== topic)
                              }
                              updateFormData({
                                claimData: {
                                  ...formData.claimData,
                                  issuerClaims: issuerClaimsCopy
                                }
                              })
                            }}
                          />
                          <Label htmlFor={`issuer-${index}-${topic}`} className="text-xs">{topic}</Label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateFormData({
                  claimData: {
                    ...formData.claimData,
                    claimIssuer: [...formData.claimData.claimIssuer, ""],
                    issuerClaims: [...(formData.claimData.issuerClaims || []), []],
                  }
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Claim Issuer
            </Button>
          </div>
              </div>
              
              <div className="border-t pt-4">
                <Label className="text-base font-medium mb-3 block">Token Metadata (Optional)</Label>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={formData.metadata.logoUrl || ""}
                      onChange={(e) => updateFormData({ 
                        metadata: { 
                          ...formData.metadata, 
                          logoUrl: e.target.value 
                        } 
                      })}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.metadata.website || ""}
                        onChange={(e) => updateFormData({ 
                          metadata: { 
                            ...formData.metadata, 
                            website: e.target.value 
                          } 
                        })}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="whitepaper">Whitepaper URL</Label>
                      <Input
                        id="whitepaper"
                        value={formData.metadata.whitepaper || ""}
                        onChange={(e) => updateFormData({ 
                          metadata: { 
                            ...formData.metadata, 
                            whitepaper: e.target.value 
                          } 
                        })}
                        placeholder="https://example.com/whitepaper.pdf"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review & Deploy */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Review Your Token Configuration</h3>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Token Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <p className="font-medium">{formData.basicInfo.name}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Symbol:</span>
                          <p className="font-medium">{formData.basicInfo.symbol}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Supply:</span>
                          <p className="font-medium">{Number(formData.basicInfo.totalSupply).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <p className="font-medium">${formData.basicInfo.initialPrice}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Asset Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <p className="font-medium">
                            {ASSET_CATEGORIES[formData.assetInfo.category as keyof typeof ASSET_CATEGORIES]?.name}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <p className="font-medium">
                            {
                              ASSET_CATEGORIES[formData.assetInfo.category as keyof typeof ASSET_CATEGORIES]?.assets.find(
                                (a) => a.id === formData.assetInfo.type,
                              )?.name
                            }
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Jurisdiction:</span>
                          <p className="font-medium">
                            {
                              JURISDICTION_REQUIREMENTS[formData.assetInfo.jurisdiction as keyof typeof JURISDICTION_REQUIREMENTS]
                                ?.name
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Compliance & Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Required Claims:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.claimData.claimTopics.map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Documents Status:</span>
                        <p className="font-medium text-green-600">
                          {formData.requiredDocuments.filter((doc) => formData.uploadedDocuments[doc]).length} /{" "}
                          {formData.requiredDocuments.length} uploaded
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please review all information carefully. Once deployed, some token configurations cannot be easily
                  modified.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext} disabled={!isStepValid(currentStep)}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCreateToken}
              disabled={loading || !isConnected}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Token...
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4 mr-2" />
                  Deploy Token
                </>
              )}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

const EmptyStateOnboarding = ({ onStartTokenCreation }: { onStartTokenCreation: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Building className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Welcome to Token Issuer Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your real-world assets into compliant security tokens. Start your tokenization journey with our
            guided setup process.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">ERC-3643 Compliant</h3>
            <p className="text-sm text-muted-foreground">
              Fully compliant with T-REX standard for security tokens with built-in KYC/AML
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Multi-Jurisdiction</h3>
            <p className="text-sm text-muted-foreground">
              Support for US, UK, EU, UAE regulations with automated compliance checks
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Asset Diversity</h3>
            <p className="text-sm text-muted-foreground">
              Tokenize real estate, bonds, art, commodities, and 100+ other asset types
            </p>
          </Card>
        </div>

        {/* Asset Categories Preview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">What Can You Tokenize?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(ASSET_CATEGORIES).map(([key, category]) => {
              const IconComponent = category.icon
              return (
                <Card key={key} className="p-4 text-center hover:shadow-md transition-shadow">
                  <div
                    className={`h-10 w-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-2`}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-medium text-sm">{category.name}</h4>
                  <p className="text-xs text-muted-foreground">{category.assets.length} types</p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Issue Your First Token?</h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Our guided wizard will walk you through token configuration, asset selection, compliance setup, and document
            upload. The entire process takes just 10-15 minutes.
          </p>
          <Button
            size="lg"
            onClick={onStartTokenCreation}
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
          >
            <Coins className="mr-2 h-5 w-5" />
            Issue Your First Token
          </Button>
        </Card>

        {/* Process Steps */}
        <div className="mt-12 grid md:grid-cols-6 gap-4 text-center">
          {[
            { icon: FileText, title: "Token Details", desc: "Name, symbol, supply" },
            { icon: Building, title: "Asset Selection", desc: "Choose asset type" },
            { icon: Globe, title: "Jurisdiction", desc: "Legal compliance" },
            { icon: Upload, title: "Documents", desc: "Upload required docs" },
            { icon: Settings, title: "Configuration", desc: "Agents & addresses" },
            { icon: Rocket, title: "Deploy", desc: "Launch your token" },
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <step.icon className="h-5 w-5 text-gray-600" />
              </div>
              <h4 className="font-medium text-sm">{step.title}</h4>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
