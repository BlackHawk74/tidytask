import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addDays, format, isAfter, isBefore, isSameDay, parseISO } from "date-fns"
import { Priority, Task, TaskStatus } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting functions
export function formatDate(date: string | Date | undefined): string {
  try {
    // Handle potential invalid date strings
    if (date === null || date === undefined) {
      return format(new Date(), 'MMM dd, yyyy')
    }
    
    let dateObj: Date;
    
    if (typeof date === 'string') {
      // Handle ISO format dates (with T or Z)
      if (date.includes('T') || date.includes('Z')) {
        dateObj = parseISO(date);
      } else {
        // For other string formats, use the Date constructor
        dateObj = new Date(date);
      }
    } else {
      // It's already a Date object
      dateObj = date;
    }
    
    // Validate the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date detected:', date);
      return format(new Date(), 'MMM dd, yyyy');
    }
    
    return format(dateObj, 'MMM dd, yyyy')
  } catch (error) {
    console.error('Error formatting date:', error)
    return format(new Date(), 'MMM dd, yyyy')
  }
}

export function formatRelativeDate(date: string | Date | undefined): string {
  try {
    // Handle potential invalid date strings
    if (date === null || date === undefined) {
      return 'Today'
    }
    
    let dateObj: Date;
    
    if (typeof date === 'string') {
      // Handle ISO format dates (with T or Z)
      if (date.includes('T') || date.includes('Z')) {
        dateObj = parseISO(date);
      } else {
        // For other string formats, use the Date constructor
        dateObj = new Date(date);
      }
    } else {
      // It's already a Date object
      dateObj = date;
    }
    
    // Validate the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date detected:', date);
      return 'Today';
    }
    
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
    // Set hours, minutes, seconds, and milliseconds to 0 for accurate day comparison
    today.setHours(0, 0, 0, 0)

    let deadlineDate: Date | null = null;

    if (task.deadline) {
      try {
        // Try parsing the deadline
        if (typeof task.deadline === 'string') {
          // Check if it's an ISO string
          if (task.deadline.includes('T') || task.deadline.includes('Z')) {
            deadlineDate = parseISO(task.deadline)
          } else {
            // Regular date string
            deadlineDate = new Date(task.deadline)
          }
        } else {
          // It might already be a Date object (though unlikely from store)
          deadlineDate = new Date(task.deadline)
        }
        
        // Check if the parsed date is valid
        if (isNaN(deadlineDate.getTime())) {
          console.warn('Invalid task deadline encountered:', task.deadline);
          deadlineDate = null; // Treat invalid date as no deadline
        }
      } catch (error) {
        console.error('Error parsing task deadline:', task.deadline, error)
        deadlineDate = null; // Treat parsing error as no deadline
      }
    }

    // If no valid deadline, it's Upcoming
    if (!deadlineDate) {
      return 'Upcoming';
    }

    // Set hours, minutes, seconds, and milliseconds to 0 for accurate day comparison
    deadlineDate.setHours(0, 0, 0, 0);

    // Now compare dates
    if (isBefore(deadlineDate, today)) {
      return 'Overdue'
    } else if (isSameDay(deadlineDate, today)) {
      return 'Today'
    } else { // isAfter(deadlineDate, today)
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
