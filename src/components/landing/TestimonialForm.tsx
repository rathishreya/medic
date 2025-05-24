
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Send, User, MessageSquareText } from "lucide-react"; // Added User, MessageSquareText

export interface TestimonialFormData {
  author: string;
  quote: string;
  role?: string; // Optional: role for the testimonial author
  imageSrc?: string; // Optional: image for the testimonial author
  dataAiHint?: string; // Optional: AI hint for image
}

interface TestimonialFormProps {
  onSubmitTestimonial: (data: TestimonialFormData) => void;
}

const testimonialFormSchema = z.object({
  author: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name is too long."),
  quote: z.string().min(10, "Testimonial must be at least 10 characters.").max(500, "Testimonial is too long."),
});

export default function TestimonialForm({ onSubmitTestimonial }: TestimonialFormProps) {
  const { toast } = useToast();
  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      author: "",
      quote: "",
    },
  });

  const handleSubmit: SubmitHandler<TestimonialFormData> = (data) => {
    // Add some default/mock values for fields not in the form
    const newTestimonial: TestimonialFormData = {
      ...data,
      role: "Verified User", // Default role
      imageSrc: `https://source.unsplash.com/random/100x100/?${encodeURIComponent(data.dataAiHint || 'person+smiling')}`, // Default placeholder
      dataAiHint: data.dataAiHint || "person smiling",
    };
    onSubmitTestimonial(newTestimonial);
    toast({
      title: "Testimonial Submitted!",
      description: "Thank you for your feedback.",
      className: "bg-green-600 text-white dark:bg-green-700 dark:text-white",
    });
    form.reset();
  };

  return (
    <Card className="w-full shadow-xl border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
            <MessageSquareText className="h-10 w-10 text-primary" />
            <CardTitle className="text-3xl text-primary">Share Your Experience</CardTitle>
        </div>
        <CardDescription>
          We'd love to hear your feedback! Submit your testimonial below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base"><User className="h-5 w-5 text-accent"/>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Priya Sharma" {...field} className="text-base"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base"><MessageSquareText className="h-5 w-5 text-accent"/>Your Testimonial</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your experience..."
                      className="resize-none text-base min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" /> Submit Testimonial
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    