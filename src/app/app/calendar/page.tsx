"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { TaskCard } from "@/components/task-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CalendarPage() {
  // Use a client-side only flag to prevent hydration mismatches
  const [isClient, setIsClient] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [weekDays, setWeekDays] = useState<Date[]>([])
  const { tasks, selectedFamilyMember, familyMembers } = useStore()
  
  // Initialize dates on client-side only to avoid hydration errors
  useEffect(() => {
    setIsClient(true)
    setSelectedDate(new Date())
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    setWeekDays(Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)))
  }, [])
  
  // Filter tasks based on selected family member
  const filteredTasks = selectedFamilyMember
    ? tasks.filter(task => task.assignee === selectedFamilyMember)
    : tasks
  
  // Get tasks for the selected date (only if selectedDate is available)
  const tasksForSelectedDate = selectedDate ? filteredTasks.filter(task => {
    // Safely handle potentially undefined or invalid deadline
    if (!task.deadline) return false;
    try {
      const taskDate = new Date(task.deadline);
      return !isNaN(taskDate.getTime()) && isSameDay(taskDate, selectedDate);
    } catch (e) { 
      console.error("Error parsing task deadline for selected date:", task.deadline, e);
      return false;
    }
  }) : []
  
  // Only render date-dependent content on the client side
  if (!isClient || !selectedDate) {
    return (
      <div className="container mx-auto py-4 px-2">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-center">
            <div className="h-8 w-32 bg-muted rounded mb-4 mx-auto"></div>
            <div className="h-64 w-full max-w-3xl bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-4 px-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-4">Calendar</h1>
        
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  {tasksForSelectedDate.length > 0 ? (
                    tasksForSelectedDate.slice(0, 2).map((task) => (
                      <TaskCard key={task.id} task={task} isCalendarView={true} />
                    ))
                  ) : (
                    <div className="col-span-2 flex h-16 items-center justify-center rounded-md border border-dashed">
                      <p className="text-center text-sm text-muted-foreground">
                        No tasks scheduled for this date
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="w-full border-t border-border my-2"></div>
                
                {tasksForSelectedDate.length > 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {tasksForSelectedDate.slice(2, 4).map((task) => (
                      <TaskCard key={task.id} task={task} isCalendarView={true} />
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
              const dayTasks = filteredTasks.filter(task => {
                // Safely handle potentially undefined or invalid deadline
                if (!task.deadline) return false;
                try {
                  const taskDate = new Date(task.deadline);
                  return !isNaN(taskDate.getTime()) && isSameDay(taskDate, day);
                } catch (e) {
                  console.error("Error parsing task deadline for week view:", task.deadline, e);
                  return false;
                }
              })
              const isSelected = isSameDay(day, selectedDate)
              
              return (
                <motion.div
                  key={day.toISOString()}
                  whileHover={{ scale: 1.02 }}
                  className="h-full"
                  onClick={() => setSelectedDate(day)}
                >
                  <Card className={`h-full flex flex-col ${isSelected ? 'border-primary ring-1 ring-primary' : ''} ${isSameDay(day, new Date()) && !isSelected ? 'border-blue-400 dark:border-blue-600' : ''}`}>
                    <div className={`text-center py-2 ${isSelected ? 'bg-primary text-primary-foreground' : isSameDay(day, new Date()) ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-muted/50'}`}>
                      <div className="font-medium">{format(day, "EEE")}</div>
                      <div className="text-xl">{format(day, "d")}</div>
                    </div>
                    <CardContent className="flex-1 p-2 overflow-y-auto">
                      {dayTasks.length > 0 ? (
                        <div className="space-y-2">
                          {dayTasks
                            .sort((a, b) => {
                              // Sort by priority: High, Medium, Low
                              const priorityOrder = { High: 0, Medium: 1, Low: 2 };
                              return priorityOrder[a.priority] - priorityOrder[b.priority];
                            })
                            .slice(0, 2)
                            .map((task) => (
                              <div 
                                key={task.id} 
                                className={`p-2 rounded-md border-l-4 ${task.priority === 'High' ? 'border-l-red-500 bg-red-50 dark:bg-red-950/20' : task.priority === 'Medium' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' : 'border-l-green-500 bg-green-50 dark:bg-green-950/20'}`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium truncate">{task.title}</div>
                                  {task.assignee && (
                                    <Avatar className="h-6 w-6 ml-1 flex-shrink-0">
                                      <AvatarImage src={familyMembers.find((m) => m.id === task.assignee)?.avatarUrl} />
                                      <AvatarFallback className={`text-xs ${familyMembers.find((m) => m.id === task.assignee)?.color}`}>
                                        {/* Add optional chaining for name before substring */}
                                        {familyMembers.find((m) => m.id === task.assignee)?.name?.substring(0, 2) ?? '?'}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                </div>
                              </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <div className="text-center text-xs text-muted-foreground">
                              +{dayTasks.length - 2} more
                            </div>
                          )}
                        </div>
                      ) : null}
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
