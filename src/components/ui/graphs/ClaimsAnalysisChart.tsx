import { Card } from "../card/Card";
import { CardHeader } from "../card/CardHeader";
import { CardBody } from "../card/CardBody";

export const ClaimsAnalysisChart = () => {
  return (
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
  );
};
