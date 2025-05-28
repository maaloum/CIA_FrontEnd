import { useState } from "react";
import {
  ListIcon,
  CalenderIcon,
  CheckLineIcon,
  CloseLineIcon,
} from "../../../icons";
import Input from "../../form/input/InputField";
import Button from "../../ui/Button";

interface Renewal {
  id: string;
  customerName: string;
  policyNumber: string;
  policyType: "home" | "car" | "life";
  currentPremium: number;
  renewalDate: string;
  status: "pending" | "approved" | "rejected" | "expired";
  daysUntilRenewal: number;
  lastRenewalDate: string;
}

export default function RenewalsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Mock data - replace with actual API call
  const renewals: Renewal[] = [
    {
      id: "1",
      customerName: "John Doe",
      policyNumber: "POL-2024-001",
      policyType: "home",
      currentPremium: 1200.0,
      renewalDate: "2024-03-20",
      status: "pending",
      daysUntilRenewal: 15,
      lastRenewalDate: "2023-03-20",
    },
    {
      id: "2",
      customerName: "Jane Smith",
      policyNumber: "POL-2024-002",
      policyType: "car",
      currentPremium: 850.5,
      renewalDate: "2024-03-15",
      status: "approved",
      daysUntilRenewal: 10,
      lastRenewalDate: "2023-03-15",
    },
  ];

  const filteredRenewals = renewals.filter((renewal) => {
    const matchesSearch =
      renewal.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      renewal.policyNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || renewal.status === selectedStatus;
    const matchesType =
      selectedType === "all" || renewal.policyType === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "expired":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <ListIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search renewals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
            aria-label="Filter by policy type"
          >
            <option value="all">All Types</option>
            <option value="home">Home Insurance</option>
            <option value="car">Car Insurance</option>
            <option value="life">Life Insurance</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRenewals.map((renewal) => (
          <div
            key={renewal.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {renewal.customerName}
                </h3>
                <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CalenderIcon className="mr-1 h-4 w-4" />
                  {renewal.daysUntilRenewal} days until renewal
                </div>
              </div>
              <span
                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                  renewal.status
                )}`}
              >
                {renewal.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Policy Number:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {renewal.policyNumber}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Policy Type:
                </span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {renewal.policyType}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Current Premium:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(renewal.currentPremium)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Last Renewal:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {renewal.lastRenewalDate}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {renewal.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <CheckLineIcon className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <CloseLineIcon className="h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
