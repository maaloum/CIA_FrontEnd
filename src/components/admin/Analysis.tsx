import { useState } from "react";
import { Card } from "../ui/card/Card";
import { CardHeader } from "../ui/card/CardHeader";
import { CardBody } from "../ui/card/CardBody";
import { CardFooter } from "../ui/card/CardFooter";
import  Button  from "../ui/button/Button";
import { Select } from "../ui/select/Select";

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: "up" | "down";
}

export default function Analysis() {
  const [timeRange, setTimeRange] = useState("30d");

  const metrics: MetricCard[] = [
    {
      title: "Total Policies",
      value: "1,234",
      change: 12.5,
      trend: "up",
    },
    {
      title: "Active Customers",
      value: "856",
      change: 8.2,
      trend: "up",
    },
    {
      title: "Monthly Revenue",
      value: "$45,678",
      change: -2.4,
      trend: "down",
    },
    {
      title: "Claims Filed",
      value: "89",
      change: 5.7,
      trend: "up",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Analysis Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-40"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </Select>
          <Button variant="primary">Export Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardBody>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {metric.title}
                </span>
                <span className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                  {metric.value}
                </span>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm ${
                      metric.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {metric.trend === "up" ? "↑" : "↓"}{" "}
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    vs last period
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Policy Distribution
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Chart placeholder - Policy distribution by type
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Trends
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Chart placeholder - Revenue trends over time
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Claims
            </h3>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Claim ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Sample data - replace with actual data */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      CLM-001
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      John Doe
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      Auto
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      $2,500
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="secondary" className="w-full">
              View All Claims
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Performing Agents
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {/* Sample data - replace with actual data */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Sarah Johnson
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      45 policies
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-500">+12%</span>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="secondary" className="w-full">
              View All Agents
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
