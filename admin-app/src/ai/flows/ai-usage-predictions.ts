'use server';

/**
 * @fileOverview An AI agent to predict client resource usage and suggest upgrades.
 *
 * - predictUsageAndSuggestUpgrade - Predicts client resource usage and suggests plan upgrades.
 * - UsagePredictionInput - The input type for the predictUsageAndSuggestUpgrade function.
 * - UsagePredictionOutput - The return type for the predictUsageAndSuggestUpgrade function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UsagePredictionInputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  currentPlan: z.string().describe('The name of the company\'s current plan.'),
  resourceUsageData: z.string().describe('The company\'s resource usage data as a JSON string.'),
  featureLimits: z.string().describe('The current plan\'s feature limits as a JSON string.'),
});
export type UsagePredictionInput = z.infer<typeof UsagePredictionInputSchema>;

const UsagePredictionOutputSchema = z.object({
  predictedUsage: z.string().describe('AI-driven prediction of client resource usage as a JSON string.'),
  upgradeSuggestion: z.string().describe('Suggestion for plan upgrades based on predicted usage.'),
  confidenceLevel: z.string().describe('The confidence level of the prediction (low, medium, high).'),
});
export type UsagePredictionOutput = z.infer<typeof UsagePredictionOutputSchema>;

export async function predictUsageAndSuggestUpgrade(
  input: UsagePredictionInput
): Promise<UsagePredictionOutput> {
  return predictUsageAndSuggestUpgradeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictUsageAndSuggestUpgradePrompt',
  input: {schema: UsagePredictionInputSchema},
  output: {schema: UsagePredictionOutputSchema},
  prompt: `You are an AI assistant that analyzes client resource usage data and provides predictions and upgrade suggestions.

  Analyze the provided resource usage data and feature limits to predict future resource usage and suggest plan upgrades if the client is likely to exceed their current limits.

  Company Name: {{{companyName}}}
  Current Plan: {{{currentPlan}}}
  Resource Usage Data: {{{resourceUsageData}}}
  Feature Limits: {{{featureLimits}}}

  Based on this information, provide a prediction of the client's resource usage, a suggestion for plan upgrades, and a confidence level for the prediction. Return predicted usage, upgrade suggestion, and confidence level in JSON format.
  `,
});

const predictUsageAndSuggestUpgradeFlow = ai.defineFlow(
  {
    name: 'predictUsageAndSuggestUpgradeFlow',
    inputSchema: UsagePredictionInputSchema,
    outputSchema: UsagePredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
