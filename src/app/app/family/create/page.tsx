"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
// Ensure Role is imported if you use it, though it's not directly used in this version for family creation default.
// import { Role } from '@/lib/types'; 

export default function CreateFamilyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [familyName, setFamilyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateFamily = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!familyName.trim()) {
      toast({
        title: 'Family name required',
        description: 'Please enter a name for your family.',
        variant: 'destructive',
      });
      return;
    }
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to create a family.',
        variant: 'destructive',
      });
      router.push('/auth/login'); 
      return;
    }

    setIsLoading(true);

    try {
      // Call the Supabase Edge Function 'create-family'
      // This is more secure and robust as it bundles DB operations server-side.
      const { data, error: functionError } = await supabase.functions.invoke('create-family', {
        body: { familyName: familyName.trim() }, // Pass familyName in the request body
      });

      if (functionError) {
        // Handle errors from invoking the function itself (e.g., network, function not found)
        console.error('Supabase function invocation error:', functionError);
        throw new Error(functionError.message || 'Failed to connect to the family creation service.');
      }

      // The function itself might return an error object if something went wrong internally
      if (data && data.error) {
         console.error('Error returned from create-family function:', data.error);
        throw new Error(data.error || 'An error occurred while creating the family.');
      }
      
      // Assuming the function returns { family: {...}, familyCode: "..." } on success
      const createdFamily = data.family;
      const familyCode = data.familyCode;

      if (!createdFamily || !familyCode) {
        console.error('Invalid response from create-family function:', data);
        throw new Error('Received an invalid response from the server.');
      }

      toast({
        title: 'Family Created!',
        description: `Successfully created ${createdFamily.name}. Your family code is: ${familyCode}. Share it with members to join!`,
        duration: 10000, // Show longer for copying code
      });
      
      // Force a refresh of the current route to re-run server components and loaders,
      // then push to the dashboard. This helps ensure AppLayout re-evaluates user state.
      router.refresh(); 
      setTimeout(() => { // Give refresh a moment before navigating
          router.push('/app/dashboard'); 
      }, 100);


    } catch (error: any) {
      console.error('Create family error on client:', error);
      toast({
        title: 'Error Creating Family',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-primary/70 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">Create Your Family</CardTitle>
          <CardDescription className="text-center text-muted-foreground pt-2">
            Give your family a name to get started. A unique code will be generated for others to join.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateFamily} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="familyName" className="text-sm font-medium text-foreground">Family Name</label>
              <Input
                id="familyName"
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="e.g., The Awesome Smiths"
                required
                className="w-full"
                aria-describedby="familyName-help"
              />
              <p id="familyName-help" className="text-xs text-muted-foreground pt-1">
                Choose a fun and recognizable name for your family group.
              </p>
            </div>
            <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Family & Get Code'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-center text-center">
           <p className="text-xs text-muted-foreground mt-4">
            After creation, you'll receive a unique family code to share with members.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}