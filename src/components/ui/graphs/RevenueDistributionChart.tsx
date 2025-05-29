import { Card } from "../card/Card";
import { CardHeader } from "../card/CardHeader";
import { CardBody } from "../card/CardBody";

export const RevenueDistributionChart = () => {
  return (
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
  );
};
