"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Check, Edit, LogOut, Plus, Save, Trash2, User, UserPlus } from "lucide-react"
import { useStore } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Role } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const { familyMembers, addFamilyMember, deleteFamilyMember } = useStore()
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  // Family member management state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("member")
  const [newMemberColor, setNewMemberColor] = useState("#4F46E5")
  
  // User profile management state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [name, setName] = useState("")
  const [colorTheme, setColorTheme] = useState("#4F46E5")
  const [isUpdating, setIsUpdating] = useState(false)
  
  const colorOptions = [
    { name: "Indigo", value: "#4F46E5" },
    { name: "Red", value: "#EF4444" },
    { name: "Green", value: "#10B981" },
    { name: "Orange", value: "#F97316" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Yellow", value: "#F59E0B" },
  ]
  
  const handleAddMember = () => {
    if (newMemberName.trim()) {
      // Create family member with required fields for database schema
      addFamilyMember({
        name: newMemberName.trim(),
        role: newMemberRole as Role,
        color: newMemberColor,
        color_theme: newMemberColor,
        avatarUrl: `https://api.dicebear.com/7.x/personas/svg?seed=${newMemberName.trim()}`,
        family_id: 'default', // Will be assigned by the store
        user_id: 'default',   // Will be assigned by the store
        joined_at: new Date().toISOString()
      })
      setNewMemberName("")
      setNewMemberRole("Member")
      setNewMemberColor("#4F46E5")
      setIsAddMemberOpen(false)
    }
  }
  
  // Load user profile data when component mounts
  useEffect(() => {
    // Create a flag to track if the component is still mounted
    let isMounted = true;
    
    const loadUserProfile = async () => {
      // Make sure we have a user and the component is still mounted
      if (!user || !isMounted) return;
      
      try {
        // First check if the user exists in the database
        const { data, error } = await supabase
          .from('users')
          .select('name, color_theme')
          .eq('id', user.id)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            // User doesn't exist yet, create a default profile
            const defaultProfile = {
              id: user.id,
              name: '',
              email: user.email,
              color_theme: '#4F46E5',
              setup_completed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            // Insert the new user
            const { error: insertError } = await supabase
              .from('users')
              .insert(defaultProfile);
              
            if (insertError) {
              console.error('Error creating user profile:', insertError);
              
              // Still set default values even if insert fails
              if (isMounted) {
                setName('');
                setColorTheme('#4F46E5');
              }
              return;
            }
            
            // Use default values
            if (isMounted) {
              setName('');
              setColorTheme('#4F46E5');
            }
            return;
          }
          
          console.error('Error loading user profile:', error);
          
          // Set default values on error
          if (isMounted) {
            setName('');
            setColorTheme('#4F46E5');
          }
          return;
        }
        
        if (data && isMounted) {
          setName(data.name || '');
          setColorTheme(data.color_theme || '#4F46E5');
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        
        // Set default values even if there's an error
        if (isMounted) {
          setName('');
          setColorTheme('#4F46E5');
        }
      }
    };
    
    // Add a small delay to ensure auth is fully initialized
    const timer = setTimeout(() => {
      loadUserProfile();
    }, 500);
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [user]);
  
  // Handle user profile update
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: name.trim(),
          color_theme: colorTheme,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="container mx-auto max-w-3xl py-6 px-4">
      <Tabs defaultValue="family" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="family">Family Members</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="family" className="mt-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Family Members</h2>
            <Button 
              onClick={() => setIsAddMemberOpen(true)} 
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {familyMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback style={{ backgroundColor: member.color }}>
                          {member.name ? member.name.charAt(0) : '?'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">{member.name || 'Unknown'}</h3>
                        <div className="mt-1 flex items-center gap-2">
                          <span 
                            className="inline-block h-3 w-3 rounded-full" 
                            style={{ backgroundColor: member.color }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteFamilyMember(member.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Profile</h2>
            {!isEditingProfile ? (
              <Button 
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <Button 
                onClick={() => setIsEditingProfile(false)}
                variant="outline"
              >
                Cancel
              </Button>
            )}
          </div>
          
          <Card>
            <CardContent className="p-6">
              {!isEditingProfile ? (
                <div className="flex items-start gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/personas/svg?seed=${name || 'user'}`} 
                      alt={name || 'User avatar'}
                    />
                    <AvatarFallback style={{ backgroundColor: colorTheme }}>
                      {name ? name.charAt(0) : user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium">{name}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                        <p>{name || 'Not set'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Color Theme</h4>
                        <div className="mt-1 flex items-center gap-2">
                          <span 
                            className="inline-block h-4 w-4 rounded-full" 
                            style={{ backgroundColor: colorTheme }}
                          />
                          <span>{colorOptions.find(c => c.value === colorTheme)?.name || 'Custom'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 text-destructive" 
                        onClick={async () => {
                          await signOut();
                          router.push('/login');
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isUpdating}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Color Theme</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            className={`h-10 rounded-md transition-all ${
                              colorTheme === color.value 
                                ? "ring-2 ring-offset-2 ring-primary" 
                                : "hover:scale-110"
                            }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setColorTheme(color.value)}
                            aria-label={`Select ${color.name} theme`}
                          >
                            {colorTheme === color.value && (
                              <Check className="h-5 w-5 text-white mx-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full flex items-center justify-center gap-2" 
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="memberName">Name</Label>
              <Input
                id="memberName"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`h-8 w-8 rounded-full border-2 ${
                      newMemberColor === color.value
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setNewMemberColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={!newMemberName.trim()}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
