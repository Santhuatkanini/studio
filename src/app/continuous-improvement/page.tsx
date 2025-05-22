import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, Line, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, Cell } from "recharts";
import { RefreshCw, ThumbsUp, ThumbsDown, MessageSquareWarning, PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const chartDataAccuracy = [
  { month: "Jan", accuracy: 75 }, { month: "Feb", accuracy: 78 }, { month: "Mar", accuracy: 80 },
  { month: "Apr", accuracy: 82 }, { month: "May", accuracy: 85 }, { month: "Jun", accuracy: 83 },
];

const chartDataFeedback = [
  { name: "Positive", value: 400, fill: "hsl(var(--chart-2))" },
  { name: "Neutral", value: 300, fill: "hsl(var(--chart-4))" },
  { name: "Negative", value: 100, fill: "hsl(var(--chart-5))" },
];

const chartDataMisclassified = [
  { intent: "Order Status", count: 58 }, { intent: "Refund Request", count: 42 },
  { intent: "Product Info", count: 30 }, { intent: "Account Access", count: 25 },
  { intent: "Tech Support", count: 15 },
];

const chartConfigAccuracy = { accuracy: { label: "Accuracy (%)", color: "hsl(var(--chart-1))" } };
const chartConfigMisclassified = { count: { label: "Count", color: "hsl(var(--chart-1))" } };


const recentFeedback = [
  { id: "fb001", text: "The answer about return policy was incorrect.", type: "Negative", date: "2024-07-19" },
  { id: "fb002", text: "Very helpful and quick response!", type: "Positive", date: "2024-07-19" },
  { id: "fb003", text: "Could not understand my question about shipping times.", type: "Negative", date: "2024-07-18" },
  { id: "fb004", text: "The model correctly identified my complex issue.", type: "Positive", date: "2024-07-18" },
];


export default function ContinuousImprovementPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Continuous Improvement Console</h1>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Model Accuracy Over Time</CardTitle>
            <CardDescription>Monthly accuracy trend of the primary model.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigAccuracy} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartDataAccuracy} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis domain={[0,100]} tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Line type="monotone" dataKey="accuracy" stroke="var(--color-accuracy)" strokeWidth={2} dot={true} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Feedback Distribution</CardTitle>
            <CardDescription>Overall sentiment from user interactions.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={{}} className="h-[300px] w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <RechartsTooltip formatter={(value: number, name: string) => [`${value} (${((value / chartDataFeedback.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}%)`, name]} />
                  <Pie data={chartDataFeedback} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} 
                       label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                          const RADIAN = Math.PI / 180;
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          return (
                            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}
                  >
                     {chartDataFeedback.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                  </Pie>
                  <RechartsLegend 
                    formatter={(value, entry) => <span style={{ color: entry.color }}>{value}</span>} 
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Misclassified Intents</CardTitle>
          <CardDescription>Areas where the model struggles most frequently.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigMisclassified} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataMisclassified} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis dataKey="intent" type="category" tickLine={false} axisLine={false} width={120} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} layout="vertical" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareWarning className="h-5 w-5 text-primary" /> Recent Feedback
            </CardTitle>
            <CardDescription>Latest feedback submitted by users or reviewers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[300px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feedback</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentFeedback.map((fb) => (
                    <TableRow key={fb.id}>
                      <TableCell className="text-sm">{fb.text}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                          fb.type === "Positive" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                          "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}>
                          {fb.type === "Positive" ? <ThumbsUp className="h-3 w-3" /> : <ThumbsDown className="h-3 w-3" />}
                          {fb.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">{fb.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
             {recentFeedback.length === 0 && (
                 <div className="text-center py-8 text-muted-foreground">
                   <p>No recent feedback.</p>
                 </div>
              )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" /> Model Retraining & Refinement
            </CardTitle>
            <CardDescription>Incorporate new data or refine prompts to improve model performance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
              <h3 className="text-sm font-medium mb-1">Add New Training Data</h3>
              <Textarea placeholder="Paste new training examples here (e.g., in JSONL format)..." className="min-h-[100px] font-mono text-xs" />
              <Button className="mt-2 w-full sm:w-auto" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Data
              </Button>
            </div>
             <Button className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" /> Retrain Model with New Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
