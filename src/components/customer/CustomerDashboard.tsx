import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  ListIcon,
  AlertIcon,
  CalenderIcon,
  DollarLineIcon,
  DocsIcon,
  MailIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../../../src/icons";
import Button from "../../components/ui/Button";
import { RootState } from "../../store";
import { policyService } from "../../services/policyService";
import toast from "react-hot-toast";
import { Policy } from "../../types/policy";

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

  // console.log(user.id);
  const token = useSelector((state: RootState) => state.auth.token);
  const [notifications] = useState<Notification[]>([
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

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPolicyId, setExpandedPolicyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      // if (!token || !user?.id) {
      //   toast.error("Authentication token or user ID is missing");
      //   return;
      // }

      try {
        setIsLoading(true);
        const data = await policyService.getCustomerPolicies(token);
        console.log({ data });
        setPolicies(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error fetching policies:", error);
        toast.error("Failed to load policies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, [token]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getPolicyTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "home":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "car":
      case "auto":
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

  const handleTogglePolicy = (policyId: string) => {
    setExpandedPolicyId(expandedPolicyId === policyId ? null : policyId);
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
            {policies.filter((p) => p.renewalStatus === "ACTIVE").length}
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
            {policies.filter((p) => p.renewalStatus === "PENDING").length}
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
            {formatCurrency(policies[1]?.premium || 0)}
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
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Loading policies...
              </span>
            </div>
          ) : policies.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-600 dark:text-gray-400">
                No policies found.
              </p>
            </div>
          ) : (
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
                    Premium
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
                  <>
                    <tr key={policy.id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleTogglePolicy(policy.id)}
                            className="mr-2 text-gray-400 hover:text-gray-500"
                          >
                            {expandedPolicyId === policy.id ? (
                              <ChevronUpIcon className="h-5 w-5" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5" />
                            )}
                          </button>
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPolicyTypeColor(
                              policy.application?.product?.type
                            )}`}
                          >
                            {policy.application?.product?.type}
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
                        {formatCurrency(policy.premium)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            policy.renewalStatus === "ACTIVE"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : policy.renewalStatus === "PENDING"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {policy.renewalStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                            onClick={() => handleTogglePolicy(policy.id)}
                          >
                            {expandedPolicyId === policy.id
                              ? "Hide Details"
                              : "View Details"}
                          </Button>
                          {policy.renewalStatus === "ACTIVE" && (
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
                    {expandedPolicyId === policy.id && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Product Name
                              </h4>
                              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                {policy.productName}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Application Status
                              </h4>
                              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                {policy.renewalStatus}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Created At
                              </h4>
                              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                {policy.startDate}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Last Updated
                              </h4>
                              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                {policy.endDate}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Product Description
                              </h4>
                              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                {policy.coverage}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
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
