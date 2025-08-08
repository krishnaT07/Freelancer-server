'use server';

import { ai } from '../genkit';
import { z } from 'zod';

const GenerateGigImageInputSchema = z.object({
  promptText: z.string(),
});
export type GenerateGigImageInput = z.infer<typeof GenerateGigImageInputSchema>;

const GenerateGigImageOutputSchema = z.object({
  imageDataUri: z.string().describe(
    "The generated image for the gig, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type GenerateGigImageOutput = z.infer<typeof GenerateGigImageOutputSchema>;

export async function generateGigImage(input: GenerateGigImageInput): Promise<GenerateGigImageOutput> {
  return generateGigImageFlow(input);
}

const generateGigImageFlow = ai.defineFlow(
  {
    name: 'generateGigImageFlow',
    inputSchema: GenerateGigImageInputSchema,
    outputSchema: GenerateGigImageOutputSchema,
  },
  async (input: GenerateGigImageInput) => {
    const { promptText } = input;
    const response = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate an attractive, professional, and high-quality image that visually represents the following service or gig title. The image should be photorealistic or in a modern digital art style, suitable for a professional marketplace listing. Avoid using text in the image. Gig Title: ${promptText}`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const media = response.media;
    if (!media || !media.url) {
      throw new Error('Image generation failed to produce an image.');
    }

    return { imageDataUri: media.url };
  }
);

