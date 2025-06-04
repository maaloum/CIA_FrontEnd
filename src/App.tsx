import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaymentsBilling from "./components/customer/PaymentsBilling";
import Documents from "./components/customer/Documents";
import Login from "./components/auth/SignInForm";
import NotFound from "./pages/OtherPage/NotFound";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminDashboard from "./components/admin/AdminDashboard";
import Policies from "./components/customer/Policies";
import Settings from "./components/Settings";
import Analysis from "./components/admin/Analysis";
import Graphs from "./components/admin/Graphs";
import AdminPolicies from "./components/admin/Policies";
import Customers from "./components/admin/Customers";
import GithubCallback from "./components/auth/GithubCallback";
import useInactivityLogout from "./hooks/useInactivityLogout";

export default function App() {
  useInactivityLogout();
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
            </Route>
            <Route element={<AppLayout />}>
              <Route path="/customer/policies" element={<Policies />} />
              <Route path="/customer/payments" element={<PaymentsBilling />} />
              <Route path="/customer/documents" element={<Documents />} />
              <Route path="/customer/profile" element={<UserProfiles />} />
              <Route path="/customer/settings" element={<Settings />} />
            </Route>

            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/analysis" element={<Analysis />} />
              <Route path="/admin/graphs" element={<Graphs />} />
              <Route path="/admin/policies" element={<AdminPolicies />} />
              <Route path="/admin/customers" element={<Customers />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/github/callback" element={<GithubCallback />} />

          <Route path="/" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
