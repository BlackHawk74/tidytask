"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { Priority, Task, Subtask } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SubtaskList } from "@/components/subtask-list"

interface TaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task
  mode?: "create" | "edit"
}

export function TaskModal({ 
  open, 
  onOpenChange, 
  task, 
  mode = "create" 
}: TaskModalProps) {
  const { familyMembers, addTask, updateTask } = useStore()
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignee, setAssignee] = useState("")
  const [priority, setPriority] = useState<Priority>("Medium")
  const [date, setDate] = useState<Date>(new Date())
  const [tempId, setTempId] = useState("")
  const [tempSubtasks, setTempSubtasks] = useState<Subtask[]>([])
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  
  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && task) {
        setTitle(task.title || '')
        setDescription(task.description || '')
        setAssignee(task.assignee || '')
        setPriority(task.priority)
        // Safely parse the date with error handling
        try {
          setDate(task.due_date ? new Date(task.due_date) : new Date())
        } catch (error) {
          console.error('Error parsing date:', error)
          setDate(new Date())
        }
        setTempId(task.id)
        setTempSubtasks(task.subtasks || [])
      } else {
        // Default values for create mode
        setTitle("")
        setDescription("")
        setAssignee(familyMembers[0]?.id || "")
        setPriority("Medium")
        setDate(new Date())
        setTempId("")
        setTempSubtasks([])
      }
    }
  }, [open, mode, task, familyMembers])
  
  const handleSubmit = () => {
    if (!title.trim() || !assignee) return
    
    if (mode === "edit" && task) {
      updateTask(task.id, {
        title,
        description,
        assignee,
        priority,
        due_date: date.toISOString(),
      })
    } else {
      // Create a new task with required fields for database schema
      addTask({
        title,
        description,
        assignee,
        priority,
        due_date: date.toISOString(), // Use ISO string format for dates
        subtasks: tempSubtasks,
        completed: false,
        status: 'Upcoming',
        family_id: 'default', // Will be assigned by the store
        created_by: 'current_user', // Will be assigned by the store
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assigned_to: assignee // Use assigned_to to match database schema
      })
    }
    
    onOpenChange(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="assignee">Assign To</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select family member" />
                </SelectTrigger>
                <SelectContent>
                  {familyMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="deadline"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="mt-2">
            {mode === "edit" && task ? (
              <SubtaskList taskId={task.id} subtasks={task.subtasks || []} />
            ) : (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Subtasks</h3>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a new subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newSubtaskTitle.trim()) {
                        // Create subtask with all required fields for database schema
                        const newSubtask: Subtask = {
                          id: `temp-${Date.now()}-${tempSubtasks.length}`,
                          task_id: tempId || `temp-task-${Date.now()}`,
                          title: newSubtaskTitle.trim(),
                          completed: false,
                          created_at: new Date().toISOString()
                        }
                        setTempSubtasks([...tempSubtasks, newSubtask])
                        setNewSubtaskTitle("")
                      }
                    }}
                    className="h-9"
                  />
                  <Button 
                    onClick={() => {
                      if (newSubtaskTitle.trim()) {
                        // Create subtask with all required fields for database schema
                        const newSubtask: Subtask = {
                          id: `temp-${Date.now()}-${tempSubtasks.length}`,
                          task_id: tempId || `temp-task-${Date.now()}`,
                          title: newSubtaskTitle.trim(),
                          completed: false,
                          created_at: new Date().toISOString()
                        }
                        setTempSubtasks([...tempSubtasks, newSubtask])
                        setNewSubtaskTitle("")
                      }
                    }} 
                    size="sm" 
                    variant="secondary"
                    disabled={!newSubtaskTitle.trim()}
                    className="h-9 px-3"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add subtask</span>
                  </Button>
                </div>
                
                <AnimatePresence>
                  {tempSubtasks.length > 0 ? (
                    <ul className="space-y-2">
                      {tempSubtasks.map((subtask, index) => (
                        <motion.li
                          key={subtask.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2 rounded-md border bg-card p-2"
                        >
                          <Checkbox
                            id={`subtask-${subtask.id}`}
                            checked={subtask.completed}
                            onCheckedChange={(checked: boolean) => {
                              const updatedSubtasks = [...tempSubtasks]
                              updatedSubtasks[index] = {
                                ...subtask,
                                completed: checked
                              }
                              setTempSubtasks(updatedSubtasks)
                            }}
                          />
                          <label
                            htmlFor={`subtask-${subtask.id}`}
                            className={`flex-1 text-sm ${
                              subtask.completed ? "text-muted-foreground line-through" : ""
                            }`}
                          >
                            {subtask.title}
                          </label>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              const updatedSubtasks = tempSubtasks.filter((_, i) => i !== index)
                              setTempSubtasks(updatedSubtasks)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Delete subtask</span>
                          </Button>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-sm text-muted-foreground"
                    >
                      No subtasks yet
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !assignee}>
            {mode === "create" ? "Create Task" : "Update Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
