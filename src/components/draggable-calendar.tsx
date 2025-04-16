"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
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
import { Task } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { TaskCard } from "@/components/task-card"
import { DraggableTaskCard } from "@/components/draggable-task-card"
import { DroppableCalendarDay } from "./droppable-calendar-day"

export function DraggableCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const { tasks, selectedFamilyMember, updateTask } = useStore()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  
  // Filter tasks based on selected family member
  const filteredTasks = selectedFamilyMember
    ? tasks.filter(task => task.assignee === selectedFamilyMember)
    : tasks
  
  // Get tasks for the selected date
  const tasksForSelectedDate = filteredTasks.filter(task => {
    const taskDate = new Date(task.deadline);
    return isSameDay(taskDate, selectedDate);
  })
  
  // Generate week view (7 days starting from the current week)
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i))
  
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
    const targetDateStr = over.id as string
    
    // Only process if the drop target is a date
    if (targetDateStr && targetDateStr.startsWith('date-')) {
      const dateString = targetDateStr.replace('date-', '')
      const targetDate = new Date(dateString)
      
      // Update task deadline to the new date
      updateTask(taskId, { 
        deadline: targetDate.toISOString()
      })
      
      // If the new date is the selected date, we don't need to change it
      if (!isSameDay(targetDate, selectedDate)) {
        setSelectedDate(targetDate)
      }
    }
    
    setActiveTask(null)
  }
  
  return (
    <div className="container mx-auto py-4 px-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-4">Calendar</h1>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1 h-full overflow-hidden">
              <CardHeader className="pb-1 pt-3 px-3 text-center">
                <CardTitle className="text-base">Date Picker</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex items-center justify-center">
                <div className="max-w-md mx-auto">
                  <style jsx global>{`
                    .dynamic-calendar {
                      width: 100%;
                      max-width: 300px;
                      margin: 0 auto;
                    }
                    .dynamic-calendar table {
                      width: 100%;
                      border-spacing: 0.15rem;
                      margin: 0 auto;
                    }
                    .dynamic-calendar thead {
                      margin-bottom: 0.25rem;
                    }
                    .dynamic-calendar th {
                      text-align: center;
                      font-size: clamp(0.75rem, 1.2vw, 0.9rem);
                      padding: 0.25rem 0;
                      font-weight: 600;
                    }
                    .dynamic-calendar thead tr,
                    .dynamic-calendar tbody tr {
                      display: flex;
                      justify-content: space-between;
                      width: 100%;
                    }
                    .dynamic-calendar td {
                      text-align: center;
                      padding: 0;
                    }
                    .dynamic-calendar button {
                      width: 2.2rem;
                      height: 2.2rem;
                      font-size: 0.9rem;
                    }
                  `}</style>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(new Date(date));
                      }
                    }}
                    className="rounded-md w-full dynamic-calendar"
                    classNames={{
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 h-full">
              <CardHeader className="pb-1 pt-3 px-3 text-center">
                <CardTitle className="text-base">
                  Tasks for {format(selectedDate, "MMMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col h-full">
                  <DroppableCalendarDay 
                    date={selectedDate}
                    tasks={tasksForSelectedDate}
                  />
                  
                  <div className="w-full border-t border-border my-2"></div>
                  
                  {tasksForSelectedDate.length > 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {tasksForSelectedDate.slice(2, 4).map((task) => (
                        <DraggableTaskCard key={task.id} task={task} isCalendarView={true} />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-0 border-t border-border pt-3">
            <h2 className="text-xl font-medium mb-3">Week View</h2>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3" style={{ minHeight: "200px" }}>
              {weekDays.map((day) => {
                const dayTasks = filteredTasks.filter(task => 
                  isSameDay(new Date(task.deadline), day)
                )
                const isSelected = isSameDay(day, selectedDate)
                
                return (
                  <DroppableCalendarDay
                    key={day.toISOString()}
                    date={day}
                    tasks={dayTasks}
                    isSelected={isSelected}
                    onSelect={() => setSelectedDate(day)}
                  />
                )
              })}
            </div>
          </div>
          
          {/* Drag overlay for the currently dragged task */}
          <DragOverlay>
            {activeTask ? (
              <div className="w-full max-w-sm opacity-80">
                <TaskCard task={activeTask} isDragging isCalendarView={true} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </motion.div>
    </div>
  )
}
