"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Sample data remains the same
const revenueData = [
  { month: "Jan", revenue: 1000 },
  { month: "Feb", revenue: 1500 },
  { month: "Mar", revenue: 1300 },
  { month: "Apr", revenue: 1800 },
  { month: "May", revenue: 2000 },
  { month: "Jun", revenue: 2500 },
];

const productSalesData = [
  { product: "Product A", sales: 4000 },
  { product: "Product B", sales: 3000 },
  { product: "Product C", sales: 2000 },
  { product: "Product D", sales: 2780 },
  { product: "Product E", sales: 1890 },
];

const marketShareData = [
  { name: "Company A", value: 400 },
  { name: "Company B", value: 300 },
  { name: "Company C", value: 200 },
  { name: "Company D", value: 100 },
];

const satisfactionData = [
  { name: "Very Satisfied", value: 70 },
  { name: "Satisfied", value: 85 },
  { name: "Neutral", value: 60 },
  { name: "Unsatisfied", value: 40 },
  { name: "Very Unsatisfied", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function ModernChartsDashboard() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Revenue Trend Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Monthly revenue over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full p-0">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue, #0088FE)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Product Sales Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Product Sales Comparison</CardTitle>
            <CardDescription>Sales figures for each product</CardDescription>
          </CardHeader>
          <CardContent className="w-full p-0">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productSalesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="var(--color-sales, #00C49F)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Market Share Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Market Share Distribution</CardTitle>
            <CardDescription>
              Breakdown of market share by company
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full p-0">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Satisfaction Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Customer Satisfaction Scores</CardTitle>
            <CardDescription>
              Radial chart of satisfaction levels
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="10%"
                  outerRadius="80%"
                  barSize={10}
                  data={satisfactionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                >
                  <RadialBar
                    label={{
                      position: "insideStart",
                      fill: "#fff",
                      fontSize: 12,
                    }}
                    background
                    dataKey="value"
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </RadialBar>
                  <Legend
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      fontSize: 12,
                      bottom: 0,
                    }}
                  />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
