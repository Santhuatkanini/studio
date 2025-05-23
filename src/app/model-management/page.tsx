
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, ExternalLink, CircleSlash, BrainCircuit, ListChecks, Lightbulb, Rocket, Eye } from "lucide-react";
import FineTuningAssistantForm from "@/components/fine-tuning-assistant-form";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast"; 

const sampleFineTuningJobs = [
  { id: "ftj_abc123", baseModel: "Llama 3 8B", dataset: "Customer Support Q1", status: "Running", progress: 75, created: "2024-07-18 10:00" },
  { id: "ftj_def456", baseModel: "Mistral 7B", dataset: "Oil and Gas", status: "Completed", progress: 100, created: "2024-07-15 14:30" },
  { id: "ftj_ghi789", baseModel: "GPT-Neo 2.7B", dataset: "Product Descriptions", status: "Failed", progress: 20, created: "2024-07-19 09:15" },
  { id: "ftj_jkl012", baseModel: "Llama 3 8B", dataset: "Electrification", status: "Queued", progress: 0, created: "2024-07-19 11:00" },
  { id: "ftj_mno345", baseModel: "Mistral 7B", dataset: "Flow Control", status: "Completed", progress: 100, created: "2024-07-20 12:00" },
];

const sampleDeployedModels = [
  { id: "dep_xyz789", modelName: "SupportBot v1.2 (Llama 3)", endpoint: "/api/v1/supportbot", status: "Active", version: "1.2", requestsToday: 10250 },
  { id: "dep_uvw456", modelName: "ProductDescGen v0.9 (Mistral)", endpoint: "/api/v1/productdesc", status: "Inactive", version: "0.9", requestsToday: 0 },
  { id: "dep_rst123", modelName: "KnowledgeSearch v2.0 (Llama 3)", endpoint: "/api/v1/kbsearch", status: "Active", version: "2.0", requestsToday: 56780 },
];


export default function ModelManagementPage() {
  const { toast } = useToast(); 

  const handleStartNewJob = () => {
    toast({
      title: "Fine-Tuning Job Submitted",
      description: "Your new fine-tuning job has been successfully submitted and will begin shortly. You can monitor its progress in the table below.",
    });
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
                <Button onClick={handleStartNewJob}> 
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
                      <TableRow key={job.id}>
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
                          <Button variant="ghost" size="icon" aria-label="View Job Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {job.status === "Running" || job.status === "Queued" ? (
                            <Button variant="ghost" size="icon" aria-label="Cancel Job" className="text-destructive hover:text-destructive">
                              <CircleSlash className="h-4 w-4" />
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
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
    </div>
  );
}

