"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, Target, TrendingUp, Clock, Star } from "lucide-react"

interface Recommendation {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  effort: "easy" | "moderate" | "difficult"
  timeframe: string
  potentialIncrease: number
  priority: number
  completed: boolean
  category: "utilization" | "payment" | "credit-mix" | "inquiries"
}

const recommendations: Recommendation[] = [
  {
    id: "1",
    title: "Reduce Credit Utilization Below 30%",
    description: "Pay down ₹85,000 across your credit cards to bring overall utilization from 47% to 28%",
    impact: "high",
    effort: "moderate",
    timeframe: "1-2 months",
    potentialIncrease: 25,
    priority: 1,
    completed: false,
    category: "utilization",
  },
  {
    id: "2",
    title: "Set Up Automatic Payments",
    description: "Enable auto-pay for all credit cards to ensure you never miss a payment",
    impact: "high",
    effort: "easy",
    timeframe: "Immediate",
    potentialIncrease: 15,
    priority: 2,
    completed: true,
    category: "payment",
  },
  {
    id: "3",
    title: "Request Credit Limit Increases",
    description: "Contact HDFC and SBI to request limit increases on your existing cards",
    impact: "medium",
    effort: "easy",
    timeframe: "2-3 months",
    potentialIncrease: 12,
    priority: 3,
    completed: false,
    category: "utilization",
  },
  {
    id: "4",
    title: "Diversify Credit Mix",
    description: "Consider adding a small personal loan to improve your credit mix",
    impact: "low",
    effort: "moderate",
    timeframe: "3-6 months",
    potentialIncrease: 8,
    priority: 4,
    completed: false,
    category: "credit-mix",
  },
  {
    id: "5",
    title: "Avoid New Credit Inquiries",
    description: "Wait 6 months before applying for new credit to let recent inquiries age",
    impact: "medium",
    effort: "easy",
    timeframe: "6 months",
    potentialIncrease: 10,
    priority: 5,
    completed: false,
    category: "inquiries",
  },
]

function getImpactColor(impact: string) {
  switch (impact) {
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

function getEffortColor(effort: string) {
  switch (effort) {
    case "easy":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "moderate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "difficult":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "utilization":
      return <Target className="h-4 w-4" />
    case "payment":
      return <CheckCircle className="h-4 w-4" />
    case "credit-mix":
      return <Star className="h-4 w-4" />
    case "inquiries":
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <TrendingUp className="h-4 w-4" />
  }
}

export function CreditRecommendations() {
  const completedRecommendations = recommendations.filter((r) => r.completed).length
  const totalRecommendations = recommendations.length
  const completionPercentage = (completedRecommendations / totalRecommendations) * 100

  const potentialScoreIncrease = recommendations
    .filter((r) => !r.completed)
    .reduce((sum, r) => sum + r.potentialIncrease, 0)

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle>Credit Improvement Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {completedRecommendations}/{totalRecommendations}
              </div>
              <p className="text-sm text-muted-foreground">Recommendations Completed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+{potentialScoreIncrease}</div>
              <p className="text-sm text-muted-foreground">Potential Score Increase</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Progress</span>
              <span>{completionPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations
            .sort((a, b) => a.priority - b.priority)
            .map((rec) => (
              <div
                key={rec.id}
                className={`p-4 border rounded-lg space-y-3 ${
                  rec.completed ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {rec.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        getCategoryIcon(rec.category)
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className={`font-medium ${rec.completed ? "line-through text-muted-foreground" : ""}`}>
                        {rec.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="text-xs">Priority {rec.priority}</Badge>
                    {rec.completed && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <Badge className={getImpactColor(rec.impact)}>{rec.impact} impact</Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-3 w-3" />
                      <Badge className={getEffortColor(rec.effort)}>{rec.effort}</Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-muted-foreground">{rec.timeframe}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+{rec.potentialIncrease} points</p>
                  </div>
                </div>

                {!rec.completed && (
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Start Action
                    </Button>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                )}
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Credit Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Pay bills on time, every time</p>
                <p className="text-xs text-muted-foreground">Payment history is 35% of your credit score</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Keep old accounts open</p>
                <p className="text-xs text-muted-foreground">Longer credit history improves your score</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Monitor your credit report</p>
                <p className="text-xs text-muted-foreground">Check for errors and dispute inaccuracies</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Limit credit applications</p>
                <p className="text-xs text-muted-foreground">Too many inquiries can hurt your score</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
