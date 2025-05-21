import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import Sidebar from "../navigation/Sidebar";

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (user.role !== "admin") {
      navigate("/customer", { replace: true });
    }
  }, [user, navigate]);

  // Don't render anything while checking authentication
  if (!user) {
    return null;
  }

  // Don't render admin layout for non-admin users
  if (user.role !== "admin") {
    return null;
  }

  const adminNavItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "HomeIcon",
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: "UserIcon",
    },
    {
      name: "Policies",
      path: "/admin/policies",
      icon: "ListIcon",
    },
    {
      name: "Renewals",
      path: "/admin/renewals",
      icon: "RefreshIcon",
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: "PieChartIcon",
    },
    {
      name: "Integrations",
      path: "/admin/integrations",
      icon: "PlugInIcon",
    },
    {
      name: "Communication",
      path: "/admin/communication",
      icon: "ChatIcon",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar navItems={adminNavItems} />
      <main className="flex-1 overflow-y-auto p-6">
        {children || <Outlet />}
      </main>
    </div>
  );
}
