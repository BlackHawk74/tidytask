export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          avatar_url: string | null
          color_theme: string | null
          setup_completed: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          color_theme?: string | null
          setup_completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          color_theme?: string | null
          setup_completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      families: {
        Row: {
          id: string
          name: string
          created_by: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_by?: string
          created_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          family_id: string
          user_id: string
          role: string
          color_theme: string
          joined_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id: string
          role?: string
          color_theme?: string
          joined_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string
          role?: string
          color_theme?: string
          joined_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          family_id: string
          title: string
          description: string | null
          status: string
          priority: string
          due_date: string | null
          created_by: string
          assigned_to: string | null
          created_at: string
          updated_at: string
          completed: boolean | null
        }
        Insert: {
          id?: string
          family_id: string
          title: string
          description?: string | null
          status: string
          priority: string
          due_date?: string | null
          created_by: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          completed?: boolean | null
        }
        Update: {
          id?: string
          family_id?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          created_by?: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          completed?: boolean | null
        }
      }
      subtasks: {
        Row: {
          id: string
          task_id: string
          title: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          title?: string
          completed?: boolean
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          message: string
          read: boolean
          created_at: string
          type: string | null
          related_task_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          read?: boolean
          created_at?: string
          type?: string | null
          related_task_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          read?: boolean
          created_at?: string
          type?: string | null
          related_task_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
