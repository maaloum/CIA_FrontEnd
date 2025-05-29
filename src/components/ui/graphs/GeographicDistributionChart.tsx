import { Card } from "../card/Card";
import { CardHeader } from "../card/CardHeader";
import { CardBody } from "../card/CardBody";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RegionData {
  region: string;
  count: number;
}

interface GeographicDistributionChartProps {
  regionData: RegionData[];
  isLoading: boolean;
}

export const GeographicDistributionChart = ({
  regionData,
  isLoading,
}: GeographicDistributionChartProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Geographic Distribution
        </h3>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500">Loading customer distribution...</p>
          </div>
        ) : regionData.length === 0 ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500">
              No customer distribution data available
            </p>
          </div>
        ) : (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={regionData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="region"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
