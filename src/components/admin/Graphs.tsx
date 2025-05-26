import { useState } from "react";
import { Card } from "../ui/card/Card";
import { CardHeader } from "../ui/card/CardHeader";
import { CardBody } from "../ui/card/CardBody";
import { Select } from "../ui/select/Select";

export default function Graphs() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Data Visualization
        </h1>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Policy Growth
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Line chart placeholder - Policy growth over time
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Distribution
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Pie chart placeholder - Revenue by policy type
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Claims Analysis
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Bar chart placeholder - Claims by category
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Customer Demographics
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Donut chart placeholder - Customer age distribution
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Geographic Distribution
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Map chart placeholder - Customer distribution by region
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Policy Renewal Rate
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Area chart placeholder - Policy renewal trends
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Customer Satisfaction
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Radar chart placeholder - Customer satisfaction metrics
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
