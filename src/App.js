import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import NavBar from "./components/common/NavBar";
import Footer from "./components/common/Footer";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import DataInput from "./components/profile/DataInput";
import Dashboard from "./components/pages/Dashboard";
import LeetCodeStats from "./components/pages/LeetCodeStats";
import GFGStats from "./components/pages/GFGStats";
import CodeForcesStats from "./components/pages/CodeForcesStats";
import { LeetCodeProvider } from "./context/LeetCodeContext";
import { GFGProvider } from "./context/GFGContext";
import { CodeForcesProvider } from "./context/CodeForcesContext";

const App = () => {
  const location = useLocation(); // Get the current route

  // Define routes where NavBar should not be visible
  const noNavBarRoutes = ["/login", "/register"];
  const isNavBarVisible = !noNavBarRoutes.includes(location.pathname);

  return (
    <>
      {/* NavBar */}
      {isNavBarVisible && <NavBar />}

      <div>
        <Routes>
          {/* Redirect from home to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Main Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/datainput" element={<DataInput />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leetcode" element={<LeetCodeStats />} />
          <Route path="/GFG" element={<GFGStats />} />
          <Route path="/codeforces" element={<CodeForcesStats />} />
        </Routes>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
};

const Root = () => (
  <Router>
    <LeetCodeProvider>
      <GFGProvider>
        <CodeForcesProvider>
        <App />
        </CodeForcesProvider>
      </GFGProvider>
    </LeetCodeProvider>
  </Router>
);

export default Root;
