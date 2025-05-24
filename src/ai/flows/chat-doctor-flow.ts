
'use server';
/**
 * @fileOverview A Genkit flow to simulate an AI doctor's responses in a chat.
 *
 * - chatWithDoctor - A function that handles generating a doctor's response.
 * - ChatWithDoctorInput - The input type for the chatWithDoctor function.
 * - ChatWithDoctorOutput - The return type for the chatWithDoctor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  sender: z.enum(['patient', 'doctor']),
  text: z.string(),
});

const ChatWithDoctorInputSchema = z.object({
  patientMessage: z.string().describe('The latest message from the patient.'),
  chatHistory: z.array(ChatMessageSchema).optional().describe('The history of the conversation so far.'),
});
export type ChatWithDoctorInput = z.infer<typeof ChatWithDoctorInputSchema>;

const ChatWithDoctorOutputSchema = z.object({
  doctorResponse: z.string().describe("The AI doctor's response to the patient."),
});
export type ChatWithDoctorOutput = z.infer<typeof ChatWithDoctorOutputSchema>;

export async function chatWithDoctor(input: ChatWithDoctorInput): Promise<ChatWithDoctorOutput> {
  return chatDoctorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatDoctorPrompt',
  input: {schema: ChatWithDoctorInputSchema},
  output: {schema: ChatWithDoctorOutputSchema},
  prompt: `You are Dr. GenAI, a friendly and empathetic AI assistant in a telehealth chat.
  The patient needs your guidance. Keep your responses concise, helpful, and conversational.
  Do not give medical advice, but you can ask clarifying questions or suggest general wellness tips if appropriate.
  If the patient mentions specific symptoms, you can acknowledge them and ask for more details, but reiterate that this is not a real diagnosis and they should consult a human doctor for any medical concerns.

  Chat History (if any):
  {{#if chatHistory}}
  {{#each chatHistory}}
  {{this.sender}}: {{this.text}}
  {{/each}}
  {{else}}
  No previous messages.
  {{/if}}

  Patient's latest message: {{patientMessage}}

  Generate a suitable response as Dr. GenAI.`,
});

const chatDoctorFlow = ai.defineFlow(
  {
    name: 'chatDoctorFlow',
    inputSchema: ChatWithDoctorInputSchema,
    outputSchema: ChatWithDoctorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.doctorResponse) {
      return { doctorResponse: "I'm sorry, I'm having a little trouble understanding. Could you please rephrase that?" };
    }
    return output;
  }
);
