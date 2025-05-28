import { useSelector } from "react-redux";
import { RootState } from "../store";
import CustomerSettings from "./customer/Settings";
import AdminSettings from "./admin/Settings";

export default function Settings() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return null;
  }

  return user.role === "ADMIN" ? <AdminSettings /> : <CustomerSettings />;
}
