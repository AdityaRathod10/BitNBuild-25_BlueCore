"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, TrendingDown, CheckCircle, Target, Lightbulb, ArrowRight, Info } from "lucide-react"

interface RegimeComparison {
  regime: string
  taxLiability: number
  effectiveRate: number
  savings: number
  recommended: boolean
  deductions: {
    section80C: number
    section80D: number
    hra: number
    standardDeduction: number
    other: number
  }
  taxBreakdown: {
    slab: string
    rate: string
    tax: number
  }[]
}

interface TaxScenario {
  income: number
  hra: number
  section80C: number
  section80D: number
  homeLoanInterest: number
  otherDeductions: number
}

export function RegimeSimulator() {
  const [scenario, setScenario] = useState<TaxScenario>({
    income: 1200000,
    hra: 120000,
    section80C: 150000,
    section80D: 25000,
    homeLoanInterest: 200000,
    otherDeductions: 50000,
  })

  const calculateTax = (income: number, deductions: any, isNewRegime: boolean) => {
    let taxableIncome = income
    const deductionBreakdown = {
      section80C: 0,
      section80D: 0,
      hra: 0,
      standardDeduction: 0,
      other: 0,
    }

    if (isNewRegime) {
      // New regime - only standard deduction
      deductionBreakdown.standardDeduction = 75000
      taxableIncome -= 75000
    } else {
      // Old regime - all deductions
      deductionBreakdown.section80C = Math.min(deductions.section80C, 150000)
      deductionBreakdown.section80D = Math.min(deductions.section80D, 25000)
      deductionBreakdown.hra = Math.min(deductions.hra, income * 0.5)
      deductionBreakdown.standardDeduction = 50000
      deductionBreakdown.other = deductions.homeLoanInterest + deductions.otherDeductions

      const totalDeductions = Object.values(deductionBreakdown).reduce((sum, val) => sum + val, 0)
      taxableIncome -= totalDeductions
    }

    // Tax calculation based on regime
    let tax = 0
    const taxBreakdown = []

    if (isNewRegime) {
      // New regime slabs (FY 2024-25)
      const slabs = [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 700000, rate: 0.05 },
        { min: 700000, max: 1000000, rate: 0.1 },
        { min: 1000000, max: 1200000, rate: 0.15 },
        { min: 1200000, max: 1500000, rate: 0.2 },
        { min: 1500000, max: Number.POSITIVE_INFINITY, rate: 0.3 },
      ]

      for (const slab of slabs) {
        if (taxableIncome > slab.min) {
          const taxableInThisSlab = Math.min(taxableIncome - slab.min, slab.max - slab.min)
          const taxInThisSlab = taxableInThisSlab * slab.rate
          tax += taxInThisSlab

          if (taxInThisSlab > 0) {
            taxBreakdown.push({
              slab:
                slab.max === Number.POSITIVE_INFINITY
                  ? `₹${(slab.min / 100000).toFixed(0)}L+`
                  : `₹${(slab.min / 100000).toFixed(0)}L - ₹${(slab.max / 100000).toFixed(0)}L`,
              rate: `${slab.rate * 100}%`,
              tax: taxInThisSlab,
            })
          }
        }
      }
    } else {
      // Old regime slabs
      const slabs = [
        { min: 0, max: 250000, rate: 0 },
        { min: 250000, max: 500000, rate: 0.05 },
        { min: 500000, max: 1000000, rate: 0.2 },
        { min: 1000000, max: Number.POSITIVE_INFINITY, rate: 0.3 },
      ]

      for (const slab of slabs) {
        if (taxableIncome > slab.min) {
          const taxableInThisSlab = Math.min(taxableIncome - slab.min, slab.max - slab.min)
          const taxInThisSlab = taxableInThisSlab * slab.rate
          tax += taxInThisSlab

          if (taxInThisSlab > 0) {
            taxBreakdown.push({
              slab:
                slab.max === Number.POSITIVE_INFINITY
                  ? `₹${(slab.min / 100000).toFixed(0)}L+`
                  : `₹${(slab.min / 100000).toFixed(0)}L - ₹${(slab.max / 100000).toFixed(0)}L`,
              rate: `${slab.rate * 100}%`,
              tax: taxInThisSlab,
            })
          }
        }
      }
    }

    // Add cess (4% on tax)
    const cess = tax * 0.04
    const totalTax = tax + cess

    return {
      taxLiability: Math.round(totalTax),
      effectiveRate: (totalTax / income) * 100,
      deductions: deductionBreakdown,
      taxBreakdown,
      taxableIncome: Math.round(taxableIncome),
    }
  }

  const oldRegimeCalc = calculateTax(scenario.income, scenario, false)
  const newRegimeCalc = calculateTax(scenario.income, scenario, true)

  const regimeData: RegimeComparison[] = [
    {
      regime: "Old Tax Regime",
      taxLiability: oldRegimeCalc.taxLiability,
      effectiveRate: oldRegimeCalc.effectiveRate,
      savings: 0,
      recommended: oldRegimeCalc.taxLiability < newRegimeCalc.taxLiability,
      deductions: oldRegimeCalc.deductions,
      taxBreakdown: oldRegimeCalc.taxBreakdown,
    },
    {
      regime: "New Tax Regime",
      taxLiability: newRegimeCalc.taxLiability,
      effectiveRate: newRegimeCalc.effectiveRate,
      savings: Math.max(0, oldRegimeCalc.taxLiability - newRegimeCalc.taxLiability),
      recommended: newRegimeCalc.taxLiability < oldRegimeCalc.taxLiability,
      deductions: newRegimeCalc.deductions,
      taxBreakdown: newRegimeCalc.taxBreakdown,
    },
  ]

  const recommendedRegime = regimeData.find((r) => r.recommended)
  const totalSavings = Math.abs(oldRegimeCalc.taxLiability - newRegimeCalc.taxLiability)

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center space-x-3 text-2xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <div>
            <span>Advanced Tax Regime Simulator</span>
            <p className="text-sm font-normal text-muted-foreground mt-1">Compare old vs new tax regimes and optimize your savings</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="calculator" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Calculator</TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Comparison</TabsTrigger>
            <TabsTrigger value="breakdown" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Breakdown</TabsTrigger>
            <TabsTrigger value="scenarios" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Scenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">Income & Deductions</CardTitle>
                  <p className="text-sm text-muted-foreground">Enter your financial details for accurate calculation</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="income" className="text-sm font-semibold">Annual Income</Label>
                    <Input
                      id="income"
                      type="number"
                      value={scenario.income}
                      onChange={(e) => setScenario({ ...scenario, income: Number.parseInt(e.target.value) || 0 })}
                      className="h-12 text-lg font-medium"
                      placeholder="Enter your annual income"
                    />
                    <div className="flex flex-wrap gap-2">
                      {[800000, 1200000, 1500000, 2000000, 2500000].map((income) => (
                        <Button
                          key={income}
                          variant={scenario.income === income ? "default" : "outline"}
                          size="sm"
                          onClick={() => setScenario({ ...scenario, income })}
                          className="text-xs"
                        >
                          ₹{income / 100000}L
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="hra" className="text-sm font-semibold">HRA Received</Label>
                    <Input
                      id="hra"
                      type="number"
                      value={scenario.hra}
                      onChange={(e) => setScenario({ ...scenario, hra: Number.parseInt(e.target.value) || 0 })}
                      className="h-12 text-lg font-medium"
                      placeholder="Enter HRA amount"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="section80c" className="text-sm font-semibold">Section 80C Investments</Label>
                    <Input
                      id="section80c"
                      type="number"
                      value={scenario.section80C}
                      onChange={(e) => setScenario({ ...scenario, section80C: Number.parseInt(e.target.value) || 0 })}
                      className="h-12 text-lg font-medium"
                      placeholder="Enter 80C investments"
                    />
                    <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">Max limit: ₹1,50,000</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="section80d" className="text-sm font-semibold">Section 80D (Health Insurance)</Label>
                    <Input
                      id="section80d"
                      type="number"
                      value={scenario.section80D}
                      onChange={(e) => setScenario({ ...scenario, section80D: Number.parseInt(e.target.value) || 0 })}
                      className="h-12 text-lg font-medium"
                      placeholder="Enter health insurance premium"
                    />
                    <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">Max limit: ₹25,000</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="homeloan" className="text-sm font-semibold">Home Loan Interest (24b)</Label>
                    <Input
                      id="homeloan"
                      type="number"
                      value={scenario.homeLoanInterest}
                      onChange={(e) =>
                        setScenario({ ...scenario, homeLoanInterest: Number.parseInt(e.target.value) || 0 })
                      }
                      className="h-12 text-lg font-medium"
                      placeholder="Enter home loan interest"
                    />
                    <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">Max limit: ₹2,00,000</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">Quick Comparison</CardTitle>
                  <p className="text-sm text-muted-foreground">Real-time tax calculation comparison</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {regimeData.map((regime) => (
                    <div
                      key={regime.regime}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        regime.recommended 
                          ? "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800/30 shadow-lg" 
                          : "border-border bg-card hover:border-primary/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">{regime.regime}</h3>
                        {regime.recommended && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Tax Liability</p>
                          <p className="text-2xl font-bold text-foreground">₹{regime.taxLiability.toLocaleString("en-IN")}</p>
                        </div>
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Effective Rate</p>
                          <p className="text-2xl font-bold text-foreground">{regime.effectiveRate.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {totalSavings > 0 && (
                    <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border-2 border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-primary text-lg">Potential Annual Savings</p>
                          <p className="text-3xl font-bold text-primary mt-1">₹{totalSavings.toLocaleString("en-IN")}</p>
                          <p className="text-sm text-muted-foreground mt-1">Choose the recommended regime to save more</p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <TrendingDown className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {regimeData.map((regime) => (
                <Card key={regime.regime} className={regime.recommended ? "ring-2 ring-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{regime.regime}</CardTitle>
                      {regime.recommended && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Tax Liability</p>
                        <p className="text-xl font-bold">₹{regime.taxLiability.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Effective Rate</p>
                        <p className="text-xl font-bold">{regime.effectiveRate.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Deductions Used</h4>
                      <div className="space-y-2">
                        {Object.entries(regime.deductions).map(
                          ([key, value]) =>
                            value > 0 && (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                                <span>₹{value.toLocaleString("en-IN")}</span>
                              </div>
                            ),
                        )}
                      </div>
                    </div>

                    {regime.savings > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-green-800 font-medium">Annual Savings</span>
                          <span className="text-green-800 font-bold">₹{regime.savings.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {regimeData.map((regime) => (
                <Card key={regime.regime}>
                  <CardHeader>
                    <CardTitle className="text-lg">{regime.regime} - Tax Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Tax Slab Calculation</h4>
                        <div className="space-y-2">
                          {regime.taxBreakdown.map((slab, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                              <div>
                                <span className="text-sm font-medium">{slab.slab}</span>
                                <span className="text-xs text-muted-foreground ml-2">@ {slab.rate}</span>
                              </div>
                              <span className="font-medium">₹{slab.tax.toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex justify-between font-semibold">
                          <span>Total Tax (incl. cess)</span>
                          <span>₹{regime.taxLiability.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  What-If Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Salary Increase</h4>
                    <p className="text-sm text-muted-foreground mb-3">See tax impact of 20% salary hike</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Tax</span>
                        <span>₹{recommendedRegime?.taxLiability.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>After Hike</span>
                        <span>
                          ₹{Math.round((recommendedRegime?.taxLiability || 0) * 1.35).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-red-600">
                        <span>Additional Tax</span>
                        <span>
                          ₹{Math.round((recommendedRegime?.taxLiability || 0) * 0.35).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Max 80C Investment</h4>
                    <p className="text-sm text-muted-foreground mb-3">Invest full ₹1.5L in 80C</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Deduction</span>
                        <span>₹{scenario.section80C.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max Deduction</span>
                        <span>₹1,50,000</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-green-600">
                        <span>Tax Savings</span>
                        <span>₹{Math.round((150000 - scenario.section80C) * 0.2).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Home Loan</h4>
                    <p className="text-sm text-muted-foreground mb-3">Take ₹2L home loan interest</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Interest Deduction</span>
                        <span>₹2,00,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Principal (80C)</span>
                        <span>₹1,50,000</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-green-600">
                        <span>Total Tax Savings</span>
                        <span>₹70,000</span>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">Smart Tax Planning Tips</h4>
                        <ul className="space-y-1 text-sm text-blue-800">
                          <li>• Consider switching to new regime if you have minimal deductions</li>
                          <li>• Maximize 80C investments early in the financial year</li>
                          <li>• Health insurance premiums provide dual benefits - coverage + tax savings</li>
                          <li>• Home loan interest provides significant tax relief in old regime</li>
                          <li>• Review your regime choice annually based on changing circumstances</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {recommendedRegime && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Recommended: {recommendedRegime.regime}</p>
                    <p className="text-sm text-muted-foreground">
                      Save ₹{totalSavings.toLocaleString("en-IN")} annually with better tax efficiency
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Info className="h-4 w-4 mr-2" />
                    Learn More
                  </Button>
                  <Button size="sm">
                    Apply Choice
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
