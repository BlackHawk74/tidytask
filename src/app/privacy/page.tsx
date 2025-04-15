"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="mx-auto text-xl font-bold">Privacy Policy</div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="mt-2 text-muted-foreground">Last updated: April 15, 2025</p>
          </div>

          <section>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p className="mt-2">
              Welcome to TidyTask. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our 
              website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. The Data We Collect</h2>
            <p className="mt-2">
              We collect and process the following data:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-2">
              <li>
                <strong>Personal identification information</strong>: Name, email address, and profile information.
              </li>
              <li>
                <strong>Task data</strong>: Information about tasks you create, modify, and complete.
              </li>
              <li>
                <strong>Family member information</strong>: Names and details of family members you add to your account.
              </li>
              <li>
                <strong>Usage data</strong>: Information about how you use our website and services.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. How We Use Your Data</h2>
            <p className="mt-2">
              We use your personal data for the following purposes:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features of our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Data Security</h2>
            <p className="mt-2">
              We have implemented appropriate security measures to prevent your personal data from being 
              accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, 
              we limit access to your personal data to those employees, agents, contractors, and other third 
              parties who have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Your Rights</h2>
            <p className="mt-2">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-2">
              <li>The right to request access to your personal data</li>
              <li>The right to request correction of your personal data</li>
              <li>The right to request erasure of your personal data</li>
              <li>The right to object to processing of your personal data</li>
              <li>The right to request restriction of processing your personal data</li>
              <li>The right to request transfer of your personal data</li>
              <li>The right to withdraw consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Contact Us</h2>
            <p className="mt-2">
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email</strong>: privacy@tidytask.com<br />
              <strong>Address</strong>: 123 Task Street, Organization City, OC 12345
            </p>
          </section>
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
