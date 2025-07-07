"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Badge } from "../../../components/ui/badge"
import { Switch } from "../../../components/ui/switch"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { User, Mail, Phone, MapPin, Globe, Shield, Bell, Eye, EyeOff, Save, RefreshCw, Camera, CheckCircle, AlertTriangle, Settings, Lock, Smartphone, FileText, BarChart3, PieChart } from 'lucide-react'
import { toast } from "sonner"
import { useAppSelector, useAppDispatch } from "../../../hooks/redux-hooks"
import { Link } from "react-router"
import { Layout } from "./Layout"
// import { updateInvestorProfile } from "../../../store/slices/investorSlice"




interface ProfileData {
	personalInfo: {
		firstName: string
		lastName: string
		email: string
		phone: string
		dateOfBirth: string
		nationality: string
		address: {
			street: string
			city: string
			state: string
			zipCode: string
			country: string
		}
	}
	preferences: {
		language: string
		timezone: string
		currency: string
		notifications: {
			email: boolean
			sms: boolean
			push: boolean
			marketing: boolean
		}
	}
	security: {
		twoFactorEnabled: boolean
		lastPasswordChange: string
		loginHistory: Array<{
			date: string
			location: string
			device: string
			ip: string
		}>
	}
	privacy: {
		profileVisibility: "public" | "private" | "contacts"
		dataSharing: boolean
		analytics: boolean
	}
}


const ProfilePage = () => {
// const dispatch = useAppDispatch()
// const investorProfile = useAppSelector((state) => state.investor.profile)
	const [isEditing, setIsEditing] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [showSensitiveData, setShowSensitiveData] = useState(false)

	const [profileData, setProfileData] = useState<ProfileData>({
		personalInfo: {
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@example.com",
			phone: "+1 (555) 123-4567",
			dateOfBirth: "1985-06-15",
			nationality: "United States",
			address: {
				street: "123 Main Street",
				city: "New York",
				state: "NY",
				zipCode: "10001",
				country: "United States",
			},
		},
		preferences: {
			language: "en",
			timezone: "America/New_York",
			currency: "USD",
			notifications: {
				email: true,
				sms: false,
				push: true,
				marketing: false,
			},
		},
		security: {
			twoFactorEnabled: true,
			lastPasswordChange: "2024-01-01T00:00:00Z",
			loginHistory: [
				{
					date: "2024-01-20T10:30:00Z",
					location: "New York, NY",
					device: "Chrome on Windows",
					ip: "192.168.1.1",
				},
				{
					date: "2024-01-19T15:45:00Z",
					location: "New York, NY",
					device: "Safari on iPhone",
					ip: "192.168.1.2",
				},
			],
		},
		privacy: {
			profileVisibility: "private",
			dataSharing: false,
			analytics: true,
		},
	})

	const handleSave = async () => {
		setIsSaving(true)
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 2000))

			// Dispatch to Redux store
		// dispatch(updateInvestorProfile({
		// personalInfo: {
		// fullName: `${profileData.personalInfo.firstName} ${profileData.personalInfo.lastName}`,
		// email: profileData.personalInfo.email,
		// countryOfResidence: profileData.personalInfo.address.country,
		// accreditedStatus: investorProfile?.personalInfo.accreditedStatus || false,
		// },
		// }))

			setIsEditing(false)
			toast.success("Profile updated successfully")
		} catch (error) {
			toast.error("Failed to update profile")
		} finally {
			setIsSaving(false)
		}
	}

	const handleCancel = () => {
		setIsEditing(false)
		// Reset form data if needed
	}

	const updatePersonalInfo = (field: string, value: string) => {
		setProfileData(prev => ({
			...prev,
			personalInfo: {
				...prev.personalInfo,
				[field]: value,
			},
		}))
	}

	const updateAddress = (field: string, value: string) => {
		setProfileData(prev => ({
			...prev,
			personalInfo: {
				...prev.personalInfo,
				address: {
					...prev.personalInfo.address,
					[field]: value,
				},
			},
		}))
	}

	const updatePreferences = (field: string, value: any) => {
		setProfileData(prev => ({
			...prev,
			preferences: {
				...prev.preferences,
				[field]: value,
			},
		}))
	}

	const updateNotifications = (field: string, value: boolean) => {
		setProfileData(prev => ({
			...prev,
			preferences: {
				...prev.preferences,
				notifications: {
					...prev.preferences.notifications,
					[field]: value,
				},
			},
		}))
	}

	const updatePrivacy = (field: string, value: any) => {
		setProfileData(prev => ({
			...prev,
			privacy: {
				...prev.privacy,
				[field]: value,
			},
		}))
	}

	return (

	<Layout>
<div className="space-y-6 mt-[10%] m-4">

		<div className="flex  items-center justify-between">
			<div>
				<h1 className="text-3xl font-bold">Profile Settings</h1>
				<p className="text-muted-foreground">Manage your account information and preferences</p>
			</div>
			<div className=" flex items-center space-x-2">
				{isEditing ? (
					<>
						<Button variant="outline" onClick={handleCancel}>
							Cancel
						</Button>
						<Button onClick={handleSave} disabled={isSaving}>
							{isSaving ? (
								<>
									<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4" />
									Save Changes
								</>
							)}
						</Button>
					</>
				) : (
					<Button className="" onClick={() => setIsEditing(true)}>
						<Settings className=" mr-2 h-4 w-4" />
						Edit Profile
					</Button>
				)}
			</div>
		</div>


		{/* Profile Overview */}
		<main className="flex-1 ">

		<Card>
			<CardContent className="pt-6">
				<div className="flex items-center space-x-6">
					<div className="relative">
						<Avatar className="h-24 w-24">
							<AvatarImage src="/placeholder-user.jpg" alt="Profile" />
							<AvatarFallback className="text-lg">
								{profileData.personalInfo.firstName.charAt(0)}
								{profileData.personalInfo.lastName.charAt(0)}
							</AvatarFallback>
						</Avatar>
						{isEditing && (
							<Button
								size="sm"
								className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
							>
								<Camera className="h-4 w-4" />
							</Button>
						)}
					</div>
					<div className="flex-1">
						<h2 className="text-2xl font-bold">
							{profileData.personalInfo.firstName} {profileData.personalInfo.lastName}
						</h2>
						<p className="text-muted-foreground">{profileData.personalInfo.email}</p>
						<div className="flex items-center space-x-4 mt-2">
							<Badge className="bg-green-100 text-green-800">
								<CheckCircle className="mr-1 h-3 w-3" />
								Verified
							</Badge>
							<Badge className="bg-blue-100 text-blue-800">
								<Shield className="mr-1 h-3 w-3" />
								Accredited Investor
							</Badge>
						</div>
					</div>
					<div className="text-right">
						<p className="text-sm text-muted-foreground">Member since</p>
						<p className="font-medium">January 2024</p>
					</div>
				</div>
			</CardContent>
		</Card>

		{/* Main Profile Content */}
		<Tabs defaultValue="personal" className="space-y-4">
			<TabsList className="grid w-full grid-cols-5">
				<TabsTrigger value="personal">Personal</TabsTrigger>
				<TabsTrigger value="preferences">Preferences</TabsTrigger>
				<TabsTrigger value="security">Security</TabsTrigger>
				<TabsTrigger value="privacy">Privacy</TabsTrigger>
				<TabsTrigger value="notifications">Notifications</TabsTrigger>
			</TabsList>

			<TabsContent value="personal" className="space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>Personal Information</CardTitle>
						<CardDescription>Your basic profile information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="firstName">First Name</Label>
								<Input
									id="firstName"
									value={profileData.personalInfo.firstName}
									onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
									disabled={!isEditing}
								/>
							</div>
							<div>
								<Label htmlFor="lastName">Last Name</Label>
								<Input
									id="lastName"
									value={profileData.personalInfo.lastName}
									onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
									disabled={!isEditing}
								/>
							</div>
							<div>
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									value={profileData.personalInfo.email}
									onChange={(e) => updatePersonalInfo("email", e.target.value)}
									disabled={!isEditing}
								/>
							</div>
							<div>
								<Label htmlFor="phone">Phone Number</Label>
								<Input
									id="phone"
									value={profileData.personalInfo.phone}
									onChange={(e) => updatePersonalInfo("phone", e.target.value)}
									disabled={!isEditing}
								/>
							</div>
							<div>
								<Label htmlFor="dateOfBirth">Date of Birth</Label>
								<Input
									id="dateOfBirth"
									type="date"
									value={profileData.personalInfo.dateOfBirth}
									onChange={(e) => updatePersonalInfo("dateOfBirth", e.target.value)}
									disabled={!isEditing}
								/>
							</div>
							<div>
								<Label htmlFor="nationality">Nationality</Label>
								<Select
									value={profileData.personalInfo.nationality}
									onValueChange={(value) => updatePersonalInfo("nationality", value)}
									disabled={!isEditing}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="United States">United States</SelectItem>
										<SelectItem value="Canada">Canada</SelectItem>
										<SelectItem value="United Kingdom">United Kingdom</SelectItem>
										<SelectItem value="Germany">Germany</SelectItem>
										<SelectItem value="France">France</SelectItem>
										<SelectItem value="Japan">Japan</SelectItem>
										<SelectItem value="Australia">Australia</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Address Information</CardTitle>
						<CardDescription>Your residential address</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="street">Street Address</Label>
							<Input
								id="street"
								value={profileData.personalInfo.address.street}
								onChange={(e) => updateAddress("street", e.target.value)}
								disabled={!isEditing}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<Label htmlFor="city">City</Label>
								<Input
									id="city"
									value={profileData.personalInfo.address.city}
									onChange={(e) => updateAddress("city", e.target.value)}
									disabled={!isEditing}
								/>
							</div>
							<div>
								<Label htmlFor="state">State/Province</Label>
								<Input
									id="state"
									value={profileData.personalInfo.address.state}
									onChange={(e) => updateAddress("state", e.target.value)}
									disabled={!isEditing}
								/>
							</div>
							<div>
								<Label htmlFor="zipCode">ZIP/Postal Code</Label>
								<Input
									id="zipCode"
									value={profileData.personalInfo.address.zipCode}
									onChange={(e) => updateAddress("zipCode", e.target.value)}
									disabled={!isEditing}
								/>
							</div>
						</div>
						<div>
							<Label htmlFor="country">Country</Label>
							<Select
								value={profileData.personalInfo.address.country}
								onValueChange={(value) => updateAddress("country", value)}
								disabled={!isEditing}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="United States">United States</SelectItem>
									<SelectItem value="Canada">Canada</SelectItem>
									<SelectItem value="United Kingdom">United Kingdom</SelectItem>
									<SelectItem value="Germany">Germany</SelectItem>
									<SelectItem value="France">France</SelectItem>
									<SelectItem value="Japan">Japan</SelectItem>
									<SelectItem value="Australia">Australia</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			<TabsContent value="preferences" className="space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>Language & Region</CardTitle>
						<CardDescription>Customize your language and regional settings</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<Label htmlFor="language">Language</Label>
								<Select
									value={profileData.preferences.language}
									onValueChange={(value) => updatePreferences("language", value)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="en">English</SelectItem>
										<SelectItem value="es">Spanish</SelectItem>
										<SelectItem value="fr">French</SelectItem>
										<SelectItem value="de">German</SelectItem>
										<SelectItem value="ja">Japanese</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="timezone">Timezone</Label>
								<Select
									value={profileData.preferences.timezone}
									onValueChange={(value) => updatePreferences("timezone", value)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="America/New_York">Eastern Time</SelectItem>
										<SelectItem value="America/Chicago">Central Time</SelectItem>
										<SelectItem value="America/Denver">Mountain Time</SelectItem>
										<SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
										<SelectItem value="Europe/London">GMT</SelectItem>
										<SelectItem value="Europe/Paris">CET</SelectItem>
										<SelectItem value="Asia/Tokyo">JST</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="currency">Preferred Currency</Label>
								<Select
									value={profileData.preferences.currency}
									onValueChange={(value) => updatePreferences("currency", value)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="USD">USD - US Dollar</SelectItem>
										<SelectItem value="EUR">EUR - Euro</SelectItem>
										<SelectItem value="GBP">GBP - British Pound</SelectItem>
										<SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
										<SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			<TabsContent value="security" className="space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>Security Settings</CardTitle>
						<CardDescription>Manage your account security</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">Two-Factor Authentication</p>
								<p className="text-sm text-muted-foreground">
									Add an extra layer of security to your account
								</p>
							</div>
							<div className="flex items-center space-x-2">
								<Switch
									checked={profileData.security.twoFactorEnabled}
									onCheckedChange={(checked) =>
										setProfileData(prev => ({
											...prev,
											security: { ...prev.security, twoFactorEnabled: checked }
										}))
									}
								/>
								{profileData.security.twoFactorEnabled && (
									<Badge className="bg-green-100 text-green-800">
										<Smartphone className="mr-1 h-3 w-3" />
										Enabled
									</Badge>
								)}
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">Password</p>
								<p className="text-sm text-muted-foreground">
									Last changed: {new Date(profileData.security.lastPasswordChange).toLocaleDateString()}
								</p>
							</div>
							<Button variant="outline">
								<Lock className="mr-2 h-4 w-4" />
								Change Password
							</Button>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">Show Sensitive Data</p>
								<p className="text-sm text-muted-foreground">
									Toggle visibility of sensitive information
								</p>
							</div>
							<Button
								variant="outline"
								onClick={() => setShowSensitiveData(!showSensitiveData)}
							>
								{showSensitiveData ? (
									<>
										<EyeOff className="mr-2 h-4 w-4" />
										Hide
									</>
								) : (
									<>
										<Eye className="mr-2 h-4 w-4" />
										Show
									</>
								)}
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Login History</CardTitle>
						<CardDescription>Recent login activity</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{profileData.security.loginHistory.map((login, index) => (
								<div key={index} className="flex items-center justify-between p-3 border rounded-lg">
									<div>
										<p className="font-medium">{login.device}</p>
										<p className="text-sm text-muted-foreground">{login.location}</p>
									</div>
									<div className="text-right">
										<p className="text-sm">{new Date(login.date).toLocaleDateString()}</p>
										<p className="text-xs text-muted-foreground">
											{showSensitiveData ? login.ip : "•••.•••.•••.•••"}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			<TabsContent value="privacy" className="space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>Privacy Settings</CardTitle>
						<CardDescription>Control your data and privacy preferences</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div>
							<Label>Profile Visibility</Label>
							<Select
								value={profileData.privacy.profileVisibility}
								onValueChange={(value) => updatePrivacy("profileVisibility", value)}
							>
								<SelectTrigger className="mt-2">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="public">Public - Visible to everyone</SelectItem>
									<SelectItem value="private">Private - Only visible to you</SelectItem>
									<SelectItem value="contacts">Contacts - Visible to your contacts only</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">Data Sharing</p>
								<p className="text-sm text-muted-foreground">
									Allow sharing of anonymized data for research
								</p>
							</div>
							<Switch
								checked={profileData.privacy.dataSharing}
								onCheckedChange={(checked) => updatePrivacy("dataSharing", checked)}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">Analytics</p>
								<p className="text-sm text-muted-foreground">
									Help improve our service with usage analytics
								</p>
							</div>
							<Switch
								checked={profileData.privacy.analytics}
								onCheckedChange={(checked) => updatePrivacy("analytics", checked)}
							/>
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			<TabsContent value="notifications" className="space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>Notification Preferences</CardTitle>
						<CardDescription>Choose how you want to receive notifications</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">Email Notifications</p>
								<p className="text-sm text-muted-foreground">
									Receive important updates via email
								</p>
							</div>
							<Switch
								checked={profileData.preferences.notifications.email}
								onCheckedChange={(checked) => updateNotifications("email", checked)}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">SMS Notifications</p>
								<p className="text-sm text-muted-foreground">
									Receive urgent alerts via SMS
								</p>
							</div>
							<Switch
								checked={profileData.preferences.notifications.sms}
								onCheckedChange={(checked) => updateNotifications("sms", checked)}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">Push Notifications</p>
								<p className="text-sm text-muted-foreground">
									Receive notifications in your browser
								</p>
							</div>
							<Switch
								checked={profileData.preferences.notifications.push}
								onCheckedChange={(checked) => updateNotifications("push", checked)}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">Marketing Communications</p>
								<p className="text-sm text-muted-foreground">
									Receive updates about new features and offers
								</p>
							</div>
							<Switch
								checked={profileData.preferences.notifications.marketing}
								onCheckedChange={(checked) => updateNotifications("marketing", checked)}
							/>
						</div>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>

		</main>
			</div>
		</Layout>

	)
}

export default ProfilePage
