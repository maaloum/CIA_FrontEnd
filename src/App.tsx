import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLayout from "./components/layouts/AdminLayout";
import CustomerLayout from "./components/layouts/CustomerLayout";
import CustomerDashboard from "./components/customer/CustomerDashboard";
import PaymentsBilling from "./components/customer/PaymentsBilling";
import Documents from "./components/customer/Documents";
import Login from "./components/auth/SignInForm";
// import SignUpForm from "./components/auth/SignUpForm";
import NotFound from "./pages/OtherPage/NotFound";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthInitializer from "./components/auth/AuthInitializer";
import Profile from "./components/customer/Profile";
import AdminDashboard from "./components/admin/AdminDashboard";
import { useSelector } from "react-redux";
import { RootState } from "./store";

function RootRedirect() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/customer" replace />;
}

export default function App() {
  return (
    <>
      <AuthInitializer />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Protected Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Customer Routes */}
          <Route
            path="/customer"
            element={
              <CustomerLayout>
                <CustomerDashboard />
              </CustomerLayout>
            }
          />
          <Route
            path="/customer/payments"
            element={
              <CustomerLayout>
                <PaymentsBilling />
              </CustomerLayout>
            }
          />
          <Route
            path="/customer/documents"
            element={
              <CustomerLayout>
                <Documents />
              </CustomerLayout>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <CustomerLayout>
                <Profile />
              </CustomerLayout>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          {/* <Route path="/admin/*" element={<AdminLayout />} /> */}

          {/* Redirect root to login */}
          <Route path="/" element={<Login />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
