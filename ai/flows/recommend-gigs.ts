
'use server';

/**
 * @fileOverview A Genkit flow for recommending gigs to a user based on their recent orders.
 *
 * - recommendGigs - A function that takes a user's recent orders and returns a list of recommended gig titles.
 * - RecommendGigsInput - The input type for the recommendGigs function.
 * - RecommendGigsOutput - The return type for the recommendGigs function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const RecommendGigsInputSchema = z.object({
  recentOrderTitles: z.array(z.string()).describe('A list of titles from the user\'s recent gig orders.'),
});
export type RecommendGigsInput = z.infer<typeof RecommendGigsInputSchema>;

const RecommendGigsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('An array of recommended gig titles.'),
});
export type RecommendGigsOutput = z.infer<typeof RecommendGigsOutputSchema>;

export async function recommendGigs(input: RecommendGigsInput): Promise<RecommendGigsOutput> {
  return recommendGigsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendGigsPrompt',
  input: {schema: RecommendGigsInputSchema},
  output: {schema: RecommendGigsOutputSchema},
  prompt: `You are a recommendation engine for a freelance marketplace called GigLink.
  Your goal is to suggest relevant services to clients to encourage them to purchase more gigs.

  Based on the following list of gig titles from a user's recent orders, recommend up to 3 other similar or complementary gig titles that they might be interested in.
  Do not recommend titles that are too similar to the ones they've already purchased. Only return the titles.

  Recent Orders:
  {{#each recentOrderTitles}}
  - {{{this}}}
  {{/each}}
  `,
});

const recommendGigsFlow = ai.defineFlow(
  {
    name: 'recommendGigsFlow',
    inputSchema: RecommendGigsInputSchema,
    outputSchema: RecommendGigsOutputSchema,
  },
  async (input) => {
    // In a real app, you might have more complex logic here to fetch more user data.
    if (input.recentOrderTitles.length === 0) {
      // If the user has no orders, recommend some popular services.
      // This part doesn't use an LLM but could be expanded to do so.
      return { recommendations: [
        'I will design a stunning modern logo',
        'I will write compelling SEO blog posts',
        'I will create a promotional video animation',
      ] };
    }

    const {output} = await prompt(input);
    return output!;
  }
);
