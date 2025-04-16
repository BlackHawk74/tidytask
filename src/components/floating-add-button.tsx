"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { TaskModal } from "@/components/task-modal"

export function FloatingAddButton() {
  const [showTaskModal, setShowTaskModal] = useState(false)
  
  return (
    <>
      <motion.div 
        className="fixed bottom-20 right-6 md:bottom-6 md:right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button 
          onClick={() => setShowTaskModal(true)}
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>
      
      <TaskModal 
        open={showTaskModal} 
        onOpenChange={setShowTaskModal} 
        mode="create" 
      />
    </>
  )
}
