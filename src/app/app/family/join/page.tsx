"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

export default function JoinFamilyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [familyCode, setFamilyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinFamily = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!familyCode.trim()) {
      toast({
        title: 'Family code required',
        description: 'Please enter the code to join a family.',
        variant: 'destructive',
      });
      return;
    }
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to join a family.',
        variant: 'destructive',
      });
      router.push('/auth'); // Or your login page
      return;
    }

    setIsLoading(true);
    try {
      // Call the 'join-family' Edge Function
      const { data, error: functionInvokeError } = await supabase.functions.invoke('join-family', {
        body: { familyCode: familyCode.trim().toUpperCase() }, // Send trimmed and uppercased code
      });

      if (functionInvokeError) {
        // Handle network errors or if the function itself crashes before returning a structured response
        console.error("Function invoke error:", functionInvokeError);
        throw new Error(functionInvokeError.message || "Error calling join function.");
      }

      if (data && data.error) { 
        // Handle business logic errors returned by the function (e.g., invalid code, already member)
        console.error("Function returned an error:", data.error);
        throw new Error(data.error);
      }
      
      toast({
        title: data?.message || 'Successfully joined family!', // Use message from function if available
        description: "You're now part of the family.",
      });
      router.push('/app'); // Redirect to the main app dashboard
    } catch (error: any) {
      console.error('Error joining family:', error);
      toast({
        title: 'Failed to join family',
        description: error.message || 'An unexpected error occurred. Please check the code and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <Button variant="ghost" size="icon" className="absolute top-4 left-4" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-2xl font-bold text-center pt-8">Join a Family</CardTitle>
          <CardDescription className="text-center">
            Enter the unique code provided by a family member to join their TidyTask family.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinFamily} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="familyCode" className="text-sm font-medium">Family Code</Label>
              <Input
                id="familyCode"
                type="text"
                placeholder="Enter 6-character code"
                value={familyCode}
                onChange={(e) => setFamilyCode(e.target.value.toUpperCase())} // Codes often case-insensitive or uppercase
                className="h-12 text-lg tracking-wider text-center"
                maxLength={10} // Assuming family codes are relatively short
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? 'Joining...' : 'Join Family'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p>If you don't have a code, ask an existing family member or create your own family.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
