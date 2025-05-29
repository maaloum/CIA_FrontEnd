import { Policy } from "../types/policy";

export type RevenueDistribution = {
  type: string;
  totalRevenue: number;
  percentage: number;
};

export function calculateRevenueDistributionByPolicyType(
  policies: Policy[]
): RevenueDistribution[] {
  const revenueMap: Record<string, number> = {};
  let totalRevenue = 0;

  // Aggregate revenue by policy coverage type
  for (const policy of policies) {
    const type = policy.coverage || "UNKNOWN";
    const revenue = policy.premium || 0;

    revenueMap[type] = (revenueMap[type] || 0) + revenue;
    totalRevenue += revenue;
  }

  // Convert to array with percentage
  const result: RevenueDistribution[] = Object.entries(revenueMap).map(
    ([type, totalRevenueByType]) => {
      const percentage =
        totalRevenue === 0 ? 0 : (totalRevenueByType / totalRevenue) * 100;
      return {
        type,
        totalRevenue: +totalRevenueByType.toFixed(2),
        percentage: +percentage.toFixed(2),
      };
    }
  );

  return result;
}
