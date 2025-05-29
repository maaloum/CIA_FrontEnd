import { Policy } from "../../../types/policy";
import Label from "../../form/Label";
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

const getPolicyTypeColor = (type: string) => {
  switch (type) {
    case "home":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "car":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "life":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
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
    <div className="space-y-4">
      <div
        key={policy.id}
        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPolicyTypeColor(
                policy.application.product.type
              )}`}
            >
              {policy.application.product.type}
            </span>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Policy #{policy.policyNumber}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {policy.startDate} - {policy.endDate}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
              policy.renewalStatus
            )}`}
          >
            {policy.renewalStatus}
          </span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Coverage</Label>
            <div className="mt-1 text-sm text-gray-900 dark:text-white">
              {policy.coverage}
            </div>
          </div>
          <div>
            <Label>Premium</Label>
            <div className="mt-1 text-sm text-gray-900 dark:text-white">
              {formatCurrency(policy.premium)}
            </div>
          </div>
          <div>
            <Label>Payment Frequency</Label>
            <div className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
              quarterly {/* quarterly {policy?.paymentFrequency} */}
            </div>
          </div>
          <div>
            <Label>Next Payment</Label>
            <div className="mt-1 text-sm text-gray-900 dark:text-white">
              {policy?.endDate}
            </div>
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
    </div>
  );
};
