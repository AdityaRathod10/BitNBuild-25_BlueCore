import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CibilScoreAnalysis } from "@/components/credit-hub/cibil-score-analysis"
import { CreditUtilization } from "@/components/credit-hub/credit-utilization"
import { CibilScenarioSimulator } from "@/components/credit-hub/cibil-scenario-simulator"
import { CreditRecommendations } from "@/components/credit-hub/credit-recommendations"
import { CreditCard } from "lucide-react"
import { AuthGuard } from "@/components/AuthGuard"

export default function CreditHubPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-balance">Credit Hub</h1>
            </div>
            <p className="text-muted-foreground text-pretty">
              Monitor your credit health and get personalized recommendations to improve your CIBIL score
            </p>
          </div>

      {/* Credit Hub Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="utilization">Credit Utilization</TabsTrigger>
          <TabsTrigger value="simulator">Score Simulator</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CibilScoreAnalysis />
        </TabsContent>

        <TabsContent value="utilization">
          <CreditUtilization />
        </TabsContent>

        <TabsContent value="simulator">
          <CibilScenarioSimulator />
        </TabsContent>

        <TabsContent value="recommendations">
          <CreditRecommendations />
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
