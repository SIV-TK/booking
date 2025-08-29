/**
 * @fileOverview Generates a summary of event bookings using AI.
 *
 * - generateEventSummary - A function that generates the event summary.
 * - GenerateEventSummaryInput - The input type for the generateEventSummary function.
 * - GenerateEventSummaryOutput - The return type for the generateEventSummary function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventSummaryInputSchema = z.object({
  eventData: z.string().describe('The event data including bookings and attendance.'),
});

export type GenerateEventSummaryInput = z.infer<typeof GenerateEventSummaryInputSchema>;

const GenerateEventSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the event bookings including attendance rates and peak booking times.'),
});

export type GenerateEventSummaryOutput = z.infer<typeof GenerateEventSummaryOutputSchema>;

export async function generateEventSummary(input: GenerateEventSummaryInput): Promise<GenerateEventSummaryOutput> {
  return generateEventSummaryFlow(input);
}

const generateEventSummaryPrompt = ai.definePrompt({
  name: 'generateEventSummaryPrompt',
  input: {schema: GenerateEventSummaryInputSchema},
  output: {schema: GenerateEventSummaryOutputSchema},
  prompt: `You are an administrator tasked with summarizing event data. Analyze the provided event data and generate a concise summary, highlighting key metrics such as attendance rates, peak booking times, and any notable trends. Use clear and straightforward language.

Event Data: {{{eventData}}}`, 
});

const generateEventSummaryFlow = ai.defineFlow(
  {
    name: 'generateEventSummaryFlow',
    inputSchema: GenerateEventSummaryInputSchema,
    outputSchema: GenerateEventSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateEventSummaryPrompt(input);
    return output!;
  }
);
