'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered support chat.
 *
 * - supportChat - A function that takes a user's message history and returns an AI-generated response.
 * - SupportChatInput - The input type for the supportChat function.
 * - SupportChatOutput - The return type for the supportChat function.
 */

import { ai } from '../genkit';
import { z } from 'zod';  // <--- fixed here

const SupportChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ).describe('The conversation history between the user and the AI.'),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;  // fixed import source

const SupportChatOutputSchema = z.object({
  response: z.string().describe('The AI-generated response to the user.'),
});
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;  // fixed import source

export async function supportChat(input: SupportChatInput): Promise<SupportChatOutput> {
  return supportChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supportChatPrompt',
  input: { schema: SupportChatInputSchema },
  output: { schema: SupportChatOutputSchema },
  prompt: `You are a friendly and helpful support agent for GigLink, a marketplace for freelance services. 
Your goal is to assist users by answering their questions and resolving their doubts about the platform.
Be concise and clear in your responses.

Conversation History:
{{#each history}}
  **{{role}}**: {{{content}}}
{{/each}}

**model**:`,
});

const supportChatFlow = ai.defineFlow(
  {
    name: 'supportChatFlow',
    inputSchema: SupportChatInputSchema,
    outputSchema: SupportChatOutputSchema,
  },
  async (input: SupportChatInput) => {  // added explicit type here
    const { output } = await prompt(input);
    return { response: output!.response };
  }
);

