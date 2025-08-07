
'use server';

/**
 * @fileOverview A Genkit flow for generating an image for a gig based on its title.
 *
 * - generateGigImage - A function that takes a gig title and returns a data URI for a generated image.
 * - GenerateGigImageInput - The input type for the generateGigImage function.
 * - GenerateGigImageOutput - The return type for the generateGigImage function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const GenerateGigImageInputSchema = z.string();
export type GenerateGigImageInput = z.infer<typeof GenerateGigImageInputSchema>;

const GenerateGigImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image for the gig, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateGigImageOutput = z.infer<typeof GenerateGigImageOutputSchema>;

export async function generateGigImage(promptText: GenerateGigImageInput): Promise<GenerateGigImageOutput> {
  return generateGigImageFlow(promptText);
}

const generateGigImageFlow = ai.defineFlow(
  {
    name: 'generateGigImageFlow',
    inputSchema: GenerateGigImageInputSchema,
    outputSchema: GenerateGigImageOutputSchema,
  },
  async (prompt) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate an attractive, professional, and high-quality image that visually represents the following service or gig title. The image should be photorealistic or in a modern digital art style, suitable for a professional marketplace listing. Avoid using text in the image. Gig Title: ${prompt}`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
        throw new Error('Image generation failed to produce an image.');
    }

    return { imageDataUri: media.url };
  }
);
