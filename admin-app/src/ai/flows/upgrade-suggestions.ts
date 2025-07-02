'use server';

/**
 * @fileOverview AI agent to suggest plan upgrades for clients based on usage.
 *
 * - suggestPlanUpgrades - A function that suggests plan upgrades based on client usage.
 * - SuggestPlanUpgradesInput - The input type for the suggestPlanUpgrades function.
 * - SuggestPlanUpgradesOutput - The return type for the suggestPlanUpgrades function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPlanUpgradesInputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  currentPlan: z.string().describe('The name of the company\'s current plan.'),
  usageData: z
    .string()
    .describe(
      'JSON stringified data representing the company\'s usage of various CRM features, should include metrics like lead count, email sends, storage used, and active users.'
    ),
  featureLimits: z
    .string()
    .describe(
      'JSON stringified data representing the limits of various CRM features of the company plan, should include metrics like lead count, email sends, storage used, and active users.'
    ),
});
export type SuggestPlanUpgradesInput = z.infer<typeof SuggestPlanUpgradesInputSchema>;

const SuggestPlanUpgradesOutputSchema = z.object({
  upgradeRecommendation: z
    .string()
    .describe(
      'A recommendation for a plan upgrade, including the name of the suggested plan and the reasons for the upgrade.'
    ),
  reasoning: z.string().describe('The AI reasoning behind the upgrade suggestion.'),
});
export type SuggestPlanUpgradesOutput = z.infer<typeof SuggestPlanUpgradesOutputSchema>;

export async function suggestPlanUpgrades(
  input: SuggestPlanUpgradesInput
): Promise<SuggestPlanUpgradesOutput> {
  return suggestPlanUpgradesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPlanUpgradesPrompt',
  input: {schema: SuggestPlanUpgradesInputSchema},
  output: {schema: SuggestPlanUpgradesOutputSchema},
  prompt: `You are an AI assistant that analyzes a company's CRM usage and suggests plan upgrades.

  Company Name: {{{companyName}}}
  Current Plan: {{{currentPlan}}}
  Usage Data: {{{usageData}}}
  Feature Limits: {{{featureLimits}}}

  Based on the company's usage data and feature limits, provide a plan upgrade recommendation and reasoning.
  Be concise and specific in your recommendation, mentioning the suggested plan and why it is appropriate.
  Ensure that the upgrade recommendation aligns with the company's needs and usage patterns, and that the reasoning is clear and justified.

  Format:
  Upgrade Recommendation: [Suggested Plan] - [Reasons for Upgrade]
  Reasoning: [AI reasoning behind the suggestion]
  `,
});

const suggestPlanUpgradesFlow = ai.defineFlow(
  {
    name: 'suggestPlanUpgradesFlow',
    inputSchema: SuggestPlanUpgradesInputSchema,
    outputSchema: SuggestPlanUpgradesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
