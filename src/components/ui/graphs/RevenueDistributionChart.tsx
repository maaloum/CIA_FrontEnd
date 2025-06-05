import { Card } from "../card/Card";
import { CardHeader } from "../card/CardHeader";
import { CardBody } from "../card/CardBody";
import { RevenueDistribution } from "../../../utiles/RevenueDistributionByPolicy";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  TooltipProps,
} from "recharts";
import React from "react";

interface PolicyDistrubutionChartProps {
  policies: RevenueDistribution[];
  isLoading: boolean;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: RevenueDistribution;
  }>;
}

export const RevenueDistributionChart = ({
  policies,
  isLoading,
}: PolicyDistrubutionChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">
            {data.type}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Revenue: {formatCurrency(data.totalRevenue)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percentage: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Revenue Distribution
        </h3>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : policies.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No revenue data available
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={policies}
                  dataKey="totalRevenue"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {policies.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string, entry): React.ReactNode => {
                    const payload =
                      entry.payload as unknown as RevenueDistribution;
                    return (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {value} ({formatCurrency(payload.totalRevenue)})
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
