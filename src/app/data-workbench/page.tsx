import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadCloud, Edit, Trash2, Sparkles, FileText, Eye } from "lucide-react";
import TrainingDataGeneratorForm from "@/components/training-data-generator-form";
import Image from "next/image";

const sampleDatasets = [
  { id: "ds001", name: "Customer Support Tickets Q1", type: "CSV", status: "Annotated", lastModified: "2024-07-15", records: 1200 },
  { id: "ds002", name: "Product Descriptions - Electronics", type: "JSONL", status: "Raw", lastModified: "2024-07-10", records: 5600 },
  { id: "ds003", name: "Internal Knowledge Base Articles", type: "PDF Collection", status: "Processing", lastModified: "2024-07-18", records: 350 },
  { id: "ds004", name: "Social Media Comments - Sentiment", type: "TXT", status: "Annotated", lastModified: "2024-06-20", records: 15000 },
];

export default function DataWorkbenchPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Data Workbench</h1>

      <Tabs defaultValue="curate" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="curate">Curate & Annotate</TabsTrigger>
          <TabsTrigger value="generate">Generate Training Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="curate" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <CardTitle>Manage Datasets</CardTitle>
                  <CardDescription>Upload, view, and prepare your domain-specific data.</CardDescription>
                </div>
                <Button>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Dataset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleDatasets.map((dataset) => (
                      <TableRow key={dataset.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {dataset.name}
                        </TableCell>
                        <TableCell>{dataset.type}</TableCell>
                        <TableCell>
                           <span className={`px-2 py-1 text-xs rounded-full ${
                            dataset.status === "Annotated" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                            dataset.status === "Raw" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" :
                            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}>
                            {dataset.status}
                          </span>
                        </TableCell>
                        <TableCell>{dataset.records.toLocaleString()}</TableCell>
                        <TableCell>{dataset.lastModified}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" aria-label="View/Edit Dataset">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" aria-label="Annotate Dataset">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" aria-label="Delete Dataset" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {sampleDatasets.length === 0 && (
                 <div className="text-center py-12 text-muted-foreground">
                   <Image src="https://placehold.co/300x200.png" alt="No datasets" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="empty state illustration" />
                   <p className="text-lg font-medium">No Datasets Found</p>
                   <p>Upload your first dataset to get started.</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <CardTitle>Intelligent Assistant - Generate Training Data</CardTitle>
              </div>
              <CardDescription>Use AI to generate training examples from your documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <TrainingDataGeneratorForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
