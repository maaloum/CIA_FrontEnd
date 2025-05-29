import { useState, useEffect } from "react";
import { Card } from "../ui/card/Card";
import { CardHeader } from "../ui/card/CardHeader";
import { CardBody } from "../ui/card/CardBody";
import { CardFooter } from "../ui/card/CardFooter";
import { Button } from "../ui/button/Button";
import { Select } from "../ui/select/Select";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { policyService } from "../../services/policyService";
import { customerService } from "../../services/customerService";
import { toast } from "react-hot-toast";

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: "up" | "down";
}

export default function Analysis() {
  const [timeRange, setTimeRange] = useState("30d");
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  const fetchMetrics = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const [policies, customers] = await Promise.all([
        policyService.getPolicies(token),
        customerService.getCustomers(token),
      ]);

      console.log(customers, customers.length);

      // Calculate metrics
      const totalPolicies = policies.length;
      const activeCustomers = customers.filter(
        (c) => c.status === "ACTIVE"
      ).length;
      const monthlyRevenue = policies.reduce(
        (sum, policy) => sum + (policy.premium || 0),
        0
      );
      const claimsFiled = policies.filter(
        (p) => p.renewalStatus === "PENDING"
      ).length;

      // Calculate changes (mock data for now - replace with actual historical data)
      const changes = {
        policies: 12.5,
        customers: 8.2,
        revenue: -2.4,
        claims: 5.7,
      };

      setMetrics([
        {
          title: "Total Policies",
          value: totalPolicies.toLocaleString(),
          change: changes.policies,
          trend: changes.policies >= 0 ? "up" : "down",
        },
        {
          title: "Active Customers",
          value: activeCustomers.toLocaleString(),
          change: changes.customers,
          trend: changes.customers >= 0 ? "up" : "down",
        },
        {
          title: "Monthly Revenue",
          value: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(monthlyRevenue),
          change: changes.revenue,
          trend: changes.revenue >= 0 ? "up" : "down",
        },
        {
          title: "Claims Filed",
          value: claimsFiled.toLocaleString(),
          change: changes.claims,
          trend: changes.claims >= 0 ? "up" : "down",
        },
      ]);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      toast.error("Failed to load metrics");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Analysis Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-40"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </Select>
          <Button variant="primary">Export Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? // Loading skeleton
            Array(4)
              .fill(0)
              .map((_, index) => (
                <Card key={index}>
                  <CardBody>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    </div>
                  </CardBody>
                </Card>
              ))
          : metrics.map((metric) => (
              <Card key={metric.title}>
                <CardBody>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {metric.title}
                    </span>
                    <span className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                      {metric.value}
                    </span>
                    <div className="flex items-center mt-2">
                      <span
                        className={`text-sm ${
                          metric.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {metric.trend === "up" ? "↑" : "↓"}{" "}
                        {Math.abs(metric.change)}%
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        vs last period
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Policy Distribution
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Chart placeholder - Policy distribution by type
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Trends
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Chart placeholder - Revenue trends over time
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Claims
            </h3>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Claim ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        Loading claims data...
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        CLM-001
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        John Doe
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        Auto
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        $2,500
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Claims
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Performing Agents
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="ml-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Sarah Johnson
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        45 policies
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-500">
                    +12%
                  </span>
                </div>
              )}
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Agents
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
