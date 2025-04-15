import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { AppState, FamilyMember, Notification, Subtask, Task } from './types';
import { mockFamilyMembers, mockNotifications, mockTasks } from './mock-data';

export const useStore = create<AppState>((set) => ({
  tasks: mockTasks,
  familyMembers: mockFamilyMembers,
  notifications: mockNotifications,
  selectedFamilyMember: null,

  // Task Actions
  addTask: (task) => set((state) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    // Add notification for new task
    const assignee = state.familyMembers.find(member => member.id === task.assignee);
    if (assignee) {
      state.addNotification({
        message: `New task assigned to ${assignee.name}: ${task.title}`,
        taskId: newTask.id
      });
    }
    
    return { tasks: [...state.tasks, newTask] };
  }),
  
  updateTask: (id, updatedTask) => set((state) => ({
    tasks: state.tasks.map((task) => 
      task.id === id ? { ...task, ...updatedTask } : task
    )
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id)
  })),
  
  completeTask: (id) => set((state) => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      const assignee = state.familyMembers.find(member => member.id === task.assignee);
      if (assignee) {
        state.addNotification({
          message: `${assignee.name} completed: ${task.title}`,
          taskId: id
        });
      }
    }
    
    return {
      tasks: state.tasks.map((task) => 
        task.id === id 
          ? { 
              ...task, 
              completed: true, 
              subtasks: task.subtasks.map(st => ({ ...st, completed: true }))
            } 
          : task
      )
    };
  }),
  
  // Subtask Actions
  addSubtask: (taskId, subtask) => set((state) => ({
    tasks: state.tasks.map((task) => 
      task.id === taskId 
        ? { 
            ...task, 
            subtasks: [...task.subtasks, { ...subtask, id: uuidv4() }] 
          } 
        : task
    )
  })),
  
  updateSubtask: (taskId, subtaskId, completed) => set((state) => ({
    tasks: state.tasks.map((task) => 
      task.id === taskId 
        ? { 
            ...task, 
            subtasks: task.subtasks.map((subtask) => 
              subtask.id === subtaskId 
                ? { ...subtask, completed } 
                : subtask
            ) 
          } 
        : task
    )
  })),
  
  deleteSubtask: (taskId, subtaskId) => set((state) => ({
    tasks: state.tasks.map((task) => 
      task.id === taskId 
        ? { 
            ...task, 
            subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId) 
          } 
        : task
    )
  })),
  
  // Family Member Actions
  addFamilyMember: (member) => set((state) => ({
    familyMembers: [...state.familyMembers, { ...member, id: uuidv4() }]
  })),
  
  updateFamilyMember: (id, updatedMember) => set((state) => ({
    familyMembers: state.familyMembers.map((member) => 
      member.id === id ? { ...member, ...updatedMember } : member
    )
  })),
  
  deleteFamilyMember: (id) => set((state) => {
    // Reassign tasks to null or first available member
    const defaultAssignee = state.familyMembers.find(m => m.id !== id)?.id || null;
    
    return {
      familyMembers: state.familyMembers.filter((member) => member.id !== id),
      tasks: state.tasks.map(task => 
        task.assignee === id 
          ? { ...task, assignee: defaultAssignee || '' } 
          : task
      )
    };
  }),
  
  selectFamilyMember: (id) => set(() => ({
    selectedFamilyMember: id
  })),
  
  // Notification Actions
  addNotification: (notification) => set((state) => ({
    notifications: [
      {
        ...notification,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        read: false
      },
      ...state.notifications
    ]
  })),
  
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((notification) => 
      notification.id === id ? { ...notification, read: true } : notification
    )
  })),
  
  clearNotifications: () => set(() => ({
    notifications: []
  }))
}));
