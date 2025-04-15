import { FamilyMember, Notification, Task } from './types';
import { addDays, format, subDays } from 'date-fns';

// Helper function to format dates consistently
const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

const today = new Date();

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: '1',
    name: 'Mom',
    color: '#F97316', // Orange
    role: 'Admin',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=Mom'
  },
  {
    id: '2',
    name: 'Dad',
    color: '#4F46E5', // Indigo
    role: 'Admin',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=Dad'
  },
  {
    id: '3',
    name: 'Emma',
    color: '#10B981', // Green
    role: 'Member',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=Emma'
  },
  {
    id: '4',
    name: 'Jake',
    color: '#EF4444', // Red
    role: 'Member',
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=Jake'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    description: 'Buy groceries for the week',
    assignee: '1', // Mom
    priority: 'High',
    deadline: formatDate(today),
    completed: false,
    createdAt: formatDate(subDays(today, 2)),
    subtasks: [
      { id: '1-1', title: 'Make shopping list', completed: true },
      { id: '1-2', title: 'Check pantry for items', completed: true },
      { id: '1-3', title: 'Visit grocery store', completed: false },
      { id: '1-4', title: 'Put away groceries', completed: false }
    ]
  },
  {
    id: '2',
    title: 'Mow the lawn',
    description: 'Cut the grass in the backyard',
    assignee: '2', // Dad
    priority: 'Medium',
    deadline: formatDate(today),
    completed: false,
    createdAt: formatDate(subDays(today, 1)),
    subtasks: [
      { id: '2-1', title: 'Check lawn mower gas', completed: true },
      { id: '2-2', title: 'Mow front yard', completed: false },
      { id: '2-3', title: 'Mow backyard', completed: false }
    ]
  },
  {
    id: '3',
    title: 'Math homework',
    description: 'Complete algebra assignment',
    assignee: '3', // Emma
    priority: 'High',
    deadline: formatDate(addDays(today, 1)),
    completed: false,
    createdAt: formatDate(subDays(today, 3)),
    subtasks: [
      { id: '3-1', title: 'Read chapter 5', completed: true },
      { id: '3-2', title: 'Complete practice problems', completed: false },
      { id: '3-3', title: 'Check answers with solutions', completed: false }
    ]
  },
  {
    id: '4',
    title: 'Clean bedroom',
    description: 'Organize and clean room',
    assignee: '4', // Jake
    priority: 'Low',
    deadline: formatDate(addDays(today, 2)),
    completed: false,
    createdAt: formatDate(subDays(today, 1)),
    subtasks: [
      { id: '4-1', title: 'Pick up toys', completed: false },
      { id: '4-2', title: 'Make bed', completed: true },
      { id: '4-3', title: 'Vacuum floor', completed: false }
    ]
  },
  {
    id: '5',
    title: 'Plan family dinner',
    description: 'Organize weekend family dinner',
    assignee: '1', // Mom
    priority: 'Medium',
    deadline: formatDate(addDays(today, 3)),
    completed: false,
    createdAt: formatDate(subDays(today, 4)),
    subtasks: [
      { id: '5-1', title: 'Decide on menu', completed: true },
      { id: '5-2', title: 'Invite extended family', completed: true },
      { id: '5-3', title: 'Prepare house', completed: false },
      { id: '5-4', title: 'Cook dinner', completed: false }
    ]
  },
  {
    id: '6',
    title: 'Fix leaky faucet',
    description: 'Repair the bathroom sink',
    assignee: '2', // Dad
    priority: 'Low',
    deadline: formatDate(subDays(today, 1)),
    completed: false,
    createdAt: formatDate(subDays(today, 5)),
    subtasks: [
      { id: '6-1', title: 'Buy replacement parts', completed: false },
      { id: '6-2', title: 'Turn off water supply', completed: false },
      { id: '6-3', title: 'Replace faucet', completed: false }
    ]
  },
  {
    id: '7',
    title: 'Science project',
    description: 'Complete volcano model',
    assignee: '3', // Emma
    priority: 'High',
    deadline: formatDate(subDays(today, 2)),
    completed: true,
    createdAt: formatDate(subDays(today, 7)),
    subtasks: [
      { id: '7-1', title: 'Research volcano types', completed: true },
      { id: '7-2', title: 'Build model base', completed: true },
      { id: '7-3', title: 'Paint volcano', completed: true },
      { id: '7-4', title: 'Prepare eruption chemicals', completed: true }
    ]
  },
  {
    id: '8',
    title: 'Basketball practice',
    description: 'Attend team practice',
    assignee: '4', // Jake
    priority: 'Medium',
    deadline: formatDate(addDays(today, 1)),
    completed: false,
    createdAt: formatDate(subDays(today, 2)),
    subtasks: [
      { id: '8-1', title: 'Pack gym bag', completed: true },
      { id: '8-2', title: 'Fill water bottle', completed: false },
      { id: '8-3', title: 'Attend practice', completed: false }
    ]
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    message: 'Grocery Shopping is due today!',
    timestamp: new Date().toISOString(),
    read: false,
    taskId: '1'
  },
  {
    id: '2',
    message: 'Fix leaky faucet is overdue!',
    timestamp: new Date(subDays(today, 1).setHours(9, 0, 0)).toISOString(),
    read: true,
    taskId: '6'
  },
  {
    id: '3',
    message: 'Emma completed Science project',
    timestamp: new Date(subDays(today, 1).setHours(15, 30, 0)).toISOString(),
    read: false,
    taskId: '7'
  },
  {
    id: '4',
    message: 'New task assigned: Math homework',
    timestamp: new Date(subDays(today, 3).setHours(10, 15, 0)).toISOString(),
    read: true,
    taskId: '3'
  }
];
