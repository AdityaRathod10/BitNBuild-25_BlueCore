"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Calculator,
  CreditCard,
  TrendingUp,
  PiggyBank,
  Target,
  Shield,
  FileText,
  ChevronDown,
  Bot,
  Bell,
  User,
  Database,
  HelpCircle,
  LogOut,
  Zap,
  Menu,
} from "lucide-react"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Investments",
    href: "/investments",
    icon: TrendingUp,
  },
  {
    title: "Budgeting",
    href: "/budgeting",
    icon: PiggyBank,
  },
  {
    title: "Tax Center",
    href: "/tax-center",
    icon: Calculator,
  },
  {
    title: "Credit Hub",
    href: "/credit-hub",
    icon: CreditCard,
  },
]

const moreNavItems = [
  {
    title: "Financial Goals",
    href: "/financial-goals",
    icon: Target,
  },
  {
    title: "Insurance",
    href: "/insurance",
    icon: Shield,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
]

const userMenuItems = [
  {
    title: "Profile Settings",
    href: "/profile",
    icon: User,
  },
  {
    title: "Data & Accounts",
    href: "/accounts",
    icon: Database,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
]

export function MainNav() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-105">
            <Zap className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground">TaxWise</h1>
            <p className="text-xs text-muted-foreground">AI Tax Assistant</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                  "hover:bg-accent/50 hover:text-accent-foreground hover:shadow-sm",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  isActive 
                    ? "bg-accent text-accent-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  "group-hover:scale-110",
                  isActive && "text-primary"
                )} />
                <span className="relative">
                  {item.title}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </span>
              </Link>
            )
          })}

          {/* More Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl px-4 py-2.5 transition-all duration-200 group"
                aria-label="More navigation options"
                aria-haspopup="true"
              >
                More
                <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl"
            >
              {moreNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link 
                      href={item.href} 
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors duration-200"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* AI Co-Pilot */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl px-3 py-2.5 transition-all duration-200 group" 
            asChild
          >
            <Link href="/ai-copilot" aria-label="Open AI Co-Pilot">
              <Bot className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:ml-2 sm:inline font-medium">AI Co-Pilot</span>
            </Link>
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl p-2.5 transition-all duration-200 group relative" 
            asChild
          >
            <Link href="/notifications" aria-label="View notifications">
              <Bell className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" aria-label="New notification" />
            </Link>
          </Button>

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl px-3 py-2.5 transition-all duration-200 group"
                aria-label="User menu"
                aria-haspopup="true"
              >
                <User className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl"
            >
              {userMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link 
                      href={item.href} 
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors duration-200"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                )
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive hover:bg-destructive/10 px-3 py-2.5 rounded-lg transition-colors duration-200"
                variant="destructive"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl p-2.5 transition-all duration-200"
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-xl border-l border-border/50">
              <div className="flex flex-col space-y-6 mt-6">
                {/* Mobile Logo */}
                <div className="flex items-center space-x-3 pb-4 border-b border-border/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-lg">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-foreground">TaxWise</h1>
                    <p className="text-xs text-muted-foreground">AI Tax Assistant</p>
                  </div>
                </div>

                {/* Mobile Navigation Items */}
                <nav className="flex flex-col space-y-2" role="navigation" aria-label="Mobile navigation">
                  {mainNavItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                          "hover:bg-accent/50 hover:text-accent-foreground",
                          isActive 
                            ? "bg-accent text-accent-foreground" 
                            : "text-muted-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    )
                  })}
                </nav>

                {/* Mobile User Actions */}
                <div className="pt-4 border-t border-border/50">
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/ai-copilot"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                    >
                      <Bot className="h-5 w-5" />
                      <span>AI Co-Pilot</span>
                    </Link>
                    <Link
                      href="/notifications"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                    >
                      <Bell className="h-5 w-5" />
                      <span>Notifications</span>
                    </Link>
                    {userMenuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      )
                    })}
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}