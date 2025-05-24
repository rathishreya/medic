
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, UserCircle, Stethoscope, Mail, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";


const patientInfoSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }).max(100),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).max(15),
  reasonForConsultation: z.string().min(10, { message: "Reason must be at least 10 characters." }).max(500),
  medicalSpecialty: z.string({ required_error: "Please select a medical specialty." }),
});

type PatientInfoFormValues = z.infer<typeof patientInfoSchema>;

const medicalSpecialties = [
  "General Medicine",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Psychiatry",
  "Endocrinology",
  "Gastroenterology",
  "Other",
];

export default function ConsultationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<PatientInfoFormValues>({
    resolver: zodResolver(patientInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      reasonForConsultation: "",
    },
  });

  function onSubmit(data: PatientInfoFormValues) {
    console.log("Patient Information Submitted:", data); // Keep for debugging
    toast({
      title: "Information Captured",
      description: "Your details have been saved. Proceeding to session.",
      variant: "default",
    });
    // In a real app, you'd save this data to a backend.
    // For this demo, we directly navigate to the session page.
    router.push("/session");
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="shadow-xl border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <UserCircle className="h-10 w-10 text-primary" />
            <CardTitle className="text-3xl text-primary">
              New Consultation
            </CardTitle>
          </div>
          <CardDescription className="pt-2">
            Please provide your information to start a new telehealth consultation. All fields are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base"><UserCircle className="h-5 w-5 text-accent"/>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Rohan Sharma" {...field} className="text-base"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2 text-base"><CalendarDays className="h-5 w-5 text-accent"/>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal text-base",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base"><Mail className="h-5 w-5 text-accent"/>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="e.g., rohan.sharma@example.com" {...field} className="text-base"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base"><Phone className="h-5 w-5 text-accent"/>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="e.g., 98XXXXXX00" {...field} className="text-base"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medicalSpecialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base"><Stethoscope className="h-5 w-5 text-accent"/>Preferred Medical Specialty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-base">
                          <SelectValue placeholder="Select a specialty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {medicalSpecialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty} className="text-base">
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reasonForConsultation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base"><MessageCircle className="h-5 w-5 text-accent"/>Reason for Consultation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe your symptoms or reason for consultation..."
                        className="resize-none text-base"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      This will help the doctor prepare for your consultation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Proceed to Session"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    