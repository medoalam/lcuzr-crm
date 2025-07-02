'use server';
/**
 * @fileOverview Extracts product information from a voice transcript.
 *
 * - extractProductFromVoice - A function that handles the product extraction.
 */

import {ai} from '@/ai/genkit';
import {
    ProductFromVoiceInput,
    ProductFromVoiceInputSchema,
    ProductFromVoiceOutput,
    ProductFromVoiceOutputSchema,
} from '@/ai/schemas/product-from-voice-schemas';


export async function extractProductFromVoice(input: ProductFromVoiceInput): Promise<ProductFromVoiceOutput> {
  return productFromVoiceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productFromVoicePrompt',
  input: {schema: ProductFromVoiceInputSchema},
  output: {schema: ProductFromVoiceOutputSchema},
  prompt: `You are an expert at parsing product information from unstructured text. A user has provided a voice transcript describing a product or service. Extract the key details and format them as a JSON object.

If a detail is not mentioned, use a reasonable default or leave it blank.
- For price, extract only the number.
- For category, choose one from: Furniture, Electronics, Services.
- For tags, generate a few relevant keywords based on the description.

Transcript: "{{{prompt}}}"`,
});

const productFromVoiceFlow = ai.defineFlow(
  {
    name: 'productFromVoiceFlow',
    inputSchema: ProductFromVoiceInputSchema,
    outputSchema: ProductFromVoiceOutputSchema,
  },
  async (promptText) => {
    const {output} = await prompt(promptText);
    return output!;
  }
);
