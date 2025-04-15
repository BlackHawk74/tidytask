"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell } from "lucide-react"
import { format, parseISO } from "date-fns"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const { notifications, markNotificationAsRead, clearNotifications } = useStore()
  
  const unreadCount = notifications.filter(n => !n.read).length
  
  const formatNotificationTime = (timestamp: string) => {
    const date = parseISO(timestamp)
    return format(date, 'h:mm a')
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <motion.span 
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {unreadCount}
            </motion.span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-medium">Notifications</h4>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto px-2 py-1 text-xs"
              onClick={clearNotifications}
            >
              Clear all
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <AnimatePresence>
            {notifications.length > 0 ? (
              <ul className="divide-y">
                {notifications.map((notification) => (
                  <motion.li 
                    key={notification.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => markNotificationAsRead(notification.id)}
                    className={`cursor-pointer p-3 hover:bg-muted/50 ${notification.read ? 'opacity-70' : 'font-medium'}`}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm">{notification.message}</p>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary"></span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatNotificationTime(notification.timestamp)}
                    </p>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center p-6">
                <Bell className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  No notifications yet
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  )
}
