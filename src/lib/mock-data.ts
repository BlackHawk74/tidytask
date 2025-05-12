import { FamilyMember, Notification, Task, TaskStatus } from './types';
import { addDays, format, subDays, parseISO, isToday, isFuture, isPast } from 'date-fns';

// Helper function to format dates consistently
const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Helper function to determine task status based on deadline
const determineTaskStatus = (deadline: string, completed: boolean): TaskStatus => {
  if (completed) return 'Completed';
  try {
    const dueDate = parseISO(deadline);
    if (isToday(dueDate)) return 'Today';
    if (isFuture(dueDate)) return 'Upcoming';
    if (isPast(dueDate)) return 'Overdue';
  } catch (error) {
    console.error("Error parsing date in determineTaskStatus:", deadline, error);
    return 'Upcoming'; // Default status if date parsing fails
  }
  return 'Upcoming'; // Default
};

const today = new Date();
const todayStr = formatDate(today);

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: '1',
    family_id: 'mock-family-id',
    user_id: 'user-1',
    name: 'Mom',
    color: '#F97316',
    color_theme: '#F97316',
    role: 'admin',
    joined_at: new Date().toISOString(),
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=Mom'
  },
  {
    id: '2',
    family_id: 'mock-family-id',
    user_id: 'user-2',
    name: 'Dad',
    color: '#4F46E5',
    color_theme: '#4F46E5',
    role: 'admin',
    joined_at: new Date().toISOString(),
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=Dad'
  },
  {
    id: '3',
    family_id: 'mock-family-id',
    user_id: 'user-3',
    name: 'Emma',
    color: '#10B981',
    color_theme: '#10B981',
    role: 'member',
    joined_at: new Date().toISOString(),
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=Emma'
  },
  {
    id: '4',
    family_id: 'mock-family-id',
    user_id: 'user-4',
    name: 'Jake',
    color: '#EF4444',
    color_theme: '#EF4444',
    role: 'member',
    joined_at: new Date().toISOString(),
    avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=Jake'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    family_id: 'mock-family-id',
    title: 'Grocery Shopping',
    description: 'Buy groceries for the week',
    assignee: '1',
    assigned_to: '1',
    priority: 'High',
    deadline: formatDate(today),
    due_date: formatDate(today),
    completed: false,
    status: determineTaskStatus(formatDate(today), false),
    createdAt: formatDate(subDays(today, 2)),
    created_at: formatDate(subDays(today, 2)),
    created_by: '1',
    updated_at: todayStr,
    subtasks: [
      { id: '1-1', title: 'Make shopping list', completed: true, task_id: '1', created_at: formatDate(subDays(today, 2)) },
      { id: '1-2', title: 'Check pantry for items', completed: true, task_id: '1', created_at: formatDate(subDays(today, 2)) },
      { id: '1-3', title: 'Visit grocery store', completed: false, task_id: '1', created_at: formatDate(subDays(today, 2)) },
      { id: '1-4', title: 'Put away groceries', completed: false, task_id: '1', created_at: formatDate(subDays(today, 2)) }
    ]
  },
  {
    id: '2',
    family_id: 'mock-family-id',
    title: 'Mow the lawn',
    description: 'Cut the grass in the backyard',
    assignee: '2',
    assigned_to: '2',
    priority: 'Medium',
    deadline: formatDate(today),
    due_date: formatDate(today),
    completed: false,
    status: determineTaskStatus(formatDate(today), false),
    createdAt: formatDate(subDays(today, 1)),
    created_at: formatDate(subDays(today, 1)),
    created_by: '2',
    updated_at: todayStr,
    subtasks: [
      { id: '2-1', title: 'Check lawn mower gas', completed: true, task_id: '2', created_at: formatDate(subDays(today, 1)) },
      { id: '2-2', title: 'Mow front yard', completed: false, task_id: '2', created_at: formatDate(subDays(today, 1)) },
      { id: '2-3', title: 'Mow backyard', completed: false, task_id: '2', created_at: formatDate(subDays(today, 1)) }
    ]
  },
  {
    id: '3',
    family_id: 'mock-family-id',
    title: 'Math homework',
    description: 'Complete algebra assignment',
    assignee: '3',
    assigned_to: '3',
    priority: 'High',
    deadline: formatDate(addDays(today, 1)),
    due_date: formatDate(addDays(today, 1)),
    completed: false,
    status: determineTaskStatus(formatDate(addDays(today, 1)), false),
    createdAt: formatDate(subDays(today, 3)),
    created_at: formatDate(subDays(today, 3)),
    created_by: '1',
    updated_at: todayStr,
    subtasks: [
      { id: '3-1', title: 'Read chapter 5', completed: true, task_id: '3', created_at: formatDate(subDays(today, 3)) },
      { id: '3-2', title: 'Complete practice problems', completed: false, task_id: '3', created_at: formatDate(subDays(today, 3)) },
      { id: '3-3', title: 'Check answers with solutions', completed: false, task_id: '3', created_at: formatDate(subDays(today, 3)) }
    ]
  },
  {
    id: '4',
    family_id: 'mock-family-id',
    title: 'Clean bedroom',
    description: 'Organize and clean room',
    assignee: '4',
    assigned_to: '4',
    priority: 'Low',
    deadline: formatDate(addDays(today, 2)),
    due_date: formatDate(addDays(today, 2)),
    completed: false,
    status: determineTaskStatus(formatDate(addDays(today, 2)), false),
    createdAt: formatDate(subDays(today, 1)),
    created_at: formatDate(subDays(today, 1)),
    created_by: '1',
    updated_at: todayStr,
    subtasks: [
      { id: '4-1', title: 'Pick up toys', completed: false, task_id: '4', created_at: formatDate(subDays(today, 1)) },
      { id: '4-2', title: 'Make bed', completed: true, task_id: '4', created_at: formatDate(subDays(today, 1)) },
      { id: '4-3', title: 'Vacuum floor', completed: false, task_id: '4', created_at: formatDate(subDays(today, 1)) }
    ]
  },
  {
    id: '5',
    family_id: 'mock-family-id',
    title: 'Plan family dinner',
    description: 'Organize Sunday family dinner',
    assignee: '1',
    assigned_to: '1',
    priority: 'Medium',
    deadline: formatDate(addDays(today, 3)),
    due_date: formatDate(addDays(today, 3)),
    completed: false,
    status: determineTaskStatus(formatDate(addDays(today, 3)), false),
    createdAt: formatDate(subDays(today, 4)),
    created_at: formatDate(subDays(today, 4)),
    created_by: '1',
    updated_at: todayStr,
    subtasks: [
      { id: '5-1', title: 'Decide on menu', completed: true, task_id: '5', created_at: formatDate(subDays(today, 4)) },
      { id: '5-2', title: 'Invite extended family', completed: true, task_id: '5', created_at: formatDate(subDays(today, 4)) },
      { id: '5-3', title: 'Prepare house', completed: false, task_id: '5', created_at: formatDate(subDays(today, 4)) },
      { id: '5-4', title: 'Cook dinner', completed: false, task_id: '5', created_at: formatDate(subDays(today, 4)) }
    ]
  },
  {
    id: '6',
    family_id: 'mock-family-id',
    title: 'Fix leaky faucet',
    description: 'Repair the dripping faucet in the kitchen sink',
    assignee: '2',
    assigned_to: '2',
    priority: 'Low',
    deadline: formatDate(subDays(today, 1)),
    due_date: formatDate(subDays(today, 1)),
    completed: false,
    status: determineTaskStatus(formatDate(subDays(today, 1)), false),
    createdAt: formatDate(subDays(today, 5)),
    created_at: formatDate(subDays(today, 5)),
    created_by: '1',
    updated_at: todayStr,
    subtasks: [
      { id: '6-1', title: 'Buy replacement parts', completed: false, task_id: '6', created_at: formatDate(subDays(today, 5)) },
      { id: '6-2', title: 'Turn off water supply', completed: false, task_id: '6', created_at: formatDate(subDays(today, 5)) },
      { id: '6-3', title: 'Replace faucet', completed: false, task_id: '6', created_at: formatDate(subDays(today, 5)) }
    ]
  },
  {
    id: '7',
    family_id: 'mock-family-id',
    title: 'Science project',
    description: 'Build volcano model for science fair',
    assignee: '3',
    assigned_to: '3',
    priority: 'High',
    deadline: formatDate(subDays(today, 3)),
    due_date: formatDate(subDays(today, 3)),
    completed: true,
    status: determineTaskStatus(formatDate(subDays(today, 3)), true),
    createdAt: formatDate(subDays(today, 7)),
    created_at: formatDate(subDays(today, 7)),
    created_by: '3',
    updated_at: formatDate(subDays(today, 1)),
    subtasks: [
      { id: '7-1', title: 'Research volcano types', completed: true, task_id: '7', created_at: formatDate(subDays(today, 7)) },
      { id: '7-2', title: 'Build model base', completed: true, task_id: '7', created_at: formatDate(subDays(today, 7)) },
      { id: '7-3', title: 'Paint volcano', completed: true, task_id: '7', created_at: formatDate(subDays(today, 7)) },
      { id: '7-4', title: 'Prepare eruption chemicals', completed: true, task_id: '7', created_at: formatDate(subDays(today, 7)) }
    ]
  },
  {
    id: '8',
    family_id: 'mock-family-id',
    title: 'Prepare for soccer practice',
    description: 'Get ready for practice at 5 PM',
    assignee: '4',
    assigned_to: '4',
    priority: 'Medium',
    deadline: formatDate(today),
    due_date: formatDate(today),
    completed: false,
    status: determineTaskStatus(formatDate(today), false),
    createdAt: formatDate(subDays(today, 2)),
    created_at: formatDate(subDays(today, 2)),
    created_by: '2',
    updated_at: todayStr,
    subtasks: [
      { id: '8-1', title: 'Pack gym bag', completed: true, task_id: '8', created_at: formatDate(subDays(today, 2)) },
      { id: '8-2', title: 'Fill water bottle', completed: false, task_id: '8', created_at: formatDate(subDays(today, 2)) },
      { id: '8-3', title: 'Attend practice', completed: false, task_id: '8', created_at: formatDate(subDays(today, 2)) }
    ]
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    message: 'Grocery Shopping is due today!',
    user_id: '1',
    created_at: new Date().toISOString(),
    read: false,
    related_task_id: '1'
  },
  {
    id: '2',
    message: 'Fix leaky faucet is overdue!',
    user_id: '2',
    created_at: new Date(subDays(today, 1).setHours(9, 0, 0)).toISOString(),
    read: true,
    related_task_id: '6'
  },
  {
    id: '3',
    message: 'Emma completed Science project',
    user_id: '3',
    created_at: new Date(subDays(today, 1).setHours(15, 30, 0)).toISOString(),
    read: false,
    related_task_id: '7'
  },
  {
    id: '4',
    message: 'New task assigned: Math homework',
    user_id: '3',
    created_at: new Date(subDays(today, 3).setHours(10, 15, 0)).toISOString(),
    read: true,
    related_task_id: '3'
  }
];
