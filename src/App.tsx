import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AdminLayout from "./components/layouts/AdminLayout";
// import CustomerLayout from "./components/layouts/CustomerLayout";
// import CustomerDashboard from "./components/customer/CustomerDashboard";
import PaymentsBilling from "./components/customer/PaymentsBilling";
import Documents from "./components/customer/Documents";
import Login from "./components/auth/SignInForm";
// import SignUpForm from "./components/auth/SignUpForm";
import NotFound from "./pages/OtherPage/NotFound";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import UserProfiles from "./pages/UserProfiles";
// import Videos from "./pages/UiElements/Videos";
// import Images from "./pages/UiElements/Images";
// import Alerts from "./pages/UiElements/Alerts";
// import Badges from "./pages/UiElements/Badges";
// import Avatars from "./pages/UiElements/Avatars";
// import Buttons from "./pages/UiElements/Buttons";
// import LineChart from "./pages/Charts/LineChart";
// import BarChart from "./pages/Charts/BarChart";
// import Calendar from "./pages/Calendar";
// import BasicTables from "./pages/Tables/BasicTables";
// import FormElements from "./pages/Forms/FormElements";
// import Blank from "./pages/Blank";
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

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Protected Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
            </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/github/callback" element={<GithubCallback />} />

          {/* Customer Routes */}
          <Route element={<AppLayout />}>
            <Route path="/customer/policies" element={<Policies />} />
            <Route path="/customer/payments" element={<PaymentsBilling />} />
            <Route path="/customer/documents" element={<Documents />} />
            <Route path="/customer/profile" element={<UserProfiles />} />
            <Route path="/customer/settings" element={<Settings />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/analysis" element={<Analysis />} />
            <Route path="/admin/graphs" element={<Graphs />} />
            <Route path="/admin/policies" element={<AdminPolicies />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>

          {/* Redirect root to login */}
          <Route path="/" element={<Login />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
