
// src/components/new-fine-tuning-job-form.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const baseModels = [
  { id: 'llama3-8b', name: 'Llama 3 8B' },
  { id: 'mistral-7b', name: 'Mistral 7B' },
  { id: 'gpt-neo-2.7b', name: 'GPT-Neo 2.7B' },
  { id: 'gemini-pro', name: 'Gemini Pro' },
];

const datasets = [
  { id: 'cs-q1', name: 'Customer Support Q1' },
  { id: 'oil-gas', name: 'Oil and Gas Data' }, // Renamed for clarity
  { id: 'product-desc', name: 'Product Descriptions' },
  { id: 'electrification', name: 'Electrification Data' },
  { id: 'flow-control', name: 'Flow Control Data' },
];

const formSchema = z.object({
  jobId: z.string(),
  baseModel: z.string().min(1, { message: 'Please select a base model.' }),
  dataset: z.string().min(1, { message: 'Please select a dataset.' }),
});

export type NewFineTuningJobFormData = z.infer<typeof formSchema>;

interface NewFineTuningJobFormProps {
  defaultJobId: string;
  onSubmitSuccess: (data: NewFineTuningJobFormData) => void;
}

export default function NewFineTuningJobForm({
  defaultJobId,
  onSubmitSuccess,
}: NewFineTuningJobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewFineTuningJobFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobId: defaultJobId,
      baseModel: '',
      dataset: '',
    },
  });

  useEffect(() => {
    form.reset({ ...form.getValues(), jobId: defaultJobId });
  }, [defaultJobId, form]);

  const handleSubmit: SubmitHandler<NewFineTuningJobFormData> = async (data) => {
    setIsSubmitting(true);
    // Simulate API call or processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmitSuccess(data);
    setIsSubmitting(false);
    // The dialog will be closed by the parent component
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="jobId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fine-Tuning Job ID</FormLabel>
              <FormControl>
                <Input {...field} readOnly className="bg-muted/50 cursor-not-allowed" />
              </FormControl>
              <FormDescription>This ID is auto-generated.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="baseModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Model</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a base model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {baseModels.map((model) => (
                    <SelectItem key={model.id} value={model.name}> {/* Use name for submission simplicity */}
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataset"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dataset</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dataset" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {datasets.map((dataset) => (
                    <SelectItem key={dataset.id} value={dataset.name}> {/* Use name for submission simplicity */}
                      {dataset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit Fine-Tuning Job
        </Button>
      </form>
    </Form>
  );
}
