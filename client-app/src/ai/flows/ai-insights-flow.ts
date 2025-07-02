'use server';
/**
 * @fileOverview A comprehensive AI insights generator for the LCUZR CRM.
 * It analyzes leads, sales, and product data to produce actionable insights
 * tailored to a specific user role.
 *
 * - getAiInsights - A function that handles the insight generation process.
 */

import {ai} from '@/ai/genkit';
import {
    AiInsightsInput,
    AiInsightsInputSchema,
    AiInsightsOutput,
    AiInsightsOutputSchema,
} from '@/ai/schemas/ai-insights-schemas';

export async function getAiInsights(input: AiInsightsInput): Promise<AiInsightsOutput> {
  return aiInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiInsightsPrompt',
  input: {schema: AiInsightsInputSchema},
  output: {schema: AiInsightsOutputSchema},
  prompt: `You are a world-class CRM analyst AI for a company called LCUZR. Your task is to analyze CRM data and provide actionable insights, alerts, forecasts, and optimization suggestions.

The user's role is: {{{userRole}}}. Tailor your insights to be most relevant to this role.
- An 'Admin' wants to see global performance, cross-branch comparisons, and major risks.
- A 'Sales Manager' is focused on team performance, deal pipeline health, and product sales trends.
- A 'Showroom Rep' or 'Field Rep' needs insights on their personal leads, suggestions for closing deals, and product upsell opportunities.

Analyze the following data:
Leads Data: {{{leadsJson}}}
Sales Data: {{{salesJson}}}
Product Data: {{{productsJson}}}

Generate a list of insights based on your analysis. For each insight, provide:
- 'type': Can be 'Alert', 'Opportunity', 'Forecast', or 'Optimization'.
- 'title': A concise headline for the insight.
- 'description': A 1-2 sentence explanation of the finding.
- 'confidence': Your confidence in this insight from 0.0 to 1.0.
- 'actionable': A boolean indicating if there is a direct action the user can take.
- 'actionText': A short, clear call to action (e.g., "View Risky Deals", "Create Bundle").
- 'relatedEntity': If applicable, the ID of the lead, product, or rep this insight pertains to.

Example for a Sales Manager:
If you see a product is frequently in 'Won' deals but not in many 'Quotation' deals, suggest an 'Optimization' to promote it more.
If a sales rep has many 'Proposal' deals stuck for weeks, create an 'Alert'.
If sales volume is trending up, provide a 'Forecast'.
If multiple customers who bought Product A also bought Product C, suggest an 'Opportunity' to create a bundle.

Return a JSON object that strictly follows the output schema.
`,
});

const aiInsightsFlow = ai.defineFlow(
  {
    name: 'aiInsightsFlow',
    inputSchema: AiInsightsInputSchema,
    outputSchema: AiInsightsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
