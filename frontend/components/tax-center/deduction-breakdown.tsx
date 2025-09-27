"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

interface Deduction {
  section: string
  description: string
  maxLimit: number
  claimed: number
  remaining: number
  suggestions: string[]
  priority: "high" | "medium" | "low"
}

const deductions: Deduction[] = [
  {
    section: "Section 80C",
    description: "Investments in ELSS, PPF, EPF, NSC, Tax-saving FD",
    maxLimit: 150000,
    claimed: 95000,
    remaining: 55000,
    suggestions: ["Invest ₹55,000 in ELSS mutual funds", "Increase PPF contribution"],
    priority: "high",
  },
  {
    section: "Section 80D",
    description: "Health insurance premiums",
    maxLimit: 25000,
    claimed: 18000,
    remaining: 7000,
    suggestions: ["Upgrade health insurance plan", "Add parents to health insurance"],
    priority: "medium",
  },
  {
    section: "Section 24(b)",
    description: "Home loan interest deduction",
    maxLimit: 200000,
    claimed: 150000,
    remaining: 50000,
    suggestions: ["Consider prepayment to optimize interest", "Review loan restructuring options"],
    priority: "low",
  },
  {
    section: "Section 80G",
    description: "Donations to eligible charities",
    maxLimit: 50000,
    claimed: 12000,
    remaining: 38000,
    suggestions: ["Donate to PM CARES Fund", "Contribute to eligible NGOs"],
    priority: "medium",
  },
]

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export function DeductionBreakdown() {
  const totalMaxLimit = deductions.reduce((sum, d) => sum + d.maxLimit, 0)
  const totalClaimed = deductions.reduce((sum, d) => sum + d.claimed, 0)
  const totalRemaining = deductions.reduce((sum, d) => sum + d.remaining, 0)
  const potentialSavings = totalRemaining * 0.3 // Assuming 30% tax bracket

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>Deduction Breakdown</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Remaining</p>
            <p className="text-2xl font-bold text-primary">₹{totalRemaining.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Potential Savings</p>
            <p className="text-2xl font-bold text-green-600">₹{potentialSavings.toLocaleString()}</p>
          </div>
        </div>

        {/* Deduction Cards */}
        <div className="space-y-4">
          {deductions.map((deduction) => {
            const percentage = (deduction.claimed / deduction.maxLimit) * 100
            const isComplete = percentage === 100

            return (
              <div key={deduction.section} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{deduction.section}</h3>
                    <Badge className={getPriorityColor(deduction.priority)}>{deduction.priority}</Badge>
                    {isComplete && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ₹{deduction.claimed.toLocaleString()} / ₹{deduction.maxLimit.toLocaleString()}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">{deduction.description}</p>

                <div className="space-y-2">
                  <Progress value={percentage} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">₹{deduction.remaining.toLocaleString()} remaining</span>
                    <span className="font-medium">{percentage.toFixed(0)}% utilized</span>
                  </div>
                </div>

                {deduction.remaining > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium">Investment Suggestions</span>
                    </div>
                    <ul className="space-y-1">
                      {deduction.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center space-x-2">
                          <span>•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                    <Button size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Invest Now
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Action Button */}
        <Button className="w-full" size="lg">
          Generate Investment Plan
        </Button>
      </CardContent>
    </Card>
  )
}
