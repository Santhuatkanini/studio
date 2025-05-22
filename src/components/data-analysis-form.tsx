// src/components/data-analysis-form.tsx
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { analyzeDataInsights, type AnalyzeDataInsightsInput, type AnalyzeDataInsightsOutput } from '@/ai/flows/data-insights';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  datasetDescription: z.string().min(10, "Dataset description is too short.").max(2000),
  dataSample: z.string().min(10, "Data sample is too short.").max(5000),
});

type FormData = z.infer<typeof formSchema>;

export default function DataAnalysisForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDataInsightsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      datasetDescription: "",
      dataSample: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeDataInsights(data);
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Data insights generated successfully.",
      });
    } catch (error) {
      console.error("Error analyzing data:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not generate data insights. Please try again.",
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
          name="datasetDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dataset Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of the dataset..."
                  className="min-h-[100px]"
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
          name="dataSample"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Sample (JSON format preferred)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste a representative sample of your data here..."
                  className="min-h-[150px] font-mono text-xs"
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
          Analyze Data
        </Button>
      </form>

      {analysisResult && (
        <div className="mt-8 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Quality Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{analysisResult.dataQualityIssues}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Improvement Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{analysisResult.improvementAreas}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{analysisResult.overallAssessment}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </Form>
  );
}
