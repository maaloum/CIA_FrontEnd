import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import PageMeta from "../../components/common/PageMeta";
import AdminDashboard from "../../components/admin/AdminDashboard";
import CustomerDashboard from "../../components/customer/CustomerDashboard";

export default function Home() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  if (!user) return null; 

  const status = user.role?.toLowerCase() || "";

  return (
    <>
      <PageMeta
        title="Classic Insurance"
        description="Classic insurance is your partner"
      />
      {status === "admin" && <AdminDashboard />}
      {status === "customer" && <CustomerDashboard />}
    </>
  );
}
