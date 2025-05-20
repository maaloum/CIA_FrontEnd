import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export default function ProtectedRoute() {
  const { token } = useSelector((state: RootState) => state.auth);

  // If there's no token, redirect to sign in
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // If there is a token, render the child routes
  return <Outlet />;
}
