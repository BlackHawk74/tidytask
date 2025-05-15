"use client"

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HeaderBar } from "@/components/header-bar";
import { MobileNavBar } from "@/components/mobile-nav-bar";
import { DesktopNav } from "@/components/desktop-nav";
import { FloatingAddButton } from "@/components/floating-add-button";
import { supabase } from "@/lib/supabase"; 
import { useStore } from "@/lib/store"; 
import { Skeleton } from "@/components/ui/skeleton"; 
import { Task, FamilyMember } from "@/lib/types"; 

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter(); 
  const { setTasks, setFamilyMembers } = useStore(); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsFamilySetup, setNeedsFamilySetup] = useState(false); 

  useEffect(() => {
    const checkUserStatusAndFetchData = async () => {
      setIsLoading(true);
      setError(null);
      setNeedsFamilySetup(false);

      try {
        // 1. Check Session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session?.user) {
          console.log("No user session found, redirecting to login.");
          router.push('/'); // Redirect to auth/login if no user
          setIsLoading(false); // Stop loading
          return;
        }

        const userId = session.user.id;

        // 2. Check Profile Setup Status
        console.log(`Checking profile setup for user: ${userId}`);
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('setup_completed')
          .eq('id', userId)
          .single();

        // Handle potential errors fetching profile (e.g., RLS blocks, network issue)
        // Allow PGRST116 (Not Found) initially, as trigger might be slightly delayed, but redirect below handles it.
        if (profileError && profileError.code !== 'PGRST116') { 
            console.error(`Error fetching profile status: ${profileError.message}`);
            throw new Error(`Failed to fetch profile status: ${profileError.message}`);
        }

        // If profile doesn't exist yet OR setup is not completed, redirect.
        if (!profileData || !profileData.setup_completed) {
            // Only redirect if NOT already on profile-setup page to avoid loop
            if (pathname !== '/profile-setup') {
                console.log("Profile setup not complete or profile not found, redirecting to /profile-setup.");
                router.push('/profile-setup');
            }
            // Stop loading and further checks, let profile setup page render
            setIsLoading(false);
            return;
        }

        console.log(`Profile setup complete for user: ${userId}. Checking family membership.`);

        // 3. Check Family Membership (Only if profile setup is complete)
        const { data: memberData, error: memberError } = await supabase
          .from('family_members')
          .select('*') // Changed from 'family_id' to '*' for this check
          .eq('user_id', userId)
          .maybeSingle(); // Use maybeSingle for graceful handling of no family

        console.log("[AppLayout] Family membership raw memberData:", JSON.stringify(memberData, null, 2));

        // Check for genuine errors first. PGRST116 with null data is treated as 'not found' for .maybeSingle()
        if (memberError && memberError.code !== 'PGRST116') {
            console.error(`[AppLayout] Error checking family_members table. Code: ${memberError.code}, Details: ${memberError.details}, Message: ${memberError.message}, Hint: ${memberError.hint}`);
            throw new Error(`Failed to check family status. DB Error: ${memberError.message}`);
        }

        // If profile setup is complete BUT user is not in a family (memberData is null, and any PGRST116 error is ignored here)
        if (!memberData?.family_id) {
          console.warn("[AppLayout] User profile setup complete, but not in a family (or memberData is null with acceptable PGRST116). Prompting for family setup.");
          setNeedsFamilySetup(true);
          setIsLoading(false);
          return; // Render the Create/Join Family screen
        }

        console.log(`[AppLayout] User belongs to family ${memberData.family_id}. Fetching app data.`);

        // 4. Fetch App Data (Only if profile setup complete AND user is in a family)
        const familyId = memberData.family_id;

        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('family_id', familyId);

        if (tasksError) throw tasksError;

        const { data: familyMembersData, error: familyMembersError } = await supabase
          .from('family_members')
          .select(`
            id,
            family_id,
            user_id,
            role,
            color_theme,
            joined_at,
            users ( id, name, avatar_url )
          `)
          .eq('family_id', familyId);

        if (familyMembersError) throw familyMembersError;
        
        const formattedFamilyMembers = familyMembersData?.map((member: any) => ({
          id: member.id,
          family_id: member.family_id,
          user_id: member.user_id,
          role: member.role,
          color_theme: member.color_theme,
          joined_at: member.joined_at,
          name: member.users?.name ?? 'Unknown',
          avatarUrl: member.users?.avatar_url ?? undefined,
          color: member.color_theme, 
        })) || [];

        setTasks(tasksData as Task[] || []);
        setFamilyMembers(formattedFamilyMembers as FamilyMember[]);

      } catch (err: any) {
        console.error("Full error object during data fetch:", err); 
        console.error("Error fetching data (message property):", err.message);
        console.error("Error fetching data (stringified):", String(err));
        setError(err.message || String(err) || "An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatusAndFetchData();
  // Add pathname to dependency array because we use it in the redirect logic
  }, [router, setTasks, setFamilyMembers, pathname]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Skeleton className="h-16 w-full" /> 
        <div className="flex flex-1">
          <Skeleton className="hidden md:block w-64 h-full" /> 
          <main className="flex-1 p-4">
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-64 w-full" />
          </main>
        </div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-card p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-destructive mb-4">Failed to load data</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (needsFamilySetup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <div className="bg-card p-8 sm:p-12 rounded-xl shadow-2xl text-center max-w-md w-full">
          <h2 className="text-3xl font-bold text-foreground mb-3">Welcome to TidyTask!</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            To get started, you can create a new family or join an existing one if you have a code.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => router.push('/app/family/create')}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/80 text-lg font-semibold transition-colors duration-150"
            >
              Create a New Family
            </button>
            <button
              onClick={() => router.push('/app/family/join')}
              className="w-full bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/80 text-lg font-semibold transition-colors duration-150"
            >
              Join with a Code
            </button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Alternatively, an existing family admin can also add you to their family group directly.
          </p>
        </div>
      </div>
    );
  }

  const hideAddButtonPaths = ["/app/profile", "/app/settings"];
  const shouldShowAddButton = !hideAddButtonPaths.includes(pathname) && !isLoading;

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderBar />
      <div className="flex flex-1">
        <DesktopNav />
        <main className="flex-1 md:ml-[80px] transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
      {shouldShowAddButton && <FloatingAddButton />}
      <MobileNavBar />
    </div>
  );
}
