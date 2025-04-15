export type Priority = 'Low' | 'Medium' | 'High';
export type Role = 'Admin' | 'Member';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string; // familyMemberId
  priority: Priority;
  deadline: string;
  subtasks: Subtask[];
  completed: boolean;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  avatarUrl?: string;
  color: string;
  role: Role;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  taskId?: string;
}

export type TaskStatus = 'Today' | 'Upcoming' | 'Completed' | 'Overdue';

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
