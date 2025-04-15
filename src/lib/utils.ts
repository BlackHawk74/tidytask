import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addDays, format, isAfter, isBefore, isSameDay, parseISO } from "date-fns"
import { Priority, Task, TaskStatus } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting functions
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM dd, yyyy')
}

export function formatRelativeDate(date: string | Date): string {
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
}

// Task status determination
export function getTaskStatus(task: Task): TaskStatus {
  if (task.completed) {
    return 'Completed'
  }
  
  const today = new Date()
  const deadline = parseISO(task.deadline)
  
  if (isBefore(deadline, today) && !isSameDay(deadline, today)) {
    return 'Overdue'
  } else if (isSameDay(deadline, today)) {
    return 'Today'
  } else {
    return 'Upcoming'
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
  if (task.subtasks.length === 0) return task.completed ? 100 : 0
  
  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length
  return Math.round((completedSubtasks / task.subtasks.length) * 100)
}
