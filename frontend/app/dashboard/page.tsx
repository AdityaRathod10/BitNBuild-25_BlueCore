import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, CreditCard, PiggyBank, Target, ArrowUpRight, AlertCircle } from "lucide-react"
import { TaxSavingMeter } from "@/components/dashboard/tax-saving-meter"
import { CashFlowOverview } from "@/components/dashboard/cash-flow-overview"
import { FinancialSummary } from "@/components/dashboard/financial-summary"
import { AuthGuard } from "@/components/AuthGuard"

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">Good morning, Rahul</h1>
            <p className="text-muted-foreground text-pretty">Here's your financial overview for December 2024</p>
          </div>

      {/* Financial Summary */}
      <FinancialSummary />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Liability (YTD)</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,24,500</div>
            <p className="text-xs text-muted-foreground">+12% from last year</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold financial-positive">₹45,200</div>
            <p className="text-xs text-muted-foreground">Through optimization</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CIBIL Score</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">785</div>
            <p className="text-xs financial-positive flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +15 this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹28.5L</div>
            <p className="text-xs financial-positive flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8.2% this quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tax Saving Meter */}
        <TaxSavingMeter />

        {/* Cash Flow Overview */}
        <CashFlowOverview />
      </div>

      {/* Action Center */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <span>Action Center</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-warning/10 rounded-lg border border-warning/20">
            <div className="space-y-1">
              <p className="font-medium">Upload Form 16</p>
              <p className="text-sm text-muted-foreground">Complete your tax filing for accurate calculations</p>
            </div>
            <Button size="sm">Upload</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="space-y-1">
              <p className="font-medium">Link Credit Cards</p>
              <p className="text-sm text-muted-foreground">2 credit cards pending connection</p>
            </div>
            <Button size="sm" variant="outline">
              Connect
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="space-y-1">
              <p className="font-medium">Review Transactions</p>
              <p className="text-sm text-muted-foreground">45 uncategorized transactions this month</p>
            </div>
            <Button size="sm" variant="outline">
              Review
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-primary" />
              <span>Tax Optimizer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Compare tax regimes and maximize your savings</p>
            <Button className="w-full">Optimize Now</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Investment Hub</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Track portfolio performance and capital gains</p>
            <Button className="w-full bg-transparent" variant="outline">
              View Portfolio
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Financial Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Plan and track your long-term financial objectives</p>
            <Button className="w-full bg-transparent" variant="outline">
              Set Goals
            </Button>
          </CardContent>
        </Card>
      </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
