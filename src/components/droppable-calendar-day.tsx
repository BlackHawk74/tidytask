"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, isSameDay } from "date-fns"
import { useDroppable } from "@dnd-kit/core"
import { Task } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { DraggableTaskCard } from "@/components/draggable-task-card"

interface DroppableCalendarDayProps {
  date: Date
  tasks: Task[]
  isSelected?: boolean
  onSelect?: () => void
}

export function DroppableCalendarDay({ 
  date, 
  tasks, 
  isSelected = false,
  onSelect
}: DroppableCalendarDayProps) {
  const [isOver, setIsOver] = useState(false)
  
  // Create a unique ID for this date
  const dateId = `date-${date.toISOString()}`
  
  // Set up droppable area
  const { setNodeRef, isOver: dndIsOver } = useDroppable({
    id: dateId,
  })
  
  // Update local state when drag over status changes
  if (dndIsOver !== isOver) {
    setIsOver(dndIsOver)
  }
  
  // Format the date for display
  const dayName = format(date, "EEE")
  const dayNumber = format(date, "d")
  const isToday = isSameDay(date, new Date())
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-full"
      onClick={onSelect}
    >
      <Card 
        ref={setNodeRef}
        className={`h-full flex flex-col ${
          isSelected 
            ? 'border-primary ring-1 ring-primary' 
            : isOver 
              ? 'border-primary/50 bg-primary/5' 
              : ''
        } ${
          isToday && !isSelected 
            ? 'border-blue-400 dark:border-blue-600' 
            : ''
        } transition-all duration-200`}
      >
        <div className={`text-center py-2 ${
          isSelected 
            ? 'bg-primary text-primary-foreground' 
            : isToday 
              ? 'bg-blue-100 dark:bg-blue-900/30' 
              : 'bg-muted/50'
        }`}>
          <div className="font-medium">{dayName}</div>
          <div className="text-xl">{dayNumber}</div>
        </div>
        
        <CardContent className="flex-1 p-2 overflow-y-auto">
          <AnimatePresence>
            {tasks.length > 0 ? (
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
              >
                {tasks.map((task) => (
                  <DraggableTaskCard 
                    key={task.id} 
                    task={task} 
                    isCalendarView={true} 
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex h-full items-center justify-center rounded-md ${
                  isOver ? 'bg-primary/10 border border-dashed border-primary' : ''
                }`}
              >
                {isOver ? (
                  <p className="text-center text-xs text-primary font-medium">
                    Drop task here
                  </p>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
