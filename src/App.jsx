import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./app/page";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AssistantPage from "./pages/AssistantPage.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LaunchNotesSection from "./components/LaunchNotesSection";
import ForCompaniesSection from "./components/ForCompaniesSection";
import SpendsBudgetsSection from "./components/SpendsBudgetsSection";
import UPIBillsSection from "./components/UPIBillsSection";
import FamilySpaceSection from "./components/FamilySpaceSection";
import FuturePlannerSection from "./components/FuturePlannerSection";
import Details from "./components/Details.jsx";

// ⭐ ADD THIS
import SubscriptionPage from "./components/SubscriptionPage.jsx";

// Layout component to conditionally render Navbar
const Layout = ({ children }) => {
  const location = useLocation();

  const showNavbar = !["/dashboard", "/assistant", "/details"].includes(
    location.pathname
  );

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          {/* ⭐ ADD THIS */}
          <Route path="/subscribe" element={<SubscriptionPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/launch" element={<LaunchNotesSection />} />
          <Route path="/for-companies" element={<ForCompaniesSection />} />
          <Route path="/spends-budgets" element={<SpendsBudgetsSection />} />
          <Route path="/Upi-Bills" element={<UPIBillsSection />} />
          <Route path="/Family-Space" element={<FamilySpaceSection />} />
          <Route path="/Future-Planner" element={<FuturePlannerSection />} />
          <Route path="/details" element={<Details />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <AssistantPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
