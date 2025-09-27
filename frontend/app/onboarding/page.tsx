"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Zap, ArrowRight, ArrowLeft, Check, User, Briefcase, Target, Settings, Sparkles } from "lucide-react"

interface OnboardingData {
  personalInfo: {
    firstName: string
    lastName: string
    dateOfBirth: string
    phone: string
    city: string
    occupation: string
  }
  financialInfo: {
    annualIncome: string
    currentSavings: string
    monthlyExpenses: string
    hasInvestments: boolean
    riskTolerance: string
    investmentExperience: string
  }
  goals: {
    primaryGoals: string[]
    timeHorizon: string
    targetAmount: string
    specificGoals: string
  }
  preferences: {
    preferredLanguage: string
    communicationPreference: string[]
    advisoryServices: boolean
    taxPlanningHelp: boolean
  }
}

const initialData: OnboardingData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    city: "",
    occupation: "",
  },
  financialInfo: {
    annualIncome: "",
    currentSavings: "",
    monthlyExpenses: "",
    hasInvestments: false,
    riskTolerance: "",
    investmentExperience: "",
  },
  goals: {
    primaryGoals: [],
    timeHorizon: "",
    targetAmount: "",
    specificGoals: "",
  },
  preferences: {
    preferredLanguage: "",
    communicationPreference: [],
    advisoryServices: false,
    taxPlanningHelp: false,
  },
}

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Tell us about yourself",
    icon: User,
  },
  {
    id: 2,
    title: "Financial Profile",
    description: "Your current financial situation",
    icon: Briefcase,
  },
  {
    id: 3,
    title: "Goals & Objectives",
    description: "What do you want to achieve?",
    icon: Target,
  },
  {
    id: 4,
    title: "Preferences",
    description: "Customize your experience",
    icon: Settings,
  },
]

const financialGoals = [
  "Retirement Planning",
  "Tax Saving",
  "Wealth Creation",
  "Emergency Fund",
  "Child Education",
  "Home Purchase",
  "Debt Reduction",
  "Travel Fund",
]

const occupations = [
  "Software Engineer",
  "Doctor",
  "Teacher",
  "Business Owner",
  "Consultant",
  "Government Employee",
  "Student",
  "Other",
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [isLoading, setIsLoading] = useState(false)

  const progress = (currentStep / steps.length) * 100

  const handleInputChange = (section: keyof OnboardingData, field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleArrayChange = (section: keyof OnboardingData, field: string, value: string, checked: boolean) => {
    setData((prev) => {
      const currentArray = (prev[section] as any)[field] as string[]
      const newArray = checked ? [...currentArray, value] : currentArray.filter((item) => item !== value)

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray,
        },
      }
    })
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          data.personalInfo.firstName &&
          data.personalInfo.lastName &&
          data.personalInfo.dateOfBirth &&
          data.personalInfo.phone &&
          data.personalInfo.city &&
          data.personalInfo.occupation
        )
      case 2:
        return (
          data.financialInfo.annualIncome &&
          data.financialInfo.currentSavings &&
          data.financialInfo.monthlyExpenses &&
          data.financialInfo.riskTolerance &&
          data.financialInfo.investmentExperience
        )
      case 3:
        return data.goals.primaryGoals.length > 0 && data.goals.timeHorizon
      case 4:
        return data.preferences.preferredLanguage && data.preferences.communicationPreference.length > 0
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
              <Zap className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Financial Journey</h1>
          <p className="text-muted-foreground">Let's set up your profile to provide personalized recommendations</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isActive
                        ? "border-primary text-primary"
                        : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {step.title}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
              <span>{steps[currentStep - 1].title}</span>
            </CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={data.personalInfo.firstName}
                      onChange={(e) => handleInputChange("personalInfo", "firstName", e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={data.personalInfo.lastName}
                      onChange={(e) => handleInputChange("personalInfo", "lastName", e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={data.personalInfo.dateOfBirth}
                      onChange={(e) => handleInputChange("personalInfo", "dateOfBirth", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={data.personalInfo.phone}
                      onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={data.personalInfo.city}
                      onChange={(e) => handleInputChange("personalInfo", "city", e.target.value)}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation *</Label>
                    <Select
                      value={data.personalInfo.occupation}
                      onValueChange={(value) => handleInputChange("personalInfo", "occupation", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        {occupations.map((occupation) => (
                          <SelectItem key={occupation} value={occupation}>
                            {occupation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Financial Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annualIncome">Annual Income (₹) *</Label>
                    <Select
                      value={data.financialInfo.annualIncome}
                      onValueChange={(value) => handleInputChange("financialInfo", "annualIncome", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-300000">₹0 - ₹3,00,000</SelectItem>
                        <SelectItem value="300000-600000">₹3,00,000 - ₹6,00,000</SelectItem>
                        <SelectItem value="600000-1000000">₹6,00,000 - ₹10,00,000</SelectItem>
                        <SelectItem value="1000000-1500000">₹10,00,000 - ₹15,00,000</SelectItem>
                        <SelectItem value="1500000+">₹15,00,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentSavings">Current Savings (₹) *</Label>
                    <Select
                      value={data.financialInfo.currentSavings}
                      onValueChange={(value) => handleInputChange("financialInfo", "currentSavings", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select savings range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-100000">₹0 - ₹1,00,000</SelectItem>
                        <SelectItem value="100000-500000">₹1,00,000 - ₹5,00,000</SelectItem>
                        <SelectItem value="500000-1000000">₹5,00,000 - ₹10,00,000</SelectItem>
                        <SelectItem value="1000000-2500000">₹10,00,000 - ₹25,00,000</SelectItem>
                        <SelectItem value="2500000+">₹25,00,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses">Monthly Expenses (₹) *</Label>
                  <Select
                    value={data.financialInfo.monthlyExpenses}
                    onValueChange={(value) => handleInputChange("financialInfo", "monthlyExpenses", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select expense range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-25000">₹0 - ₹25,000</SelectItem>
                      <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                      <SelectItem value="50000-75000">₹50,000 - ₹75,000</SelectItem>
                      <SelectItem value="75000-100000">₹75,000 - ₹1,00,000</SelectItem>
                      <SelectItem value="100000+">₹1,00,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Do you currently have any investments?</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasInvestments"
                      checked={data.financialInfo.hasInvestments}
                      onCheckedChange={(checked) => handleInputChange("financialInfo", "hasInvestments", checked)}
                    />
                    <Label htmlFor="hasInvestments">Yes, I have existing investments</Label>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Risk Tolerance *</Label>
                  <RadioGroup
                    value={data.financialInfo.riskTolerance}
                    onValueChange={(value) => handleInputChange("financialInfo", "riskTolerance", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="conservative" id="conservative" />
                      <Label htmlFor="conservative">Conservative - I prefer stable, low-risk investments</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate">Moderate - I'm comfortable with some risk for better returns</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="aggressive" id="aggressive" />
                      <Label htmlFor="aggressive">Aggressive - I'm willing to take high risks for high returns</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investmentExperience">Investment Experience *</Label>
                  <Select
                    value={data.financialInfo.investmentExperience}
                    onValueChange={(value) => handleInputChange("financialInfo", "investmentExperience", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner - New to investing</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Some experience with investments</SelectItem>
                      <SelectItem value="advanced">Advanced - Experienced investor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Goals & Objectives */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Primary Financial Goals * (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {financialGoals.map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={goal}
                          checked={data.goals.primaryGoals.includes(goal)}
                          onCheckedChange={(checked) =>
                            handleArrayChange("goals", "primaryGoals", goal, checked as boolean)
                          }
                        />
                        <Label htmlFor={goal} className="text-sm">
                          {goal}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeHorizon">Investment Time Horizon *</Label>
                  <Select
                    value={data.goals.timeHorizon}
                    onValueChange={(value) => handleInputChange("goals", "timeHorizon", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your time horizon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short-term (1-3 years)</SelectItem>
                      <SelectItem value="medium">Medium-term (3-7 years)</SelectItem>
                      <SelectItem value="long">Long-term (7+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                  <Input
                    id="targetAmount"
                    value={data.goals.targetAmount}
                    onChange={(e) => handleInputChange("goals", "targetAmount", e.target.value)}
                    placeholder="e.g., 50,00,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specificGoals">Specific Goals (Optional)</Label>
                  <Textarea
                    id="specificGoals"
                    value={data.goals.specificGoals}
                    onChange={(e) => handleInputChange("goals", "specificGoals", e.target.value)}
                    placeholder="Tell us about any specific financial goals you have..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Preferences */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredLanguage">Preferred Language *</Label>
                  <Select
                    value={data.preferences.preferredLanguage}
                    onValueChange={(value) => handleInputChange("preferences", "preferredLanguage", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="tamil">Tamil</SelectItem>
                      <SelectItem value="telugu">Telugu</SelectItem>
                      <SelectItem value="bengali">Bengali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Communication Preferences * (Select all that apply)</Label>
                  <div className="space-y-2">
                    {["Email", "SMS", "Push Notifications", "WhatsApp"].map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={method}
                          checked={data.preferences.communicationPreference.includes(method)}
                          onCheckedChange={(checked) =>
                            handleArrayChange("preferences", "communicationPreference", method, checked as boolean)
                          }
                        />
                        <Label htmlFor={method}>{method}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <Label>Additional Services</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="advisoryServices"
                        checked={data.preferences.advisoryServices}
                        onCheckedChange={(checked) => handleInputChange("preferences", "advisoryServices", checked)}
                      />
                      <Label htmlFor="advisoryServices" className="flex flex-col space-y-1">
                        <span>Personal Financial Advisory</span>
                        <span className="text-sm text-muted-foreground">
                          Get personalized advice from certified financial advisors
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="taxPlanningHelp"
                        checked={data.preferences.taxPlanningHelp}
                        onCheckedChange={(checked) => handleInputChange("preferences", "taxPlanningHelp", checked)}
                      />
                      <Label htmlFor="taxPlanningHelp" className="flex flex-col space-y-1">
                        <span>Tax Planning Assistance</span>
                        <span className="text-sm text-muted-foreground">Get help with tax optimization and filing</span>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={nextStep} disabled={!isStepValid()}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={!isStepValid() || isLoading}>
              {isLoading ? (
                "Setting up your account..."
              ) : (
                <>
                  Complete Setup
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>

        {/* Selected Goals Preview */}
        {currentStep === 3 && data.goals.primaryGoals.length > 0 && (
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Selected Goals:</h4>
              <div className="flex flex-wrap gap-2">
                {data.goals.primaryGoals.map((goal) => (
                  <Badge key={goal} variant="secondary">
                    {goal}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
