
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2, AlertTriangle, Stethoscope, UserMd } from "lucide-react"; // UserMd is a placeholder, Stethoscope is good
import { recommendDoctorSpecialty, type RecommendDoctorSpecialtyOutput } from "@/ai/flows/recommend-doctor-flow";
import type { Department } from "@/app/page"; // Assuming Department type is exported from page.tsx or a shared types file

interface DoctorRecommendationProps {
  availableSpecialties: string[];
  departments: Department[]; // Pass departments to find matching images/icons
}

const recommendationSchema = z.object({
  symptoms: z.string().min(10, "Please describe your symptoms in at least 10 characters.").max(500, "Symptoms description is too long."),
});
type RecommendationFormValues = z.infer<typeof recommendationSchema>;

export default function DoctorRecommendation({ availableSpecialties, departments }: DoctorRecommendationProps) {
  const [recommendation, setRecommendation] = useState<RecommendDoctorSpecialtyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  const onSubmit: SubmitHandler<RecommendationFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const result = await recommendDoctorSpecialty({ symptoms: data.symptoms, availableSpecialties });
      setRecommendation(result);
    } catch (err) {
      console.error("Error recommending doctor:", err);
      setError("Sorry, we couldn't process your request at the moment. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getDepartmentIcon = (specialtyName: string) => {
    const dept = departments.find(d => d.name.toLowerCase() === specialtyName.toLowerCase());
    return dept?.Icon || Stethoscope;
  }

  return (
    <Card className="w-full shadow-xl border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Lightbulb className="h-10 w-10 text-primary" />
          <CardTitle className="text-3xl text-primary">AI Doctor Recommendation</CardTitle>
        </div>
        <CardDescription>
          Describe your symptoms, and our AI will suggest a relevant medical specialty. This is not a diagnosis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Your Symptoms</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I've had a persistent cough and chest pain for a week..."
                      className="resize-none text-base min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Getting Recommendation...
                </>
              ) : (
                "Get AI Recommendation"
              )}
            </Button>
          </form>
        </Form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {recommendation && !isLoading && (
          <Card className="mt-8 bg-muted/50">
            <CardHeader>
                <div className="flex items-center gap-3">
                    {React.createElement(getDepartmentIcon(recommendation.recommendedSpecialty) || Stethoscope, {className: "h-8 w-8 text-accent"})}
                    <CardTitle className="text-2xl text-accent">AI Recommendation:</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-lg">
                <strong className="font-semibold text-foreground">Suggested Specialty:</strong> {recommendation.recommendedSpecialty}
              </p>
              {recommendation.suggestedDoctor && (
                 <p className="text-md">
                    <strong className="font-semibold text-foreground">Potentially Relevant Doctor:</strong> {recommendation.suggestedDoctor}
                 </p>
              )}
              <p className="text-sm text-muted-foreground italic border-l-4 border-accent pl-3 py-1">
                <strong className="block font-medium not-italic text-foreground/80">Important Note:</strong> {recommendation.reasoning}
              </p>

            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">
                    You can find more about our departments and specialists in the sections above.
                </p>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
