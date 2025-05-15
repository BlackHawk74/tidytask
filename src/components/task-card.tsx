"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useStore } from "@/lib/store"
import { Task } from "@/lib/types"
import { calculateTaskProgress, formatRelativeDate, getPriorityColor } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SubtaskList } from "@/components/subtask-list"
import { TaskModal } from "@/components/task-modal"

interface TaskCardProps {
  task: Task
  isCalendarView?: boolean
  isDragging?: boolean
}

export function TaskCard({ task, isCalendarView = false, isDragging = false }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { familyMembers, completeTask } = useStore()
  
  const assigneeUser = familyMembers.find(member => member.user_id === task.assigned_to)
  const progress = calculateTaskProgress(task)
  
  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.02 }}
        className={`group ${isDragging ? 'shadow-lg' : ''} w-full`}
      >
        <Card className={`overflow-hidden ${task.completed ? 'opacity-70' : ''}`}>
          <CardHeader className="p-4 pb-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold">{task.title}</h3>
                {assigneeUser && (
                  <p className="text-xs text-muted-foreground">Assigned to: {assigneeUser.name}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                  {task.description}
                </p>
              </div>
              
              {assigneeUser && (
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarImage src={assigneeUser.avatarUrl} alt={assigneeUser.name || 'User'} />
                  <AvatarFallback style={{ backgroundColor: assigneeUser.color }}>
                    {assigneeUser.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-4 pt-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className={`rounded-full px-2 py-0.5 ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className="text-muted-foreground">
                {formatRelativeDate(task.deadline)}
              </span>
            </div>
            
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex items-center justify-between p-2 pt-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit
            </Button>
            
            <div className="flex items-center gap-1">
              {!task.completed && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => completeTask(task.id)}
                >
                  Complete
                </Button>
              )}
              
              {!isCalendarView && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
          
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t px-4 py-3"
            >
              <SubtaskList taskId={task.id} subtasks={task.subtasks || []} />
            </motion.div>
          )}
        </Card>
      </motion.div>
      
      <TaskModal 
        open={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen} 
        task={task}
        mode="edit"
      />
    </>
  )
}
