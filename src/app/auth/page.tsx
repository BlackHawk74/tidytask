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
import { useAuth } from "@/lib/auth-context"

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
  }, [currentNotification, notifications, onNotification])
  
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
  
  // Camera state to track the scroll position
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0 })
  
  // Track which task is currently active
  const [activeTask, setActiveTask] = useState(0)
  
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
  
  useEffect(() => {
    // Auto-check tasks for demo purposes
    const interval = setInterval(() => {
      setTasks(prev => {
        const index = Math.floor(Math.random() * prev.length)
        return prev.map((task, i) => 
          i === index && !task.completed ? { ...task, completed: true } : task
        )
      })
    }, 8000)
    
    return () => clearInterval(interval)
  }, [])
  
  const handleTaskClick = (index: number) => {
    setActiveTask(index)
    
    // Smooth scroll to position
    setCameraPosition({ x: 0, y: -index * 76 })
  }
  
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Family Tasks</h3>
          <p className="text-white/70">Manage household responsibilities</p>
        </div>
        <div className="flex space-x-2">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10">
            <User className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10">
            <Calendar className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 shadow-lg overflow-hidden">
        <div 
          className="transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${cameraPosition.y}px)` }}
        >
          {tasks.map((task, index) => (
            <motion.div 
              key={task.id}
              initial={task.isNew ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`
                p-4 mb-1 rounded-lg flex items-center cursor-pointer
                ${activeTask === index ? 'bg-white/20' : 'hover:bg-white/10'}
                ${task.completed ? 'opacity-60' : 'opacity-100'}
                transition-all duration-200 ease-in-out
              `}
              onClick={() => handleTaskClick(index)}
            >
              <div 
                className={`
                  w-5 h-5 rounded-full flex items-center justify-center mr-3 
                  ${task.completed ? 'bg-green-500' : 'border-2 border-white/70'}
                `}
              >
                {task.completed && <Check className="h-3 w-3 text-white" />}
              </div>
              <div>
                <p className={`text-white font-medium ${task.completed ? 'line-through' : ''}`}>
                  {task.text}
                </p>
                <p className="text-xs text-white/60">
                  Assigned to: {task.assignee}
                </p>
              </div>
              <div 
                className="ml-auto w-2 h-12 rounded-full" 
                style={{ backgroundColor: task.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="mx-auto bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg mt-4"
      >
        <Button className="w-full bg-white/20 hover:bg-white/30 text-white">
          <Pencil className="mr-2 h-4 w-4" />
          Add New Task
        </Button>
      </motion.div>
      
      {/* Notification animation */}
      <div className="relative">
        <NotificationAnimation onNotification={handleNotification} />
      </div>
    </>
  )
}

export default function AuthPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accountType, setAccountType] = useState("personal")
  const [notificationEvent, setNotificationEvent] = useState<NotificationEvent | null>(null)
  const [authError, setAuthError] = useState("")
  
  // Function to handle new notifications
  const handleNotification = (notification: NotificationEvent) => {
    setNotificationEvent(notification)
  }
  
  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setIsLoading(true)
    
    try {
      await signIn(email, password)
      // The auth context will handle redirection
    } catch (error: any) {
      setAuthError(error.message || 'Failed to sign in')
      setIsLoading(false)
    }
  }
  
  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setIsLoading(true)
    
    try {
      await signUp(email, password, name)
      // The auth context will handle redirection
    } catch (error: any) {
      setAuthError(error.message || 'Failed to create account')
      setIsLoading(false)
    }
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
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input 
                          id="login-email" 
                          type="email" 
                          placeholder="name@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input 
                          id="login-password" 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required 
                        />
                      </div>
                      {authError && (
                        <p className="text-sm text-destructive">{authError}</p>
                      )}
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
                  <form onSubmit={handleSignUp}>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="name@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input 
                          id="signup-password" 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required 
                        />
                      </div>
                      {authError && (
                        <p className="text-sm text-destructive">{authError}</p>
                      )}
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
          </p>
        </div>
      </div>
    </div>
  )
}
