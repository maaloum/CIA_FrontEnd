import { useState, useEffect } from "react";
import {
  ListIcon,
  DownloadIcon,
  DollarLineIcon,
  CalenderIcon,
} from "../../icons";
import Button from "../../components/ui/Button";
import Input from "../../components/form/input/InputField";
import { policyService } from "../../services/policyService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Policy } from "../../types/policy";
import toast from "react-hot-toast";

interface Payment {
  id: string;
  policyNumber: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "failed";
  paymentMethod: string;
  invoiceNumber: string;
}

export default function PaymentsBilling() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchPolicies = async () => {
      if (!token) {
        toast.error("Authentication token is missing");
        return;
      }

      try {
        setIsLoading(true);
        const data = await policyService.getCustomerPolicies(token);
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

  // Mock data - replace with actual API call
  const payments: Payment[] = [
    {
      id: "1",
      policyNumber: "POL-2024-001",
      amount: 850.0,
      date: "2024-02-15",
      status: "paid",
      paymentMethod: "Credit Card",
      invoiceNumber: "INV-2024-001",
    },
    {
      id: "2",
      policyNumber: "POL-2024-002",
      amount: 1200.0,
      date: "2024-03-01",
      status: "pending",
      paymentMethod: "Bank Transfer",
      invoiceNumber: "INV-2024-002",
    },
  ];

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || payment.status === selectedStatus;
    const matchesDateRange =
      (!dateRange.start || payment.date >= dateRange.start) &&
      (!dateRange.end || payment.date <= dateRange.end);
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
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
            placeholder="Search by policy or invoice number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
            aria-label="Filter by payment status"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <div className="flex gap-2">
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="w-40"
            />
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="w-40"
            />
          </div>
          <Button variant="primary" className="flex items-center gap-2">
            <DollarLineIcon className="h-5 w-5" />
            Make Payment
          </Button>
        </div>
      </div>

      {/* Active Policies */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Active Policies
          </h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600 mx-auto" />
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Loading policies...
              </p>
            </div>
          ) : policies.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-400">
                No active policies found.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Policy #{policy.policyNumber}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {policy.productName}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                        policy.renewalStatus.toLowerCase()
                      )}`}
                    >
                      {policy.renewalStatus}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
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
                        Coverage
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {policy.coverage}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Period
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {policy.startDate} - {policy.endDate}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      // startIcon={<DownloadIcon className="h-4 w-4" />}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      // startIcon={<DollarLineIcon className="h-4 w-4" />}
                    >
                      Make Payment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Policy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Payment Method
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
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {payment.invoiceNumber}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {payment.policyNumber}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {payment.date}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {payment.paymentMethod}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        <DownloadIcon className="h-4 w-4" />
                        Download
                      </Button>
                      {payment.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                        >
                          Pay Now
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

      {/* Upcoming Payments */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Upcoming Payments
        </h3>
        <div className="mt-4 space-y-4">
          {policies.map((policy) => (
            <div key={policy.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalenderIcon className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {policy.productName} Premium
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Policy #{policy.policyNumber}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(policy.premium)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  Pay Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
