"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  BellRing,
  Check,
  AlertTriangle,
  TrendingUp,
  Calculator,
  CreditCard,
  Shield,
  PiggyBank,
  Calendar,
  Settings,
  Trash2,
} from "lucide-react"

interface Notification {
  id: string
  type: "tax" | "investment" | "credit" | "insurance" | "budget" | "general"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  priority: "high" | "medium" | "low"
  actionRequired?: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "tax",
    title: "Tax Filing Deadline Approaching",
    message: "Your ITR filing deadline is in 15 days. Complete your tax filing to avoid penalties.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
    priority: "high",
    actionRequired: true,
  },
  {
    id: "2",
    type: "investment",
    title: "SIP Due Tomorrow",
    message: "Your monthly SIP of ₹10,000 in HDFC Top 100 Fund is due tomorrow.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: false,
    priority: "medium",
  },
  {
    id: "3",
    type: "credit",
    title: "CIBIL Score Updated",
    message: "Your CIBIL score has increased from 742 to 756. Great improvement!",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRead: true,
    priority: "low",
  },
  {
    id: "4",
    type: "budget",
    title: "Budget Alert: Dining Expenses",
    message: "You've spent ₹8,500 on dining this month, which is 70% of your ₹12,000 budget.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRead: false,
    priority: "medium",
  },
  {
    id: "5",
    type: "insurance",
    title: "Health Insurance Renewal",
    message: "Your health insurance policy expires in 30 days. Renew now to avoid coverage gaps.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isRead: true,
    priority: "high",
    actionRequired: true,
  },
]

const notificationIcons = {
  tax: Calculator,
  investment: TrendingUp,
  credit: CreditCard,
  insurance: Shield,
  budget: PiggyBank,
  general: Bell,
}

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    taxReminders: true,
    investmentAlerts: true,
    creditUpdates: true,
    budgetAlerts: true,
    insuranceReminders: true,
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const highPriorityCount = notifications.filter((n) => n.priority === "high" && !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const handleSettingChange = (setting: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: value }))
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount} unread notifications
                {highPriorityCount > 0 && (
                  <span className="ml-2 text-red-600 font-medium">({highPriorityCount} high priority)</span>
                )}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <BellRing className="h-4 w-4" />
            <span>All Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Unread</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type]
                return (
                  <Card
                    key={notification.id}
                    className={`transition-all hover:shadow-md ${
                      !notification.isRead ? "border-l-4 border-l-primary bg-primary/5" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3
                                className={`font-medium text-sm ${
                                  !notification.isRead ? "text-foreground" : "text-muted-foreground"
                                }`}
                              >
                                {notification.title}
                              </h3>
                              <Badge variant="outline" className={`text-xs ${priorityColors[notification.priority]}`}>
                                {notification.priority}
                              </Badge>
                              {notification.actionRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{getRelativeTime(notification.timestamp)}</span>
                              </span>
                              <span className="capitalize">{notification.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {notifications
                .filter((n) => !n.isRead)
                .map((notification) => {
                  const Icon = notificationIcons[notification.type]
                  return (
                    <Card key={notification.id} className="border-l-4 border-l-primary bg-primary/5">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-medium text-sm">{notification.title}</h3>
                                <Badge variant="outline" className={`text-xs ${priorityColors[notification.priority]}`}>
                                  {notification.priority}
                                </Badge>
                                {notification.actionRequired && (
                                  <Badge variant="destructive" className="text-xs">
                                    Action Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{getRelativeTime(notification.timestamp)}</span>
                                </span>
                                <span className="capitalize">{notification.type}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                      <span>Email Notifications</span>
                      <span className="text-sm text-muted-foreground">Receive notifications via email</span>
                    </Label>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(value) => handleSettingChange("emailNotifications", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                      <span>Push Notifications</span>
                      <span className="text-sm text-muted-foreground">Receive browser push notifications</span>
                    </Label>
                    <Switch
                      id="push-notifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(value) => handleSettingChange("pushNotifications", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notifications" className="flex flex-col space-y-1">
                      <span>SMS Notifications</span>
                      <span className="text-sm text-muted-foreground">Receive notifications via SMS</span>
                    </Label>
                    <Switch
                      id="sms-notifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(value) => handleSettingChange("smsNotifications", value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tax-reminders" className="flex flex-col space-y-1">
                      <span>Tax Reminders</span>
                      <span className="text-sm text-muted-foreground">Filing deadlines, deduction alerts</span>
                    </Label>
                    <Switch
                      id="tax-reminders"
                      checked={notificationSettings.taxReminders}
                      onCheckedChange={(value) => handleSettingChange("taxReminders", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="investment-alerts" className="flex flex-col space-y-1">
                      <span>Investment Alerts</span>
                      <span className="text-sm text-muted-foreground">SIP due dates, portfolio updates</span>
                    </Label>
                    <Switch
                      id="investment-alerts"
                      checked={notificationSettings.investmentAlerts}
                      onCheckedChange={(value) => handleSettingChange("investmentAlerts", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="credit-updates" className="flex flex-col space-y-1">
                      <span>Credit Updates</span>
                      <span className="text-sm text-muted-foreground">CIBIL score changes, credit alerts</span>
                    </Label>
                    <Switch
                      id="credit-updates"
                      checked={notificationSettings.creditUpdates}
                      onCheckedChange={(value) => handleSettingChange("creditUpdates", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="budget-alerts" className="flex flex-col space-y-1">
                      <span>Budget Alerts</span>
                      <span className="text-sm text-muted-foreground">Spending limits, budget overruns</span>
                    </Label>
                    <Switch
                      id="budget-alerts"
                      checked={notificationSettings.budgetAlerts}
                      onCheckedChange={(value) => handleSettingChange("budgetAlerts", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="insurance-reminders" className="flex flex-col space-y-1">
                      <span>Insurance Reminders</span>
                      <span className="text-sm text-muted-foreground">Policy renewals, premium due dates</span>
                    </Label>
                    <Switch
                      id="insurance-reminders"
                      checked={notificationSettings.insuranceReminders}
                      onCheckedChange={(value) => handleSettingChange("insuranceReminders", value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
