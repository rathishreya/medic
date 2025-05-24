// src/ai/flows/transcribe-consultation.ts
'use server';
/**
 * @fileOverview Real-time transcription flow for telehealth consultations.
 *
 * - transcribeConsultation - A function that handles the transcription process.
 * - TranscribeConsultationInput - The input type for the transcribeConsultation function.
 * - TranscribeConsultationOutput - The return type for the transcribeConsultation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeConsultationInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeConsultationInput = z.infer<typeof TranscribeConsultationInputSchema>;

const TranscribeConsultationOutputSchema = z.object({
  transcription: z
    .string()
    .describe('The real-time transcription of the telehealth consultation.'),
});
export type TranscribeConsultationOutput = z.infer<typeof TranscribeConsultationOutputSchema>;

export async function transcribeConsultation(input: TranscribeConsultationInput): Promise<TranscribeConsultationOutput> {
  return transcribeConsultationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transcribeConsultationPrompt',
  input: {schema: TranscribeConsultationInputSchema},
  output: {schema: TranscribeConsultationOutputSchema},
  prompt: `Transcribe the following audio data from a telehealth consultation in real-time.  Ensure accurate transcription, paying close attention to medical terminology and potential variations in accents and dialects.

Audio: {{media url=audioDataUri}}`,
});

const transcribeConsultationFlow = ai.defineFlow(
  {
    name: 'transcribeConsultationFlow',
    inputSchema: TranscribeConsultationInputSchema,
    outputSchema: TranscribeConsultationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
