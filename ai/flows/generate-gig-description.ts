'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a gig description.
 *
 * - generateGigDescription - A function that takes a gig title and keywords and returns a description.
 * - GenerateGigDescriptionInput - The input type for the function.
 * - GenerateGigDescriptionOutput - The return type for the function.
 */

import { ai } from '../genkit';
import { z } from 'zod';  // Fix import here

const GenerateGigDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the gig.'),
  keywords: z.array(z.string()).describe('A list of keywords related to the gig.'),
});
export type GenerateGigDescriptionInput = z.infer<typeof GenerateGigDescriptionInputSchema>;

const GenerateGigDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated gig description.'),
});
export type GenerateGigDescriptionOutput = z.infer<typeof GenerateGigDescriptionOutputSchema>;

export async function generateGigDescription(
  input: GenerateGigDescriptionInput
): Promise<GenerateGigDescriptionOutput> {
  return generateGigDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGigDescriptionPrompt',
  input: { schema: GenerateGigDescriptionInputSchema },
  output: { schema: GenerateGigDescriptionOutputSchema },
  prompt: `You are an expert copywriter specializing in creating compelling gig descriptions for a freelance marketplace called GigLink.

  Given the gig title and a list of keywords, write a professional, engaging, and detailed description for the service. 
  The description should be between 200 and 400 characters. 
  It should highlight the key benefits for the client and explain what the service includes.
  Use a friendly and professional tone.

  Gig Title: {{{title}}}
  Keywords: {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Description:`,
});

const generateGigDescriptionFlow = ai.defineFlow(
  {
    name: 'generateGigDescriptionFlow',
    inputSchema: GenerateGigDescriptionInputSchema,
    outputSchema: GenerateGigDescriptionOutputSchema,
  },
  async (input: GenerateGigDescriptionInput) => {  // Explicitly type input here
    const { output } = await prompt(input);
    return output!;
  }
);
