"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { useStore } from "@/lib/store"
import { Task } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { TaskCard } from "@/components/task-card"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const { tasks, selectedFamilyMember } = useStore()
  
  // Filter tasks based on selected family member
  const filteredTasks = selectedFamilyMember
    ? tasks.filter(task => task.assignee === selectedFamilyMember)
    : tasks
  
  // Get tasks for the selected date
  const tasksForSelectedDate = filteredTasks.filter(task => 
    isSameDay(new Date(task.deadline), selectedDate)
  )
  
  // Generate week view (7 days starting from the current week)
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i))
  
  return (
    <div className="container mx-auto py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6">Calendar</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Date Picker</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                Tasks for {format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasksForSelectedDate.length > 0 ? (
                  tasksForSelectedDate.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                    <p className="text-center text-sm text-muted-foreground">
                      No tasks scheduled for this date
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-medium mb-4">Week View</h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const dayTasks = filteredTasks.filter(task => 
                isSameDay(new Date(task.deadline), day)
              )
              const isSelected = isSameDay(day, selectedDate)
              
              return (
                <motion.div
                  key={day.toISOString()}
                  whileHover={{ scale: 1.02 }}
                  className="h-full"
                >
                  <Card 
                    className={`h-full cursor-pointer ${
                      isSelected ? 'border-primary' : ''
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <CardHeader className="p-3">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {format(day, "EEE")}
                        </p>
                        <p className={`text-lg ${
                          isSelected ? 'text-primary font-bold' : ''
                        }`}>
                          {format(day, "d")}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      {dayTasks.length > 0 ? (
                        <div className="space-y-2">
                          {dayTasks.slice(0, 2).map((task) => (
                            <div
                              key={task.id}
                              className="rounded-md bg-muted p-2 text-xs truncate"
                              style={{
                                borderLeftWidth: '4px',
                                borderLeftColor: task.priority === 'High' 
                                  ? '#EF4444' 
                                  : task.priority === 'Medium' 
                                    ? '#F59E0B' 
                                    : '#10B981'
                              }}
                            >
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <p className="text-center text-xs text-muted-foreground">
                              +{dayTasks.length - 2} more
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-center text-xs text-muted-foreground">
                          No tasks
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
