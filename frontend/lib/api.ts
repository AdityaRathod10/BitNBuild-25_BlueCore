import { cookieUtils } from './cookies'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Global auth error handler
let globalAuthErrorHandler: (() => void) | null = null

export const setAuthErrorHandler = (handler: () => void) => {
  globalAuthErrorHandler = handler
}

// Helper function to get token from cookies - use same method as AuthContext
const getAuthToken = (): string | null => {
  const token = cookieUtils.getToken()
  return token || null
}

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  if (response.status === 401) {
    // Authentication error - call global handler
    if (globalAuthErrorHandler) {
      globalAuthErrorHandler()
    }
    throw new Error('Authentication failed')
  }
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'API request failed')
  }
  
  return response.json()
}

// Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface OnboardingData {
  id: string
  userId: string
  dateOfBirth?: string
  gender?: string
  maritalStatus?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  annualIncome?: number
  monthlyIncome?: number
  occupation?: string
  employer?: string
  workExperience?: number
  shortTermGoals?: string[]
  longTermGoals?: string[]
  riskTolerance?: 'Conservative' | 'Moderate' | 'Aggressive'
  isCompleted: boolean
  completedSteps: string[]
  currentStep?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  user: User
  token: string
  message: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

// Auth API
export const authApi = {
  async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Registration failed')
    }

    return response.json()
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Login failed')
    }

    return response.json()
  },
}

// Onboarding API
export const onboardingApi = {
  async getOnboardingStatus(): Promise<ApiResponse<OnboardingData | null>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/onboarding`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    return handleApiResponse(response)
  },

  async savePersonalInfo(data: {
    dateOfBirth?: string
    gender?: string
    maritalStatus?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
  }): Promise<ApiResponse<OnboardingData>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/onboarding/personal-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    return handleApiResponse(response)
  },

  async saveFinancialInfo(data: {
    annualIncome?: number
    monthlyIncome?: number
    occupation?: string
    employer?: string
    workExperience?: number
  }): Promise<ApiResponse<OnboardingData>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/onboarding/financial-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to save financial information')
    }

    return response.json()
  },

  async saveFinancialGoals(data: {
    shortTermGoals?: string[]
    longTermGoals?: string[]
    riskTolerance?: 'Conservative' | 'Moderate' | 'Aggressive'
  }): Promise<ApiResponse<OnboardingData>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/onboarding/financial-goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to save financial goals')
    }

    return response.json()
  },

  async uploadDocument(data: {
    documentType: 'panCard' | 'aadharCard' | 'bankStatement' | 'salarySlip'
    documentData: string
    fileName: string
    fileType: string
  }): Promise<ApiResponse<OnboardingData>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/onboarding/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to upload document')
    }

    return response.json()
  },

  async completeOnboarding(): Promise<ApiResponse<OnboardingData>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/onboarding/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to complete onboarding')
    }

    return response.json()
  },
}

// User Profile API
export const userApi = {
  async getProfile(): Promise<ApiResponse<User & { onboarding?: OnboardingData }>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch profile')
    }

    return response.json()
  },

  async updateProfile(data: {
    firstName?: string
    lastName?: string
    phone?: string
  }): Promise<ApiResponse<User>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    return handleApiResponse(response)
  },

  async getDetailedProfile(): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/detailed`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    return handleApiResponse(response)
  },

  async getPreferences(): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/preferences`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch preferences')
    }

    return response.json()
  },

  async updatePreferences(data: {
    currency?: string
    language?: string
    timezone?: string
    theme?: string
  }): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update preferences')
    }

    return response.json()
  },

  async getSecuritySettings(): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/security`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch security settings')
    }

    return response.json()
  },

  async updateSecuritySettings(data: {
    twoFactorEnabled?: boolean
    emailNotifications?: boolean
    smsAlerts?: boolean
    loginAlerts?: boolean
  }): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/security`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update security settings')
    }

    return response.json()
  },

  async updateIdentityInfo(data: {
    panCard?: string
    aadharCard?: string
  }): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/identity`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update identity information')
    }

    return response.json()
  },

  async uploadProfilePhoto(profilePhoto: string): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ profilePhoto }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to upload profile photo')
    }

    return response.json()
  },

  async removeProfilePhoto(): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/photo`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to remove profile photo')
    }

    return response.json()
  },

  async updateFinancialInfo(data: {
    annualIncome?: string
    riskTolerance?: 'Conservative' | 'Moderate' | 'Aggressive'
    investmentExperience?: 'Beginner' | 'Intermediate' | 'Advanced'
  }): Promise<ApiResponse<any>> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token found')

    const response = await fetch(`${API_BASE_URL}/user/profile/financial`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update financial information')
    }

    return response.json()
  },
}

// Utility functions
export const authUtils = {
  setToken(token: string) {
    // This is now handled by the AuthContext
  },

  getToken(): string | null {
    // This is now handled by the AuthContext
    return null
  },

  removeToken() {
    // This is now handled by the AuthContext
  },

  isAuthenticated(): boolean {
    // This is now handled by the AuthContext
    return false
  },
}
