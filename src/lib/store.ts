import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { AppState, FamilyMember, Notification, Subtask, Task, Role } from './types';
import { supabase } from './supabase';

export const useStore = create<AppState>()(persist(
  (set, get) => ({
  tasks: [],
  familyMembers: [],
  notifications: [],
  selectedFamilyMember: null,

  // Task Actions
  addTask: async (task: Omit<Task, 'id' | 'created_at'>) => {
    const { familyMembers } = get(); // Get current family members for assignee check
    const newTask: Task = {
      ...task,
      id: uuidv4(), // Generate ID client-side
      created_at: new Date().toISOString(),
      // Ensure family_id is included - might need to get it from state if not passed in
      family_id: task.family_id || familyMembers.find(fm => fm.user_id === task.assignee)?.family_id || '', // Attempt to infer family_id
    };

    // Optimistically update local state first
    set(state => ({ tasks: [...state.tasks, newTask] }));

    // Add notification locally
    const assignee = familyMembers.find(member => member.id === task.assignee);
    if (assignee) {
      get().addNotification({ // Assuming addNotification remains sync for now
        message: `New task assigned to ${assignee.name}: ${task.title}`,
        related_task_id: newTask.id,
        user_id: assignee.user_id,
        created_at: new Date().toISOString()
      });
    }
    
    // Then, try to save to Supabase
    try {
      // We need the full Task object for Supabase, ensure required fields are present
      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select(); // Select to confirm insertion
        
      if (error) throw error;
      console.log('Task added to Supabase:', data);
    } catch (error) {
      console.error("Error adding task to Supabase:", error);
      // Optional: Revert local state change if Supabase fails?
      // set(state => ({ tasks: state.tasks.filter(t => t.id !== newTask.id) }));
      // For now, we just log the error.
    }
  },
  
  updateTask: async (id: string, updatedTaskData: Partial<Task>) => {
    // Optimistically update local state
    set(state => ({
      tasks: state.tasks.map((task) => 
        task.id === id ? { ...task, ...updatedTaskData, updated_at: new Date().toISOString() } : task
      )
    }));

    // Then, update Supabase
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...updatedTaskData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      console.log('Task updated in Supabase:', data);
    } catch (error) {
      console.error("Error updating task in Supabase:", error);
      // Optional: Revert local state?
    }
  },
  
  deleteTask: async (id: string) => {
    const originalTasks = get().tasks; // Store original state for potential rollback
    // Optimistically update local state
    set(state => ({
      tasks: state.tasks.filter((task) => task.id !== id)
    }));
    
    // Then, delete from Supabase
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      console.log('Task deleted from Supabase:', id);
    } catch (error) {
      console.error("Error deleting task from Supabase:", error);
      // Revert local state if Supabase deletion failed
      set({ tasks: originalTasks });
    }
  },
  
  completeTask: (id) => set(state => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      const assignee = state.familyMembers.find(member => member.id === task.assignee);
      if (assignee) {
        state.addNotification({
          message: `${assignee.name} completed: ${task.title}`,
          related_task_id: id,
          user_id: assignee.user_id,
          created_at: new Date().toISOString()
        });
      }
      
      // Mark all subtasks as completed
      const updatedSubtasks = task.subtasks ? task.subtasks.map(st => ({
        ...st,
        completed: true
      })) : [];
      
      return {
        tasks: state.tasks.map(t => 
          t.id === id 
            ? { ...t, completed: true, subtasks: updatedSubtasks } 
            : t
        )
      };
    }
    return state;
  }),
  
  // Subtask Actions
  addSubtask: (taskId, subtask) => set(state => ({
    tasks: state.tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            subtasks: [...(task.subtasks || []), { ...subtask, id: uuidv4() }] 
          } 
        : task
    )
  })),
  
  updateSubtask: (taskId, subtaskId, completed) => set(state => ({
    tasks: state.tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            subtasks: task.subtasks 
              ? task.subtasks.map(subtask => 
                  subtask.id === subtaskId 
                    ? { ...subtask, completed } 
                    : subtask
                )
              : []
          } 
        : task
    )
  })),
  
  deleteSubtask: (taskId, subtaskId) => set(state => ({
    tasks: state.tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            subtasks: task.subtasks 
              ? task.subtasks.filter(subtask => subtask.id !== subtaskId)
              : []
          } 
        : task
    )
  })),
  
  // Family Member Actions
  addFamilyMember: async (memberInput: { 
    family_id: string; 
    user_id: string; // This should be the ID of an existing user in your 'users' table
    role: Role; 
    color_theme: string; 
  }) => {
    const newMemberRecord = {
      id: uuidv4(), // Client-side generated ID for optimistic update & Supabase insertion
      family_id: memberInput.family_id,
      user_id: memberInput.user_id,
      role: memberInput.role,
      color_theme: memberInput.color_theme,
      joined_at: new Date().toISOString(),
    };
    
    // For optimistic update, create a temporary FamilyMember object for the store.
    // This will lack the user's actual name and avatar until the next full data fetch from AppLayout,
    // or until a more sophisticated update mechanism is implemented here.
    const optimisticMember: FamilyMember = {
        ...newMemberRecord, // id, family_id, user_id, role, color_theme, joined_at
        name: 'New Member', // Placeholder name
        avatarUrl: undefined,    // Placeholder avatar
        // 'color' property for FamilyMember type was aliasing color_theme, ensure consistency if used
    };

    set(state => ({ familyMembers: [...state.familyMembers, optimisticMember] }));
    
    try {
      // Only insert columns that exist in the 'family_members' table.
      // 'name' and 'avatar_url' come from the related 'users' table via a join.
      const { data, error } = await supabase
        .from('family_members')
        .insert({
            id: newMemberRecord.id, // Explicitly send the client-generated ID
            family_id: newMemberRecord.family_id,
            user_id: newMemberRecord.user_id,
            role: newMemberRecord.role,
            color_theme: newMemberRecord.color_theme,
            joined_at: newMemberRecord.joined_at,
        })
        .select() // Select to get the confirmed record
        .single(); // Expecting a single record back
        
      if (error) throw error;

      console.log('Family Member added to Supabase:', data);
      
      // If Supabase insert was successful, update the optimistic entry with the confirmed data.
      // This is mainly useful if Supabase modifies/confirms any fields (e.g., if ID were server-generated).
      // The name and avatar will still be placeholders until the next AppLayout.fetchData call.
      if (data) {
        set(state => ({
            familyMembers: state.familyMembers.map(fm => 
                fm.id === newMemberRecord.id ? { ...optimisticMember, ...data, id: data.id } : fm
            )
        }));
      }

    } catch (error) {
      console.error("Error adding family member to Supabase:", error);
      // Revert local state if Supabase insertion failed
      set(state => ({ familyMembers: state.familyMembers.filter(fm => fm.id !== newMemberRecord.id) }));
    }
  },
  
  updateFamilyMember: async (id: string, updatedMemberData: Partial<FamilyMember>) => {
    // Optimistic update
    set(state => ({
      familyMembers: state.familyMembers.map(member => 
        member.id === id ? { ...member, ...updatedMemberData } : member
      )
    }));
    
    try {
      const { data, error } = await supabase
        .from('family_members')
        .update(updatedMemberData)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      console.log('Family Member updated in Supabase:', data);
    } catch (error) {
      console.error("Error updating family member in Supabase:", error);
      // Revert local state?
    }
  },
  
  deleteFamilyMember: async (id: string) => {
    const originalMembers = get().familyMembers;
    // Optimistic update
    set(state => ({
      familyMembers: state.familyMembers.filter(member => member.id !== id)
    }));
    
    // If deleting the currently selected member, deselect them
    if (get().selectedFamilyMember === id) {
      set({ selectedFamilyMember: null }); // Or select another member?
    }
    
    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      console.log('Family Member deleted from Supabase:', id);
    } catch (error) {
      console.error("Error deleting family member from Supabase:", error);
      // Revert local state
      set({ familyMembers: originalMembers, selectedFamilyMember: get().selectedFamilyMember }); // Restore selection too?
    }
  },
  
  selectFamilyMember: (id) => set({ selectedFamilyMember: id }),
  
  // Notification Actions
  addNotification: (notificationInput: Omit<Notification, 'id' | 'timestamp' | 'read'>) => set(state => {
    const newNotification: Notification = {
      ...notificationInput, // Spread necessary properties (message, user_id, related_task_id, type, etc.)
      id: uuidv4(),
      created_at: new Date().toISOString(), // Generate new creation timestamp
      read: false, // Default read status
    };

    return {
      notifications: [newNotification, ...state.notifications]
    };
  }),

  markNotificationAsRead: (id) => set(state => ({
    notifications: state.notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    )
  })),
  
  clearNotifications: () => set({ notifications: [] }),

  // Actions to hydrate store from backend
  setTasks: (tasks: Task[]) => set({ tasks }),
  setFamilyMembers: (members: FamilyMember[]) => set({ familyMembers: members }),
}), {
  name: 'tidytask-storage',
  skipHydration: true
}));
