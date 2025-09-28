import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { MainNav } from "@/components/navigation/main-nav"
import { AuthProvider } from "@/contexts/AuthContext"
import { UserDataProvider } from "@/contexts/UserDataContext"
import { ToastProvider } from "@/components/ui/toast-provider"
import { ChatToggleButton } from "@/components/chatbot/chat-toggle-button"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "TaxWise - AI Tax Assistant",
  description: "Smart tax optimization and financial management platform",
  generator: "TaxWise",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <UserDataProvider>
            <ToastProvider>
              <MainNav />
              <Suspense fallback={null}>{children}</Suspense>
              <ChatToggleButton />
              <Analytics />
            </ToastProvider>
          </UserDataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
