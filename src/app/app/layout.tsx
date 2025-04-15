"use client"

import { HeaderBar } from "@/components/header-bar"
import { MobileNavBar } from "@/components/mobile-nav-bar"
import { DesktopNav } from "@/components/desktop-nav"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderBar />
      <div className="flex flex-1">
        <DesktopNav />
        <main className="flex-1 md:ml-[80px] transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
      <MobileNavBar />
    </div>
  )
}
