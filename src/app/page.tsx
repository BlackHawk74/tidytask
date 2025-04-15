"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Spline from '@splinetool/react-spline';

export default function Home() {
  const features = [
    {
      title: "Task Management",
      description: "Create, assign, and track tasks with priorities and deadlines",
    },
    {
      title: "Family Collaboration",
      description: "Assign tasks to family members with custom color themes",
    },
    {
      title: "Beautiful Interface",
      description: "Enjoy a modern, responsive design that works on all devices",
    },
    {
      title: "Progress Tracking",
      description: "Monitor task completion with visual progress indicators",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="flex items-center gap-2"
            >
              <img 
                src="/logo_tidytask.png" 
                alt="TidyTask Logo" 
                className="h-8 w-auto" 
              />
              <span className="text-xl font-bold">TidyTask</span>
            </motion.div>
          </div>
          <Link 
            href="/auth" 
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-6"
              >
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3 mb-4"
                  >
                    <motion.img 
                      src="/logo_tidytask.png" 
                      alt="TidyTask Logo" 
                      className="h-12 w-auto" 
                      initial={{ rotate: -10, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    />
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
                  >
                    Family Task Management Made Simple
                  </motion.h1>
                  
                  <motion.p 
                    className="text-lg text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    TidyTask helps your family stay organized with a beautiful, collaborative task management system.
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Link
                      href="/auth"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative mx-auto w-full max-w-3xl rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-1 shadow-xl"
                style={{ height: '500px' }}
              >
                <div className="absolute inset-0 rounded-lg border border-primary/10 bg-background/80 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
                  <div className="h-full w-full">
                    <Spline scene="https://prod.spline.design/eVTtNvtotvFrjC1j/scene.splinecode" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Features</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to keep your family organized and on track.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { 
                      type: "spring", 
                      stiffness: 100, 
                      damping: 15, 
                      delay: index * 0.15,
                      duration: 0.8
                    }
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    transition: { type: "spring", stiffness: 400, damping: 15 }
                  }}
                  className="rounded-xl border bg-card p-6 transition-all"
                >
                  <motion.div 
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ 
                      scale: 1, 
                      opacity: 1,
                      transition: { delay: index * 0.15 + 0.3, duration: 0.5, type: "spring" }
                    }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, backgroundColor: "var(--primary-20)" }}
                  >
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </motion.div>
                  <motion.h3 
                    className="mb-2 text-xl font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: index * 0.15 + 0.4, duration: 0.5 }
                    }}
                    viewport={{ once: true }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p 
                    className="text-muted-foreground"
                    initial={{ opacity: 0 }}
                    whileInView={{ 
                      opacity: 1,
                      transition: { delay: index * 0.15 + 0.5, duration: 0.5 }
                    }}
                    viewport={{ once: true }}
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
              <h2 className="text-2xl font-bold md:text-3xl">Ready to get organized?</h2>
              <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
                Start using TidyTask today and transform how your family manages tasks.
              </p>
              <Link
                href="/auth"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-background px-6 py-3 font-medium text-foreground transition-colors hover:bg-background/90"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="mb-4 flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="group relative hover:text-primary">
              Privacy Policy
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/terms" className="group relative hover:text-primary">
              Terms of Service
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/cookies" className="group relative hover:text-primary">
              Cookie Policy
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/help" className="group relative hover:text-primary">
              Help Center
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
          <p>© {new Date().getFullYear()} TidyTask. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
