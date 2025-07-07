"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { Progress } from "../../../components/ui/progress"
import { useDropzone } from "react-dropzone"
import { FileText, Upload, Download, Eye, Trash2, CheckCircle, AlertTriangle, Clock, Search, Filter, RefreshCw, ExternalLink, Shield, Camera, FileImage, FileIcon as FilePdf } from 'lucide-react'
import { toast } from "sonner"
import { Layout } from "./Layout"

interface Document {
  id: string
  name: string
  type: "identity" | "address" | "income" | "bank" | "tax" | "accreditation" | "other"
  status: "pending" | "verified" | "rejected" | "expired"
  uploadedAt: string
  expiresAt?: string
  size: number
  format: string
  ipfsHash: string
  verifiedBy?: string
  rejectionReason?: string
  isRequired: boolean
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Passport_John_Doe.pdf",
    type: "identity",
    status: "verified",
    uploadedAt: "2024-01-15T10:30:00Z",
    expiresAt: "2029-01-15T10:30:00Z",
    size: 2048576,
    format: "PDF",
    ipfsHash: "QmX7Y8Z9...",
    verifiedBy: "KYC Team",
    isRequired: true,
  },
  {
    id: "2",
    name: "Utility_Bill_December.pdf",
    type: "address",
    status: "verified",
    uploadedAt: "2024-01-12T14:20:00Z",
    size: 1024768,
    format: "PDF",
    ipfsHash: "QmA1B2C3...",
    verifiedBy: "Compliance Team",
    isRequired: true,
  },
  {
    id: "3",
    name: "Bank_Statement_2023.pdf",
    type: "bank",
    status: "pending",
    uploadedAt: "2024-01-20T09:15:00Z",
    size: 3072384,
    format: "PDF",
    ipfsHash: "QmD4E5F6...",
    isRequired: true,
  },
  {
    id: "4",
    name: "Tax_Return_2023.pdf",
    type: "tax",
    status: "rejected",
    uploadedAt: "2024-01-18T16:45:00Z",
    size: 4096512,
    format: "PDF",
    ipfsHash: "QmG7H8I9...",
    rejectionReason: "Document is not clear enough to verify details",
    isRequired: false,
  },
  {
    id: "5",
    name: "Accreditation_Letter.pdf",
    type: "accreditation",
    status: "expired",
    uploadedAt: "2023-06-15T11:30:00Z",
    expiresAt: "2024-01-15T11:30:00Z",
    size: 1536256,
    format: "PDF",
    ipfsHash: "QmJ1K2L3...",
    isRequired: true,
  },
]

const documentTypes = [
  { value: "identity", label: "Identity Document", required: true },
  { value: "address", label: "Proof of Address", required: true },
  { value: "income", label: "Proof of Income", required: false },
  { value: "bank", label: "Bank Statement", required: true },
  { value: "tax", label: "Tax Document", required: false },
  { value: "accreditation", label: "Accreditation Proof", required: true },
  { value: "other", label: "Other", required: false },
]

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [selectedType, setSelectedType] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!selectedType) {
      toast.error("Please select a document type first")
      return
    }

    setIsUploading(true)
    
    for (const file of acceptedFiles) {
      try {
        // Simulate file upload to IPFS
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const newDocument: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: selectedType as Document['type'],
          status: "pending",
          uploadedAt: new Date().toISOString(),
          size: file.size,
          format: file.name.split('.').pop()?.toUpperCase() || "UNKNOWN",
          ipfsHash: `Qm${Math.random().toString(36).substr(2, 9)}...`,
          isRequired: documentTypes.find(t => t.value === selectedType)?.required || false,
        }

        setDocuments(prev => [newDocument, ...prev])
        toast.success(`${file.name} uploaded successfully`)
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`)
      }
    }
    
    setIsUploading(false)
  }, [selectedType])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-orange-100 text-orange-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFileIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "pdf":
        return <FilePdf className="h-5 w-5 text-red-600" />
      case "jpg":
      case "jpeg":
      case "png":
        return <FileImage className="h-5 w-5 text-blue-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getCompletionPercentage = () => {
    const requiredDocs = documentTypes.filter(type => type.required)
    const verifiedRequiredDocs = documents.filter(doc => 
      doc.isRequired && doc.status === "verified"
    )
    return Math.round((verifiedRequiredDocs.length / requiredDocs.length) * 100)
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
    toast.success("Document deleted successfully")
  }

  const handleViewDocument = (doc: Document) => {
    // In a real app, this would open the document from IPFS
    window.open(`https://ipfs.io/ipfs/${doc.ipfsHash}`, '_blank')
  }

  const handleDownloadDocument = (doc: Document) => {
    // In a real app, this would download the document from IPFS
    toast.success(`Downloading ${doc.name}...`)
  }

  return (
    <Layout>

    <div className="space-y-6 mt-[10%] m-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">Upload and manage your compliance documents</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Document Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Document Verification Status</span>
          </CardTitle>
          <CardDescription>Track your document verification progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completion Progress</span>
              <span className="text-sm text-muted-foreground">{getCompletionPercentage()}%</span>
            </div>
            <Progress value={getCompletionPercentage()} className="w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.status === "verified").length}
                </div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {documents.filter(d => d.status === "pending").length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {documents.filter(d => d.status === "rejected").length}
                </div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {documents.filter(d => d.status === "expired").length}
                </div>
                <div className="text-sm text-muted-foreground">Expired</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Documents</TabsTrigger>
          <TabsTrigger value="manage">Manage Documents</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Document</CardTitle>
              <CardDescription>Select document type and upload your files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="document-type">Document Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <span>{type.label}</span>
                          {type.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                } ${!selectedType ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} disabled={!selectedType} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p className="text-blue-600">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-lg font-medium">
                      {selectedType ? 'Drag & drop files here, or click to select' : 'Select document type first'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Supports PDF, JPG, PNG, DOC, DOCX (max 10MB)
                    </p>
                  </div>
                )}
              </div>

              {isUploading && (
                <Alert>
                  <Upload className="h-4 w-4" />
                  <AlertDescription>
                    Uploading documents to secure storage...
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div className="grid gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(doc.format)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{doc.name}</p>
                          {doc.isRequired && <Badge variant="outline" className="text-xs">Required</Badge>}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}</span>
                          <span>{formatFileSize(doc.size)}</span>
                          <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                          {doc.expiresAt && (
                            <span>Expires: {new Date(doc.expiresAt).toLocaleDateString()}</span>
                          )}
                        </div>
                        {doc.verifiedBy && (
                          <p className="text-xs text-green-600 mt-1">Verified by {doc.verifiedBy}</p>
                        )}
                        {doc.rejectionReason && (
                          <p className="text-xs text-red-600 mt-1">Rejected: {doc.rejectionReason}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDocument(doc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadDocument(doc)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium">No documents found</p>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Requirements</CardTitle>
              <CardDescription>Required documents for compliance verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {documentTypes.map((type) => {
                  const userDoc = documents.find(d => d.type === type.value && d.status === "verified")
                  const hasDoc = !!userDoc
                  
                  return (
                    <div key={type.value} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-3">
                        {hasDoc ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300 mt-0.5" />
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{type.label}</p>
                            {type.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {type.value === "identity" && "Government-issued photo ID (passport, driver's license, etc.)"}
                            {type.value === "address" && "Utility bill or bank statement showing your current address"}
                            {type.value === "income" && "Recent pay stubs, tax returns, or employment verification"}
                            {type.value === "bank" && "Recent bank statements showing account activity"}
                            {type.value === "tax" && "Tax returns or tax identification documents"}
                            {type.value === "accreditation" && "Proof of accredited investor status"}
                            {type.value === "other" && "Additional supporting documents as requested"}
                          </p>
                          {hasDoc && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ Verified: {userDoc.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className={hasDoc ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {hasDoc ? "Complete" : "Pending"}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </Layout>

  )
}

export default DocumentsPage
