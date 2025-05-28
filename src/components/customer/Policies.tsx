import { useState } from "react";
// import { useSelector } from "react-redux";
import {
  ListIcon,
  DownloadIcon,
  PlusIcon,
  BoxIcon,
  FileIcon,
  UserIcon,
} from "../../icons";
import {Button} from "../ui/button/Button";
import Input from "../form/input/InputField";
// import { RootState } from "../../store";

interface Policy {
  id: string;
  type: "home" | "car" | "life";
  policyNumber: string;
  startDate: string;
  endDate: string;
  price: number;
  coverage: string;
  status: "active" | "pending" | "expired";
  premium: number;
  paymentFrequency: "monthly" | "quarterly" | "annually";
  nextPaymentDate: string;
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

export default function Policies() {
  // const user = useSelector((state: RootState) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock data - replace with actual API call
  const policies: Policy[] = [
    {
      id: "1",
      type: "car",
      policyNumber: "POL-2024-001",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      price: 850.0,
      coverage: "Comprehensive",
      status: "active",
      premium: 850.0,
      paymentFrequency: "monthly",
      nextPaymentDate: "2024-04-01",
      documents: [
        {
          id: "1",
          name: "Policy Document",
          type: "pdf",
          url: "/documents/policy-1.pdf",
        },
        {
          id: "2",
          name: "Vehicle Registration",
          type: "pdf",
          url: "/documents/vehicle-reg.pdf",
        },
      ],
    },
    {
      id: "2",
      type: "home",
      policyNumber: "POL-2024-002",
      startDate: "2024-02-01",
      endDate: "2025-01-31",
      price: 1200.0,
      coverage: "Full Coverage",
      status: "active",
      premium: 1200.0,
      paymentFrequency: "quarterly",
      nextPaymentDate: "2024-04-01",
      documents: [
        {
          id: "3",
          name: "Policy Document",
          type: "pdf",
          url: "/documents/policy-2.pdf",
        },
        {
          id: "4",
          name: "Property Documents",
          type: "pdf",
          url: "/documents/property-docs.pdf",
        },
      ],
    },
  ];

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.coverage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || policy.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || policy.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case "home":
        return <BoxIcon className="h-6 w-6" />;
      case "car":
        return <FileIcon className="h-6 w-6" />;
      case "life":
        return <UserIcon className="h-6 w-6" />;
      default:
        return <ListIcon className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <ListIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search policies..."
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
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
          </select>
          <Button variant="primary" className="w-full sm:w-auto">
            <PlusIcon className="mr-2 h-5 w-5" />
            New Policy
          </Button>
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPolicies.map((policy) => (
          <div
            key={policy.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getPolicyIcon(policy.type)}
                <div>
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPolicyTypeColor(
                      policy.type
                    )}`}
                  >
                    {policy.type}
                  </span>
                  <h3 className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    Policy #{policy.policyNumber}
                  </h3>
                </div>
              </div>
              <span
                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                  policy.status
                )}`}
              >
                {policy.status}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Coverage
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {policy.coverage}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Premium
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(policy.premium)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Payment Frequency
                </span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {policy.paymentFrequency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Next Payment
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {policy.nextPaymentDate}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Valid Until
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {policy.endDate}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                startIcon={<DownloadIcon className="h-4 w-4" />}
              >
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                startIcon={<ListIcon className="h-4 w-4" />}
              >
                View Details
              </Button>
            </div>

            {policy.documents.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Related Documents
                </h4>
                <div className="space-y-2">
                  {policy.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {doc.name}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        startIcon={<DownloadIcon className="h-4 w-4" />}
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
