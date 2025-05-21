import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import Sidebar from "../navigation/Sidebar";

interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  console.log({
    user,
  });

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/signin", { replace: true });
  //   } else if (user.role !== "admin") {
  //     navigate("/admin", { replace: true });
  //   }
  // }, [user, navigate]);

  // Don't render anything while checking authentication
  if (!user) {
    return null;
  }

  // Don't render customer layout for non-customer users
  if (user.role !== "customer") {
    return null;
  }

  const customerNavItems = [
    {
      name: "Dashboard",
      path: "/customer",
      icon: "HomeIcon",
    },
    {
      name: "My Policies",
      path: "/customer/policies",
      icon: "ListIcon",
    },
    {
      name: "Payments & Billing",
      path: "/customer/payments",
      icon: "DollarLineIcon",
    },
    {
      name: "Documents",
      path: "/customer/documents",
      icon: "DocsIcon",
    },
    {
      name: "Profile",
      path: "/customer/profile",
      icon: "UserIcon",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar navItems={customerNavItems} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
