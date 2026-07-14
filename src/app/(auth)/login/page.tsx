"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-zinc-950">
      {/* Left Image Section */}
      <div className="relative hidden w-1/2 lg:flex flex-col justify-between overflow-hidden bg-zinc-950">
        <Image
          src="/hero-mobile.jpg"
          alt="Athlete"
          fill
          priority
          className="object-cover opacity-50 grayscale mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/60" />
        
        <div className="relative z-10 p-12">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="relative z-10 p-12">
          <Image src="/logo.png" alt="OFF-REP" width={80} height={30} className="invert mb-6" />
          <h2 className="text-4xl font-black italic tracking-widest uppercase text-white">
            Earn Every Rep.
          </h2>
          <p className="mt-4 max-w-sm text-lg text-zinc-400">
            Push your limits with premium performance gear designed for athletes.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="lg:hidden inline-block mb-8">
              <Image src="/logo.png" alt="OFF-REP" width={64} height={24} className="dark:invert" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome back to OFF-REP
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Enter your email and password to log in to your account
            </p>
          </div>

          <form action={formAction} className="space-y-6 mt-8">
            {state?.error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>{state.error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="h-12 border-zinc-200/80 bg-zinc-50 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus-visible:ring-zinc-350"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-semibold">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="h-12 border-zinc-200/80 bg-zinc-50 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus-visible:ring-zinc-350"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="h-12 w-full text-base font-bold uppercase tracking-wide bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all"
            >
              {isPending ? "Logging in..." : "Log in"}
            </Button>
          </form>
          
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-zinc-900 hover:underline dark:text-zinc-50">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
