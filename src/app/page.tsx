import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Database, Zap, Users, BarChart, LineChart, Search } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, Line, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend } from "recharts";
import DataAnalysisForm from "@/components/data-analysis-form";

const chartDataIngestion = [
  { date: "2024-01", value: 120 },
  { date: "2024-02", value: 200 },
  { date: "2024-03", value: 150 },
  { date: "2024-04", value: 300 },
  { date: "2024-05", value: 250 },
  { date: "2024-06", value: 400 },
];

const chartModelPerformance = [
  { name: "Model A", accuracy: 85, precision: 88 },
  { name: "Model B", accuracy: 92, precision: 90 },
  { name: "Model C", accuracy: 78, precision: 82 },
];

const chartConfigIngestion = {
  value: {
    label: "Data Points",
    color: "hsl(var(--chart-1))",
  },
};

const chartConfigPerformance = {
  accuracy: {
    label: "Accuracy (%)",
    color: "hsl(var(--chart-1))",
  },
  precision: {
    label: "Precision (%)",
    color: "hsl(var(--chart-2))",
  },
};


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Data Insights Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
            <Database className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Models Fine-Tuning</CardTitle>
            <Zap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+2 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deployments</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Stable</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Data Ingestion Rate</CardTitle>
            <CardDescription>Monthly data points ingested</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigIngestion} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartDataIngestion} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={true} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Model Performance Overview</CardTitle>
            <CardDescription>Accuracy and Precision for top models</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigPerformance} className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartModelPerformance} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8}/>
                  <YAxis tickLine={false} axisLine={false} tickMargin={8}/>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="accuracy" fill="var(--color-accuracy)" radius={4} />
                  <Bar dataKey="precision" fill="var(--color-precision)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            <CardTitle>Intelligent Assistant - Analyze Data</CardTitle>
          </div>
          <CardDescription>Get AI-powered insights on your datasets.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataAnalysisForm />
        </CardContent>
      </Card>

    </div>
  );
}
