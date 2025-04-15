"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TaskModal } from "@/components/task-modal"
import { NotificationCenter } from "@/components/notification-center"

export function HeaderBar() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const { familyMembers, selectedFamilyMember, selectFamilyMember } = useStore()
  
  // Get current time to display greeting
  const currentHour = new Date().getHours()
  let greeting = "Good evening"
  if (currentHour < 12) {
    greeting = "Good morning"
  } else if (currentHour < 18) {
    greeting = "Good afternoon"
  }
  
  // Get selected family member or first member as default
  const activeMember = selectedFamilyMember 
    ? familyMembers.find(m => m.id === selectedFamilyMember) 
    : familyMembers[0]
  
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold"
          >
            TidyTask
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden md:block text-sm text-muted-foreground"
          >
            {greeting}, {activeMember?.name || "there"}!
          </motion.div>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <span>Family</span>
                {activeMember && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activeMember.avatarUrl} alt={activeMember.name} />
                    <AvatarFallback style={{ backgroundColor: activeMember.color }}>
                      {activeMember.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Family Members</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => selectFamilyMember(null)}>
                  Everyone
                </DropdownMenuItem>
                {familyMembers.map((member) => (
                  <DropdownMenuItem 
                    key={member.id}
                    onClick={() => selectFamilyMember(member.id)}
                    className="flex items-center gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback style={{ backgroundColor: member.color }}>
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                    {member.role === 'Admin' && (
                      <span className="ml-auto text-xs text-muted-foreground">Admin</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <NotificationCenter />
          
          <ThemeToggle />
          
          <Button onClick={() => setIsTaskModalOpen(true)} size="icon" className="rounded-full">
            <Plus className="h-5 w-5" />
            <span className="sr-only">Add Task</span>
          </Button>
        </div>
      </div>
      
      <TaskModal 
        open={isTaskModalOpen} 
        onOpenChange={setIsTaskModalOpen} 
      />
    </header>
  )
}
