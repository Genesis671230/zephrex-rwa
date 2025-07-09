

"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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


// Types for issuer dashboard
interface TokenData {
  id: string
  symbol: string
  name: string
  tokenAddress: string
  totalSupply: string
  circulatingSupply: string
  price: number
  marketCap: number
  holders: number
  totalInvestments: number
  status: "active" | "paused" | "frozen"
  compliance: {
    kycRequired: boolean
    amlRequired: boolean
    accreditedOnly: boolean
    jurisdictionRestrictions: string[]
  }
  createdAt: string
  lastActivity: string
  trustedIssuers: string[]
  emergencyPaused: boolean
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

// import type { AppDispatch } from "@/store/store"
// import { useDispatch, useSelector } from "react-redux"

// export const useAppDispatch = () => useDispatch<AppDispatch>()
// export const useAppSelector = useSelector


const TokenCreationStepper = ({ isOpen, onClose, onSuccess }: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: (tokenAddress: string) => void
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const { address: issuerAddress, isConnected } = useAppKitAccount()
  
  const [formData, setFormData] = useState<CreateTokenFormData>({
    name: '',
    symbol: '',
    decimals: 18,
    ownerAddress: issuerAddress || '',
    irAgentAddress: issuerAddress || '',
    tokenAgentAddress: issuerAddress || '',
    prefix: '',
    modules: {
      CountryAllowModule: [840, 826], // US, UK
      CountryRestrictModule: [],
      MaxBalanceModule: [1000000]
    },
    claimData: {
      claimTopics: ['IDENTITY_CLAIM'],
      claimIissuers: [issuerAddress || ''],
      issuerClaims: ['VERIFIED']
    }
  })

  // Update addresses when wallet connects
  useEffect(() => {
    if (issuerAddress) {
      setFormData((prev: any) => ({
        ...prev,
        ownerAddress: issuerAddress,
        irAgentAddress: issuerAddress,
        tokenAgentAddress: issuerAddress,
        claimData: {
          ...prev.claimData,
          claimIissuers: [issuerAddress]
        }
      }))
    }
  }, [issuerAddress])

  const steps = [
    { id: 1, title: "Basic Information", description: "Token details and metadata" },
    { id: 2, title: "Addresses & Agents", description: "Owner and agent configurations" },
    { id: 3, title: "Compliance Modules", description: "Configure compliance settings" },
    { id: 4, title: "Identity Claims", description: "Setup identity verification" },
    { id: 5, title: "Review & Create", description: "Review and deploy token" }
  ]

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
      toast.error('Please connect your wallet first')
      return
    }

    setLoading(true)
    try {
      toast.loading('Creating token...', { id: 'create-token' })
      
      const response = await fetch(`${API_BASE_URL}/tokens/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenData: formData,
          claimData: formData.claimData
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create token')
      }

      toast.success('Token created successfully!', { id: 'create-token' })
      onSuccess(result.tokenAddress)
      onClose()
      
      // Reset form
      setCurrentStep(1)
      setFormData({
        ...formData,
        name: '',
        symbol: '',
        prefix: ''
      })

    } catch (error: any) {
      console.error('Token creation error:', error)
      toast.error(error.message || 'Failed to create token', { id: 'create-token' })
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (updates: Partial<CreateTokenFormData>) => {
    setFormData((prev: any) => ({ ...prev, ...updates }))
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.symbol && formData.prefix
      case 2:
        return formData.ownerAddress && formData.irAgentAddress && formData.tokenAgentAddress
      case 3:
        return true // Module configuration is optional
      case 4:
        return formData.claimData.claimTopics.length > 0 && formData.claimData.claimIissuers.length > 0
      default:
        return true
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Create New ERC3643 Token
          </SheetTitle>
          <SheetDescription>
            Follow the steps to configure and deploy your security token
          </SheetDescription>
        </SheetHeader>

        {/* Progress Steps */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium
                  ${currentStep >= step.id 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    h-0.5 w-12 mx-2
                    ${currentStep > step.id ? 'bg-purple-600' : 'bg-gray-200'}
                  `} />
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
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Token Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="e.g., Green Brew Bond"
                />
              </div>
              <div>
                <Label htmlFor="symbol">Token Symbol *</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => updateFormData({ symbol: e.target.value.toUpperCase() })}
                  placeholder="e.g., GBB"
                />
              </div>
              <div>
                <Label htmlFor="decimals">Decimals</Label>
                <Input
                  id="decimals"
                  type="number"
                  value={formData.decimals}
                  onChange={(e) => updateFormData({ decimals: parseInt(e.target.value) || 18 })}
                />
              </div>
              <div>
                <Label htmlFor="prefix">Salt/Prefix *</Label>
                <Input
                  id="prefix"
                  value={formData.prefix}
                  onChange={(e) => updateFormData({ prefix: e.target.value })}
                  placeholder="unique-salt-123"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Unique identifier for deterministic deployment
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Addresses & Agents */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="ownerAddress">Owner Address *</Label>
                <Input
                  id="ownerAddress"
                  value={formData.ownerAddress}
                  onChange={(e) => updateFormData({ ownerAddress: e.target.value })}
                  placeholder="0x..."
                />
              </div>
              <div>
                <Label htmlFor="irAgentAddress">Identity Registry Agent *</Label>
                <Input
                  id="irAgentAddress"
                  value={formData.irAgentAddress}
                  onChange={(e) => updateFormData({ irAgentAddress: e.target.value })}
                  placeholder="0x..."
                />
              </div>
              <div>
                <Label htmlFor="tokenAgentAddress">Token Agent *</Label>
                <Input
                  id="tokenAgentAddress"
                  value={formData.tokenAgentAddress}
                  onChange={(e) => updateFormData({ tokenAgentAddress: e.target.value })}
                  placeholder="0x..."
                />
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Note:</strong> All agent addresses are currently set to your wallet address. 
                  You can modify them if needed.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Compliance Modules */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Country Allow Module</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Specify allowed countries (country codes)
                </p>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Country code (e.g., 840 for US)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = parseInt(e.currentTarget.value)
                        if (value && !formData.modules.CountryAllowModule.includes(value)) {
                          updateFormData({
                            modules: {
                              ...formData.modules,
                              CountryAllowModule: [...formData.modules.CountryAllowModule, value]
                            }
                          })
                          e.currentTarget.value = ''
                        }
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.modules.CountryAllowModule.map((code) => (
                    <Badge key={code} variant="secondary" className="flex items-center gap-1">
                      {code}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => {
                          updateFormData({
                            modules: {
                              ...formData.modules,
                              CountryAllowModule: formData.modules.CountryAllowModule.filter(c => c !== code)
                            }
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
                <Label className="text-base font-medium">Max Balance Module</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Maximum tokens per wallet
                </p>
                <Input
                  type="number"
                  value={formData.modules.MaxBalanceModule[0] || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0
                    updateFormData({
                      modules: {
                        ...formData.modules,
                        MaxBalanceModule: [value]
                      }
                    })
                  }}
                  placeholder="1000000"
                />
              </div>
            </div>
          )}

          {/* Step 4: Identity Claims */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Claim Topics</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Required identity claim types
                </p>
                <div className="space-y-2">
                  {['IDENTITY_CLAIM', 'KYC_CLAIM', 'AML_CLAIM', 'ACCREDITATION_CLAIM'].map((topic) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox
                        id={topic}
                        checked={formData.claimData.claimTopics.includes(topic)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData({
                              claimData: {
                                ...formData.claimData,
                                claimTopics: [...formData.claimData.claimTopics, topic]
                              }
                            })
                          } else {
                            updateFormData({
                              claimData: {
                                ...formData.claimData,
                                claimTopics: formData.claimData.claimTopics.filter(t => t !== topic)
                              }
                            })
                          }
                        }}
                      />
                      <Label htmlFor={topic} className="text-sm">{topic}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="claimIssuer">Claim Issuers</Label>
                <Input
                  id="claimIssuer"
                  value={formData.claimData.claimIissuers[0] || ''}
                  onChange={(e) => {
                    updateFormData({
                      claimData: {
                        ...formData.claimData,
                        claimIissuers: [e.target.value]
                      }
                    })
                  }}
                  placeholder="0x..."
                />
              </div>

              <div>
                <Label className="text-base font-medium">Issuer Claims</Label>
                <div className="space-y-2">
                  {['VERIFIED', 'KYC_PASSED', 'AML_CLEARED', 'ACCREDITED'].map((claim) => (
                    <div key={claim} className="flex items-center space-x-2">
                      <Checkbox
                        id={claim}
                        checked={formData.claimData.issuerClaims.includes(claim)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData({
                              claimData: {
                                ...formData.claimData,
                                issuerClaims: [...formData.claimData.issuerClaims, claim]
                              }
                            })
                          } else {
                            updateFormData({
                              claimData: {
                                ...formData.claimData,
                                issuerClaims: formData.claimData.issuerClaims.filter(c => c !== claim)
                              }
                            })
                          }
                        }}
                      />
                      <Label htmlFor={claim} className="text-sm">{claim}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Create */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Review Token Configuration</h3>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{formData.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Symbol:</span>
                        <span className="font-medium">{formData.symbol}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Decimals:</span>
                        <span className="font-medium">{formData.decimals}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Salt:</span>
                        <span className="font-mono text-xs">{formData.prefix}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Addresses</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Owner:</span>
                        <p className="font-mono text-xs break-all">{formData.ownerAddress}</p>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">IR Agent:</span>
                        <p className="font-mono text-xs break-all">{formData.irAgentAddress}</p>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Token Agent:</span>
                        <p className="font-mono text-xs break-all">{formData.tokenAgentAddress}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Compliance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Allowed Countries:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.modules.CountryAllowModule.map((code: number) => (
                            <Badge key={code} variant="outline" className="text-xs">{code}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Max Balance:</span>
                        <span className="font-medium ml-2">{formData.modules.MaxBalanceModule[0]?.toLocaleString()}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Required Claims:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {formData.claimData.claimTopics.map((topic: string) => (
                            <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Once created, the token configuration cannot be easily modified. Please review all details carefully.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCreateToken}
              disabled={loading || !isConnected}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4 mr-2" />
                  Create Token
                </>
              )}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

const IssuerDashboard = () => {
  const dispatch = useDispatch()
  const {  investors, investmentOrders, analytics } = useSelector((state: any) => state.issuer)
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
  const [tokens,setTokens] = useState<MarketplaceToken[]>([])


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
  

  // Mock data for demonstration
  const mockTokens: TokenData[] = [
    {
      id: "1",
      symbol: "GBB",
      name: "Green Brew Bond",
      tokenAddress: "0x97C1E24C5A5D5F5b5e5D5c5B5a5F5E5d5C5b5A5f",
      totalSupply: "1000000",
      circulatingSupply: "750000",
      price: 10.43,
      marketCap: 7822500,
      holders: 245,
      totalInvestments: 156,
      status: "active",
      compliance: {
        kycRequired: true,
        amlRequired: true,
        accreditedOnly: false,
        jurisdictionRestrictions: ["US", "EU"],
      },
      createdAt: "2024-01-15",
      lastActivity: "2024-01-20",
      trustedIssuers: [issuerAddress || ""],
      emergencyPaused: false
    },
    {
      id: "2",
      symbol: "RGT",
      name: "Royal Galaxy Token",
      tokenAddress: "0x97C1E1235A5D5F5b5e5D5c5B5a5F5E5d5C5b5A5f",
      totalSupply: "1000000",
      circulatingSupply: "750000",
      price: 1.23,
      marketCap: 1230000,
      holders: 1000,
      totalInvestments: 1000,
      status: "paused",
      compliance: {
        kycRequired: true,
        amlRequired: false,
        accreditedOnly: false,
        jurisdictionRestrictions: ["UAE", "UK"],
      },
      createdAt: "2025-01-15",
      lastActivity: "2025-07-06",
      trustedIssuers: [issuerAddress || ""],
      emergencyPaused: false
    },
  ]

  const mockInvestors: InvestorProfile[] = [
    {
      id: "1",
      walletAddress: "0xD2E33B6ACDE32e80E6553270C349C9BC8E45aCf0",
      onChainId: "0xB7A730d79eCB3A171a66c4Aebdf0f84DC62882A4",
      fullName: "John Smith",
      email: "john.smith@example.com",
      country: "US",
      investorType: "individual",
      accreditedStatus: true,
      kycStatus: "verified",
      amlStatus: "verified",
      totalInvested: 25000,
      tokenBalance: 2397.5,
      firstInvestment: "2024-01-10",
      lastActivity: "2024-01-18",
      riskScore: 25,
      complianceScore: 95,
      status: "active",
      documents: {
        identity: "ipfs://QmIdentity123",
        address: "ipfs://QmAddress123",
        income: "ipfs://QmIncome123",
        accreditation: "ipfs://QmAccred123",
      },
      transactions: [],
    },
    {
      id: "2",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      onChainId: "0xC8B841e90eDC4A282a77c4Aebdf0f84DC62882B5",
      fullName: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      country: "CA",
      investorType: "institutional",
      accreditedStatus: true,
      kycStatus: "verified",
      amlStatus: "pending",
      totalInvested: 100000,
      tokenBalance: 9587.2,
      firstInvestment: "2024-01-05",
      lastActivity: "2024-01-19",
      riskScore: 15,
      complianceScore: 88,
      status: "active",
      documents: {
        identity: "ipfs://QmIdentity456",
        address: "ipfs://QmAddress456",
        income: "ipfs://QmIncome456",
        accreditation: "ipfs://QmAccred456",
      },
      transactions: [],
    },
  ]

  const mockOrders: InvestmentOrder[] = [
    {
      id: "ORD-001",
      investorId: "3",
      investorName: "Michael Chen",
      investorEmail: "michael.chen@example.com",
      tokenSymbol: "GBB",
      requestedAmount: 1000,
      investmentValue: 10430,
      currency: "USDC",
      paymentMethod: "stablecoin",
      status: "pending",
      submittedAt: "2024-01-20T10:30:00Z",
      complianceChecks: {
        kyc: true,
        aml: true,
        jurisdiction: true,
        accreditation: false,
      },
      documents: ["ipfs://QmDoc1", "ipfs://QmDoc2"],
      riskAssessment: {
        score: 35,
        level: "medium",
        factors: ["First-time investor", "Large investment amount"],
      },
      notes: "First investment from this investor. Requires additional review.",
    },
    {
      id: "ORD-002",
      investorId: "4",
      investorName: "Emma Wilson",
      investorEmail: "emma.wilson@example.com",
      tokenSymbol: "GBB",
      requestedAmount: 500,
      investmentValue: 5215,
      currency: "ETH",
      paymentMethod: "crypto_wallet",
      status: "approved",
      submittedAt: "2024-01-19T14:15:00Z",
      reviewedAt: "2024-01-19T16:30:00Z",
      reviewedBy: issuerAddress,
      complianceChecks: {
        kyc: true,
        aml: true,
        jurisdiction: true,
        accreditation: true,
      },
      documents: ["ipfs://QmDoc3", "ipfs://QmDoc4"],
      riskAssessment: {
        score: 20,
        level: "low",
        factors: ["Verified accredited investor", "Good compliance history"],
      },
      notes: "Approved for minting. All compliance checks passed.",
    },
  ]



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


  const fetchInvestorData = async () => {
    try {
      setLoading(true);
      const res = await getInvestorList();
      console.log('API Response:', res);

      if (!isConnected) {
        open();
        return;
      }

      if (issuerAddress) {
        const investorDetails = res.content.filter(
          (investor: any) =>
            investor.investorAddress.toLowerCase() ===
            issuerAddress.toLowerCase()
        );


        const stdata = await getSTData()
        console.log("ST data received:", stdata)

        // Filter the data based on the symbol from URL params
        const filteredTokens = stdata.content.filter((contract: any) => contract.ownerAddress.toLowerCase() === "0x9d876216ee6fb74c70bd71f715e34b71dd02134c"?.toLowerCase())
        setTokens(filteredTokens)

        setSelectedToken(filteredTokens[0].symbol)
        // Check if signer key is already approved (mock check)
        // In real implementation, you'd check the blockchain
        // setSignerKeyApproved(details?.claimStatus?.kycVerified || false)
      }
    } catch (error) {
      console.error('Error fetching investor data:', error);
      toast.error('Failed to fetch investor data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestorData();
  }, [issuerAddress]);


  useEffect(() => {
    if (issuerAddress) {
      dispatch(fetchTokens(issuerAddress))
    }
  }, [dispatch, issuerAddress])

  useEffect(() => {
    if (selectedToken) {
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

      const result = await mintTokens(selectedToken, mintRecipient, mintAmount)

      if (result.success) {
        toast.success(`Successfully minted ${mintAmount} tokens to ${mintRecipient}`, { id: "mint-tokens" })
        setMintAmount("")
        setMintRecipient("")
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
      const result = await dispatch(approveInvestmentOrder({ orderId, tokenSymbol: selectedToken }))
      
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
        const currentToken = mockTokens.find(t => t.symbol === selectedToken)
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
        const currentToken = mockTokens.find(t => t.symbol === selectedToken)
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const filteredInvestors = mockInvestors.filter((investor) => {
    const matchesSearch =
      investor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || investor.status === statusFilter
    const matchesCompliance =
      complianceFilter === "all" ||
      (complianceFilter === "verified" && investor.kycStatus === "verified" && investor.amlStatus === "verified") ||
      (complianceFilter === "pending" && (investor.kycStatus === "pending" || investor.amlStatus === "pending"))

    return matchesSearch && matchesStatus && matchesCompliance
  })

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.investorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())

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
             <Select value={selectedToken} onValueChange={setSelectedToken}>
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
          {/* Overview Cards */}
          <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
                <DollarSign className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$7.82M</div>
                <p className="text-xs opacity-80">+12.5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Investors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">+18 new this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Requires review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Token Price</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$10.43</div>
                <p className="text-xs text-green-600">+2.3% today</p>
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
                  <Card key={token.tokenAddress} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm overflow-hidden">
                    {/* Token Header */}
                    <div className={`h-2 bg-gradient-to-r ${
                      index % 3 === 0 ? 'from-purple-500 to-blue-500' :
                      index % 3 === 1 ? 'from-blue-500 to-cyan-500' :
                      'from-cyan-500 to-green-500'
                    }`} />
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${
                            index % 3 === 0 ? 'from-purple-500 to-blue-500' :
                            index % 3 === 1 ? 'from-blue-500 to-cyan-500' :
                            'from-cyan-500 to-green-500'
                          } flex items-center justify-center`}>
                            <span className="text-white font-bold text-lg">
                              {token.symbol?.charAt(0) || 'T'}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900">
                              {token.symbol || 'N/A'}
                            </CardTitle>
                            <CardDescription className="text-sm font-medium">
                              {token.name || 'Unknown Token'}
                            </CardDescription>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedToken(token.symbol)}>
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
                            {token.totalSupply ? Number(token.totalSupply).toLocaleString() : '1,000,000'}
                          </div>
                          <div className="text-xs text-muted-foreground">Total Supply</div>
                        </div>
                        <div className="text-center p-3 bg-white/60 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            ${token.initialPrice ? Number(token.initialPrice).toFixed(2) : '10.00'}
                          </div>
                          <div className="text-xs text-muted-foreground">Price</div>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Contract Address</div>
                            <div className="text-sm font-mono text-gray-700">
                              {token.tokenAddress?.slice(0, 6)}...{token.tokenAddress?.slice(-4)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(token.tokenAddress)}
                          >
                            <Copy className="h-3 w-3 m-2" />
                              
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                              <a href={`https://sepolia.etherscan.io/address/${token.tokenAddress}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              </a>
                          </Button>

                          </div>

                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs"
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
                          className="flex-1 text-xs"
                          onClick={() => {
                            setSelectedToken(token.symbol)
                            setActiveTab("investors")
                          }}
                        >
                          <Users className="w-3 h-3 mr-1" />
                          Investors
                        </Button>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <Badge 
                          variant="default" 
                          className="bg-green-100 text-green-700 hover:bg-green-100"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Created {new Date(token.deployedAt || Date.now()).toLocaleDateString()}
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

              {/* Portfolio Analytics */}
              <div className="grid gap-6 md:grid-cols-2">
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
                        <span className="text-blue-700">Total Market Cap</span>
                        <span className="font-bold text-blue-900">
                          ${tokens.reduce((acc: number, token: any) => acc + (Number(token.initialPrice || 10) * Number(token.totalSupply || 1000000)), 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Active Tokens</span>
                        <span className="font-bold text-blue-900">{tokens.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Avg. Token Price</span>
                        <span className="font-bold text-blue-900">
                          ${tokens.length > 0 ? (tokens.reduce((acc: number, token: any) => acc + Number(token.initialPrice || 10), 0) / tokens.length).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-purple-900">
                      <Activity className="h-5 w-5" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tokens.slice(0, 3).map((token: any, index: number) => (
                        <div key={token.tokenAddress} className="flex items-center space-x-3">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-purple-700">
                            {token.symbol} token deployed successfully
                          </span>
                          <span className="text-xs text-purple-500 ml-auto">
                            {new Date(token.deployedAt || Date.now() - index * 86400000).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                      {tokens.length === 0 && (
                        <div className="text-center text-purple-600 py-4">
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
                  <p className="text-muted-foreground">Review and approve pending investment orders</p>
                </div>
              </div>

              <div className="grid gap-6">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{order.investorName.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{order.investorName}</CardTitle>
                            <CardDescription>{order.investorEmail}</CardDescription>
                            <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            order.status === "pending"
                              ? "secondary"
                              : order.status === "approved"
                                ? "default"
                                : "destructive"
                          }
                          className={
                            order.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : order.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : ""
                          }
                        >
                          {order.status}
                        </Badge>
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
                  <p className="text-muted-foreground">Monitor and manage compliance requirements</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">KYC Required</p>
                        <p className="text-sm text-muted-foreground">Identity verification mandatory</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">AML Required</p>
                        <p className="text-sm text-muted-foreground">Anti-money laundering checks</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 grid-cols-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">95%</div>
                        <p className="text-sm text-muted-foreground">KYC Verified</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">92%</div>
                        <p className="text-sm text-muted-foreground">AML Cleared</p>
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
                  <p className="text-muted-foreground">Detailed insights into token performance and investor behavior</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Performance Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Monthly Growth</span>
                          <span className="text-green-600">+12.5%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '12.5%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Investor Retention</span>
                          <span className="text-blue-600">87%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Investor Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Institutional vs Individual</span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1 bg-blue-200 rounded h-4"></div>
                        <div className="flex-2 bg-green-200 rounded h-4"></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>30% Institutional</span>
                        <span>70% Individual</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Risk Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">Low Risk</div>
                        <p className="text-sm text-muted-foreground">Portfolio Risk Score</p>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-full border-4 border-green-300 flex items-center justify-center">
                          <span className="text-sm font-medium">25</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                  <p className="text-muted-foreground">Manage API keys and integration settings</p>
                </div>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Generate and manage API keys for external integrations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Production API Key</p>
                        <p className="text-sm text-muted-foreground font-mono">sk_prod_************************</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Generate New API Key
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Webhooks</CardTitle>
                    <CardDescription>Configure webhooks for real-time notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Webhook Endpoint
                    </Button>
                  </CardContent>
                </Card>
              </div>
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
      residential: ["Title Deed", "DEWA Connection", "Municipality Approval", "Property Valuation"],
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
  // Token Details
  name: string
  symbol: string
  totalSupply: string
  tokenPrice: string
  decimals: number

  // Addresses
  ownerAddress: string
  irAgentAddress: string
  tokenAgentAddress: string

  // Asset Details
  jurisdiction: string
  assetCategory: string
  assetType: string
  assetDescription: string

  // Compliance
  claimTopics: string[]
  trustedIssuers: string[]
  complianceModules: {
    CountryAllowModule: number[]
    CountryRestrictModule: number[]
    MaxBalanceModule: number[]
  }

  // Documents
  requiredDocuments: string[]
  uploadedDocuments: { [key: string]: File | null }

  // Additional
  prefix: string
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
    name: "",
    symbol: "",
    totalSupply: "",
    tokenPrice: "",
    decimals: 18,
    ownerAddress: issuerAddress || "",
    irAgentAddress: issuerAddress || "",
    tokenAgentAddress: issuerAddress || "",
    jurisdiction: "",
    assetCategory: "",
    assetType: "",
    assetDescription: "",
    claimTopics: ["IDENTITY_CLAIM"],
    trustedIssuers: [issuerAddress || ""],
    complianceModules: {
      CountryAllowModule: [840], // US by default
      CountryRestrictModule: [],
      MaxBalanceModule: [1000000],
    },
    requiredDocuments: [],
    uploadedDocuments: {},
    prefix: "",
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
        ownerAddress: issuerAddress,
        irAgentAddress: issuerAddress,
        tokenAgentAddress: issuerAddress,
        trustedIssuers: [issuerAddress],
      }))
    }
  }, [issuerAddress])

  useEffect(() => {
    // Update required documents when jurisdiction and asset type change
    if (formData.jurisdiction && formData.assetType) {
      const jurisdictionReqs =
        JURISDICTION_REQUIREMENTS[formData.jurisdiction as keyof typeof JURISDICTION_REQUIREMENTS]
      if (jurisdictionReqs) {
        const generalDocs = jurisdictionReqs.generalDocs
        const assetDocs =
          jurisdictionReqs.assetSpecific[formData.assetType as keyof typeof jurisdictionReqs.assetSpecific] || []
        setFormData((prev) => ({
          ...prev,
          requiredDocuments: [...generalDocs, ...assetDocs],
        }))
      }
    }
  }, [formData.jurisdiction, formData.assetType])

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

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const mockTokenAddress = `0x${Math.random().toString(16).substr(2, 40)}`
      toast.success("Token created successfully!", { id: "create-token" })
      onSuccess(mockTokenAddress)
      onClose()

      // Reset form
      setCurrentStep(1)
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
        return formData.name && formData.symbol && formData.totalSupply && formData.tokenPrice
      case 2:
        return formData.assetCategory && formData.assetType
      case 3:
        return formData.jurisdiction
      case 4:
        return (
          formData.requiredDocuments.length === 0 ||
          formData.requiredDocuments.every((doc) => formData.uploadedDocuments[doc])
        )
      case 5:
        return formData.ownerAddress && formData.irAgentAddress && formData.tokenAgentAddress
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
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                    placeholder="e.g., Manhattan Office Building Token"
                  />
                </div>
                <div>
                  <Label htmlFor="symbol">Token Symbol *</Label>
                  <Input
                    id="symbol"
                    value={formData.symbol}
                    onChange={(e) => updateFormData({ symbol: e.target.value.toUpperCase() })}
                    placeholder="e.g., MOBT"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalSupply">Total Supply *</Label>
                  <Input
                    id="totalSupply"
                    value={formData.totalSupply}
                    onChange={(e) => updateFormData({ totalSupply: e.target.value })}
                    placeholder="1000000"
                  />
                </div>
                <div>
                  <Label htmlFor="tokenPrice">Token Price (USD) *</Label>
                  <Input
                    id="tokenPrice"
                    value={formData.tokenPrice}
                    onChange={(e) => updateFormData({ tokenPrice: e.target.value })}
                    placeholder="10.00"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="decimals">Decimals</Label>
                <Input
                  id="decimals"
                  type="number"
                  value={formData.decimals}
                  onChange={(e) => updateFormData({ decimals: Number.parseInt(e.target.value) || 18 })}
                />
              </div>
              <div>
                <Label htmlFor="prefix">Deployment Salt *</Label>
                <Input
                  id="prefix"
                  value={formData.prefix}
                  onChange={(e) => updateFormData({ prefix: e.target.value })}
                  placeholder="unique-identifier-123"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Unique identifier for deterministic contract deployment
                </p>
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
                          formData.assetCategory === key ? "ring-2 ring-purple-500" : ""
                        }`}
                        onClick={() => updateFormData({ assetCategory: key, assetType: "" })}
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

              {formData.assetCategory && (
                <div>
                  <Label className="text-base font-medium">Select Specific Asset Type</Label>
                  <div className="grid gap-3 mt-3">
                    {ASSET_CATEGORIES[formData.assetCategory as keyof typeof ASSET_CATEGORIES].assets.map((asset) => (
                      <Card
                        key={asset.id}
                        className={`cursor-pointer transition-all hover:shadow-sm ${
                          formData.assetType === asset.id ? "ring-2 ring-purple-500 bg-purple-50" : ""
                        }`}
                        onClick={() => updateFormData({ assetType: asset.id })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{asset.name}</h4>
                              <p className="text-sm text-muted-foreground">{asset.description}</p>
                            </div>
                            {formData.assetType === asset.id && <CheckCircle className="h-5 w-5 text-purple-600" />}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {formData.assetType && (
                <div>
                  <Label htmlFor="assetDescription">Asset Description</Label>
                  <Textarea
                    id="assetDescription"
                    value={formData.assetDescription}
                    onChange={(e) => updateFormData({ assetDescription: e.target.value })}
                    placeholder="Provide detailed description of your asset..."
                    rows={3}
                  />
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
                  value={formData.jurisdiction}
                  onValueChange={(value) => updateFormData({ jurisdiction: value })}
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
                        checked={formData.claimTopics.includes(topic)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData({
                              claimTopics: [...formData.claimTopics, topic],
                            })
                          } else {
                            updateFormData({
                              claimTopics: formData.claimTopics.filter((t) => t !== topic),
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
                            if (value && !formData.complianceModules.CountryAllowModule.includes(value)) {
                              updateFormData({
                                complianceModules: {
                                  ...formData.complianceModules,
                                  CountryAllowModule: [...formData.complianceModules.CountryAllowModule, value],
                                },
                              })
                              e.currentTarget.value = ""
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.complianceModules.CountryAllowModule.map((code) => (
                        <Badge key={code} variant="secondary" className="flex items-center gap-1">
                          {code}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => {
                              updateFormData({
                                complianceModules: {
                                  ...formData.complianceModules,
                                  CountryAllowModule: formData.complianceModules.CountryAllowModule.filter(
                                    (c) => c !== code,
                                  ),
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
                      value={formData.complianceModules.MaxBalanceModule[0] || ""}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value) || 0
                        updateFormData({
                          complianceModules: {
                            ...formData.complianceModules,
                            MaxBalanceModule: [value],
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
                  Based on your jurisdiction ({formData.jurisdiction}) and asset type, the following documents are
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
                  value={formData.ownerAddress}
                  onChange={(e) => updateFormData({ ownerAddress: e.target.value })}
                  placeholder="0x..."
                />
              </div>
              <div>
                <Label htmlFor="irAgentAddress">Identity Registry Agent *</Label>
                <Input
                  id="irAgentAddress"
                  value={formData.irAgentAddress}
                  onChange={(e) => updateFormData({ irAgentAddress: e.target.value })}
                  placeholder="0x..."
                />
              </div>
              <div>
                <Label htmlFor="tokenAgentAddress">Token Agent *</Label>
                <Input
                  id="tokenAgentAddress"
                  value={formData.tokenAgentAddress}
                  onChange={(e) => updateFormData({ tokenAgentAddress: e.target.value })}
                  placeholder="0x..."
                />
              </div>
              <div>
                <Label>Trusted Issuers</Label>
                <div className="space-y-2 mt-2">
                  {formData.trustedIssuers.map((issuer, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={issuer}
                        onChange={(e) => {
                          const newIssuers = [...formData.trustedIssuers]
                          newIssuers[index] = e.target.value
                          updateFormData({ trustedIssuers: newIssuers })
                        }}
                        placeholder="0x..."
                      />
                      {formData.trustedIssuers.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            updateFormData({
                              trustedIssuers: formData.trustedIssuers.filter((_, i) => i !== index),
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
                        trustedIssuers: [...formData.trustedIssuers, ""],
                      })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Trusted Issuer
                  </Button>
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
                          <p className="font-medium">{formData.name}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Symbol:</span>
                          <p className="font-medium">{formData.symbol}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Supply:</span>
                          <p className="font-medium">{Number(formData.totalSupply).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <p className="font-medium">${formData.tokenPrice}</p>
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
                            {ASSET_CATEGORIES[formData.assetCategory as keyof typeof ASSET_CATEGORIES]?.name}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <p className="font-medium">
                            {
                              ASSET_CATEGORIES[formData.assetCategory as keyof typeof ASSET_CATEGORIES]?.assets.find(
                                (a) => a.id === formData.assetType,
                              )?.name
                            }
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Jurisdiction:</span>
                          <p className="font-medium">
                            {
                              JURISDICTION_REQUIREMENTS[formData.jurisdiction as keyof typeof JURISDICTION_REQUIREMENTS]
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
                          {formData.claimTopics.map((topic) => (
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

// const IssuerDashboard = () => {
//   const { address: issuerAddress, isConnected } = useAppKitAccount()
//   const { open } = useAppKit()
//   const [showTokenCreation, setShowTokenCreation] = useState(false)
//   const [tokens, setTokens] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   // Mock check for existing tokens
//   useEffect(() => {
//     const checkExistingTokens = async () => {
//       if (!issuerAddress) return

//       setLoading(true)
//       try {
//         // Simulate API call to check existing tokens
//         await new Promise((resolve) => setTimeout(resolve, 1000))

//         // For demo purposes, assume no tokens initially
//         // In real implementation, this would fetch from your API
//         const existingTokens: any[] = []
//         setTokens(existingTokens)
//       } catch (error) {
//         console.error("Error checking tokens:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     checkExistingTokens()
//   }, [issuerAddress])

//   const handleTokenCreated = (tokenAddress: string) => {
//     // Add the new token to the list
//     const newToken = {
//       id: Date.now().toString(),
//       symbol: "NEW",
//       name: "New Token",
//       tokenAddress,
//       deployedAt: new Date().toISOString(),
//     }
//     setTokens((prev) => [...prev, newToken])
//     toast.success("Token created successfully!")
//   }

//   if (!isConnected) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
//         <Card className="w-96">
//           <CardHeader className="text-center">
//             <CardTitle>Connect Wallet</CardTitle>
//             <CardDescription>Please connect your wallet to access the issuer dashboard</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button onClick={() => open()} className="w-full">
//               Connect Wallet
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
//         <div className="text-center">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
//           <p className="text-muted-foreground">Loading your dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   // Show onboarding if no tokens exist
//   if (tokens.length === 0) {
//     return (
//       <>
//         <EmptyStateOnboarding onStartTokenCreation={() => setShowTokenCreation(true)} />
//         <TokenCreationWizard
//           isOpen={showTokenCreation}
//           onClose={() => setShowTokenCreation(false)}
//           onSuccess={handleTokenCreated}
//         />
//       </>
//     )
//   }

//   // Show full dashboard if tokens exist
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       {/* Your existing dashboard code would go here */}
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-bold">Token Issuer Dashboard</h1>
//             <p className="text-muted-foreground">
//               Manage your {tokens.length} token{tokens.length !== 1 ? "s" : ""}
//             </p>
//           </div>
//           <Button onClick={() => setShowTokenCreation(true)}>
//             <Plus className="mr-2 h-4 w-4" />
//             Create New Token
//           </Button>
//         </div>

//         {/* Token grid */}
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {tokens.map((token) => (
//             <Card key={token.id}>
//               <CardHeader>
//                 <CardTitle>{token.symbol}</CardTitle>
//                 <CardDescription>{token.name}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-muted-foreground font-mono">{token.tokenAddress}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       <TokenCreationWizard
//         isOpen={showTokenCreation}
//         onClose={() => setShowTokenCreation(false)}
//         onSuccess={handleTokenCreated}
//       />
//     </div>
//   )
// }

// export default IssuerDashboard
