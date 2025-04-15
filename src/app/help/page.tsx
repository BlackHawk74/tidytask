"use client"

import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HelpCenter() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="mx-auto text-xl font-bold">Help Center</div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">How can we help you?</h1>
            <p className="mt-2 text-muted-foreground">
              Search our knowledge base or browse the categories below
            </p>
            
            <div className="mt-6 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search for help..." 
                  className="pl-10" 
                />
              </div>
              <Button type="submit">Search</Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Getting Started</h2>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Creating your first task
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Adding family members
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Setting up your profile
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Understanding the dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Task Management</h2>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Creating and editing tasks
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Setting priorities and deadlines
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Assigning tasks to family members
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Using the calendar view
                  </Link>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Account Settings</h2>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Updating your profile
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Managing notifications
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Changing your password
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Deleting your account
                  </Link>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Troubleshooting</h2>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Common issues and solutions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    App not loading properly
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Missing tasks or family members
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Notification problems
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-6 text-center">
            <h2 className="text-xl font-semibold">Still need help?</h2>
            <p className="mt-2">
              Our support team is ready to assist you with any questions or issues.
            </p>
            <Button className="mt-4">Contact Support</Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TidyTask. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
