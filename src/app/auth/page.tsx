"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, CheckCircle2, Circle, Pencil, Bell, User, Calendar } from "lucide-react"
import { LoadingScreen } from "@/components/loading-animation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types for our components
interface NotificationData {
  id: number
  text: string
  time: string
  avatar: string
  name: string
  type: "complete" | "assign" | "add"
  taskText?: string
  taskColor?: string
}

interface NotificationEvent {
  type: "assign" | "add"
  taskText: string
  taskColor: string
  timestamp: number
}

interface Task {
  id: number
  text: string
  completed: boolean
  color: string
  isNew?: boolean
  assignee?: string
}

interface NotificationAnimationProps {
  onNotification: (event: NotificationEvent) => void
}

interface TaskAnimationProps {
  notificationEvent: NotificationEvent | null
}

// Notification Component
function NotificationAnimation({ onNotification }: NotificationAnimationProps) {
  // Local notification state
  const [currentNotification, setCurrentNotification] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  
  // Track which notifications have been read
  const [readStatus, setReadStatus] = useState({
    1: false,
    2: false,
    3: true,
    4: true,
  })
  
  // Notification data
  const [notifications] = useState<NotificationData[]>([  
    { id: 1, text: "Mom completed 'Take out the trash'!", time: "2m ago", avatar: "/avatars/mom.png", name: "Mom", type: "complete" },
    { id: 2, text: "Dad assigned you 'Mow the lawn'", time: "10m ago", avatar: "/avatars/dad.png", name: "Dad", type: "assign", taskText: "Mow the lawn", taskColor: "#2563eb" },
    { id: 3, text: "Sister completed 'Clean the kitchen'!", time: "25m ago", avatar: "/avatars/sister.png", name: "Emma", type: "complete" },
    { id: 4, text: "New family task added: 'Grocery shopping'", time: "1h ago", avatar: "/avatars/brother.png", name: "Jake", type: "add", taskText: "Grocery shopping", taskColor: "#ea580c" },
  ])
  
  useEffect(() => {
    // Animation sequence for notifications
    const interval = setInterval(() => {
      // Trigger notification event first
      const currentNotif = notifications[currentNotification]
      if (currentNotif.type === 'assign' || currentNotif.type === 'add') {
        if (currentNotif.taskText && currentNotif.taskColor) {
          onNotification({
            type: currentNotif.type,
            taskText: currentNotif.taskText,
            taskColor: currentNotif.taskColor,
            timestamp: Date.now()
          })
        }
      }
      
      // Then show notification
      setShowNotification(true)
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false)
        
        // Move to next notification after hiding
        setTimeout(() => {
          setCurrentNotification(prev => (prev + 1) % notifications.length)
          
          // Mark as read
          setReadStatus(prev => ({
            ...prev,
            [notifications[currentNotification].id]: true
          }))
        }, 500)
      }, 3000)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [currentNotification, notifications.length])
  
  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} /* Apple's cubic-bezier curve */
          className="absolute -top-16 right-0 w-64 bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden z-50 border border-gray-100 dark:bg-gray-800/90 dark:border-gray-700"
        >
          <div className="flex items-start p-3">
            <div className="flex-shrink-0 mr-3">
              <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <div className="h-full w-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                  {notifications[currentNotification].name.charAt(0)}
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {notifications[currentNotification].text}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {notifications[currentNotification].time}
              </p>
            </div>
            <motion.div 
              className="ml-2 flex-shrink-0 h-4 w-4 rounded-full bg-primary"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: 2 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Animated Task Component
function TaskAnimation({ notificationEvent }: TaskAnimationProps) {
  // Define a local handleNotification function
  const handleNotification = (event: NotificationEvent) => {
    // This function is just for demonstration in the animation
    console.log('Task animation received notification:', event);
  }
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Pick up groceries", completed: false, color: "#9333ea", assignee: "Mom" },
    { id: 2, text: "Mow the lawn", completed: false, color: "#3b82f6", assignee: "Dad" },
    { id: 3, text: "Take out trash", completed: false, color: "#f97316", assignee: "Alex" },
    { id: 4, text: "Walk the dog", completed: false, color: "#10b981", assignee: "Emma" },
    { id: 5, text: "Clean bedroom", completed: false, color: "#ec4899", assignee: "Jake" },
  ])
  
  // Listen for notification events to add new tasks
  useEffect(() => {
    if (notificationEvent && (notificationEvent.type === 'assign' || notificationEvent.type === 'add')) {
      // Add the new task with an animation
      const newTask: Task = {
        id: Date.now(),
        text: notificationEvent.taskText,
        completed: false,
        color: notificationEvent.taskColor,
        isNew: true,
        assignee: ['Mom', 'Dad', 'Alex', 'Emma', 'Jake'][Math.floor(Math.random() * 5)]
      }
      
      // First add the task
      setTasks(prev => [newTask, ...prev])
      
      // Set it as active after a brief delay
      setTimeout(() => {
        setActiveTask(0)
        setCameraPosition({ x: 0, y: 0 })
      }, 300)
      
      // Remove the "new" flag after animation completes
      setTimeout(() => {
        setTasks(prev => 
          prev.map(task => 
            task.id === newTask.id ? { ...task, isNew: false } : task
          )
        )
      }, 2500)
    }
  }, [notificationEvent])
  
  const [activeTask, setActiveTask] = useState(0)
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    // Animation sequence
    const interval = setInterval(() => {
      // First highlight the next task without completing it
      setActiveTask(prev => {
        const next = (prev + 1) % tasks.length
        
        // Move camera to focus on the active task with a smooth spring animation
        setCameraPosition({
          x: 0,
          y: -next * 12
        })
        
        return next
      })
      
      // Mark task as completed with a delay for better visual flow
      setTimeout(() => {
        setTasks(prev => {
          return prev.map((task, index) => {
            if (index === activeTask) {
              return { ...task, completed: true }
            }
            return task
          })
        })
      }, 1200)
      
    }, 2500)
    
    return () => clearInterval(interval)
  }, [activeTask, tasks.length])
  
  return (
    <motion.div 
      className="relative bg-white/30 backdrop-blur-sm rounded-lg p-6 shadow-xl border-2 border-white/40 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.4), rgba(255,255,255,0.2))' }}
    >
      <NotificationAnimation onNotification={handleNotification} />
      
      {/* Floating action buttons with pop-out effect */}
      <div className="absolute -right-10 top-1/4 flex flex-col gap-8">
        {/* Notification button */}
        <motion.div 
          className="group relative"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Connector line */}
          <motion.div 
            className="absolute top-1/2 right-full w-6 h-0.5 bg-gradient-to-r from-transparent to-white/50"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          />
          
          {/* Button */}
          <motion.div 
            className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-400/80 to-purple-600/80 backdrop-blur-md flex items-center justify-center"
            style={{ 
              boxShadow: '0 8px 20px rgba(147, 51, 234, 0.3), 0 0 0 2px rgba(255,255,255,0.5), inset 0 -2px 10px rgba(0,0,0,0.2)' 
            }}
            whileHover={{ 
              scale: 1.15, 
              boxShadow: '0 10px 25px rgba(147, 51, 234, 0.4), 0 0 0 3px rgba(255,255,255,0.6), inset 0 -2px 10px rgba(0,0,0,0.2)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="h-6 w-6 text-white drop-shadow-md" />
            
            {/* Glow effect */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-purple-400/20"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
        
        {/* Profile button */}
        <motion.div 
          className="group relative"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Connector line */}
          <motion.div 
            className="absolute top-1/2 right-full w-6 h-0.5 bg-gradient-to-r from-transparent to-white/50"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
          
          {/* Button */}
          <motion.div 
            className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400/80 to-blue-600/80 backdrop-blur-md flex items-center justify-center"
            style={{ 
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3), 0 0 0 2px rgba(255,255,255,0.5), inset 0 -2px 10px rgba(0,0,0,0.2)' 
            }}
            whileHover={{ 
              scale: 1.15, 
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4), 0 0 0 3px rgba(255,255,255,0.6), inset 0 -2px 10px rgba(0,0,0,0.2)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="h-6 w-6 text-white drop-shadow-md" />
          </motion.div>
        </motion.div>
        
        {/* Calendar button */}
        <motion.div 
          className="group relative"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Connector line */}
          <motion.div 
            className="absolute top-1/2 right-full w-6 h-0.5 bg-gradient-to-r from-transparent to-white/50"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          />
          
          {/* Button */}
          <motion.div 
            className="h-14 w-14 rounded-full bg-gradient-to-br from-orange-400/80 to-orange-600/80 backdrop-blur-md flex items-center justify-center"
            style={{ 
              boxShadow: '0 8px 20px rgba(249, 115, 22, 0.3), 0 0 0 2px rgba(255,255,255,0.5), inset 0 -2px 10px rgba(0,0,0,0.2)' 
            }}
            whileHover={{ 
              scale: 1.15, 
              boxShadow: '0 10px 25px rgba(249, 115, 22, 0.4), 0 0 0 3px rgba(255,255,255,0.6), inset 0 -2px 10px rgba(0,0,0,0.2)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar className="h-6 w-6 text-white drop-shadow-md" />
          </motion.div>
        </motion.div>
      </div>
      <div className="sticky top-0 z-10 bg-white/30 backdrop-blur-md p-4 -mx-4 -mt-4 mb-6 border-b border-white/20 rounded-t-lg shadow-sm">
        <h3 className="text-xl font-semibold text-white drop-shadow-md flex items-center">
          <span>Today's Tasks</span>
          <motion.span 
            className="ml-2 bg-primary/20 text-primary text-xs py-1 px-2 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            {tasks.filter(t => !t.completed).length} remaining
          </motion.span>
        </h3>
      </div>
      
      <div className="relative overflow-hidden" style={{ maxHeight: "350px" }}>
        <motion.div 
          className="space-y-4 pt-2"
          animate={{ y: cameraPosition.y }}
          transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.5 }}
        >
        {tasks.map((task, index) => (
          <motion.div 
            key={task.id}
            className={`flex items-center gap-4 p-4 rounded-md ${task.isNew ? 'bg-primary/20 ring-2 ring-primary/50' : index === activeTask ? 'bg-white/40 ring-2 ring-white/70' : 'bg-white/20'} shadow-md`}
            initial={task.isNew ? { opacity: 0, height: 0, y: -20 } : { opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              height: 'auto',
              y: 0,
              scale: task.isNew ? 1.05 : index === activeTask ? 1.05 : 1,
              boxShadow: index === activeTask ? '0 8px 16px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              delay: task.isNew ? 0 : index * 0.05,
              scale: { type: "spring", stiffness: 300, damping: 20 }
            }}
            layout
          >
            <motion.div 
              className="flex-shrink-0"
              animate={task.completed ? { scale: [1, 1.5, 1], rotate: [0, 10, 0] } : {}}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              {task.completed ? (
                <CheckCircle2 className="h-7 w-7 text-green-400 drop-shadow-md" />
              ) : index === activeTask ? (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 1 }}
                >
                  <Pencil className="h-7 w-7 text-white drop-shadow-md" />
                </motion.div>
              ) : (
                <Circle className="h-7 w-7 text-white/80 drop-shadow-md" />
              )}
            </motion.div>
            
            <div className="flex-1">
              <motion.p 
                className={`text-base font-medium ${task.completed ? 'line-through text-white/70' : 'text-white'} drop-shadow-sm`}
                animate={index === activeTask && !task.completed ? 
                  { scale: [1, 1.03, 1], x: [0, 2, 0], color: ['#ffffff', '#f8f8f8', '#ffffff'] } : 
                  task.completed ? { opacity: [1, 0.7, 0.7] } : {}
                }
                transition={{ duration: 0.8, repeat: task.completed ? 0 : 1, ease: "easeInOut" }}
              >
                {task.text}
              </motion.p>
              {task.assignee && (
                <motion.p 
                  className="text-xs text-white/60 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Assigned to: {task.assignee}
                </motion.p>
              )}
            </div>
            
            <motion.div 
              className="h-4 w-4 rounded-full shadow-md"
              style={{ backgroundColor: task.color }}
              animate={index === activeTask ? 
                { scale: [1, 1.4, 1], boxShadow: ['0px 0px 0px rgba(0,0,0,0.2)', '0px 0px 8px rgba(0,0,0,0.5)', '0px 0px 0px rgba(0,0,0,0.2)'] } : 
                {}
              }
              transition={{ duration: 0.8, repeat: index === activeTask ? 1 : 0, repeatType: "reverse" }}
            />
          </motion.div>
        ))}
        </motion.div>
        
        {/* Gradient overlay at the bottom for a fading effect */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/30 to-transparent pointer-events-none"></div>
      </div>
    </motion.div>
  )
}

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [notificationEvent, setNotificationEvent] = useState<NotificationEvent | null>(null)
  
  // Function to handle new notifications
  const handleNotification = (notification: NotificationEvent) => {
    setNotificationEvent(notification)
  }
  
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate loading
    setTimeout(() => {
      // Keep loading true, the LoadingScreen will handle navigation
    }, 1500)
  }
  
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen 
            onComplete={() => {
              router.push("/app")
            }} 
            delay={0.2}
          />
        )}
      </AnimatePresence>
      {/* TidyTask Logo */}
      <motion.div 
        className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 lg:left-6 lg:translate-x-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <img 
          src="/logo_tidytask.png" 
          alt="TidyTask Logo" 
          className="h-10 w-auto filter brightness-0 invert" 
          style={{ filter: 'brightness(0) invert(1)' }} 
        />
      </motion.div>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          {/* Logo text removed to prevent duplication */}
        </div>
        
        {/* Animated Task List */}
        <motion.div 
          className="relative z-20 mx-auto my-auto max-w-md w-full px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <TaskAnimation notificationEvent={notificationEvent} />
        </motion.div>
        
        <motion.div 
          className="relative z-20 mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <blockquote className="space-y-2">
            <p className="text-lg">
              "TidyTask has transformed how our family manages household responsibilities. 
              Everyone knows what they need to do and when it needs to be done."
            </p>
            <footer className="text-sm">Sofia Anderson</footer>
          </blockquote>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-primary/90 to-primary/40 opacity-30" />
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome to TidyTask</h1>
            <p className="text-sm text-muted-foreground">
              Sign in or create an account to get started
            </p>
          </div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="transition-all duration-300 ease-in-out">Login</TabsTrigger>
              <TabsTrigger value="register" className="transition-all duration-300 ease-in-out">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="transition-all duration-300 ease-in-out">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your email and password to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleAuth}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="name@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : null}
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              </motion.div>
            </TabsContent>
            <TabsContent value="register" className="transition-all duration-300 ease-in-out">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Enter your information to create a new account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleAuth}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="name@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>
                    <div className="space-y-1">
                      <Label>Account Type</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="personal" name="account-type" className="h-4 w-4 accent-blueprint-primary" defaultChecked />
                          <Label htmlFor="personal" className="text-sm font-normal">Personal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="family" name="account-type" className="h-4 w-4 accent-blueprint-primary" />
                          <Label htmlFor="family" className="text-sm font-normal">Family</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : null}
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
      
      {/* Notification component */}
      <NotificationAnimation onNotification={handleNotification} />
    </div>
  )
}
