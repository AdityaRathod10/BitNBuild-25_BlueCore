"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bot, Send, User, Sparkles, TrendingUp, Calculator, PiggyBank, Shield, Lightbulb } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

const quickActions = [
  { icon: Calculator, label: "Tax Optimization", query: "How can I optimize my taxes for this financial year?" },
  { icon: TrendingUp, label: "Investment Advice", query: "What are the best investment options for my risk profile?" },
  { icon: PiggyBank, label: "Budget Analysis", query: "Analyze my spending patterns and suggest improvements" },
  { icon: Shield, label: "Insurance Review", query: "Review my insurance coverage and suggest improvements" },
]

const aiResponses = {
  tax: "Based on your current income of ₹12,00,000, I recommend maximizing your 80C deductions by investing ₹1,50,000 in ELSS funds. You can save approximately ₹46,800 in taxes by switching to the new tax regime and claiming HRA exemption. Consider investing in NPS for additional ₹50,000 deduction under 80CCD(1B).",
  investment:
    "Given your moderate risk profile and 10-year investment horizon, I suggest a balanced portfolio: 60% equity (₹3,60,000 in diversified mutual funds), 30% debt (₹1,80,000 in corporate bonds), and 10% gold (₹60,000 in gold ETFs). This allocation can potentially generate 12-14% annual returns.",
  budget:
    "Your spending analysis shows 35% on essentials, 25% on lifestyle, and 40% savings - excellent! However, I notice ₹8,000 monthly on dining out. Reducing this by 30% could save ₹28,800 annually. Consider automating investments to maintain your savings discipline.",
  insurance:
    "Your current life insurance coverage of ₹50,00,000 is adequate, but I recommend increasing health insurance from ₹5,00,000 to ₹10,00,000 given rising medical costs. Consider a top-up plan for cost-effective additional coverage. Your motor insurance is due for renewal in 2 months.",
  default:
    "I'm your AI financial co-pilot! I can help you with tax optimization, investment planning, budget analysis, insurance reviews, and personalized financial advice. What would you like to explore today?",
}

export default function AICopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI financial co-pilot. I'm here to help you optimize your taxes, plan investments, analyze spending, and achieve your financial goals. How can I assist you today?",
      timestamp: new Date(),
      suggestions: ["Tax Optimization", "Investment Planning", "Budget Review", "Insurance Analysis"],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    if (lowerQuery.includes("tax") || lowerQuery.includes("deduction") || lowerQuery.includes("80c")) {
      return aiResponses.tax
    } else if (
      lowerQuery.includes("invest") ||
      lowerQuery.includes("mutual fund") ||
      lowerQuery.includes("portfolio")
    ) {
      return aiResponses.investment
    } else if (lowerQuery.includes("budget") || lowerQuery.includes("spending") || lowerQuery.includes("expense")) {
      return aiResponses.budget
    } else if (lowerQuery.includes("insurance") || lowerQuery.includes("coverage") || lowerQuery.includes("health")) {
      return aiResponses.insurance
    } else {
      return aiResponses.default
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: getAIResponse(message),
      timestamp: new Date(),
      suggestions: ["Tell me more", "Show calculations", "Alternative options", "Next steps"],
    }

    setMessages((prev) => [...prev, aiResponse])
    setIsTyping(false)
  }

  const handleQuickAction = (query: string) => {
    handleSendMessage(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Co-Pilot</h1>
            <p className="text-muted-foreground text-lg">Your intelligent financial assistant</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Quick Actions Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-auto p-4 text-left hover:bg-primary/5 transition-colors"
                    onClick={() => handleQuickAction(action.query)}
                  >
                    <Icon className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm font-semibold text-green-800">Tax Saving Opportunity</p>
                <p className="text-xs text-green-600 mt-2">You can save ₹31,200 more in taxes this year</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm font-semibold text-blue-800">Investment Rebalancing</p>
                <p className="text-xs text-blue-600 mt-2">Your portfolio needs rebalancing for optimal returns</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="text-sm font-semibold text-orange-800">Budget Alert</p>
                <p className="text-xs text-orange-600 mt-2">Dining expenses are 15% above budget this month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="xl:col-span-3">
          <Card className="h-[700px] flex flex-col shadow-sm">
            <CardHeader className="flex-shrink-0 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Chat with AI Co-Pilot</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Online
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[85%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-3`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-muted border-2 border-background shadow-sm"
                          }`}
                        >
                          {message.type === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                        </div>
                        <div className="space-y-2">
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              message.type === "user"
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-muted border shadow-sm"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          </div>
                          {message.suggestions && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-3 text-xs rounded-full hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
                                  onClick={() => handleSendMessage(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground px-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border-2 border-background shadow-sm">
                          <Bot className="h-5 w-5" />
                        </div>
                        <div className="rounded-2xl px-4 py-3 bg-muted border shadow-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <Separator />
              <div className="p-6 bg-muted/30">
                <div className="flex space-x-3">
                  <Input
                    placeholder="Ask me anything about your finances..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 h-12 rounded-xl border-2 focus:border-primary transition-colors"
                  />
                  <Button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isTyping}
                    className="h-12 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
