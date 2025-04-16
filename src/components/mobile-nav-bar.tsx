"use client"

import { motion } from "framer-motion"
import { Home, Bell, Calendar, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MobileNavBar() {
  const pathname = usePathname()
  
  const navItems = [
    { icon: Home, label: "Dashboard", href: "/app" },
    { icon: Bell, label: "Notifications", href: "/app/notifications" },
    { icon: Calendar, label: "Calendar", href: "/app/calendar" },
    { icon: User, label: "Profile", href: "/app/profile" },
  ]
  
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-10 block md:hidden border-t bg-background/80 backdrop-blur-sm"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <Button 
                variant="ghost" 
                className={cn(
                  "flex h-full w-full flex-col items-center justify-center gap-1 rounded-none",
                  isActive && "text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
