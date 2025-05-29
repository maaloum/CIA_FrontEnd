import { Policy } from "../../../services/policyService";
import { Button } from "../button/Button";

interface PolicyCardProps {
  policy: Policy;
  onEdit?: () => void;
  onDelete?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "INACTIVE":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const PolicyCard = ({ policy, onEdit, onDelete }: PolicyCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Policy #{policy.policyNumber}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Product: {policy.application?.product?.name || "N/A"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Application Status: {policy.application?.status || "N/A"}
          </p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            policy.renewalStatus
          )}`}
        >
          {policy.renewalStatus}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {policy.startDate
              ? new Date(policy.startDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">End Date</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {policy.endDate
              ? new Date(policy.endDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Coverage:</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {policy.coverage || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Premium</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {policy.premium ? formatCurrency(policy.premium) : "N/A"}
          </p>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={onDelete}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </Button>
      </div>
    </div>
  );
};
