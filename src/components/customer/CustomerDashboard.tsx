import { useState } from "react";
import { useSelector } from "react-redux";
import {
  ListIcon,
  AlertIcon,
  CalenderIcon,
  DollarLineIcon,
  DocsIcon,
  MailIcon,
} from "../../../src/icons";
import Button from "../../components/ui/Button";
import { RootState } from "../../store";

interface Policy {
  id: string;
  type: "home" | "car" | "life";
  policyNumber: string;
  startDate: string;
  endDate: string;
  price: number;
  coverage: string;
  status: "active" | "pending" | "expired";
}

interface Notification {
  id: string;
  type: "reminder" | "offer" | "document" | "message";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export default function CustomerDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "reminder",
      title: "Policy Expiration",
      message: "Your auto insurance expires in 7 days",
      date: "2024-03-20",
      read: false,
    },
    {
      id: "2",
      type: "offer",
      title: "Special Offer",
      message: "Get 20% off on home insurance renewal",
      date: "2024-03-19",
      read: false,
    },
  ]);

  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: "1",
      type: "car",
      policyNumber: "POL-2024-001",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      price: 850.0,
      coverage: "Comprehensive",
      status: "active",
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
    },
  ]);

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <CalenderIcon className="h-5 w-5" />;
      case "offer":
        return <DollarLineIcon className="h-5 w-5" />;
      case "document":
        return <DocsIcon className="h-5 w-5" />;
      case "message":
        return <MailIcon className="h-5 w-5" />;
      default:
        return <AlertIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Here's an overview of your insurance policies and important updates.
        </p>
      </div>

      {/* Quick Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <ListIcon className="h-5 w-5 text-brand-500" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Active Policies
            </h3>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {policies.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <AlertIcon className="h-5 w-5 text-yellow-500" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Pending Applications
            </h3>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {policies.filter((p) => p.status === "pending").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <CalenderIcon className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Next Payment
            </h3>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(policies[0]?.price || 0)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Due in 15 days
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <AlertIcon className="h-5 w-5 text-red-500" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Notifications
            </h3>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {notifications.filter((n) => !n.read).length}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Unread messages
          </p>
        </div>
      </div>

      {/* Active Policies */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            My Policies
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Policy Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Coverage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPolicyTypeColor(
                          policy.type
                        )}`}
                      >
                        {policy.type}
                      </span>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Policy #{policy.policyNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {policy.startDate} - {policy.endDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {policy.coverage}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(policy.price)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        policy.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {policy.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        View Details
                      </Button>
                      {policy.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-4 ${
                !notification.read ? "bg-gray-50 dark:bg-gray-800/50" : ""
              }`}
            >
              <div className="mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {notification.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {notification.message}
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  {notification.date}
                </p>
              </div>
              {!notification.read && (
                <span className="inline-flex h-2 w-2 rounded-full bg-brand-500"></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
