
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
import { Send, User, MessageSquareText } from "lucide-react"; 

export interface TestimonialFormData {
  author: string;
  quote: string;
  role?: string; 
  imageSrc?: string; 
  dataAiHint?: string; 
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
    const newTestimonial: TestimonialFormData = {
      ...data,
      role: "Verified User",
      imageSrc: `https://source.unsplash.com/random/100x100/?${encodeURIComponent(data.dataAiHint || 'person+smiling')}`,
      dataAiHint: data.dataAiHint || "person smiling",
    };
    onSubmitTestimonial(newTestimonial);
    toast({
      title: "Testimonial Submitted!",
      description: "Thank you for your feedback.",
      variant: "success",
    });
    form.reset();
  };

  return (
    <Card className="w-full shadow-lg border-emerald-200 bg-gradient-to-b from-white to-emerald-50/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 rounded-full">
            <MessageSquareText className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-3xl text-emerald-800">Share Your Experience</CardTitle>
            <CardDescription className="text-emerald-700/80">
              We'd love to hear your feedback! Submit your testimonial below.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base text-emerald-800">
                    <div className="p-1 bg-emerald-100 rounded-full">
                      <User className="h-4 w-4 text-emerald-600" />
                    </div>
                    Your Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Priya Sharma" 
                      {...field} 
                      className="text-base border-emerald-300 focus:border-emerald-400 focus-visible:ring-emerald-200"
                    />
                  </FormControl>
                  <FormMessage className="text-emerald-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base text-emerald-800">
                    <div className="p-1 bg-emerald-100 rounded-full">
                      <MessageSquareText className="h-4 w-4 text-emerald-600" />
                    </div>
                    Your Testimonial
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your experience..."
                      className="resize-none text-base min-h-[120px] border-emerald-300 focus:border-emerald-400 focus-visible:ring-emerald-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-emerald-600" />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full text-lg py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition-all duration-300 hover:shadow-lg"
              size="lg" 
              disabled={form.formState.isSubmitting}
            >
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

