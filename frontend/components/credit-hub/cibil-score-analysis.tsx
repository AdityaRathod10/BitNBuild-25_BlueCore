"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Calendar, CreditCard } from "lucide-react"

const scoreHistory = [
  { month: "Jan", score: 720 },
  { month: "Feb", score: 735 },
  { month: "Mar", score: 742 },
  { month: "Apr", score: 758 },
  { month: "May", score: 771 },
  { month: "Jun", score: 785 },
]

const scoreFactors = [
  { factor: "Payment History", impact: 35, score: 92, color: "hsl(var(--chart-2))" },
  { factor: "Credit Utilization", impact: 30, score: 78, color: "hsl(var(--chart-3))" },
  { factor: "Credit History Length", impact: 15, score: 85, color: "hsl(var(--chart-1))" },
  { factor: "Credit Mix", impact: 10, score: 88, color: "hsl(var(--chart-4))" },
  { factor: "New Credit", impact: 10, score: 95, color: "hsl(var(--chart-5))" },
]

function getScoreRating(score: number) {
  if (score >= 750) return { rating: "Excellent", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900" }
  if (score >= 700) return { rating: "Good", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900" }
  if (score >= 650) return { rating: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900" }
  return { rating: "Poor", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900" }
}

export function CibilScoreAnalysis() {
  const currentScore = scoreHistory[scoreHistory.length - 1].score
  const previousScore = scoreHistory[scoreHistory.length - 2].score
  const scoreChange = currentScore - previousScore
  const { rating, color, bgColor } = getScoreRating(currentScore)

  return (
    <div className="space-y-8">
      {/* Current Score Card */}
      <Card className="bg-gradient-to-br from-primary/5 via-primary/8 to-primary/10 border-primary/20 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between text-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <span>Your CIBIL Score</span>
            </div>
            <Badge className={`${bgColor} ${color} border-0 px-4 py-2 text-sm font-semibold`}>{rating}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="text-center lg:text-left">
              <div className="text-6xl font-bold text-primary mb-2">{currentScore}</div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                {scoreChange > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <span className={`text-lg font-semibold ${scoreChange > 0 ? "text-green-600" : "text-red-600"}`}>
                  {scoreChange > 0 ? "+" : ""}
                  {scoreChange} this month
                </span>
              </div>
              <p className="text-muted-foreground">Your credit health is improving steadily</p>
            </div>
            <div className="space-y-4">
              <div className="text-lg font-semibold text-foreground mb-4">Score Range Legend</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="font-medium">300-549</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Poor</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">550-649</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Fair</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">650-749</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Good</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="font-medium">750-900</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Excellent</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Last Updated</span>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">December 15, 2024</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score History and Factors */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Score History Chart */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Score History</CardTitle>
            <p className="text-sm text-muted-foreground">6-month credit score trend</p>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    className="text-xs font-medium"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    domain={[680, 800]} 
                    axisLine={false} 
                    tickLine={false} 
                    className="text-xs font-medium"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={4}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: "hsl(var(--primary))", strokeWidth: 3, fill: "white" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Highest</p>
                <p className="font-semibold text-green-600">785</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Lowest</p>
                <p className="font-semibold text-red-600">720</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="font-semibold">752</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Factors */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Score Factors</CardTitle>
            <p className="text-sm text-muted-foreground">Key factors affecting your credit score</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {scoreFactors.map((factor) => (
              <div key={factor.factor} className="space-y-3 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{factor.factor}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground">{factor.impact}% impact</span>
                    {factor.score >= 85 ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : factor.score >= 70 ? (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Progress value={factor.score} className="flex-1 h-3" />
                  <span className="text-lg font-bold w-12 text-right">{factor.score}%</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {factor.score >= 85 
                    ? "Excellent - Keep up the good work!" 
                    : factor.score >= 70 
                    ? "Good - Room for improvement" 
                    : "Needs attention - Focus on this area"
                  }
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">Excellent Payment History</p>
                <p className="text-sm text-muted-foreground mt-1">No missed payments in 24 months - this is your strongest factor</p>
                <div className="mt-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">On track for 800+ score</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">High Credit Utilization</p>
                <p className="text-sm text-muted-foreground mt-1">78% - Consider reducing to below 30% for better score</p>
                <div className="mt-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-yellow-600 font-medium">Priority improvement area</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">Score Improving</p>
                <p className="text-sm text-muted-foreground mt-1">+65 points in the last 6 months - great progress!</p>
                <div className="mt-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-blue-600 font-medium">Consistent upward trend</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
