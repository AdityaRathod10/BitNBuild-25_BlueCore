"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingUp, TrendingDown, RotateCcw } from "lucide-react"

interface ScenarioResult {
  action: string
  currentScore: number
  projectedScore: number
  impact: number
  timeframe: string
  confidence: "high" | "medium" | "low"
}

export function CibilScenarioSimulator() {
  const [currentScore, setCurrentScore] = useState(785)
  const [selectedAction, setSelectedAction] = useState("")
  const [paymentAmount, setPaymentAmount] = useState([50000])
  const [newCreditLimit, setNewCreditLimit] = useState([200000])
  const [loanAmount, setLoanAmount] = useState([500000])
  const [results, setResults] = useState<ScenarioResult[]>([])

  const simulateScenario = () => {
    const scenarios: ScenarioResult[] = []

    if (selectedAction === "pay-down-debt") {
      const impact = Math.min(25, Math.floor(paymentAmount[0] / 10000) * 3)
      scenarios.push({
        action: `Pay down ₹${paymentAmount[0].toLocaleString()} in credit card debt`,
        currentScore,
        projectedScore: currentScore + impact,
        impact,
        timeframe: "1-2 months",
        confidence: "high",
      })
    }

    if (selectedAction === "increase-limit") {
      const impact = Math.min(15, Math.floor(newCreditLimit[0] / 50000) * 2)
      scenarios.push({
        action: `Increase credit limit to ₹${newCreditLimit[0].toLocaleString()}`,
        currentScore,
        projectedScore: currentScore + impact,
        impact,
        timeframe: "2-3 months",
        confidence: "medium",
      })
    }

    if (selectedAction === "new-loan") {
      const impact = loanAmount[0] > 1000000 ? -10 : -5
      scenarios.push({
        action: `Take new loan of ₹${loanAmount[0].toLocaleString()}`,
        currentScore,
        projectedScore: currentScore + impact,
        impact,
        timeframe: "1-3 months",
        confidence: "high",
      })
    }

    if (selectedAction === "close-card") {
      scenarios.push({
        action: "Close oldest credit card",
        currentScore,
        projectedScore: currentScore - 8,
        impact: -8,
        timeframe: "2-4 months",
        confidence: "medium",
      })
    }

    setResults(scenarios)
  }

  const resetSimulator = () => {
    setSelectedAction("")
    setPaymentAmount([50000])
    setNewCreditLimit([200000])
    setLoanAmount([500000])
    setResults([])
  }

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case "high":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">High Confidence</Badge>
        )
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Medium Confidence
          </Badge>
        )
      case "low":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Low Confidence</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Score Display */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{currentScore}</div>
            <p className="text-sm text-muted-foreground">Current CIBIL Score</p>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-primary" />
            <span>Scenario Simulator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Select Action</Label>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a scenario to simulate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pay-down-debt">Pay Down Credit Card Debt</SelectItem>
                <SelectItem value="increase-limit">Increase Credit Limit</SelectItem>
                <SelectItem value="new-loan">Take New Loan</SelectItem>
                <SelectItem value="close-card">Close Credit Card</SelectItem>
                <SelectItem value="missed-payment">Miss Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedAction === "pay-down-debt" && (
            <div className="space-y-3">
              <Label>Payment Amount: ₹{paymentAmount[0].toLocaleString()}</Label>
              <Slider
                value={paymentAmount}
                onValueChange={setPaymentAmount}
                max={200000}
                min={10000}
                step={10000}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Paying down debt reduces credit utilization and can improve your score
              </p>
            </div>
          )}

          {selectedAction === "increase-limit" && (
            <div className="space-y-3">
              <Label>New Credit Limit: ₹{newCreditLimit[0].toLocaleString()}</Label>
              <Slider
                value={newCreditLimit}
                onValueChange={setNewCreditLimit}
                max={500000}
                min={100000}
                step={25000}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Higher credit limits reduce utilization ratio if spending stays the same
              </p>
            </div>
          )}

          {selectedAction === "new-loan" && (
            <div className="space-y-3">
              <Label>Loan Amount: ₹{loanAmount[0].toLocaleString()}</Label>
              <Slider
                value={loanAmount}
                onValueChange={setLoanAmount}
                max={2000000}
                min={100000}
                step={100000}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                New loans can temporarily lower your score due to hard inquiries
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <Button onClick={simulateScenario} disabled={!selectedAction} className="flex-1">
              Simulate Impact
            </Button>
            <Button onClick={resetSimulator} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{result.action}</h3>
                  {getConfidenceBadge(result.confidence)}
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Score</p>
                    <p className="text-lg font-semibold">{result.currentScore}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Projected Score</p>
                    <p className="text-lg font-semibold">{result.projectedScore}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Impact</p>
                    <div className="flex items-center justify-center space-x-1">
                      {result.impact > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <p className={`text-lg font-semibold ${result.impact > 0 ? "text-green-600" : "text-red-600"}`}>
                        {result.impact > 0 ? "+" : ""}
                        {result.impact}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Expected timeframe: {result.timeframe}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Disclaimer:</strong> These are estimated projections based on general credit scoring models. Actual
            score changes may vary based on your complete credit profile and other factors not considered in this
            simulation.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
