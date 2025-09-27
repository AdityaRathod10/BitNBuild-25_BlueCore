"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, Shield, Eye, EyeOff, Camera, Save, Edit, Trash2, Plus, Database, HelpCircle, LogOut, Settings } from "lucide-react"

interface UserProfile {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    address: string
    city: string
    state: string
    pincode: string
    panNumber: string
    aadharNumber: string
  }
  financialInfo: {
    annualIncome: string
    riskTolerance: string
    investmentExperience: string
    financialGoals: string[]
    taxRegime: string
  }
  preferences: {
    currency: string
    language: string
    timezone: string
    theme: string
  }
  security: {
    twoFactorEnabled: boolean
    emailNotifications: boolean
    smsAlerts: boolean
    loginAlerts: boolean
  }
}

const initialProfile: UserProfile = {
  personalInfo: {
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    dateOfBirth: "1985-06-15",
    address: "123, MG Road, Koramangala",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560034",
    panNumber: "ABCDE1234F",
    aadharNumber: "1234 5678 9012",
  },
  financialInfo: {
    annualIncome: "1200000",
    riskTolerance: "moderate",
    investmentExperience: "intermediate",
    financialGoals: ["Retirement Planning", "Tax Saving", "Wealth Creation"],
    taxRegime: "new",
  },
  preferences: {
    currency: "INR",
    language: "English",
    timezone: "Asia/Kolkata",
    theme: "system",
  },
  security: {
    twoFactorEnabled: true,
    emailNotifications: true,
    smsAlerts: false,
    loginAlerts: true,
  },
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  const handleInputChange = (section: keyof UserProfile, field: string, value: string | boolean | string[]) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSave = () => {
    // Simulate save operation
    setIsEditing(false)
    // In real app, this would make an API call
    console.log("Profile saved:", profile)
  }

  const maskSensitiveData = (data: string, visibleChars = 4) => {
    if (!showSensitiveInfo) {
      return "*".repeat(data.length - visibleChars) + data.slice(-visibleChars)
    }
    return data
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Profile" />
              <AvatarFallback className="text-lg">
                {profile.personalInfo.firstName[0]}
                {profile.personalInfo.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                {profile.personalInfo.firstName} {profile.personalInfo.lastName}
              </h1>
              <p className="text-muted-foreground">{profile.personalInfo.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary">Premium Member</Badge>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Verified
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Camera className="mr-2 h-4 w-4" />
              Change Photo
            </Button>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="financial">Financial Info</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.personalInfo.firstName}
                    onChange={(e) => handleInputChange("personalInfo", "firstName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.personalInfo.lastName}
                    onChange={(e) => handleInputChange("personalInfo", "lastName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.personalInfo.phone}
                    onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.personalInfo.dateOfBirth}
                    onChange={(e) => handleInputChange("personalInfo", "dateOfBirth", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    value={profile.personalInfo.pincode}
                    onChange={(e) => handleInputChange("personalInfo", "pincode", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={profile.personalInfo.address}
                  onChange={(e) => handleInputChange("personalInfo", "address", e.target.value)}
                  disabled={!isEditing}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.personalInfo.city}
                    onChange={(e) => handleInputChange("personalInfo", "city", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profile.personalInfo.state}
                    onChange={(e) => handleInputChange("personalInfo", "state", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Identity Documents</CardTitle>
                  <CardDescription>Your PAN and Aadhar information</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}>
                  {showSensitiveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input
                    id="panNumber"
                    value={maskSensitiveData(profile.personalInfo.panNumber, 2)}
                    onChange={(e) => handleInputChange("personalInfo", "panNumber", e.target.value)}
                    disabled={!isEditing || !showSensitiveInfo}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aadharNumber">Aadhar Number</Label>
                  <Input
                    id="aadharNumber"
                    value={maskSensitiveData(profile.personalInfo.aadharNumber, 4)}
                    onChange={(e) => handleInputChange("personalInfo", "aadharNumber", e.target.value)}
                    disabled={!isEditing || !showSensitiveInfo}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Profile</CardTitle>
              <CardDescription>Your income, investment preferences, and financial goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    value={profile.financialInfo.annualIncome}
                    onChange={(e) => handleInputChange("financialInfo", "annualIncome", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRegime">Tax Regime</Label>
                  <Select
                    value={profile.financialInfo.taxRegime}
                    onValueChange={(value) => handleInputChange("financialInfo", "taxRegime", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="old">Old Tax Regime</SelectItem>
                      <SelectItem value="new">New Tax Regime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                  <Select
                    value={profile.financialInfo.riskTolerance}
                    onValueChange={(value) => handleInputChange("financialInfo", "riskTolerance", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investmentExperience">Investment Experience</Label>
                  <Select
                    value={profile.financialInfo.investmentExperience}
                    onValueChange={(value) => handleInputChange("financialInfo", "investmentExperience", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Financial Goals</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.financialInfo.financialGoals.map((goal, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{goal}</span>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => {
                            const newGoals = profile.financialInfo.financialGoals.filter((_, i) => i !== index)
                            handleInputChange("financialInfo", "financialGoals", newGoals)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm" className="h-6 bg-transparent">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Goal
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={profile.preferences.currency}
                    onValueChange={(value) => handleInputChange("preferences", "currency", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={profile.preferences.language}
                    onValueChange={(value) => handleInputChange("preferences", "language", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Telugu">Telugu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={profile.preferences.timezone}
                    onValueChange={(value) => handleInputChange("preferences", "timezone", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={profile.preferences.theme}
                    onValueChange={(value) => handleInputChange("preferences", "theme", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={profile.security.twoFactorEnabled}
                    onCheckedChange={(value) => handleInputChange("security", "twoFactorEnabled", value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive security alerts via email</p>
                  </div>
                  <Switch
                    checked={profile.security.emailNotifications}
                    onCheckedChange={(value) => handleInputChange("security", "emailNotifications", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive security alerts via SMS</p>
                  </div>
                  <Switch
                    checked={profile.security.smsAlerts}
                    onCheckedChange={(value) => handleInputChange("security", "smsAlerts", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    checked={profile.security.loginAlerts}
                    onCheckedChange={(value) => handleInputChange("security", "loginAlerts", value)}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium">Password & Authentication</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Shield className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Phone className="mr-2 h-4 w-4" />
                    Update Phone Number
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Mail className="mr-2 h-4 w-4" />
                    Change Email Address
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium text-destructive">Danger Zone</h4>
                <div className="space-y-2">
                  <Button variant="destructive" className="w-full justify-start">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account settings and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Account Settings</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Database className="mr-2 h-4 w-4" />
                    Data & Accounts
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-destructive">Account Actions</h4>
                <div className="space-y-2">
                  <Button variant="destructive" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
