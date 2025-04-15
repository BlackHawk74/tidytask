"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Home, Plus, Bell, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TaskModal } from "@/components/task-modal"
import { cn } from "@/lib/utils"

export function MobileNavBar() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const pathname = usePathname()
  
  const navItems = [
    { icon: Home, label: "Home", href: "/app" },
    { icon: Bell, label: "Notifications", href: "/app/notifications" },
    { icon: User, label: "Profile", href: "/app/profile" },
  ]
  
  return (
    <>
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
          
          <div className="flex-1">
            <Button 
              onClick={() => setIsTaskModalOpen(true)}
              className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-none"
              variant="ghost"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs">Add Task</span>
            </Button>
          </div>
        </div>
      </motion.div>
      
      <TaskModal 
        open={isTaskModalOpen} 
        onOpenChange={setIsTaskModalOpen} 
      />
    </>
  )
}
