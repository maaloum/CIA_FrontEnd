import { useState, useEffect } from "react";
import { Select } from "../ui/select/Select";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { customerService } from "../../services/customerService";
import { policyService } from "../../services/policyService";
import { toast } from "react-hot-toast";
import { PolicyGrowthChart } from "../ui/graphs/PolicyGrowthChart";
import { RevenueDistributionChart } from "../ui/graphs/RevenueDistributionChart";
import { ClaimsAnalysisChart } from "../ui/graphs/ClaimsAnalysisChart";
import { CustomerDemographicsChart } from "../ui/graphs/CustomerDemographicsChart";
import { GenderDistributionChart } from "../ui/graphs/GenderDistributionChart";
import { GeographicDistributionChart } from "../ui/graphs/GeographicDistributionChart";
import { Policy } from "../../types/policy";
import { calculateMonthlyPolicyGrowth } from "../../utiles/PolicyGrow";

interface RegionData {
  region: string;
  count: number;
}

interface AgeGroupData {
  name: string;
  value: number;
}

interface GenderData {
  name: string;
  value: number;
}

interface PolicyGrowthData {
  month: string;
  count: number;
  growthRate: number;
}

const AGE_GROUPS = [
  { name: "18-24", min: 18, max: 24 },
  { name: "25-34", min: 25, max: 34 },
  { name: "35-44", min: 35, max: 44 },
  { name: "45-54", min: 45, max: 54 },
  { name: "55-64", min: 55, max: 64 },
  { name: "65+", min: 65, max: 120 },
];

const GENDER_LABELS = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  prefer_not_to_say: "Prefer not to say",
};

export default function Graphs() {
  const { token } = useSelector((state: RootState) => state.auth);
  const [timeRange, setTimeRange] = useState("30d");
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [ageGroupData, setAgeGroupData] = useState<AgeGroupData[]>([]);
  const [genderData, setGenderData] = useState<GenderData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [policies, setPolicies] = useState<Policy[]>([]);
  const [policyGrowthData, setPolicyGrowthData] = useState<Policy[]>([]);

  useEffect(() => {
    fetchCustomerData();
    fetchPolicies();
  }, [token]);

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // const calculatePolicyGrowth = (policies: Policy[]): PolicyGrowthData[] => {
  //   const monthlyData = policies.reduce(
  //     (acc: { [key: string]: number }, policy) => {
  //       const date = new Date(policy.startDate);
  //       const monthKey = `${date.getFullYear()}-${String(
  //         date.getMonth() + 1
  //       ).padStart(2, "0")}`;
  //       acc[monthKey] = (acc[monthKey] || 0) + 1;
  //       return acc;
  //     },
  //     {}
  //   );

  //   const sortedMonths = Object.keys(monthlyData).sort();
  //   let previousCount = 0;

  //   return sortedMonths.map((month) => {
  //     const count = monthlyData[month];
  //     const growthRate =
  //       previousCount === 0
  //         ? 0
  //         : ((count - previousCount) / previousCount) * 100;
  //     previousCount = count;

  //     return {
  //       month,
  //       count,
  //       growthRate: Number(growthRate.toFixed(1)),
  //     };
  //   });
  // };

  const fetchPolicies = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const data = await policyService.getPolicies(token);
      console.log({ data });
      setPolicyGrowthData(calculateMonthlyPolicyGrowth(data));
    } catch (error) {
      console.error("Error fetching policies:", error);
      toast.error("Failed to load policies");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomerData = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const customers = await customerService.getCustomers(token);

      // Process region data - using email domain as region for now
      const regionCounts = customers.reduce(
        (acc: { [key: string]: number }, customer) => {
          const city = customer.address || "unknown";
          acc[city] = (acc[city] || 0) + 1;
          return acc;
        },
        {}
      );

      const regionData = Object.entries(regionCounts)
        .map(([region, count]) => ({ region, count }))
        .sort((a, b) => b.count - a.count);

      // Process age group data using real dateOfBirth
      const ageCounts = customers.reduce(
        (acc: { [key: string]: number }, customer) => {
          console.log(customer.customer.dateOfBirth);
          if (customer.customer.dateOfBirth) {
            const age = calculateAge(customer.customer.dateOfBirth);
            const ageGroup = AGE_GROUPS.find(
              (group) => age >= group.min && age <= group.max
            );
            if (ageGroup) {
              acc[ageGroup.name] = (acc[ageGroup.name] || 0) + 1;
            }
          }
          return acc;
        },
        {}
      );

      const ageGroupData = AGE_GROUPS.map((group) => ({
        name: group.name,
        value: ageCounts[group.name] || 0,
      }));

      // Process gender data using real gender
      const genderCounts = customers.reduce(
        (acc: { [key: string]: number }, customer) => {
          if (customer.gender) {
            const normalizedGender = customer.gender.trim().toUpperCase();
            acc[normalizedGender] = (acc[normalizedGender] || 0) + 1;
          }
          return acc;
        },
        {}
      );

      // Convert gender data to array format with proper labels, only for existing genders
      const genderData = Object.entries(genderCounts)
        .filter(([key]) => key in GENDER_LABELS) // Only include valid gender keys
        .map(([key, value]) => ({
          name: GENDER_LABELS[key as keyof typeof GENDER_LABELS],
          value,
        }));

      setRegionData(regionData);
      setAgeGroupData(ageGroupData);
      setGenderData(genderData);
    } catch (error) {
      toast.error("Failed to fetch customer data");
      console.error("Error fetching customer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Data Visualization
        </h1>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PolicyGrowthChart policies={policyGrowthData} isLoading={isLoading} />
        <RevenueDistributionChart />
        <ClaimsAnalysisChart />
        <CustomerDemographicsChart
          ageGroupData={ageGroupData}
          isLoading={isLoading}
        />
        <GenderDistributionChart
          genderData={genderData}
          isLoading={isLoading}
        />
        <GeographicDistributionChart
          regionData={regionData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
