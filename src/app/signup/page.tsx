
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
  FormDescription,
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
import { Mail, Lock, UserPlus, UserCircle, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_USERS_KEY = "telehealthAppUsers";
const LOCAL_STORAGE_CURRENT_USER_KEY = "telehealthAppCurrentUser";

const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["patient", "doctor"], { required_error: "Please select a role." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"], // Point error to confirmPassword field
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface StoredUser {
  email: string;
  passwordHash: string; // For this demo, storing plain password. In real app, HASH IT!
  role: "patient" | "doctor";
}

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY)) {
      router.push("/"); // Already logged in
    }
  }, [router]);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "patient",
    },
  });

  function onSubmit(data: SignUpFormValues) {
    if (!isClient) return;

    const existingUsersString = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const users: StoredUser[] = existingUsersString ? JSON.parse(existingUsersString) : [];

    if (users.find(user => user.email.toLowerCase() === data.email.toLowerCase())) {
      toast({
        title: "Sign Up Failed",
        description: "An account with this email already exists.",
        variant: "destructive",
      });
      form.setError("email", { type: "manual", message: "Email already in use." });
      return;
    }

    // In a real app, hash the password securely before storing
    const newUser: StoredUser = { email: data.email, passwordHash: data.password, role: data.role };
    users.push(newUser);
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));

    toast({
      title: "Sign Up Successful!",
      description: "You can now log in with your new account.",
      variant: "default",
      className: "bg-green-600 text-white dark:bg-green-700 dark:text-white",
    });
    router.push("/login");
  }

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-3xl text-primary">Create Account</CardTitle>
          <CardDescription>Join RemoteCare Connect today. All fields are required.</CardDescription>
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base"><Lock className="h-5 w-5 text-accent"/>Confirm Password</FormLabel>
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
                    <FormLabel className="flex items-center gap-2 text-base"><Briefcase className="h-5 w-5 text-accent"/>Sign Up As</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-base">
                          <SelectValue placeholder="Select a role" />
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
              <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
