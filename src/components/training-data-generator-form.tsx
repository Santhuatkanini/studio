// src/components/training-data-generator-form.tsx
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generateTrainingData, type GenerateTrainingDataInput, type GenerateTrainingDataOutput } from '@/ai/flows/generate-training-data';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  documentText: z.string().min(50, "Document text is too short.").max(10000),
  taskDescription: z.string().min(10, "Task description is too short.").max(500),
  numExamples: z.coerce.number().int().positive().min(1).max(20).default(5),
});

type FormData = z.infer<typeof formSchema>;

export default function TrainingDataGeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<GenerateTrainingDataOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentText: "",
      taskDescription: "",
      numExamples: 5,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setGeneratedData(null);
    try {
      const result = await generateTrainingData(data);
      setGeneratedData(result);
      toast({
        title: "Data Generation Complete",
        description: `${result.length} training examples generated.`,
      });
    } catch (error) {
      console.error("Error generating training data:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate training data. Please try again.",
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
          name="documentText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Text</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste the raw document text here..."
                  className="min-h-[150px]"
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
          name="taskDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the task for which training data is needed (e.g., 'Question answering based on the document', 'Summarize key points')."
                  className="min-h-[80px]"
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
          name="numExamples"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Examples to Generate</FormLabel>
              <FormControl>
                <Input type="number" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Data
        </Button>
      </form>

      {generatedData && generatedData.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Generated Training Examples:</h3>
          {generatedData.map((example, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">Example {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Input:</p>
                  <p className="whitespace-pre-wrap bg-muted p-2 rounded-md">{example.input}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Output:</p>
                  <p className="whitespace-pre-wrap bg-muted p-2 rounded-md">{example.output}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Form>
  );
}
