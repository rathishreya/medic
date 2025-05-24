'use server';

/**
 * @fileOverview Summarizes a telehealth consultation.
 *
 * - summarizeConsultation - A function that handles the summarization of a consultation.
 * - SummarizeConsultationInput - The input type for the summarizeConsultation function.
 * - SummarizeConsultationOutput - The return type for the summarizeConsultation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeConsultationInputSchema = z.object({
  consultationText: z
    .string()
    .describe('The full text of the telehealth consultation transcript.'),
});
export type SummarizeConsultationInput = z.infer<typeof SummarizeConsultationInputSchema>;

const SummarizeConsultationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the telehealth consultation.'),
});
export type SummarizeConsultationOutput = z.infer<typeof SummarizeConsultationOutputSchema>;

export async function summarizeConsultation(input: SummarizeConsultationInput): Promise<SummarizeConsultationOutput> {
  return summarizeConsultationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeConsultationPrompt',
  input: {schema: SummarizeConsultationInputSchema},
  output: {schema: SummarizeConsultationOutputSchema},
  prompt: `You are an AI assistant specialized in summarizing telehealth consultations for healthcare providers.

  Please provide a concise summary of the following consultation transcript, highlighting key discussion points, diagnoses, and recommendations.

  Consultation Transcript:
  {{consultationText}}`,
});

const summarizeConsultationFlow = ai.defineFlow(
  {
    name: 'summarizeConsultationFlow',
    inputSchema: SummarizeConsultationInputSchema,
    outputSchema: SummarizeConsultationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
