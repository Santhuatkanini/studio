// Use server directive.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting initial fine-tuning parameters
 * based on the provided dataset analysis.
 *
 * @interface SuggestFineTuningParametersInput - Defines the input schema for the suggestFineTuningParameters function.
 * @interface SuggestFineTuningParametersOutput - Defines the output schema for the suggestFineTuningParameters function.
 * @function suggestFineTuningParameters - The main function that triggers the flow and returns the suggested parameters.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const SuggestFineTuningParametersInputSchema = z.object({
  datasetAnalysis: z
    .string()
    .describe(
      'A comprehensive analysis of the dataset, including size, structure, data types, and relevant statistics.'
    ),
  taskType: z
    .string()
    .describe(
      'The type of task for which the LLM will be fine-tuned (e.g., text generation, classification, question answering).'
    ),
  modelType: z
    .string()
    .describe(
      'The type of base LLM to be fine-tuned (e.g., GPT-3, BERT, custom model).'n
    ),
});

export type SuggestFineTuningParametersInput = z.infer<
  typeof SuggestFineTuningParametersInputSchema
>;

// Define the output schema
const SuggestFineTuningParametersOutputSchema = z.object({
  suggestedParameters: z
    .string()
    .describe(
      'A JSON object containing suggested initial fine-tuning parameters, including learning rate, batch size, number of epochs, and other relevant hyperparameters.'
    ),
  rationale: z
    .string()
    .describe(
      'A brief explanation of why these parameters are recommended based on the dataset analysis and task type.'
    ),
});

export type SuggestFineTuningParametersOutput = z.infer<
  typeof SuggestFineTuningParametersOutputSchema
>;

// Define the main function that calls the flow
export async function suggestFineTuningParameters(
  input: SuggestFineTuningParametersInput
): Promise<SuggestFineTuningParametersOutput> {
  return suggestFineTuningParametersFlow(input);
}

// Define the prompt
const suggestFineTuningParametersPrompt = ai.definePrompt({
  name: 'suggestFineTuningParametersPrompt',
  input: {schema: SuggestFineTuningParametersInputSchema},
  output: {schema: SuggestFineTuningParametersOutputSchema},
  prompt: `You are an AI assistant specializing in suggesting initial fine-tuning parameters for large language models.

  Based on the provided dataset analysis, task type, and model type, you will suggest appropriate fine-tuning parameters.
  You must return a JSON format for suggested parameters, and add a rationale of why these parameters are recommended.

  Dataset Analysis: {{{datasetAnalysis}}}
  Task Type: {{{taskType}}}
  Model Type: {{{modelType}}}

  Please provide the suggested parameters and rationale in the requested JSON format:
  `,
});

// Define the flow
const suggestFineTuningParametersFlow = ai.defineFlow(
  {
    name: 'suggestFineTuningParametersFlow',
    inputSchema: SuggestFineTuningParametersInputSchema,
    outputSchema: SuggestFineTuningParametersOutputSchema,
  },
  async input => {
    const {output} = await suggestFineTuningParametersPrompt(input);
    return output!;
  }
);
