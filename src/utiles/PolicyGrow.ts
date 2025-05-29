import { Policy } from "../types/policy";

export function calculateMonthlyPolicyGrowth(policies: Policy[]) {
  console.log("incoming policy", policies);
  const grouped: Record<string, number> = {};

  for (const policy of policies) {
    const [year, month, day] = policy.startDate.split("-") || "";
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    grouped[key] = (grouped[key] || 0) + 1;

    console.log({ grouped });
  }

  const sortedKeys = Object.keys(grouped).sort();
  console.log({ sortedKeys });
  const result = [];

  for (let i = 1; i < sortedKeys.length; i++) {
    const currentMonth = sortedKeys[i];
    const previousMonth = sortedKeys[i - 1];

    const currentCount = Number(grouped[currentMonth] || 0);
    const previousCount = Number(grouped[previousMonth] || 0);
    console.log({ currentMonth });
    const growth =
      previousCount === 0
        ? 0
        : ((currentCount - previousCount) / previousCount) * 100;

    result.push({
      month: currentMonth,
      count: currentCount,
      growthRate: +growth.toFixed(2),
    });
  }

  // console.log({ result });

  return result;
}
