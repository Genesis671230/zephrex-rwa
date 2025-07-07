"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Progress } from "../../../components/ui/progress"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Shield, CheckCircle, AlertTriangle, Clock, FileText, Users, Globe, Gavel, RefreshCw, Download, Eye, ExternalLink } from 'lucide-react'
import { Layout } from "./Layout"
// import { useAppSelector } from "../../../hooks/redux-hooks"

interface ComplianceCheck {
  id: string
  name: string
  description: string
  status: "passed" | "failed" | "pending" | "warning"
  lastChecked: string
  nextCheck: string
  details: string
  severity: "low" | "medium" | "high" | "critical"
}

interface JurisdictionRule {
  country: string
  countryCode: string
  status: "compliant" | "restricted" | "prohibited"
  requirements: string[]
  lastUpdated: string
}

const complianceChecks: ComplianceCheck[] = [
  {
    id: "kyc",
    name: "KYC Verification",
    description: "Know Your Customer identity verification",
    status: "passed",
    lastChecked: "2024-01-15T10:30:00Z",
    nextCheck: "2024-07-15T10:30:00Z",
    details: "Identity verified with government-issued ID",
    severity: "critical",
  },
  {
    id: "aml",
    name: "AML Screening",
    description: "Anti-Money Laundering compliance check",
    status: "passed",
    lastChecked: "2024-01-10T14:20:00Z",
    nextCheck: "2024-02-10T14:20:00Z",
    details: "No matches found in sanctions lists",
    severity: "critical",
  },
  {
    id: "accreditation",
    name: "Investor Accreditation",
    description: "Accredited investor status verification",
    status: "passed",
    lastChecked: "2024-01-05T09:15:00Z",
    nextCheck: "2024-12-05T09:15:00Z",
    details: "Income and net worth requirements met",
    severity: "high",
  },
  {
    id: "jurisdiction",
    name: "Jurisdiction Compliance",
    description: "Geographic and regulatory compliance",
    status: "passed",
    lastChecked: "2024-01-12T16:45:00Z",
    nextCheck: "2024-02-12T16:45:00Z",
    details: "Compliant with US securities regulations",
    severity: "high",
  },
  {
    id: "tax",
    name: "Tax Compliance",
    description: "Tax reporting and withholding compliance",
    status: "warning",
    lastChecked: "2024-01-08T11:30:00Z",
    nextCheck: "2024-02-08T11:30:00Z",
    details: "W-9 form expires in 30 days",
    severity: "medium",
  },
  {
    id: "fatca",
    name: "FATCA Compliance",
    description: "Foreign Account Tax Compliance Act",
    status: "passed",
    lastChecked: "2024-01-03T13:20:00Z",
    nextCheck: "2024-07-03T13:20:00Z",
    details: "US person status confirmed",
    severity: "medium",
  },
]

const jurisdictionRules: JurisdictionRule[] = [
  {
    country: "United States",
    countryCode: "US",
    status: "compliant",
    requirements: ["SEC Registration", "Accredited Investor", "KYC/AML"],
    lastUpdated: "2024-01-15",
  },
  {
    country: "European Union",
    countryCode: "EU",
    status: "compliant",
    requirements: ["MiFID II", "GDPR", "KYC/AML"],
    lastUpdated: "2024-01-10",
  },
  {
    country: "United Kingdom",
    countryCode: "GB",
    status: "compliant",
    requirements: ["FCA Authorization", "COBS Rules", "KYC/AML"],
    lastUpdated: "2024-01-12",
  },
  {
    country: "Singapore",
    countryCode: "SG",
    status: "restricted",
    requirements: ["MAS License", "Sophisticated Investor", "Enhanced KYC"],
    lastUpdated: "2024-01-08",
  },
  {
    country: "China",
    countryCode: "CN",
    status: "prohibited",
    requirements: ["Not Available"],
    lastUpdated: "2024-01-01",
  },
]

const CompliancePage = () => {
  const [isLoading, setIsLoading] = useState(false)
//   const investorProfile = useAppSelector((state) => state.investor.profile)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
      case "prohibited":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
      case "restricted":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
      case "compliant":
        return "bg-green-100 text-green-800"
      case "failed":
      case "prohibited":
        return "bg-red-100 text-red-800"
      case "warning":
      case "restricted":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500"
      case "high":
        return "border-orange-500"
      case "medium":
        return "border-yellow-500"
      case "low":
        return "border-green-500"
      default:
        return "border-gray-500"
    }
  }

  const calculateComplianceScore = () => {
    const passedChecks = complianceChecks.filter(check => check.status === "passed").length
    const totalChecks = complianceChecks.length
    return Math.round((passedChecks / totalChecks) * 100)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const exportComplianceReport = () => {
    // Implement export functionality
    console.log("Exporting compliance report...")
  }

  return (
    <Layout>

    <div className="space-y-6 mt-[10%] m-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
          <p className="text-muted-foreground">Monitor your regulatory compliance status</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportComplianceReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Compliance Score Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{calculateComplianceScore()}%</div>
            <Progress value={calculateComplianceScore()} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {complianceChecks.filter(c => c.status === "passed").length} of {complianceChecks.length} checks passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Checks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceChecks.filter(c => c.status === "passed").length}</div>
            <p className="text-xs text-muted-foreground">Compliance checks passed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {complianceChecks.filter(c => c.status === "warning").length}
            </div>
            <p className="text-xs text-muted-foreground">Items requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">Until next AML screening</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Compliance Content */}
      <Tabs defaultValue="checks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="checks">Compliance Checks</TabsTrigger>
          <TabsTrigger value="jurisdiction">Jurisdiction Rules</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="checks" className="space-y-4">
          <div className="grid gap-4">
            {complianceChecks.map((check) => (
              <Card key={check.id} className={`border-l-4 ${getSeverityColor(check.severity)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <CardTitle className="text-lg">{check.name}</CardTitle>
                        <CardDescription>{check.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(check.status)}>
                      {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Details</p>
                      <p className="text-sm">{check.details}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Checked</p>
                      <p className="text-sm">{new Date(check.lastChecked).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Next Check</p>
                      <p className="text-sm">{new Date(check.nextCheck).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {check.status === "warning" && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Action required: {check.details}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jurisdiction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jurisdiction Compliance Status</CardTitle>
              <CardDescription>Regulatory compliance by country/region</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country/Region</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requirements</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jurisdictionRules.map((rule) => (
                    <TableRow key={rule.countryCode}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span className="font-medium">{rule.country}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(rule.status)}
                          <Badge className={getStatusColor(rule.status)}>
                            {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rule.requirements.map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{rule.lastUpdated}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Documents</CardTitle>
              <CardDescription>Required documents and their verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {/* {investorProfile?.documents?.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{doc.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-center py-8">No documents uploaded yet</p>
                )} */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Audit Trail</CardTitle>
              <CardDescription>Historical record of compliance activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">KYC Verification Completed</p>
                    <p className="text-sm text-muted-foreground">
                      Identity verification passed with government-issued ID
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">January 15, 2024 at 10:30 AM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">AML Screening Passed</p>
                    <p className="text-sm text-muted-foreground">
                      No matches found in global sanctions and PEP lists
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">January 10, 2024 at 2:20 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Tax Document Expiring</p>
                    <p className="text-sm text-muted-foreground">
                      W-9 form will expire in 30 days - renewal required
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">January 8, 2024 at 11:30 AM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Accreditation Status Verified</p>
                    <p className="text-sm text-muted-foreground">
                      Income and net worth requirements confirmed
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">January 5, 2024 at 9:15 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </Layout>

  )
}

export default CompliancePage
