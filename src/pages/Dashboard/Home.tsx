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

  const renderContent = () => {
    if (!user) return null;

    const status = user.role?.toLowerCase() || "";

    if (status === "admin") {
      return <AdminDashboard />;
    }

    if (status === "customer") {
      return <CustomerDashboard />;
    }
  };

  return (
    <>
      <PageMeta
        title="Classic Insurance"
        description="Classic insurance is your partner"
      />
      {renderContent()}
    </>
  );
}
