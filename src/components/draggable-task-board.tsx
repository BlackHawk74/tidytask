"use client"

import { useState } from "react"
import { 
  DndContext, 
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useStore } from "@/lib/store"
import { Task, TaskStatus } from "@/lib/types"
import { filterTasksByFamilyMember } from "@/lib/utils"
import { TaskCard } from "@/components/task-card"
import { DroppableTaskSection } from "@/components/droppable-task-section"

export function DraggableTaskBoard() {
  const { tasks, selectedFamilyMember, updateTask } = useStore()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  
  // Filter tasks based on selected family member
  const filteredTasks = filterTasksByFamilyMember(tasks, selectedFamilyMember)
  
  // Define the sections to display
  const sections: TaskStatus[] = ["Today", "Upcoming", "Completed", "Overdue"]
  
  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  // Handle drag start
  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const taskId = active.id as string
    const task = filteredTasks.find(t => t.id === taskId)
    
    if (task) {
      setActiveTask(task)
    }
  }
  
  // Handle drag end
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    
    if (!over) {
      setActiveTask(null)
      return
    }
    
    const taskId = active.id as string
    const targetStatus = over.id as TaskStatus
    
    // Update task status if dropped in a different section
    if (targetStatus && sections.includes(targetStatus)) {
      if (targetStatus === "Completed") {
        // Find the task to update its subtasks
        const task = filteredTasks.find(t => t.id === taskId)
        
        if (task) {
          // Mark all subtasks as completed
          const updatedSubtasks = (task.subtasks || []).map(subtask => ({
            ...subtask,
            completed: true
          }))
          
          // Mark task as completed and update all subtasks
          updateTask(taskId, { 
            completed: true,
            subtasks: updatedSubtasks
          })
        } else {
          // Fallback if task not found
          updateTask(taskId, { completed: true })
        }
      } else if (targetStatus === "Today" || targetStatus === "Upcoming" || targetStatus === "Overdue") {
        // For other statuses, we need to adjust the deadline
        const now = new Date()
        const newDeadline = new Date(now)
        
        if (targetStatus === "Upcoming") {
          // Set deadline to tomorrow
          newDeadline.setDate(now.getDate() + 1)
        } else if (targetStatus === "Overdue") {
          // Set deadline to yesterday
          newDeadline.setDate(now.getDate() - 1)
        }
        
        updateTask(taskId, { 
          completed: false,
          deadline: newDeadline.toISOString()
        })
      }
    }
    
    setActiveTask(null)
  }
  
  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <DroppableTaskSection 
              key={section} 
              status={section} 
              tasks={filteredTasks} 
            />
          ))}
        </div>
        
        {/* Drag overlay for the currently dragged task */}
        <DragOverlay>
          {activeTask ? (
            <div className="w-full max-w-sm opacity-80">
              <TaskCard task={activeTask} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
