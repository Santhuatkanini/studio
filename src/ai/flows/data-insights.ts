// Use server directive.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for surfacing data insights using AI.
 *
 * - analyzeDataInsights - A function that analyzes datasets and provides insights.
 * - AnalyzeDataInsightsInput - The input type for the analyzeDataInsights function.
 * - AnalyzeDataInsightsOutput - The return type for the analyzeDataInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDataInsightsInputSchema = z.object({
  datasetDescription: z
    .string()
    .describe('A detailed description of the dataset to be analyzed.'),
  dataSample: z
    .string()
    .describe(
      'A representative sample of the data from the dataset, preferably in JSON format.'
    ),
});
export type AnalyzeDataInsightsInput = z.infer<typeof AnalyzeDataInsightsInputSchema>;

const AnalyzeDataInsightsOutputSchema = z.object({
  dataQualityIssues: z
    .string()
    .describe(
      'Identified data quality issues such as missing values, outliers, inconsistencies, and errors.'
    ),
  improvementAreas: z
    .string()
    .describe(
      'Suggested areas for data improvement, including data cleaning, transformation, and enrichment opportunities.'
    ),
  overallAssessment: z
    .string()
    .describe('An overall assessment of the dataset quality and usability.'),
});
export type AnalyzeDataInsightsOutput = z.infer<typeof AnalyzeDataInsightsOutputSchema>;

export async function analyzeDataInsights(
  input: AnalyzeDataInsightsInput
): Promise<AnalyzeDataInsightsOutput> {
  return analyzeDataInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDataInsightsPrompt',
  input: {schema: AnalyzeDataInsightsInputSchema},
  output: {schema: AnalyzeDataInsightsOutputSchema},
  prompt: `You are an AI assistant specialized in data analysis and quality assessment.

You will analyze the provided dataset description and data sample to identify data quality issues and suggest areas for improvement.

Dataset Description: {{{datasetDescription}}}

Data Sample: {{{dataSample}}}

Based on the information above, please provide the following:

1.  Data Quality Issues: List any identified data quality problems, such as missing values, outliers, inconsistencies, and errors.
2.  Improvement Areas: Suggest areas for data improvement, including data cleaning, transformation, and enrichment opportunities.
3.  Overall Assessment: Provide an overall assessment of the dataset quality and usability for machine learning tasks.

Please format your response clearly and concisely.
`,
});

const analyzeDataInsightsFlow = ai.defineFlow(
  {
    name: 'analyzeDataInsightsFlow',
    inputSchema: AnalyzeDataInsightsInputSchema,
    outputSchema: AnalyzeDataInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
