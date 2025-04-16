"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDroppable } from "@dnd-kit/core"
import { Task, TaskStatus } from "@/lib/types"
import { filterTasksByStatus } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DraggableTaskCard } from "@/components/draggable-task-card"

interface TaskSectionProps {
  status: TaskStatus
  tasks: Task[]
}

export function DroppableTaskSection({ status, tasks }: TaskSectionProps) {
  const sectionTasks = filterTasksByStatus(tasks, status)
  const [isOver, setIsOver] = useState(false)
  
  // Set up droppable area
  const { setNodeRef, isOver: dndIsOver } = useDroppable({
    id: status,
  })
  
  // Update local state when drag over status changes
  if (dndIsOver !== isOver) {
    setIsOver(dndIsOver)
  }
  
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
    <Card 
      className={`border-t-4 ${getSectionColor(status)} ${isOver ? 'ring-2 ring-primary' : ''} transition-all duration-200`}
      ref={setNodeRef}
    >
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
                <DraggableTaskCard key={task.id} task={task} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex h-24 items-center justify-center rounded-md border border-dashed ${isOver ? 'bg-primary/10' : ''}`}
            >
              <p className="text-center text-sm text-muted-foreground">
                {isOver ? "Drop task here" : `No tasks ${status.toLowerCase()}`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
