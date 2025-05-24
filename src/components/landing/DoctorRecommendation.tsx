
"use client";

import * as React from "react"; // Added this line
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2, AlertTriangle, Stethoscope, User } from "lucide-react"; // UserMd is a placeholder, Stethoscope is good
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
    <Card className="w-full shadow-xl border-emerald-200 bg-gradient-to-b from-white to-emerald-50/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 rounded-full">
            <Lightbulb className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-3xl text-emerald-800">AI Doctor Recommendation</CardTitle>
            <CardDescription className="text-emerald-700/80">
              Describe your symptoms, and our AI will suggest a relevant medical specialty. This is not a diagnosis.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-emerald-800">Your Symptoms</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I've had a persistent cough and chest pain for a week..."
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
              disabled={isLoading}
            >
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
          <Alert variant="destructive" className="mt-6 border-red-300 bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {recommendation && !isLoading && (
          <Card className="mt-8 bg-white border-emerald-200 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-full">
                  {React.createElement(getDepartmentIcon(recommendation.recommendedSpecialty) || Stethoscope, {
                    className: "h-6 w-6 text-emerald-600"
                  })}
                </div>
                <CardTitle className="text-2xl text-emerald-800">AI Recommendation:</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-emerald-100/50 rounded-full">
                  <Stethoscope className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-lg">
                  <strong className="font-semibold text-emerald-800">Suggested Specialty:</strong> {recommendation.recommendedSpecialty}
                </p>
              </div>
              
              {recommendation.suggestedDoctor && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-emerald-100/50 rounded-full">
                    <User className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-md">
                    <strong className="font-semibold text-emerald-800">Potentially Relevant Doctor:</strong> {recommendation.suggestedDoctor}
                  </p>
                </div>
              )}
              
              <div className="text-sm text-emerald-700 italic border-l-4 border-emerald-400 pl-4 py-2 bg-emerald-50/50 rounded-r-lg">
                <strong className="block font-medium not-italic text-emerald-800">Important Note:</strong> {recommendation.reasoning}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-emerald-700/80">
                You can find more about our departments and specialists in the sections above.
              </p>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
