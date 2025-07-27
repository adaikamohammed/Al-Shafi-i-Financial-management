// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Generates insightful monthly and annual financial reports with actionable recommendations.
 *
 * - generateFinancialReport - A function that generates the financial report.
 * - FinancialReportInput - The input type for the generateFinancialReport function.
 * - FinancialReportOutput - The return type for the generateFinancialReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialReportInputSchema = z.object({
  reportType: z.enum(['monthly', 'annual']).describe('The type of report to generate.'),
  financialDataSummary: z.string().describe('A summary of the financial data for the period.'),
});
export type FinancialReportInput = z.infer<typeof FinancialReportInputSchema>;

const FinancialReportOutputSchema = z.object({
  reportSummary: z.string().describe('A summary of the financial report.'),
  actionableRecommendations: z.string().describe('Actionable recommendations based on the financial data.'),
  visualizationTypes: z.array(z.string()).describe('Suggested visualization types for the report data.'),
});
export type FinancialReportOutput = z.infer<typeof FinancialReportOutputSchema>;

export async function generateFinancialReport(input: FinancialReportInput): Promise<FinancialReportOutput> {
  return generateFinancialReportFlow(input);
}

const generateFinancialReportPrompt = ai.definePrompt({
  name: 'generateFinancialReportPrompt',
  input: {schema: FinancialReportInputSchema},
  output: {schema: FinancialReportOutputSchema},
  prompt: `You are a financial advisor for Al-Shafi'i Quranic School. Based on the financial data summary provided, generate a report summary, provide actionable recommendations, and suggest visualization types for the report data.

Financial Data Summary: {{{financialDataSummary}}}
Report Type: {{{reportType}}}

Report Summary:
Actionable Recommendations:
Visualization Types:`, // Use 'visualizationTypes' and handlebars syntax to reference properties.
});

const generateFinancialReportFlow = ai.defineFlow(
  {
    name: 'generateFinancialReportFlow',
    inputSchema: FinancialReportInputSchema,
    outputSchema: FinancialReportOutputSchema,
  },
  async input => {
    const {output} = await generateFinancialReportPrompt(input);
    return output!;
  }
);
