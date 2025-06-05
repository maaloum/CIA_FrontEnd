import { Card } from "../card/Card";
import { CardHeader } from "../card/CardHeader";
import { CardBody } from "../card/CardBody";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AgeGroupData {
  name: string;
  value: number;
}

interface CustomerDemographicsChartProps {
  ageGroupData: AgeGroupData[];
  isLoading: boolean;
}

const AGE_COLORS = [
  "#4F46E5",
  "#7C3AED",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
];

export const CustomerDemographicsChart = ({
  ageGroupData,
  isLoading,
}: CustomerDemographicsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Customer Demographics
        </h3>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">Loading customer demographics...</p>
          </div>
        ) : ageGroupData.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">
              No customer demographics data available
            </p>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageGroupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {ageGroupData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={AGE_COLORS[index % AGE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
