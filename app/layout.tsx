import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { OrganizationProvider } from "@/contexts/organization-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Project Management Tool",
  description: "A comprehensive project management tool",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <OrganizationProvider>
          {children}
        </OrganizationProvider>
      </body>
    </html>
  )
}

