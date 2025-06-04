import { Card } from "../card/Card";
import { CardBody } from "../card/CardBody";
import { CardHeader } from "../card/CardHeader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PolicyGrowthData {
  month: string;
  count: number;
  growthRate: number;
}

interface PolicyGrowthChartProps {
  policies: PolicyGrowthData[];
  isLoading: boolean;
}

export const PolicyGrowthChart = ({
  policies,
  isLoading,
}: PolicyGrowthChartProps) => {
  const showCursor = policies.length > 3;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Policy Growth
        </h3>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">Loading policy growth data...</p>
          </div>
        ) : policies.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">No policy growth data available</p>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={policies}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  cursor={
                    showCursor
                      ? {
                          stroke: "#4F46E5",
                          strokeWidth: 1,
                          strokeDasharray: "3 3",
                        }
                      : false
                  }
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="count"
                  name="Total Policies"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                  animationBegin={0}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="growthRate"
                  name="Growth Rate (%)"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                  animationBegin={0}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
