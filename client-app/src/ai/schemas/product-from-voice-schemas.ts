/**
 * @fileOverview Zod schemas and TypeScript types for the product-from-voice flow.
 *
 * - ProductFromVoiceInputSchema - The Zod schema for the input.
 * - ProductFromVoiceInput - The TypeScript type for the input.
 * - ProductFromVoiceOutputSchema - The Zod schema for the output.
 * - ProductFromVoiceOutput - The TypeScript type for the output.
 */

import {z} from 'genkit';

export const ProductFromVoiceInputSchema = z.string().describe('A raw text transcript from a user describing a product.');
export type ProductFromVoiceInput = z.infer<typeof ProductFromVoiceInputSchema>;

export const ProductFromVoiceOutputSchema = z.object({
  name: z.string().describe('The name of the product.'),
  description: z.string().describe('A brief description of the product.'),
  price: z.number().describe('The price of the product.'),
  tags: z.array(z.string()).describe('A list of suggested tags for the product.'),
  category: z.string().describe('A suggested category for the product (e.g., Furniture, Electronics, Services).'),
});
export type ProductFromVoiceOutput = z.infer<typeof ProductFromVoiceOutputSchema>;
