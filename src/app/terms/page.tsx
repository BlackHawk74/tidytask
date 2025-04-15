"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="mx-auto text-xl font-bold">Terms of Service</div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Terms of Service</h1>
            <p className="mt-2 text-muted-foreground">Last updated: April 15, 2025</p>
          </div>

          <section>
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By accessing or using TidyTask, you agree to be bound by these Terms of Service and all applicable 
              laws and regulations. If you do not agree with any of these terms, you are prohibited from using or 
              accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Use License</h2>
            <p className="mt-2">
              Permission is granted to temporarily use TidyTask for personal, non-commercial transitory viewing only. 
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on TidyTask</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
            <p className="mt-2">
              This license shall automatically terminate if you violate any of these restrictions and may be 
              terminated by TidyTask at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. User Accounts</h2>
            <p className="mt-2">
              When you create an account with us, you must provide information that is accurate, complete, and 
              current at all times. Failure to do so constitutes a breach of the Terms, which may result in 
              immediate termination of your account on our Service.
            </p>
            <p className="mt-2">
              You are responsible for safeguarding the password that you use to access the Service and for any 
              activities or actions under your password. You agree not to disclose your password to any third party. 
              You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Intellectual Property</h2>
            <p className="mt-2">
              The Service and its original content, features, and functionality are and will remain the exclusive 
              property of TidyTask and its licensors. The Service is protected by copyright, trademark, and other 
              laws of both the United States and foreign countries. Our trademarks and trade dress may not be used 
              in connection with any product or service without the prior written consent of TidyTask.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Termination</h2>
            <p className="mt-2">
              We may terminate or suspend your account immediately, without prior notice or liability, for any 
              reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="mt-2">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate 
              your account, you may simply discontinue using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Limitation of Liability</h2>
            <p className="mt-2">
              In no event shall TidyTask, nor its directors, employees, partners, agents, suppliers, or affiliates, 
              be liable for any indirect, incidental, special, consequential or punitive damages, including without 
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your 
              access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Changes to Terms</h2>
            <p className="mt-2">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a 
              revision is material we will try to provide at least 30 days' notice prior to any new terms taking 
              effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Contact Us</h2>
            <p className="mt-2">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email</strong>: terms@tidytask.com<br />
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
