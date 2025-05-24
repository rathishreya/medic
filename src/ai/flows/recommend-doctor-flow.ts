'use server';
/**
 * @fileOverview A Genkit flow to recommend a medical specialty based on user symptoms.
 *
 * - recommendDoctorSpecialty - A function that handles recommending a doctor specialty.
 * - RecommendDoctorSpecialtyInput - The input type for the function.
 * - RecommendDoctorSpecialtyOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendDoctorSpecialtyInputSchema = z.object({
  symptoms: z.string().min(10, { message: "Please describe your symptoms in at least 10 characters." }).describe('The symptoms or health concerns described by the user.'),
  availableSpecialties: z.array(z.string()).describe('A list of available medical specialties in the system to choose from.'),
});
export type RecommendDoctorSpecialtyInput = z.infer<typeof RecommendDoctorSpecialtyInputSchema>;

const RecommendDoctorSpecialtyOutputSchema = z.object({
  recommendedSpecialty: z.string().describe('The medical specialty most relevant to the described symptoms, chosen from the available specialties. If no specific specialty matches, "General Medicine" should be suggested.'),
  reasoning: z.string().describe('A brief explanation of why this specialty is recommended, including a clear disclaimer that this is NOT medical advice and the user should consult a qualified healthcare professional for any medical concerns or diagnosis.'),
  suggestedDoctor: z.string().optional().describe('If a clear specialty match is found from the available list, suggest one of the doctors provided who practices in that specialty. Format as "Dr. Name (Specialty)".')
});
export type RecommendDoctorSpecialtyOutput = z.infer<typeof RecommendDoctorSpecialtyOutputSchema>;

// Mock doctor data - in a real app, this might come from a database or more complex logic
const mockDoctors = [
  { name: "Dr. Emily Carter", specialty: "Cardiology" },
  { name: "Dr. Johnathan Lee", specialty: "Gastroenterology" },
  { name: "Dr. Sarah Green", specialty: "General Medicine" },
];

export async function recommendDoctorSpecialty(input: RecommendDoctorSpecialtyInput): Promise<RecommendDoctorSpecialtyOutput> {
  return recommendDoctorSpecialtyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendDoctorSpecialtyPrompt',
  input: {schema: RecommendDoctorSpecialtyInputSchema},
  output: {schema: RecommendDoctorSpecialtyOutputSchema},
  prompt: `You are an AI assistant helping users find a suitable medical specialty based on their symptoms.
Your goal is to suggest one of the {{#each availableSpecialties}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}} based on the symptoms provided.
If the symptoms are vague or don't clearly point to a specific specialty from the list, recommend "General Medicine".

IMPORTANT RULES:
- You MUST choose a specialty from this list: {{#each availableSpecialties}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
- Your response MUST include a disclaimer: "This is not medical advice. Please consult a qualified healthcare professional for any medical concerns or diagnosis." This disclaimer should be part of the 'reasoning' field.
- DO NOT provide a diagnosis.
- DO NOT suggest treatments or medications.
- If you recommend a specialty for which there is a known doctor from the list below, you can mention one:
  {{#each mockDoctors}}
  - {{name}} ({{specialty}})
  {{/each}}
  Only suggest a doctor if their specialty EXACTLY matches your recommended specialty.

User's Symptoms:
{{symptoms}}

Based on these symptoms and the available specialties ({{#each availableSpecialties}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}), provide a recommended specialty and a brief reasoning with the mandatory disclaimer. If applicable, suggest a doctor.`,
});

const recommendDoctorSpecialtyFlow = ai.defineFlow(
  {
    name: 'recommendDoctorSpecialtyFlow',
    inputSchema: RecommendDoctorSpecialtyInputSchema,
    outputSchema: RecommendDoctorSpecialtyOutputSchema,
  },
  async (input) => {
    // Augmenting the prompt context with mockDoctors data directly within the prompt string.
    // This approach is simpler if the doctor list is static or for demonstration.
    // For dynamic data, you might pass it differently or use tools if the AI needed to fetch it.

    const {output} = await prompt(input);
    if (!output) {
      return {
        recommendedSpecialty: "General Medicine",
        reasoning: "Could not determine a specific specialty. It's always a good starting point to consult with General Medicine for a comprehensive evaluation. This is not medical advice. Please consult a qualified healthcare professional for any medical concerns or diagnosis.",
      };
    }
    // Ensure disclaimer is present, though the prompt strongly guides it.
    if (!output.reasoning.toLowerCase().includes("this is not medical advice")) {
        output.reasoning += " This is not medical advice. Please consult a qualified healthcare professional for any medical concerns or diagnosis.";
    }
    return output;
  }
);
