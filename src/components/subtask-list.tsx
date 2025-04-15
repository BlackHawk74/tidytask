"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { Subtask } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface SubtaskListProps {
  taskId: string
  subtasks: Subtask[]
}

export function SubtaskList({ taskId, subtasks }: SubtaskListProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const { addSubtask, updateSubtask, deleteSubtask } = useStore()
  
  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      addSubtask(taskId, {
        title: newSubtaskTitle.trim(),
        completed: false
      })
      setNewSubtaskTitle("")
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddSubtask()
    }
  }
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Subtasks</h3>
      
      <div className="flex gap-2">
        <Input
          placeholder="Add a new subtask..."
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-9"
        />
        <Button 
          onClick={handleAddSubtask} 
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
        {subtasks.length > 0 ? (
          <ul className="space-y-2">
            {subtasks.map((subtask) => (
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
                  onCheckedChange={(checked) => 
                    updateSubtask(taskId, subtask.id, checked as boolean)
                  }
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
                  onClick={() => deleteSubtask(taskId, subtask.id)}
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
  )
}
