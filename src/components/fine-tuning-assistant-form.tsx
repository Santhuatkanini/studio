// src/components/fine-tuning-assistant-form.tsx
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { suggestFineTuningParameters, type SuggestFineTuningParametersInput, type SuggestFineTuningParametersOutput } from '@/ai/flows/suggest-fine-tuning-parameters';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  datasetAnalysis: z.string().min(20, "Dataset analysis is too short.").max(5000),
  taskType: z.string().min(3, "Task type is too short.").max(100),
  modelType: z.string().min(3, "Model type is too short.").max(100),
});

type FormData = z.infer<typeof formSchema>;

export default function FineTuningAssistantForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionResult, setSuggestionResult] = useState<SuggestFineTuningParametersOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      datasetAnalysis: "",
      taskType: "",
      modelType: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setSuggestionResult(null);
    try {
      const result = await suggestFineTuningParameters(data);
      setSuggestionResult(result);
      toast({
        title: "Suggestions Ready",
        description: "Fine-tuning parameters suggested successfully.",
      });
    } catch (error) {
      console.error("Error suggesting parameters:", error);
      toast({
        title: "Suggestion Failed",
        description: "Could not suggest parameters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="datasetAnalysis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dataset Analysis Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a summary of your dataset analysis (size, structure, key characteristics)..."
                  className="min-h-[120px]"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="taskType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Type</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Text Generation, Classification, Q&A"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="modelType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Model Type</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Llama 3 8B, Mistral 7B, GPT-Neo"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Suggest Parameters
        </Button>
      </form>

      {suggestionResult && (
        <div className="mt-8 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md font-mono">
                {suggestionResult.suggestedParameters}
              </pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Rationale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{suggestionResult.rationale}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </Form>
  );
}
