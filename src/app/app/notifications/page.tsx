"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, parseISO } from "date-fns"
import { Bell, Check, Trash2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead, clearNotifications } = useStore()
  
  const formatNotificationTime = (timestamp: string | number | undefined) => {
    if (!timestamp) {
      return format(new Date(), 'MMM dd, yyyy h:mm a')
    }
    
    try {
      // Handle both string and number timestamp formats
      const date = typeof timestamp === 'string' 
        ? parseISO(timestamp) 
        : new Date(timestamp)
      
      return format(date, 'MMM dd, yyyy h:mm a')
    } catch (error) {
      console.error('Error formatting notification time:', error)
      return format(new Date(), 'MMM dd, yyyy h:mm a')
    }
  }
  
  return (
    <div className="container mx-auto max-w-3xl py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearNotifications}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear all
          </Button>
        )}
      </div>
      
      <AnimatePresence>
        {notifications.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={notification.read ? "opacity-70" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-primary/10 p-2">
                          <Bell className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className={`${notification.read ? "" : "font-medium"}`}>
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatNotificationTime(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12"
          >
            <Bell className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-center text-muted-foreground">
              No notifications yet
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
