"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CookiePolicy() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="mx-auto text-xl font-bold">Cookie Policy</div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Cookie Policy</h1>
            <p className="mt-2 text-muted-foreground">Last updated: April 15, 2025</p>
          </div>

          <section>
            <h2 className="text-xl font-semibold">1. What Are Cookies</h2>
            <p className="mt-2">
              Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is 
              stored in your web browser and allows the Service or a third-party to recognize you and make your 
              next visit easier and the Service more useful to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. How TidyTask Uses Cookies</h2>
            <p className="mt-2">
              When you use and access the Service, we may place a number of cookies files in your web browser.
              We use cookies for the following purposes:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-2">
              <li>
                <strong>Essential cookies</strong>: These cookies are required for the operation of our website. 
                They include, for example, cookies that enable you to log into secure areas of our website.
              </li>
              <li>
                <strong>Analytical/performance cookies</strong>: These allow us to recognize and count the number 
                of visitors and to see how visitors move around our website when they are using it. This helps us 
                to improve the way our website works, for example, by ensuring that users are finding what they 
                are looking for easily.
              </li>
              <li>
                <strong>Functionality cookies</strong>: These are used to recognize you when you return to our 
                website. This enables us to personalize our content for you, greet you by name and remember your 
                preferences (for example, your choice of language or region).
              </li>
              <li>
                <strong>Targeting cookies</strong>: These cookies record your visit to our website, the pages you 
                have visited and the links you have followed. We will use this information to make our website and 
                the advertising displayed on it more relevant to your interests.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Types of Cookies We Use</h2>
            <p className="mt-2">
              We use both session and persistent cookies on the Service and we use different types of cookies to 
              run the Service:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-2">
              <li>
                <strong>Session Cookies</strong>: We use Session Cookies to operate our Service. Session Cookies 
                are temporary and deleted from your computer when your web browser closes.
              </li>
              <li>
                <strong>Persistent Cookies</strong>: We use Persistent Cookies to remember your preferences and 
                various settings. Persistent Cookies remain on your computer after you close your web browser or 
                until you delete them.
              </li>
              <li>
                <strong>Third-party Cookies</strong>: We may use various third-party cookies to report usage 
                statistics of the Service and deliver advertisements on and through the Service.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Your Choices Regarding Cookies</h2>
            <p className="mt-2">
              If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please 
              visit the help pages of your web browser.
            </p>
            <p className="mt-2">
              Please note, however, that if you delete cookies or refuse to accept them, you might not be able to 
              use all of the features we offer, you may not be able to store your preferences, and some of our 
              pages might not display properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Where Can You Find More Information About Cookies</h2>
            <p className="mt-2">
              You can learn more about cookies and the following third-party websites:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-2">
              <li>AllAboutCookies: <a href="https://www.allaboutcookies.org/" className="text-primary hover:underline">https://www.allaboutcookies.org/</a></li>
              <li>Network Advertising Initiative: <a href="https://www.networkadvertising.org/" className="text-primary hover:underline">https://www.networkadvertising.org/</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Contact Us</h2>
            <p className="mt-2">
              If you have any questions about our Cookie Policy, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email</strong>: cookies@tidytask.com<br />
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
