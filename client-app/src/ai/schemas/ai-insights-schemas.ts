/**
 * @fileOverview Zod schemas and TypeScript types for the AI Insights flow.
 */

import {z} from 'genkit';

export const AiInsightsInputSchema = z.object({
  leadsJson: z.string().describe('A stringified JSON array of all lead data.'),
  salesJson: z.string().describe('A stringified JSON array of all sales deal data.'),
  productsJson: z.string().describe('A stringified JSON array of all product/service data.'),
  userRole: z.string().describe('The role of the user requesting insights (e.g., "Admin", "Sales Manager").'),
});
export type AiInsightsInput = z.infer<typeof AiInsightsInputSchema>;

export const AiInsightsOutputSchema = z.object({
  insights: z.array(
    z.object({
      type: z
        .enum(['Alert', 'Opportunity', 'Forecast', 'Optimization'])
        .describe('The category of the insight.'),
      title: z.string().describe('A concise headline for the insight.'),
      description: z.string().describe('A 1-2 sentence summary of the finding and its impact.'),
      confidence: z.number().min(0).max(1).describe('The AI\'s confidence level in the insight.'),
      actionable: z.boolean().describe('Whether a direct action can be taken from this insight.'),
      actionText: z.string().optional().describe('A short call to action, e.g., "Review Leads".'),
      relatedEntity: z.string().optional().describe('The ID of a relevant lead, product, or user.'),
    })
  ).describe('A list of generated insights.'),
});
export type AiInsightsOutput = z.infer<typeof AiInsightsOutputSchema>;
