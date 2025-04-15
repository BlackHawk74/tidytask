"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store"
import { TaskStatus } from "@/lib/types"
import { filterTasksByFamilyMember, filterTasksByStatus } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskCard } from "@/components/task-card"

export function TaskBoard() {
  const { tasks, selectedFamilyMember } = useStore()
  
  // Filter tasks based on selected family member
  const filteredTasks = filterTasksByFamilyMember(tasks, selectedFamilyMember)
  
  // Define the sections to display
  const sections: TaskStatus[] = ["Today", "Upcoming", "Completed", "Overdue"]
  
  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <TaskSection 
            key={section} 
            status={section} 
            tasks={filteredTasks} 
          />
        ))}
      </div>
    </div>
  )
}

interface TaskSectionProps {
  status: TaskStatus
  tasks: Array<any>
}

function TaskSection({ status, tasks }: TaskSectionProps) {
  const sectionTasks = filterTasksByStatus(tasks, status)
  
  const getSectionColor = (status: TaskStatus) => {
    switch (status) {
      case "Today":
        return "border-blue-200 dark:border-blue-800"
      case "Upcoming":
        return "border-purple-200 dark:border-purple-800"
      case "Completed":
        return "border-green-200 dark:border-green-800"
      case "Overdue":
        return "border-red-200 dark:border-red-800"
      default:
        return ""
    }
  }
  
  return (
    <Card className={`border-t-4 ${getSectionColor(status)}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{status}</CardTitle>
          <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
            {sectionTasks.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {sectionTasks.length > 0 ? (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {sectionTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-24 items-center justify-center rounded-md border border-dashed"
            >
              <p className="text-center text-sm text-muted-foreground">
                No tasks {status.toLowerCase()}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
