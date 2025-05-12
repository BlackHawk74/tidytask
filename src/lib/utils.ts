import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addDays, format, isAfter, isBefore, isSameDay, parseISO } from "date-fns"
import { Priority, Task, TaskStatus } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting functions
export function formatDate(date: string | Date): string {
  try {
    // Handle potential invalid date strings
    if (date === null || date === undefined) {
      return format(new Date(), 'MMM dd, yyyy')
    }
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'MMM dd, yyyy')
  } catch (error) {
    console.error('Error formatting date:', error)
    return format(new Date(), 'MMM dd, yyyy')
  }
}

export function formatRelativeDate(date: string | Date): string {
  try {
    // Handle potential invalid date strings
    if (date === null || date === undefined) {
      return 'Today'
    }
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    const today = new Date()
    
    if (isSameDay(dateObj, today)) {
      return 'Today'
    } else if (isSameDay(dateObj, addDays(today, 1))) {
      return 'Tomorrow'
    } else if (isSameDay(dateObj, addDays(today, -1))) {
      return 'Yesterday'
    } else {
      return formatDate(date)
    }
  } catch (error) {
    console.error('Error formatting relative date:', error)
    return 'Today'
  }
}

// Task status determination
export function getTaskStatus(task: Task): TaskStatus {
  try {
    if (task.completed) {
      return 'Completed'
    }
    
    const today = new Date()
    
    // Handle potentially invalid date values
    let deadline: Date
    try {
      // First try to parse the due_date if it exists
      if (task.due_date) {
        deadline = parseISO(task.due_date)
        // Check if the parsed date is valid
        if (isNaN(deadline.getTime())) {
          throw new Error('Invalid date')
        }
      } else {
        deadline = today
      }
    } catch (error) {
      console.error('Error parsing due_date:', error)
      deadline = today
    }
    
    if (isBefore(deadline, today) && !isSameDay(deadline, today)) {
      return 'Overdue'
    } else if (isSameDay(deadline, today)) {
      return 'Today'
    } else {
      return 'Upcoming'
    }
  } catch (error) {
    console.error('Error determining task status:', error)
    return 'Upcoming' // Default fallback
  }
}

// Filter tasks by status
export function filterTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter(task => getTaskStatus(task) === status)
}

// Filter tasks by family member
export function filterTasksByFamilyMember(tasks: Task[], familyMemberId: string | null): Task[] {
  if (!familyMemberId) return tasks
  return tasks.filter(task => task.assignee === familyMemberId)
}

// Get priority color
export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'High':
      return 'text-red-500 bg-red-100 dark:bg-red-950 dark:text-red-400'
    case 'Medium':
      return 'text-amber-500 bg-amber-100 dark:bg-amber-950 dark:text-amber-400'
    case 'Low':
      return 'text-green-500 bg-green-100 dark:bg-green-950 dark:text-green-400'
    default:
      return 'text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
  }
}

// Calculate task progress
export function calculateTaskProgress(task: Task): number {
  // Ensure subtasks is available with fallback to empty array
  const subtasks = task.subtasks || []
  
  if (subtasks.length === 0) return task.completed ? 100 : 0
  
  const completedSubtasks = subtasks.filter(subtask => subtask.completed).length
  return Math.round((completedSubtasks / subtasks.length) * 100)
}
