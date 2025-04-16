"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface LoadingAnimationProps {
  onComplete?: () => void
  delay?: number
}

export function LoadingAnimation({ onComplete, delay = 0 }: LoadingAnimationProps) {
  const [animationComplete, setAnimationComplete] = useState(false)
  
  // Handle animation completion
  useEffect(() => {
    if (animationComplete && onComplete) {
      const timer = setTimeout(() => {
        onComplete()
      }, 500) // Wait a bit after animation completes before triggering onComplete
      
      return () => clearTimeout(timer)
    }
  }, [animationComplete, onComplete])
  
  // Circle animation variants
  const circleVariants = {
    initial: { 
      pathLength: 0,
      opacity: 0,
    },
    animate: { 
      pathLength: 1,
      opacity: 1,
      transition: { 
        pathLength: { 
          type: "spring", 
          duration: 1.5,
          bounce: 0.3,
          delay: delay + 0.2
        },
        opacity: { duration: 0.3, delay: delay }
      }
    }
  }
  
  // Checkmark animation variants
  const checkVariants = {
    initial: { 
      pathLength: 0,
      opacity: 0
    },
    animate: { 
      pathLength: 1,
      opacity: 1,
      transition: { 
        pathLength: { 
          type: "spring", 
          duration: 0.8,
          bounce: 0.2,
          delay: delay + 1.5 
        },
        opacity: { duration: 0.3, delay: delay + 1.5 }
      }
    }
  }

  return (
    <div className="flex items-center justify-center h-full w-full">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay }}
        className="relative h-24 w-24"
        onAnimationComplete={() => {
          // Add a delay after the check mark appears
          setTimeout(() => setAnimationComplete(true), 800)
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="var(--primary)"
            strokeWidth="8"
            variants={circleVariants}
            initial="initial"
            animate="animate"
            className="drop-shadow-md"
          />
          
          {/* Check mark */}
          <motion.path
            d="M30 50L45 65L70 35"
            stroke="var(--primary)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={checkVariants}
            initial="initial"
            animate="animate"
            onAnimationComplete={() => {
              // Pulse effect when check mark completes
              const circle = document.querySelector('circle')
              if (circle) {
                circle.classList.add('animate-pulse')
              }
            }}
            className="drop-shadow-md"
          />
        </svg>
      </motion.div>
    </div>
  )
}

export function LoadingScreen({ onComplete, delay = 0 }: LoadingAnimationProps) {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <LoadingAnimation onComplete={onComplete} delay={delay} />
    </motion.div>
  )
}
