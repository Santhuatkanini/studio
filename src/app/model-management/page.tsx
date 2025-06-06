
'use client';

import React, { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  PlayCircle, ExternalLink, CircleSlash, BrainCircuit, ListChecks, Lightbulb, Rocket, Eye,
  CheckCircle2, Pencil, Star, RefreshCw, X, AreaChart, ChevronsUpDown, Download, Maximize2, MoreHorizontal, Trash2, MenuIcon as Menu
} from "lucide-react";
import FineTuningAssistantForm from "@/components/fine-tuning-assistant-form";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart as RechartsLineChart,
  Line as RechartsLineElement,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewFineTuningJobForm, { type NewFineTuningJobFormData } from "@/components/new-fine-tuning-job-form";


const sampleFineTuningJobs = [
  { id: "ftj_abc123", name: "mini-instruct-Finetune-ABC", baseModel: "Llama 3 8B", dataset: "Customer Support Q1", status: "Running", progress: 75, created: "2024-07-18 10:00" },
  { id: "ftj_def456", name: "oil-gas-model-DEF", baseModel: "Mistral 7B", dataset: "Oil and Gas", status: "Completed", progress: 100, created: "2024-07-15 14:30" },
  { id: "ftj_ghi789", name: "product-desc-gen-GHI", baseModel: "GPT-Neo 2.7B", dataset: "Product Descriptions", status: "Failed", progress: 20, created: "2024-07-19 09:15" },
  { id: "ftj_jkl012", name: "electrification-analyzer-JKL", baseModel: "Llama 3 8B", dataset: "Electrification", status: "Queued", progress: 0, created: "2024-07-19 11:00" },
  { id: "ftj_mno345", name: "flow-control-optimizer-MNO", baseModel: "Mistral 7B", dataset: "Flow Control", status: "Completed", progress: 100, created: "2024-07-20 12:00" },
];

const sampleDeployedModels = [
  { id: "dep_xyz789", modelName: "SupportBot v1.2 (Llama 3)", endpoint: "/api/v1/supportbot", status: "Active", version: "1.2", requestsToday: 10250 },
  { id: "dep_uvw456", modelName: "ProductDescGen v0.9 (Mistral)", endpoint: "/api/v1/productdesc", status: "Inactive", version: "0.9", requestsToday: 0 },
  { id: "dep_rst123", modelName: "KnowledgeSearch v2.0 (Llama 3)", endpoint: "/api/v1/kbsearch", status: "Active", version: "2.0", requestsToday: 56780 },
];

// Placeholder data for expanded job details
const checkpointSaveStepData = [
  { step: 0, value: 18 }, { step: 20, value: 35 }, { step: 40, value: 50 },
  { step: 60, value: 68 }, { step: 80, value: 85 }, { step: 100, value: 102 },
  { step: 120, value: 120 }, { step: 140, value: 138 }, { step: 160, value: 150 },
];

const epochData = [
  { step: 0, value: 1 }, { step: 20, value: 2 }, { step: 40, value: 3 },
  { step: 60, value: 4 }, { step: 80, value: 5 }, { step: 100, value: 6 },
  { step: 120, value: 7 }, { step: 140, value: 8 }, { step: 160, value: 9 }, { step: 170, value: 10 }
];

const evalLossData = [
  { step: 0, value: 0.98 }, { step: 20, value: 0.92 }, { step: 40, value: 0.88 }, { step: 60, value: 0.85 },
  { step: 80, value: 0.855 }, { step: 100, value: 0.86 }, { step: 120, value: 0.87 }, { step: 140, value: 0.89 }, { step: 160, value: 0.93 },
];

const evalRuntimeData = [
  { step: 0, value: 1.375 }, { step: 20, value: 1.400 }, { step: 40, value: 1.390 }, { step: 60, value: 1.450 },
  { step: 80, value: 1.410 }, { step: 100, value: 1.405 }, { step: 120, value: 1.430 }, { step: 140, value: 1.360 }, { step: 160, value: 1.415 },
];

const evalSamplesPerSecondData = [
  { step: 0, value: 47.0 }, { step: 20, value: 46.5 }, { step: 40, value: 45.2 }, { step: 60, value: 46.3 },
  { step: 80, value: 46.0 }, { step: 100, value: 45.8 }, { step: 120, value: 47.5 }, { step: 140, value: 46.1 }, { step: 160, value: 45.5 },
];

const evalStepsPerSecondData = [
  { step: 0, value: 3.60 }, { step: 20, value: 3.55 }, { step: 40, value: 3.48 }, { step: 60, value: 3.50 },
  { step: 80, value: 3.58 }, { step: 100, value: 3.45 }, { step: 120, value: 3.62 }, { step: 140, value: 3.52 }, { step: 160, value: 3.49 },
];

const powerConsumptionData = [
  { step: 0, kwh: 0.5 }, { step: 20, kwh: 1.2 }, { step: 40, kwh: 2.0 }, { step: 60, kwh: 2.8 },
  { step: 80, kwh: 3.5 }, { step: 100, kwh: 4.1 }, { step: 120, kwh: 4.8 }, { step: 140, kwh: 5.3 }, { step: 160, kwh: 6.0 },
];

const greenhouseGasesData = [
  { step: 0, co2eq: 0.2 }, { step: 20, co2eq: 0.5 }, { step: 40, co2eq: 0.8 }, { step: 60, co2eq: 1.1 },
  { step: 80, co2eq: 1.4 }, { step: 100, co2eq: 1.6 }, { step: 120, co2eq: 1.9 }, { step: 140, co2eq: 2.1 }, { step: 160, co2eq: 2.4 },
];


const chartConfigJobMetrics = {
  value: { label: "Value", color: "hsl(var(--chart-1))" },
  step: { label: "Step", color: "hsl(var(--chart-2))" }, 
  kwh: { label: "Power (kWh)", color: "hsl(var(--chart-3))" },
  co2eq: { label: "GHG (kg CO₂eq)", color: "hsl(var(--chart-4))" },
};

const metricCardsData = [
    { title: "total_flos", value: "1,524,631,000" },
    { title: "train_loss", value: "0.7911301" },
    { title: "train_runtime", value: "711.7826 s" },
    { title: "train_samples_per_sec", value: "3.681" },
    { title: "train_steps_per_second", value: "0.239" },
];


export default function ModelManagementPage() {
  const { toast } = useToast();
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [isNewJobDialogOpen, setIsNewJobDialogOpen] = useState(false);
  const [currentNewJobId, setCurrentNewJobId] = useState('');

  const generateNewJobId = () => `ftj_${Date.now()}`;

  const handleStartNewJobClick = () => {
    setCurrentNewJobId(generateNewJobId());
    setIsNewJobDialogOpen(true);
  };

  const handleNewJobFormSubmit = (data: NewFineTuningJobFormData) => {
    // In a real app, you might add this to the sampleFineTuningJobs list or send to a backend
    // For now, we just show a toast and close the dialog.
    console.log("New job submitted:", data);
    setIsNewJobDialogOpen(false); // Close the dialog
    toast({
      title: "Fine-Tuning Job Submitted",
      description: `Job ID ${data.jobId} for model '${data.baseModel}' with dataset '${data.dataset}' has been successfully submitted.`,
    });
  };


  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobId(prevId => prevId === jobId ? null : jobId);
  };

  const getStatusIcon = (status: string) => {
    if (status === "Completed") return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (status === "Running") return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
    if (status === "Failed") return <X className="h-5 w-5 text-red-500" />;
    if (status === "Queued") return <ListChecks className="h-5 w-5 text-yellow-500" />;
    return null;
  };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Model Management</h1>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 md:w-auto">
          <TabsTrigger value="jobs">Fine-Tuning Jobs</TabsTrigger>
          <TabsTrigger value="deployed">Deployed Models</TabsTrigger>
          <TabsTrigger value="assistant">Fine-Tuning Assistant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                 <CardTitle className="flex items-center gap-2"><ListChecks className="h-6 w-6 text-primary" />Fine-Tuning Jobs</CardTitle>
                  <CardDescription>Monitor and manage your model fine-tuning processes.</CardDescription>
                </div>
                <Button onClick={handleStartNewJobClick}> 
                  <PlayCircle className="mr-2 h-4 w-4" /> Start New Job
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Base Model</TableHead>
                      <TableHead>Dataset</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleFineTuningJobs.map((job) => (
                      <Fragment key={job.id}>
                        <TableRow onClick={() => toggleJobExpansion(job.id)} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-mono text-xs">{job.id}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                            {job.baseModel}
                          </TableCell>
                          <TableCell>{job.dataset}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              job.status === "Completed" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                              job.status === "Running" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" :
                              job.status === "Queued" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" :
                              "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" 
                            }`}>
                              {job.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Progress value={job.progress} className="w-[100px] h-2" indicatorClassName={
                              job.status === "Failed" ? "bg-destructive" : job.status === "Completed" ? "bg-green-500" : "bg-primary"
                            } />
                            <span className="text-xs ml-2">{job.progress}%</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" aria-label="View Job Details" onClick={(e) => { e.stopPropagation(); toggleJobExpansion(job.id); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {(job.status === "Running" || job.status === "Queued") && (
                              <Button variant="ghost" size="icon" aria-label="Cancel Job" className="text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}>
                                <CircleSlash className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                        {expandedJobId === job.id && (
                          <TableRow>
                            <TableCell colSpan={6} className="p-0">
                              <div className="p-4 bg-card border-t">
                                <div className="flex items-center gap-2 mb-4">
                                  <h2 className="text-xl font-semibold">{job.name || `${job.baseModel} Finetune`}</h2>
                                  <Button variant="ghost" size="icon" className="h-6 w-6"><Pencil className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" className="h-6 w-6"><Star className="h-4 w-4" /></Button>
                                  {getStatusIcon(job.status)}
                                  <span className="text-sm text-muted-foreground">{job.status}</span>
                                </div>

                                <Tabs defaultValue="metrics">
                                  <TabsList className="mb-4">
                                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                                    <TabsTrigger value="images" disabled>Images</TabsTrigger>
                                    <TabsTrigger value="childJobs" disabled>Child Jobs</TabsTrigger>
                                    <TabsTrigger value="outputsLogs" disabled>Outputs + logs</TabsTrigger>
                                    <TabsTrigger value="code" disabled>Code</TabsTrigger>
                                    <TabsTrigger value="monitoring" disabled>Monitoring</TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="metrics">
                                    <div className="flex flex-wrap items-center gap-2 mb-6">
                                      <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm"><RefreshCw className="mr-2 h-3 w-3" />Refresh</Button>
                                        {job.status === "Running" && <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10"><X className="mr-2 h-3 w-3" />Cancel</Button>}
                                      </div>
                                      <div className="h-6 border-l mx-2 hidden sm:block"></div>
                                      <Button variant="outline" size="sm"><AreaChart className="mr-2 h-3 w-3" />Create custom chart</Button>
                                      <Button variant="outline" size="sm" disabled>View as... <ChevronsUpDown className="ml-2 h-3 w-3" /></Button>
                                      <div className="h-6 border-l mx-2 hidden sm:block"></div>
                                      <span className="text-sm text-muted-foreground mr-2">Current view:</span>
                                      <Button variant="outline" size="sm" disabled>Local <ChevronsUpDown className="ml-2 h-3 w-3" /></Button>
                                      <Button variant="outline" size="sm" disabled>Edit view</Button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                                      {metricCardsData.map(metric => (
                                        <Card key={metric.title}>
                                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-2 px-3">
                                            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{metric.title}</CardTitle>
                                            <div className="flex items-center gap-1">
                                               <Button variant="ghost" size="icon" className="h-6 w-6"><Menu className="h-4 w-4 text-muted-foreground" /></Button>
                                               <Button variant="ghost" size="icon" className="h-6 w-6"><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></Button>
                                            </div>
                                          </CardHeader>
                                          <CardContent className="pb-2 px-3">
                                            <div className="text-2xl font-bold">{metric.value}</div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                      <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <CardTitle className="text-sm font-semibold">checkpoint_save_step</CardTitle>
                                          <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Maximize2 className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                                          </div>
                                        </CardHeader>
                                        <CardContent>
                                          <ChartContainer config={chartConfigJobMetrics} className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                              <RechartsLineChart data={checkpointSaveStepData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="step" name="Step" tickLine={false} axisLine={false} tickMargin={8} />
                                                <YAxis dataKey="value" name="Checkpoint Save Step" tickLine={false} axisLine={false} tickMargin={8} />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                <RechartsLineElement type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} name="checkpoint_save_step" />
                                              </RechartsLineChart>
                                            </ResponsiveContainer>
                                          </ChartContainer>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <CardTitle className="text-sm font-semibold">epoch</CardTitle>
                                          <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Maximize2 className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                                          </div>
                                        </CardHeader>
                                        <CardContent>
                                          <ChartContainer config={chartConfigJobMetrics} className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                              <RechartsLineChart data={epochData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="step" name="Step" tickLine={false} axisLine={false} tickMargin={8} />
                                                <YAxis dataKey="value" name="Epoch" tickLine={false} axisLine={false} tickMargin={8} domain={[0, 'dataMax + 1']} />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                <RechartsLineElement type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} name="epoch" />
                                              </RechartsLineChart>
                                            </ResponsiveContainer>
                                          </ChartContainer>
                                        </CardContent>
                                      </Card>
                                       <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <CardTitle className="text-sm font-semibold">eval_loss</CardTitle>
                                           <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Maximize2 className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                                          </div>
                                        </CardHeader>
                                        <CardContent>
                                          <ChartContainer config={chartConfigJobMetrics} className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                              <RechartsLineChart data={evalLossData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="step" name="Step" tickLine={false} axisLine={false} tickMargin={8} />
                                                <YAxis dataKey="value" name="Eval Loss" tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 0.02', 'dataMax + 0.02']} />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                <RechartsLineElement type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} name="eval_loss" />
                                              </RechartsLineChart>
                                            </ResponsiveContainer>
                                          </ChartContainer>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <CardTitle className="text-sm font-semibold">eval_runtime</CardTitle>
                                           <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Maximize2 className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                                          </div>
                                        </CardHeader>
                                        <CardContent>
                                          <ChartContainer config={chartConfigJobMetrics} className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                              <RechartsLineChart data={evalRuntimeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="step" name="Step" tickLine={false} axisLine={false} tickMargin={8} />
                                                <YAxis dataKey="value" name="Eval Runtime" tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 0.02', 'dataMax + 0.02']} />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                <RechartsLineElement type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} name="eval_runtime" />
                                              </RechartsLineChart>
                                            </ResponsiveContainer>
                                          </ChartContainer>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <CardTitle className="text-sm font-semibold">eval_samples_per_second</CardTitle>
                                           <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Maximize2 className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                                          </div>
                                        </CardHeader>
                                        <CardContent>
                                          <ChartContainer config={chartConfigJobMetrics} className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                              <RechartsLineChart data={evalSamplesPerSecondData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="step" name="Step" tickLine={false} axisLine={false} tickMargin={8} />
                                                <YAxis dataKey="value" name="Eval Samples/Sec" tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 1', 'dataMax + 1']} />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                <RechartsLineElement type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} name="eval_samples_per_second" />
                                              </RechartsLineChart>
                                            </ResponsiveContainer>
                                          </ChartContainer>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <CardTitle className="text-sm font-semibold">eval_steps_per_second</CardTitle>
                                           <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Maximize2 className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                                          </div>
                                        </CardHeader>
                                        <CardContent>
                                          <ChartContainer config={chartConfigJobMetrics} className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                              <RechartsLineChart data={evalStepsPerSecondData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="step" name="Step" tickLine={false} axisLine={false} tickMargin={8} />
                                                <YAxis dataKey="value" name="Eval Steps/Sec" tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 0.1', 'dataMax + 0.1']} />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                <RechartsLineElement type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} name="eval_steps_per_second" />
                                              </RechartsLineChart>
                                            </ResponsiveContainer>
                                          </ChartContainer>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <CardTitle className="text-sm font-semibold">Power Consumed (kWh)</CardTitle>
                                           <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Maximize2 className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                                          </div>
                                        </CardHeader>
                                        <CardContent>
                                          <ChartContainer config={chartConfigJobMetrics} className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                              <RechartsLineChart data={powerConsumptionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="step" name="Step" tickLine={false} axisLine={false} tickMargin={8} />
                                                <YAxis dataKey="kwh" name="Power (kWh)" tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                <RechartsLineElement type="monotone" dataKey="kwh" stroke="var(--color-kwh)" strokeWidth={2} dot={false} name="power_consumed_kwh" />
                                              </RechartsLineChart>
                                            </ResponsiveContainer>
                                          </ChartContainer>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                          <CardTitle className="text-sm font-semibold">Greenhouse Gases Emitted (kg CO₂eq)</CardTitle>
                                           <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Maximize2 className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                                          </div>
                                        </CardHeader>
                                        <CardContent>
                                          <ChartContainer config={chartConfigJobMetrics} className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                              <RechartsLineChart data={greenhouseGasesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="step" name="Step" tickLine={false} axisLine={false} tickMargin={8} />
                                                <YAxis dataKey="co2eq" name="GHG (kg CO₂eq)" tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 0.2', 'dataMax + 0.2']} />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                <RechartsLineElement type="monotone" dataKey="co2eq" stroke="var(--color-co2eq)" strokeWidth={2} dot={false} name="greenhouse_gases_co2eq" />
                                              </RechartsLineChart>
                                            </ResponsiveContainer>
                                          </ChartContainer>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="images">Images content placeholder.</TabsContent>
                                  <TabsContent value="childJobs">Child jobs content placeholder.</TabsContent>
                                  <TabsContent value="outputsLogs">Outputs + logs content placeholder.</TabsContent>
                                  <TabsContent value="code">Code content placeholder.</TabsContent>
                                  <TabsContent value="monitoring">Monitoring content placeholder.</TabsContent>
                                </Tabs>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {sampleFineTuningJobs.length === 0 && (
                 <div className="text-center py-12 text-muted-foreground">
                   <Image src="https://placehold.co/300x200.png" alt="No jobs" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="empty state tasks" />
                   <p className="text-lg font-medium">No Fine-Tuning Jobs</p>
                   <p>Start a new job to begin fine-tuning your models.</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployed" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <CardTitle className="flex items-center gap-2"><Rocket className="h-6 w-6 text-primary" />Deployed Models</CardTitle>
                  <CardDescription>Manage your deployed models and their API endpoints.</CardDescription>
                </div>
                <Button>
                  <Rocket className="mr-2 h-4 w-4" /> Deploy New Model
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model Name</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Requests Today</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleDeployedModels.map((model) => (
                      <TableRow key={model.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                            {model.modelName}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{model.endpoint}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            model.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                            "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}>
                            {model.status}
                          </span>
                        </TableCell>
                        <TableCell>{model.version}</TableCell>
                        <TableCell>{model.requestsToday.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" aria-label="View API Details">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                           <Button variant="ghost" size="icon" aria-label="Undeploy Model" className="text-destructive hover:text-destructive">
                            <CircleSlash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
               {sampleDeployedModels.length === 0 && (
                 <div className="text-center py-12 text-muted-foreground">
                   <Image src="https://placehold.co/300x200.png" alt="No deployed models" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="servers cloud" />
                   <p className="text-lg font-medium">No Deployed Models</p>
                   <p>Deploy a fine-tuned model to make it available via API.</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistant" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-primary" />
                <CardTitle>Intelligent Assistant - Fine-Tuning Parameters</CardTitle>
              </div>
              <CardDescription>Get AI-powered suggestions for initial fine-tuning parameters.</CardDescription>
            </CardHeader>
            <CardContent>
              <FineTuningAssistantForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={isNewJobDialogOpen} onOpenChange={setIsNewJobDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Start New Fine-Tuning Job</DialogTitle>
            <DialogDescription>
              Configure and submit a new fine-tuning job. Select the base model and dataset.
            </DialogDescription>
          </DialogHeader>
          {/* Conditionally render the form or ensure it receives the updated defaultJobId if it's always mounted */}
          {isNewJobDialogOpen && (
            <NewFineTuningJobForm
              defaultJobId={currentNewJobId}
              onSubmitSuccess={handleNewJobFormSubmit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

