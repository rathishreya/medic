
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-consultation.ts';
import '@/ai/flows/transcribe-consultation.ts';
import '@/ai/flows/chat-doctor-flow.ts';
import '@/ai/flows/generate-follow-up-suggestions.ts';
import '@/ai/flows/recommend-doctor-flow.ts';

