"use client"

import { HeaderBar } from "@/components/header-bar"
import { MobileNavBar } from "@/components/mobile-nav-bar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderBar />
      <main className="flex-1">
        {children}
      </main>
      <MobileNavBar />
    </div>
  )
}
