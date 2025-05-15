-- Supabase Database Schema for TidyTask

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  color_theme TEXT,
  setup_completed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create families table
CREATE TABLE IF NOT EXISTS public.families (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES public.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

-- Create family_members table
CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  family_id UUID REFERENCES public.families NOT NULL,
  user_id UUID REFERENCES public.users NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  color_theme TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE (family_id, user_id)
);
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  family_id UUID REFERENCES public.families NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('Today', 'Upcoming', 'Completed', 'Overdue')),
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  due_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.users NOT NULL,
  assigned_to UUID REFERENCES public.users,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create subtasks table
CREATE TABLE IF NOT EXISTS public.subtasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  message TEXT NOT NULL,
  task_id UUID REFERENCES public.tasks,
  read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- Users can read their own profile
CREATE POLICY "Users can read their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Family members can read other family members
CREATE POLICY "Family members can read other family members" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm1
      JOIN public.family_members fm2 ON fm1.family_id = fm2.family_id
      WHERE fm1.user_id = auth.uid() AND fm2.user_id = public.users.id
    )
  );

-- Family members can read their families
CREATE POLICY "Family members can read their families" ON public.families
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.family_id = families.id AND family_members.user_id = auth.uid()
    )
  );

-- Family admins can update their families
CREATE POLICY "Family admins can update their families" ON public.families
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.family_id = families.id 
        AND family_members.user_id = auth.uid()
        AND family_members.role = 'admin'
    )
  );

-- Family members can read family membership
CREATE POLICY "Family members can read family membership" ON public.family_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.family_id = family_members.family_id AND fm.user_id = auth.uid()
    )
  );

-- Family admins can create family members
CREATE POLICY "Family admins can create family members" ON public.family_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.family_id = family_members.family_id 
        AND fm.user_id = auth.uid()
        AND fm.role = 'admin'
    )
  );

-- Family admins can update family members
CREATE POLICY "Family admins can update family members" ON public.family_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.family_id = family_members.family_id 
        AND fm.user_id = auth.uid()
        AND fm.role = 'admin'
    )
  );

-- Family admins can delete family members
CREATE POLICY "Family admins can delete family members" ON public.family_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.family_id = family_members.family_id 
        AND fm.user_id = auth.uid()
        AND fm.role = 'admin'
    )
  );

-- Family members can read tasks in their families
CREATE POLICY "Family members can read tasks in their families" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.family_id = tasks.family_id AND family_members.user_id = auth.uid()
    )
  );

-- Family members can create tasks in their families
CREATE POLICY "Family members can create tasks in their families" ON public.tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.family_id = tasks.family_id AND family_members.user_id = auth.uid()
    )
  );

-- Family members can update tasks in their families
CREATE POLICY "Family members can update tasks in their families" ON public.tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.family_id = tasks.family_id AND family_members.user_id = auth.uid()
    )
  );

-- Family members can delete tasks in their families
CREATE POLICY "Family members can delete tasks in their families" ON public.tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.family_id = tasks.family_id AND family_members.user_id = auth.uid()
    )
  );

-- Family members can read subtasks in their families
CREATE POLICY "Family members can read subtasks in their families" ON public.subtasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.tasks ON tasks.family_id = family_members.family_id
      WHERE tasks.id = subtasks.task_id AND family_members.user_id = auth.uid()
    )
  );

-- Family members can create subtasks in their families
CREATE POLICY "Family members can create subtasks in their families" ON public.subtasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.tasks ON tasks.family_id = family_members.family_id
      WHERE tasks.id = subtasks.task_id AND family_members.user_id = auth.uid()
    )
  );

-- Family members can update subtasks in their families
CREATE POLICY "Family members can update subtasks in their families" ON public.subtasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.tasks ON tasks.family_id = family_members.family_id
      WHERE tasks.id = subtasks.task_id AND family_members.user_id = auth.uid()
    )
  );

-- Family members can delete subtasks in their families
CREATE POLICY "Family members can delete subtasks in their families" ON public.subtasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      JOIN public.tasks ON tasks.family_id = family_members.family_id
      WHERE tasks.id = subtasks.task_id AND family_members.user_id = auth.uid()
    )
  );

-- Users can read their own notifications
CREATE POLICY "Users can read their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications
CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_family_members_family_id ON public.family_members (family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON public.family_members (user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_family_id ON public.tasks (family_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks (assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks (status);
CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON public.subtasks (task_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_task_id ON public.notifications (task_id);

-- Create function to handle task status updates
CREATE OR REPLACE FUNCTION update_task_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If all subtasks are completed, mark the task as completed
  IF NEW.completed = TRUE AND (
    SELECT COUNT(*) = 0 OR COUNT(*) = COUNT(CASE WHEN completed = TRUE THEN 1 END)
    FROM public.subtasks
    WHERE task_id = NEW.task_id
  ) THEN
    UPDATE public.tasks SET completed = TRUE WHERE id = NEW.task_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for subtask completion
CREATE TRIGGER subtask_completed_trigger
AFTER UPDATE OF completed ON public.subtasks
FOR EACH ROW
WHEN (OLD.completed IS DISTINCT FROM NEW.completed)
EXECUTE FUNCTION update_task_status();

-- Create function to handle task status based on due date
CREATE OR REPLACE FUNCTION update_overdue_tasks()
RETURNS VOID AS $$
BEGIN
  UPDATE public.tasks
  SET status = 'Overdue'
  WHERE 
    completed = FALSE AND 
    due_date < NOW() AND
    status != 'Overdue';
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to run the overdue task update function daily
SELECT cron.schedule('0 0 * * *', 'SELECT update_overdue_tasks()');
