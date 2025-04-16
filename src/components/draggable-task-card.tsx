"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Task } from "@/lib/types"
import { TaskCard } from "./task-card"

interface DraggableTaskCardProps {
  task: Task
  isCalendarView?: boolean
}

export function DraggableTaskCard({ task, isCalendarView = false }: DraggableTaskCardProps) {
  // Set up draggable
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      task
    }
  })
  
  // Apply transform style when dragging
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 1
  }
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className="touch-manipulation cursor-grab active:cursor-grabbing"
    >
      <TaskCard 
        task={task} 
        isDragging={isDragging}
        isCalendarView={isCalendarView}
      />
    </div>
  )
}
