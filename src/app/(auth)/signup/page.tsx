"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signup } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { AlertCircle, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-zinc-950 flex-row-reverse">
      
      {/* Right Image Section */}
      <div className="relative hidden w-1/2 lg:flex flex-col justify-between overflow-hidden bg-zinc-950">
        <Image
          src="/hero-model-seated.png"
          alt="Athlete"
          fill
          priority
          className="object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        
        <div className="relative z-10 p-12 text-right">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Back to store
            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </Link>
        </div>
        
        <div className="relative z-10 p-12 mt-auto text-right">
          <h2 className="text-4xl font-black italic tracking-widest uppercase text-white">
            OFF<br />REP
          </h2>
          <p className="mt-4 text-zinc-400 font-medium tracking-wide flex flex-col items-end gap-2">
            <span><CheckCircle2 className="inline-block mr-2 h-4 w-4 text-zinc-500" /> Member exclusive drops</span>
            <span><CheckCircle2 className="inline-block mr-2 h-4 w-4 text-zinc-500" /> Early access to restocks</span>
            <span><CheckCircle2 className="inline-block mr-2 h-4 w-4 text-zinc-500" /> Faster checkout</span>
          </p>
        </div>
      </div>

      {/* Left Form Section */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex flex-col space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Create an account
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Join OFFREP to elevate your experience
            </p>
          </div>

          <form action={formAction} className="space-y-6 mt-8">
            {state?.error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>{state.error}</span>
              </div>
            )}
            {state?.success && (
              <div className="flex items-center gap-2 rounded-md bg-emerald-50 p-3 text-sm text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{state.success}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-semibold">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="h-12 border-zinc-200/80 bg-zinc-50 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus-visible:ring-zinc-350"
                />
              </div>

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
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="h-12 border-zinc-200/80 bg-zinc-50 pr-10 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus-visible:ring-zinc-350"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="h-12 w-full text-base font-bold uppercase tracking-wide bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all"
            >
              {isPending ? "Creating account..." : "Sign Up"}
            </Button>
            
            <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-zinc-900 hover:underline dark:text-zinc-50">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="relative hidden w-1/2 lg:flex flex-col justify-between overflow-hidden bg-zinc-950">
        <Image
          src="/hero-mobile.jpg"
          alt="Athlete"
          fill
          priority
          className="object-cover opacity-50 grayscale mix-blend-overlay scale-x-[-1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/60" />
        
        <div className="relative z-10 p-12 flex justify-end">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Back to Home
            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </Link>
        </div>

        <div className="relative z-10 p-12 text-right">
          <div className="flex justify-end mb-6">
            <Image src="/logo.png" alt="OFF-REP" width={80} height={30} className="invert" />
          </div>
          <h2 className="text-4xl font-black italic tracking-widest uppercase text-white">
            Live OFF-REP.
          </h2>
          <p className="mt-4 ml-auto max-w-sm text-lg text-zinc-400">
            Join thousands of athletes who trust our gear for their hardest workouts.
          </p>
        </div>
      </div>
      
    </div>
  );
}
