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

interface GenderData {
  name: string;
  value: number;
}

interface GenderDistributionChartProps {
  genderData: GenderData[];
  isLoading: boolean;
}

const GENDER_COLORS = {
  MALE: "#4F46E5",
  FEMALE: "#EC4899",
  OTHER: "#10B981",
  prefer_not_to_say: "#6B7280",
};

const GENDER_LABELS = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  prefer_not_to_say: "Prefer not to say",
};

export const GenderDistributionChart = ({
  genderData,
  isLoading,
}: GenderDistributionChartProps) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Gender Distribution
        </h3>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">Loading gender distribution...</p>
          </div>
        ) : genderData.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">
              No gender distribution data available
            </p>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
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
                  {genderData.map((entry) => {
                    const genderKey = Object.entries(GENDER_LABELS).find(
                      ([, label]) => label === entry.name
                    )?.[0] as keyof typeof GENDER_COLORS;
                    return (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={GENDER_COLORS[genderKey]}
                      />
                    );
                  })}
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
