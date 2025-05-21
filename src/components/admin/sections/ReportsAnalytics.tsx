import { useState } from "react";
import {
  ListIcon,
  DownloadIcon,
  PieChartIcon,
  DollarLineIcon,
} from "../../../icons";
import Input from "../../form/input/InputField";
import Button from "../../ui/Button";

interface AnalyticsData {
  totalPolicies: number;
  activePolicies: number;
  totalRevenue: number;
  monthlyRevenue: number;
  policyDistribution: {
    type: string;
    count: number;
    percentage: number;
  }[];
  monthlyTrends: {
    month: string;
    revenue: number;
    policies: number;
  }[];
  topPerformingAgents: {
    name: string;
    policies: number;
    revenue: number;
  }[];
}

export default function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API call
  const analyticsData: AnalyticsData = {
    totalPolicies: 1250,
    activePolicies: 980,
    totalRevenue: 1250000,
    monthlyRevenue: 125000,
    policyDistribution: [
      { type: "Home", count: 450, percentage: 36 },
      { type: "Car", count: 500, percentage: 40 },
      { type: "Life", count: 300, percentage: 24 },
    ],
    monthlyTrends: [
      { month: "Jan", revenue: 115000, policies: 85 },
      { month: "Feb", revenue: 125000, policies: 92 },
      { month: "Mar", revenue: 135000, policies: 98 },
    ],
    topPerformingAgents: [
      { name: "John Smith", policies: 45, revenue: 45000 },
      { name: "Sarah Johnson", policies: 38, revenue: 38000 },
      { name: "Mike Brown", policies: 32, revenue: 32000 },
    ],
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Date Range */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <ListIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
            aria-label="Select date range"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <DownloadIcon className="h-5 w-5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-brand-500" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Policies
            </h3>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {analyticsData.totalPolicies}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {analyticsData.activePolicies} active
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <DollarLineIcon className="h-5 w-5 text-green-500" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Revenue
            </h3>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(analyticsData.totalRevenue)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {formatCurrency(analyticsData.monthlyRevenue)} this month
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Policy Distribution
            </h3>
          </div>
          <div className="mt-2 space-y-2">
            {analyticsData.policyDistribution.map((dist) => (
              <div
                key={dist.type}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {dist.type}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {dist.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-purple-500" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Monthly Trends
            </h3>
          </div>
          <div className="mt-2 space-y-2">
            {analyticsData.monthlyTrends.map((trend) => (
              <div
                key={trend.month}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {trend.month}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(trend.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Agents */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Performing Agents
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Agent Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Policies Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Revenue Generated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {analyticsData.topPerformingAgents.map((agent) => (
                <tr key={agent.name}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {agent.name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {agent.policies}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(agent.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
