
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, LogInIcon, UserCircle, Briefcase } from "lucide-react"; // Changed LogIn to LogInIcon
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_USERS_KEY = "telehealthAppUsers";
const LOCAL_STORAGE_CURRENT_USER_KEY = "telehealthAppCurrentUser";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Min 1 for login
  role: z.enum(["patient", "doctor"], { required_error: "Please select a role." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface StoredUser {
  email: string;
  passwordHash: string; // Plain text for demo
  role: "patient" | "doctor";
}

interface CurrentUser {
  email: string;
  role: "patient" | "doctor";
}


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if user is already logged in and if their role matches potential dashboard
    const userStr = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    if (userStr) {
      const user: CurrentUser = JSON.parse(userStr);
      if (user.role === 'doctor') {
        router.push("/doctor/dashboard");
      } else {
        router.push("/"); 
      }
    }
  }, [router]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "patient",
    },
  });

  function onSubmit(data: LoginFormValues) {
    if(!isClient) return;

    const existingUsersString = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const users: StoredUser[] = existingUsersString ? JSON.parse(existingUsersString) : [];

    const foundUser = users.find(
      user => user.email.toLowerCase() === data.email.toLowerCase() && 
              user.passwordHash === data.password && // In real app, compare HASHED passwords
              user.role === data.role
    );

    if (foundUser) {
      const currentUser: CurrentUser = { email: foundUser.email, role: foundUser.role };
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(currentUser));
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${foundUser.role === 'doctor' ? 'Dr. ' : ''}${foundUser.email.split('@')[0]}!`,
        variant: "default",
        className: "bg-green-600 text-white dark:bg-green-700 dark:text-white",
      });
      
      window.dispatchEvent(new Event('authChange'));

      if (foundUser.role === 'doctor') {
        router.push("/doctor/dashboard");
      } else {
        router.push("/"); 
      }
      // router.refresh(); // Force refresh to re-evaluate layout/header if needed
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email, password, or role. Please try again or sign up.",
        variant: "destructive",
      });
      form.setError("root", { message: "Invalid credentials." });
    }
  }

  if (!isClient) {
    // Prevent rendering form until client-side check is complete to avoid flash of content
    // Or a loading spinner
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><p>Loading...</p></div>;
  }
  
  // If user is already logged in (checked in useEffect), they will be redirected.
  // This check prevents rendering the form if redirection is about to happen.
  if (localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY)) {
      return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><p>Redirecting...</p></div>;
  }


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="text-center">
          <LogInIcon className="mx-auto h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-3xl text-primary">Welcome Back!</CardTitle>
          <CardDescription>Log in to access your RemoteCare Connect account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base"><Mail className="h-5 w-5 text-accent"/>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} className="text-base"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base"><Lock className="h-5 w-5 text-accent"/>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="text-base"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base"><Briefcase className="h-5 w-5 text-accent"/>Login As</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-base">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="patient" className="text-base">Patient</SelectItem>
                        <SelectItem value="doctor" className="text-base">Doctor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
              )}
              <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Logging In..." : "Log In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
