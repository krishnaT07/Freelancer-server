'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating tags for a gig based on its title and description.
 *
 * - generateGigTags - A function that takes the gig title and description as input and returns a list of generated tags.
 * - GenerateGigTagsInput - The input type for the generateGigTags function.
 * - GenerateGigTagsOutput - The return type for the generateGigTags function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const GenerateGigTagsInputSchema = z.object({
  title: z.string().describe('The title of the gig.'),
  description: z.string().describe('The description of the gig.'),
});
export type GenerateGigTagsInput = z.infer<typeof GenerateGigTagsInputSchema>;

const GenerateGigTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of tags generated for the gig.'),
});
export type GenerateGigTagsOutput = z.infer<typeof GenerateGigTagsOutputSchema>;

export async function generateGigTags(input: GenerateGigTagsInput): Promise<GenerateGigTagsOutput> {
  return generateGigTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGigTagsPrompt',
  input: {schema: GenerateGigTagsInputSchema},
  output: {schema: GenerateGigTagsOutputSchema},
  prompt: `You are an expert at generating relevant tags for online service gigs.

  Given the title and description of a gig, generate a list of tags that will help the gig be discovered by potential customers.
  The tags should be relevant to the gig and should be specific enough to attract the right customers.
  Return no more than 10 tags.

  Title: {{{title}}}
  Description: {{{description}}}

  Tags:`,
});

const generateGigTagsFlow = ai.defineFlow(
  {
    name: 'generateGigTagsFlow',
    inputSchema: GenerateGigTagsInputSchema,
    outputSchema: GenerateGigTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);