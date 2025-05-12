"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Check, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function ProfileSetupPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [colorTheme, setColorTheme] = useState("#4F46E5") // Default indigo
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Redirect if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!firstName.trim()) {
      toast({
        title: "First name required",
        description: "Please enter your first name to continue.",
        variant: "destructive",
      })
      return
    }
    
    if (!user) return
    
    setIsSubmitting(true)
    
    try {
      const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
      const userEmail = user.email || ''; // Get email from the user object

      // Create or update user profile in the users table
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          name: fullName,                 // Use the 'name' column
          email: userEmail,               // Add the email
          color_theme: colorTheme,
          setup_completed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (profileError) throw profileError
      
      // Create a default family for the user
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .insert({
          name: `${firstName.trim()}'s Family`, // Can adjust if lastName should be part of family name
          created_by: user.id,
          created_at: new Date().toISOString()
        })
        .select()
      
      if (familyError) throw familyError
      
      // Add user as admin to the family
      if (familyData && familyData[0]) {
        const { error: memberError } = await supabase
          .from('family_members')
          .insert({
            family_id: familyData[0].id,
            user_id: user.id,
            role: 'admin',
            color_theme: colorTheme // Using the user's theme for their member entry
          });
        
        if (memberError) throw memberError
      }
      
      toast({
        title: "Profile setup complete!",
        description: "Welcome to TidyTask. You're all set to start managing your family tasks.",
      })
      
      // Redirect to app dashboard
      router.push("/app")
    } catch (error: any) {
      console.error("Error setting up profile:", error)
      toast({
        title: "Profile setup failed",
        description: error.message || "There was an error setting up your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container flex h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Choose Your Color Theme</Label>
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
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                      Setting Up...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
