// import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
// import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import AdminDashboard from "../../components/admin/AdminDashboard";
import CustomerDashboard from "../../components/customer/CustomerDashboard";
// import Pair from "../../layout/Pair";

export default function Home() {
  const { user } = useSelector((state: RootState) => state.auth);

  const getGreeting = () => {
    if (!user) return "Welcome";

    const firstName = user.firstName || "";
    const status = user.role?.toLowerCase() || "";

    if (status === "admin") {
      return `Welcome, Admin ${firstName}`;
    } else if (status === "agent") {
      return `Welcome, Agent ${firstName}`;
    } else {
      return `Welcome, Client ${firstName}`;
    }
  };

  const renderContent = () => {
    if (!user) return null;

    const status = user.role?.toLowerCase() || "";

    if (status === "admin") {
      return <AdminDashboard />;
    }

    if (status === "customer") {
      return <CustomerDashboard />;
    }

    return (
      <div className="p-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          {getGreeting()}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to your dashboard. Here you can manage your insurance policies
          and view important information.
        </p>
      </div>
    );
  };

  return (
    <>
      <PageMeta
        title="Classic Insurance"
        description="Classic insurance is your partner"
      />
      {renderContent()}
      {/* <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div> */}
    </>
  );
}
