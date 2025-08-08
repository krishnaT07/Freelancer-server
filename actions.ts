'use server';

import { generateGigTags, GenerateGigTagsInput } from './ai/flows/generate-gig-tags';
import { generateGigImage, GenerateGigImageInput } from './ai/flows/generate-gig-image';
import { supportChat, SupportChatInput } from './ai/flows/support-chat-flow';
import { generateGigDescription, GenerateGigDescriptionInput } from './ai/flows/generate-gig-description';
import { recommendGigs, RecommendGigsInput } from './ai/flows/recommend-gigs';
import { translateText, TranslateTextInput } from './ai/flows/translate-text';

// Return type for generateImageAction: either success or error
type GenerateImageResult = { imageDataUri: string } | { error: string };

export async function generateTagsAction(input: GenerateGigTagsInput): Promise<string[]> {
  try {
    const result = await generateGigTags(input);
    return result.tags;
  } catch (error) {
    console.error("Error generating tags:", error);
    return [];
  }
}

export async function generateDescriptionAction(input: GenerateGigDescriptionInput): Promise<string> {
  try {
    const result = await generateGigDescription(input);
    return result.description;
  } catch (error) {
    console.error("Error generating description:", error);
    return "We couldn't generate a description right now. Please try again or write one manually.";
  }
}

export async function generateImageAction(title: string): Promise<GenerateImageResult> {
  try {
    // Note: pass the title wrapped in the expected input object shape
    const input: GenerateGigImageInput = { promptText: title };
    const result = await generateGigImage(input);
    return { imageDataUri: result.imageDataUri };
  } catch (error) {
    console.error("Error generating image:", error);
    return { error: "Failed to generate image. Please try again." };
  }
}

export async function supportChatAction(input: SupportChatInput): Promise<string> {
  try {
    const result = await supportChat(input);
    return result.response;
  } catch (error) {
    console.error("Error in support chat:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}

export async function recommendGigsAction(input: RecommendGigsInput): Promise<string[]> {
  try {
    const result = await recommendGigs(input);
    return result.recommendations;
  } catch (error) {
    console.error("Error recommending gigs:", error);
    return [];
  }
}

export async function translateTextAction(input: TranslateTextInput): Promise<string> {
  try {
    const result = await translateText(input);
    return result.translation;
  } catch (error) {
    console.error("Error translating text:", error);
    return `Error: Could not translate to ${input.targetLanguage}.`;
  }
}
