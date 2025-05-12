export type Priority = 'Low' | 'Medium' | 'High';
export type Role = 'admin' | 'member';
export type TaskStatus = 'Today' | 'Upcoming' | 'Completed' | 'Overdue';

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  color_theme: string | null;
  setup_completed: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Family {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: Role;
  color_theme: string;
  joined_at: string;
  
  // UI properties (for compatibility with existing components)
  name?: string; // Derived from user record
  avatarUrl?: string; // Derived from user record
  color?: string; // Alias for color_theme
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface Task {
  id: string;
  family_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  completed: boolean | null;
  subtasks?: Subtask[];
  
  // UI properties (for compatibility with existing components)
  assignee?: string; // Alias for assigned_to
  deadline?: string; // Alias for due_date
  createdAt?: string; // Alias for created_at
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string;
  type?: string | null;
  related_task_id?: string | null;
  
  // UI properties (for compatibility with existing components)
  timestamp?: number; // Computed from created_at
  taskId?: string; // Alias for related_task_id
}

export interface AppState {
  tasks: Task[];
  familyMembers: FamilyMember[];
  notifications: Notification[];
  selectedFamilyMember: string | null;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  
  // Subtask Actions
  addSubtask: (taskId: string, subtask: Omit<Subtask, 'id'>) => void;
  updateSubtask: (taskId: string, subtaskId: string, completed: boolean) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  
  // Family Member Actions
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateFamilyMember: (id: string, member: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;
  selectFamilyMember: (id: string | null) => void;
  
  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}
