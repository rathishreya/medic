
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
import { Mail, Lock, UserPlus, Briefcase, Phone, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_USERS_KEY = "telehealthAppUsers";
const LOCAL_STORAGE_CURRENT_USER_KEY = "telehealthAppCurrentUser";

const userDetailsSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["patient", "doctor"], { required_error: "Please select a role." }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." }).max(15),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});

type UserDetailsFormValues = z.infer<typeof userDetailsSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

interface StoredUser {
  email: string;
  passwordHash: string; // For this demo, storing plain password. In real app, HASH IT!
  role: "patient" | "doctor";
  phoneNumber: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [uiStep, setUiStep] = useState<"details" | "otp">("details");
  const [userDetails, setUserDetails] = useState<UserDetailsFormValues | null>(null);
  const [mockOtp, setMockOtp] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY)) {
      router.push("/"); // Already logged in
    }
  }, [router]);

  const detailsForm = useForm<UserDetailsFormValues>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "patient",
      phoneNumber: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  function handleUserDetailsSubmit(data: UserDetailsFormValues) {
    if (!isClient) return;

    const existingUsersString = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const users: StoredUser[] = existingUsersString ? JSON.parse(existingUsersString) : [];

    if (users.find(user => user.email.toLowerCase() === data.email.toLowerCase())) {
      toast({
        title: "Sign Up Failed",
        description: "An account with this email already exists.",
        variant: "destructive",
      });
      detailsForm.setError("email", { type: "manual", message: "Email already in use." });
      return;
    }

    // Simulate OTP generation and sending
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(generatedOtp);
    setUserDetails(data);
    setUiStep("otp");

    // In a real app, you'd send an SMS here. For demo, we'll alert it.
    alert(`Mock OTP Sent (for demo): ${generatedOtp}\nPlease enter this OTP to complete sign-up.`);
    toast({
      title: "OTP Sent (Simulated)",
      description: `Enter the OTP: ${generatedOtp} (shown in alert).`,
    });
  }

  function handleOtpSubmit(data: OtpFormValues) {
    if (!isClient || !userDetails || !mockOtp) return;

    if (data.otp === mockOtp) {
      const existingUsersString = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      const users: StoredUser[] = existingUsersString ? JSON.parse(existingUsersString) : [];

      const newUser: StoredUser = {
        email: userDetails.email,
        passwordHash: userDetails.password, // Store plain text for demo. HASH IN PRODUCTION!
        role: userDetails.role,
        phoneNumber: userDetails.phoneNumber,
      };
      users.push(newUser);
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));

      toast({
        title: "Sign Up Successful!",
        description: "You can now log in with your new account.",
        variant: "default",
        className: "bg-green-600 text-white dark:bg-green-700 dark:text-white",
      });
      router.push("/login");
    } else {
      toast({
        title: "OTP Verification Failed",
        description: "The OTP you entered is incorrect. Please try again.",
        variant: "destructive",
      });
      otpForm.setError("otp", { type: "manual", message: "Incorrect OTP." });
    }
  }

  const handleResendOtp = () => {
    if (!mockOtp) return;
    alert(`Mock OTP Resent (for demo): ${mockOtp}\nPlease enter this OTP to complete sign-up.`);
    toast({
      title: "OTP Resent (Simulated)",
      description: `Enter the OTP: ${mockOtp} (shown in alert).`,
    });
  };

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-3xl text-primary">
            {uiStep === "details" ? "Create Account" : "Verify OTP"}
          </CardTitle>
          <CardDescription>
            {uiStep === "details"
              ? "Join RemoteCare Connect today. All fields are required."
              : "An OTP has been 'sent' to your registered phone number (shown in an alert)."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uiStep === "details" ? (
            <Form {...detailsForm}>
              <form onSubmit={detailsForm.handleSubmit(handleUserDetailsSubmit)} className="space-y-6">
                <FormField
                  control={detailsForm.control}
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
                  control={detailsForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base"><Phone className="h-5 w-5 text-accent"/>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g., 1234567890" {...field} className="text-base"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={detailsForm.control}
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
                  control={detailsForm.control}
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
                  control={detailsForm.control}
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
                <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={detailsForm.formState.isSubmitting}>
                  {detailsForm.formState.isSubmitting ? "Processing..." : "Proceed to OTP Verification"}
                </Button>
              </form>
            </Form>
          ) : ( // OTP Step
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-6">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base"><KeyRound className="h-5 w-5 text-accent"/>Enter 6-Digit OTP</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="123456" {...field} className="text-base" maxLength={6}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="submit" className="flex-1 text-lg py-3" size="lg" disabled={otpForm.formState.isSubmitting}>
                    {otpForm.formState.isSubmitting ? "Verifying..." : "Verify & Sign Up"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setUiStep("details")} className="flex-1 text-lg py-3" size="lg">
                        Back to Details
                    </Button>
                </div>
                 <Button type="button" variant="link" onClick={handleResendOtp} className="w-full text-primary">
                    Resend OTP (Simulated)
                </Button>
              </form>
            </Form>
          )}
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

    