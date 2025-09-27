"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, CreditCard, TrendingDown } from "lucide-react"

interface CreditCardData {
  id: string
  name: string
  currentBalance: number
  creditLimit: number
  utilization: number
  minPayment: number
  dueDate: string
  status: "good" | "warning" | "danger"
}

const creditCards: CreditCardData[] = [
  {
    id: "1",
    name: "HDFC Regalia",
    currentBalance: 45000,
    creditLimit: 200000,
    utilization: 22.5,
    minPayment: 2250,
    dueDate: "2024-12-25",
    status: "good",
  },
  {
    id: "2",
    name: "SBI SimplyCLICK",
    currentBalance: 85000,
    creditLimit: 150000,
    utilization: 56.7,
    minPayment: 4250,
    dueDate: "2024-12-28",
    status: "warning",
  },
  {
    id: "3",
    name: "ICICI Amazon Pay",
    currentBalance: 120000,
    creditLimit: 125000,
    utilization: 96.0,
    minPayment: 6000,
    dueDate: "2024-12-30",
    status: "danger",
  },
  {
    id: "4",
    name: "Axis Flipkart",
    currentBalance: 15000,
    creditLimit: 100000,
    utilization: 15.0,
    minPayment: 750,
    dueDate: "2025-01-05",
    status: "good",
  },
]

function getUtilizationStatus(utilization: number) {
  if (utilization <= 30) return { status: "good", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900" }
  if (utilization <= 70)
    return { status: "warning", color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900" }
  return { status: "danger", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900" }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "good":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case "danger":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    default:
      return <CreditCard className="h-4 w-4 text-muted-foreground" />
  }
}

export function CreditUtilization() {
  const totalBalance = creditCards.reduce((sum, card) => sum + card.currentBalance, 0)
  const totalLimit = creditCards.reduce((sum, card) => sum + card.creditLimit, 0)
  const overallUtilization = (totalBalance / totalLimit) * 100

  const goodCards = creditCards.filter((card) => card.utilization <= 30).length
  const warningCards = creditCards.filter((card) => card.utilization > 30 && card.utilization <= 70).length
  const dangerCards = creditCards.filter((card) => card.utilization > 70).length

  return (
    <div className="space-y-6">
      {/* Overall Utilization Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Utilization</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallUtilization.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              ₹{totalBalance.toLocaleString()} of ₹{totalLimit.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Cards</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{goodCards}</div>
            <p className="text-xs text-muted-foreground">&lt;=30% utilization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning Cards</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningCards}</div>
            <p className="text-xs text-muted-foreground">30-70% utilization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Cards</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{dangerCards}</div>
            <p className="text-xs text-muted-foreground">&gt;70% utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Card Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Card Utilization Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {creditCards.map((card) => {
            const { color, bgColor } = getUtilizationStatus(card.utilization)
            const daysUntilDue = Math.ceil(
              (new Date(card.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
            )

            return (
              <div key={card.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(card.status)}
                    <div>
                      <h3 className="font-medium">{card.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Due in {daysUntilDue} days • Min Payment: ₹{card.minPayment.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${bgColor} ${color} border-0`}>{card.utilization.toFixed(1)}%</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Current Balance</span>
                    <span className="font-medium">₹{card.currentBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Credit Limit</span>
                    <span className="font-medium">₹{card.creditLimit.toLocaleString()}</span>
                  </div>
                  <Progress value={card.utilization} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Available: ₹{(card.creditLimit - card.currentBalance).toLocaleString()}</span>
                    <span>{card.utilization.toFixed(1)}% utilized</span>
                  </div>
                </div>

                {card.utilization > 30 && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <TrendingDown className="h-4 w-4 text-primary mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Recommendation</p>
                        <p className="text-xs text-muted-foreground">
                          {card.utilization > 70
                            ? `Pay down ₹${(card.currentBalance - card.creditLimit * 0.3).toLocaleString()} to reach 30% utilization`
                            : `Consider paying down ₹${(card.currentBalance - card.creditLimit * 0.3).toLocaleString()} to improve your score`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Make Payment
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    View Statements
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Utilization Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Credit Utilization Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Keep utilization below 30%</p>
                <p className="text-xs text-muted-foreground">Lower utilization shows responsible credit management</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Pay before statement date</p>
                <p className="text-xs text-muted-foreground">Reduces reported balance to credit bureaus</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Request credit limit increases</p>
                <p className="text-xs text-muted-foreground">Higher limits reduce utilization percentage</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Spread balances across cards</p>
                <p className="text-xs text-muted-foreground">Avoid maxing out individual cards</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
