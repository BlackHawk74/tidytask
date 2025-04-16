"use client"

import { usePathname } from "next/navigation"
import { HeaderBar } from "@/components/header-bar"
import { MobileNavBar } from "@/components/mobile-nav-bar"
import { DesktopNav } from "@/components/desktop-nav"
import { FloatingAddButton } from "@/components/floating-add-button"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Don't show the add button on certain pages
  const hideAddButtonPaths = [
    "/app/profile",
    "/app/settings"
  ]
  
  const shouldShowAddButton = !hideAddButtonPaths.includes(pathname)
  
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderBar />
      <div className="flex flex-1">
        <DesktopNav />
        <main className="flex-1 md:ml-[80px] transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
      {shouldShowAddButton && <FloatingAddButton />}
      <MobileNavBar />
    </div>
  )
}
