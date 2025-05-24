
'use server';
/**
 * @fileOverview Generates general follow-up suggestions based on a consultation summary.
 *
 * - generateFollowUpSuggestions - A function that handles generating follow-up suggestions.
 * - GenerateFollowUpSuggestionsInput - The input type for the function.
 * - GenerateFollowUpSuggestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFollowUpSuggestionsInputSchema = z.object({
  consultationSummary: z
    .string()
    .describe('The summary of the telehealth consultation.'),
});
export type GenerateFollowUpSuggestionsInput = z.infer<typeof GenerateFollowUpSuggestionsInputSchema>;

const FollowUpSuggestionSchema = z.object({
  title: z.string().describe('A concise title for the suggestion.'),
  detail: z.string().describe('A more detailed explanation or action point for the suggestion. This should not be medical advice.'),
});

const GenerateFollowUpSuggestionsOutputSchema = z.object({
  suggestions: z.array(FollowUpSuggestionSchema).describe('A list of general follow-up suggestions or wellness tips. These are not medical advice and the user should consult their doctor for medical concerns.'),
});
export type GenerateFollowUpSuggestionsOutput = z.infer<typeof GenerateFollowUpSuggestionsOutputSchema>;

export async function generateFollowUpSuggestions(input: GenerateFollowUpSuggestionsInput): Promise<GenerateFollowUpSuggestionsOutput> {
  return generateFollowUpSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFollowUpSuggestionsPrompt',
  input: {schema: GenerateFollowUpSuggestionsInputSchema},
  output: {schema: GenerateFollowUpSuggestionsOutputSchema},
  prompt: `You are an AI assistant helping to provide general, non-prescriptive follow-up suggestions based on a telehealth consultation summary.
Your goal is to offer helpful wellness tips, reminders for self-care, or topics the patient might want to research further or discuss in more detail with their human doctor in a future appointment.

IMPORTANT RULES:
- DO NOT provide medical advice, diagnoses, or treatment plans.
- DO NOT suggest specific medications or dosages.
- DO NOT make urgent recommendations (e.g., "seek immediate medical attention").
- DO NOT interpret or expand on medical conditions mentioned in the summary.
- ALWAYS include a disclaimer in one of the suggestions to consult a human healthcare provider for any medical concerns or before making any health decisions.
- Keep suggestions general and safe.
- Aim for 3-4 suggestions.

Based on the following consultation summary, provide general follow-up suggestions or wellness tips.

Consultation Summary:
{{consultationSummary}}

Ensure one of your suggestions explicitly states: "Disclaimer: These are general suggestions and not medical advice. Always consult your healthcare provider for any medical concerns or before making changes to your health regimen."
`,
});

const generateFollowUpSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateFollowUpSuggestionsFlow',
    inputSchema: GenerateFollowUpSuggestionsInputSchema,
    outputSchema: GenerateFollowUpSuggestionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.suggestions) {
        return { suggestions: [{title: "Disclaimer", detail: "These are general suggestions and not medical advice. Always consult your healthcare provider for any medical concerns or before making changes to your health regimen."}] };
    }
    // Ensure the disclaimer is present
    const hasDisclaimer = output.suggestions.some(s => s.detail.toLowerCase().includes("disclaimer") || s.title.toLowerCase().includes("disclaimer"));
    if (!hasDisclaimer) {
        output.suggestions.push({
            title: "Important Disclaimer",
            detail: "These are general suggestions and not medical advice. Always consult your healthcare provider for any medical concerns or before making changes to your health regimen."
        });
    }
    return output;
  }
);
