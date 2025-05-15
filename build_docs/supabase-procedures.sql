-- Create stored procedures for database setup

-- Create users table procedure
CREATE OR REPLACE FUNCTION create_users_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    color_theme TEXT,
    setup_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );
  
  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
END;
$$;

-- Create families table procedure
CREATE OR REPLACE FUNCTION create_families_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.families (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );
  
  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_families_created_by ON public.families (created_by);
END;
$$;

-- Create family_members table procedure
CREATE OR REPLACE FUNCTION create_family_members_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.family_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    family_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role TEXT NOT NULL,
    color_theme TEXT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );
  
  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_family_members_family_id ON public.family_members (family_id);
  CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON public.family_members (user_id);
  
  -- Create unique constraint
  ALTER TABLE IF EXISTS public.family_members 
  ADD CONSTRAINT IF NOT EXISTS unique_family_user 
  UNIQUE (family_id, user_id);
END;
$$;

-- Create tasks table procedure
CREATE OR REPLACE FUNCTION create_tasks_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    family_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    assigned_to UUID,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );
  
  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_tasks_family_id ON public.tasks (family_id);
  CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks (assigned_to);
  CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks (status);
END;
$$;

-- Create subtasks table procedure
CREATE OR REPLACE FUNCTION create_subtasks_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.subtasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );
  
  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON public.subtasks (task_id);
END;
$$;

-- Create notifications table procedure
CREATE OR REPLACE FUNCTION create_notifications_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    task_id UUID,
    read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );
  
  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
  CREATE INDEX IF NOT EXISTS idx_notifications_task_id ON public.notifications (task_id);
END;
$$;
