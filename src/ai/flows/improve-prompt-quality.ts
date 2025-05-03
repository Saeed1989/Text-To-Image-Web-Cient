'use server';
/**
 * @fileOverview This file contains the Genkit flow for improving the quality of user-provided text prompts for image generation.
 *
 * - improvePromptQuality - A function that takes a user's initial text prompt and refines it for better image generation results.
 * - ImprovePromptQualityInput - The input type for the improvePromptQuality function, containing the user's initial prompt.
 * - ImprovePromptQualityOutput - The return type for the improvePromptQuality function, containing the refined prompt.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ImprovePromptQualityInputSchema = z.object({
  initialPrompt: z.string().describe('The user-provided initial text prompt.'),
});
export type ImprovePromptQualityInput = z.infer<typeof ImprovePromptQualityInputSchema>;

const ImprovePromptQualityOutputSchema = z.object({
  refinedPrompt: z.string().describe('The refined text prompt for improved image generation.'),
});
export type ImprovePromptQualityOutput = z.infer<typeof ImprovePromptQualityOutputSchema>;

export async function improvePromptQuality(input: ImprovePromptQualityInput): Promise<ImprovePromptQualityOutput> {
  return improvePromptQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improvePromptQualityPrompt',
  input: {
    schema: z.object({
      initialPrompt: z.string().describe('The user-provided initial text prompt.'),
    }),
  },
  output: {
    schema: z.object({
      refinedPrompt: z.string().describe('The refined text prompt for improved image generation.'),
    }),
  },
  prompt: `You are an expert prompt engineer. Your goal is to improve the quality of a user-provided text prompt for image generation.

Here is the initial prompt: {{{initialPrompt}}}

Refine the prompt to be more specific, descriptive, and detailed to generate a high-quality image. The refined prompt should be optimized for AI image generation models.

Output the refined prompt.`, 
});

const improvePromptQualityFlow = ai.defineFlow<
  typeof ImprovePromptQualityInputSchema,
  typeof ImprovePromptQualityOutputSchema
>(
  {
    name: 'improvePromptQualityFlow',
    inputSchema: ImprovePromptQualityInputSchema,
    outputSchema: ImprovePromptQualityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
