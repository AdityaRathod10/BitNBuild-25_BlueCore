"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, Bot, TrendingUp, Calculator, AlertCircle, CheckCircle, TestTube } from "lucide-react"

interface AnalysisResult {
  status: string
  results?: {
    processed_data: any
    tax_analysis: any
    cibil_analysis: any
    summary: {
      financial_health_score: number
      top_recommendations: string[]
      next_actions: Array<{
        priority: string
        action: string
        timeline: string
        impact: string
      }>
    }
  }
  message: string
}

export default function TestAgentsPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [backendStatus, setBackendStatus] = useState<string>("unknown")

  // Check backend health
  const checkBackendHealth = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/health')
      const data = await response.json()
      setBackendStatus(data.status === 'healthy' ? 'connected' : 'error')
      return data
    } catch (error) {
      setBackendStatus('disconnected')
      throw error
    }
  }

  // File Upload Component
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setUploadedFile(acceptedFiles[0])
        setError(null)
      }
    }
  })

  const handleAnalysis = async () => {
    if (!uploadedFile) {
      setError("Please upload a file first")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      // Check backend health first
      await checkBackendHealth()

      const formData = new FormData()
      formData.append('file', uploadedFile)

      const response = await fetch('http://127.0.0.1:8000/api/analyze-financial-data', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const testTaxQuery = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tax-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: "How can I save tax with 80C investments?",
          income_details: { annual_income: 1200000, current_investments: 50000 }
        })
      })
      
      const result = await response.json()
      console.log('Tax Query Result:', result)
      setAnalysisResult(result)
    } catch (err) {
      setError('Tax query test failed')
      console.error(err)
    }
  }

  const testCibilAnalysis = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/cibil-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credit_data: {
            current_score: 750,
            credit_cards: 3,
            loans: 1,
            payment_history: "good"
          }
        })
      })
      
      const result = await response.json()
      console.log('CIBIL Analysis Result:', result)
      setAnalysisResult(result)
    } catch (err) {
      setError('CIBIL analysis test failed')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">
                <TestTube className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">AI Agents Testing Lab</h1>
                <p className="text-muted-foreground">Test and debug your TaxWise AI agents</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={
                backendStatus === 'connected' ? 'default' : 
                backendStatus === 'disconnected' ? 'destructive' : 'secondary'
              }>
                Backend: {backendStatus}
              </Badge>
              <Button variant="outline" size="sm" onClick={checkBackendHealth}>
                Check Connection
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="file-upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="file-upload">File Analysis</TabsTrigger>
            <TabsTrigger value="tax-agent">Tax Agent</TabsTrigger>
            <TabsTrigger value="cibil-agent">CIBIL Agent</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>

          {/* File Upload Test */}
          <TabsContent value="file-upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Test File Analysis Agent</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        {isDragActive ? 'Drop your file here' : 'Upload test financial data'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        CSV, Excel files for agent testing
                      </p>
                    </div>
                    {uploadedFile && (
                      <div className="flex items-center justify-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{uploadedFile.name}</span>
                        <Badge variant="secondary">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={handleAnalysis}
                    disabled={!uploadedFile || isAnalyzing}
                    size="lg"
                    className="px-8"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Testing Agents...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4 mr-2" />
                        Run Analysis Test
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Agent Test */}
          <TabsContent value="tax-agent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Test Tax Optimization Agent</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Sample Tax Query</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      "How can I save tax with 80C investments?"
                    </p>
                    <div className="flex space-x-2">
                      <Button onClick={testTaxQuery} variant="outline">
                        <Bot className="h-4 w-4 mr-2" />
                        Test Tax Agent
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CIBIL Agent Test */}
          <TabsContent value="cibil-agent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Test CIBIL Analysis Agent</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Sample Credit Profile</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Score: 750, Cards: 3, Loans: 1, History: Good
                    </p>
                    <div className="flex space-x-2">
                      <Button onClick={testCibilAnalysis} variant="outline">
                        <Bot className="h-4 w-4 mr-2" />
                        Test CIBIL Agent
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {error && (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Test Error</span>
                  </div>
                  <p className="text-sm mt-2">{error}</p>
                </CardContent>
              </Card>
            )}

            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Agent Test Results</span>
                    <Badge variant={analysisResult.status === 'success' ? 'default' : 'destructive'}>
                      {analysisResult.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">{analysisResult.message}</p>
                    
                    {analysisResult.results?.summary && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <h4 className="font-medium mb-2">Health Score</h4>
                          <p className="text-2xl font-bold text-green-600">
                            {analysisResult.results.summary.financial_health_score}/10
                          </p>
                        </div>
                        
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <h4 className="font-medium mb-2">Recommendations</h4>
                          <ul className="text-sm space-y-1">
                            {analysisResult.results.summary.top_recommendations.map((rec, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <details>
                        <summary className="cursor-pointer font-medium text-sm">View Raw Agent Response</summary>
                        <pre className="text-xs mt-2 whitespace-pre-wrap break-all max-h-96 overflow-y-auto">
                          {JSON.stringify(analysisResult, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!analysisResult && !error && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No test results yet. Run a test from the tabs above.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}