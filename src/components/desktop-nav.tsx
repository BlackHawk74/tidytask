"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Home, 
  Bell, 
  User, 
  Calendar, 
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DesktopNav() {
  const [expanded, setExpanded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const pathname = usePathname()
  const { familyMembers, selectedFamilyMember, selectFamilyMember } = useStore()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Function to manually toggle the expanded state
  const toggleExpanded = () => {
    setExpanded(prev => !prev)
    
    // If we're collapsing manually, clear any auto-expand timeout
    if (expanded) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }
  
  // Expand when hovering
  const handleMouseEnter = () => {
    setIsHovering(true)
    setExpanded(true)
    
    // Clear any collapse timeout when hovering
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }
  
  // Start collapse timer when mouse leaves
  const handleMouseLeave = () => {
    setIsHovering(false)
    
    // Set timeout to collapse after mouse leaves
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      setExpanded(false)
    }, 2000) // Collapse after 2 seconds
  }
  
  // Collapse after navigation
  useEffect(() => {
    // When the path changes, collapse the nav after a delay
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      if (!isHovering) {
        setExpanded(false)
      }
    }, 1500) // Collapse 1.5 seconds after navigation
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  // Family member selection is handled in the dropdown
  
  const navItems = [
    { icon: Home, label: "Dashboard", href: "/app" },
    { icon: Bell, label: "Notifications", href: "/app/notifications" },
    { icon: Calendar, label: "Calendar", href: "/app/calendar" },
  ]
  
  return (
    <motion.div 
      className="hidden md:flex fixed left-0 top-16 bottom-0 z-10 flex-col border-r bg-background/80 backdrop-blur-sm"
      initial={{ width: expanded ? 240 : 80 }}
      animate={{ width: expanded ? 240 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-6">
          {expanded && (
            <motion.h3 
              className="text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Navigation
            </motion.h3>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto" 
            onClick={toggleExpanded}
          >
            {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant={isActive ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start",
                    expanded ? "px-3" : "px-0 justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {expanded && (
                    <motion.span 
                      className="ml-3"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Button>
              </Link>
            )
          })}
        </div>
        
        <div className="mt-auto">
          <div className="space-y-2">
            <h4 className={cn(
              "text-xs font-medium text-muted-foreground",
              expanded ? "px-3 mb-2" : "text-center"
            )}>
              {expanded ? "Family Members" : "Family"}
            </h4>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                expanded ? "px-3" : "px-0 justify-center",
                selectedFamilyMember === null && "bg-accent/50"
              )}
              onClick={() => selectFamilyMember(null)}
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  All
                </AvatarFallback>
              </Avatar>
              {expanded && (
                <motion.span 
                  className="ml-3"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  transition={{ delay: 0.1 }}
                >
                  Everyone
                </motion.span>
              )}
            </Button>
            
            {familyMembers.map((member) => (
              <Button
                key={member.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  expanded ? "px-3" : "px-0 justify-center",
                  selectedFamilyMember === member.id && "bg-accent/50"
                )}
                onClick={() => selectFamilyMember(member.id)}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback style={{ backgroundColor: member.color }}>
                    {member.name ? member.name.charAt(0) : '?'}
                  </AvatarFallback>
                </Avatar>
                {expanded && (
                  <motion.span 
                    className="ml-3 truncate"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    transition={{ delay: 0.1 }}
                  >
                    {member.name}
                  </motion.span>
                )}
              </Button>
            ))}
            
            <div className="pt-4 mt-4 border-t">
              <Link href="/app/profile">
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start mb-2",
                    expanded ? "px-3" : "px-0 justify-center",
                    pathname === "/app/profile" && "bg-accent/50"
                  )}
                >
                  <User className="h-5 w-5" />
                  {expanded && (
                    <motion.span 
                      className="ml-3"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      transition={{ delay: 0.1 }}
                    >
                      Profile
                    </motion.span>
                  )}
                </Button>
              </Link>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50",
                  expanded ? "px-3" : "px-0 justify-center"
                )}
                onClick={() => window.location.href = "/"}
              >
                <LogOut className="h-5 w-5" />
                {expanded && (
                  <motion.span 
                    className="ml-3"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    transition={{ delay: 0.1 }}
                  >
                    Logout
                  </motion.span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
