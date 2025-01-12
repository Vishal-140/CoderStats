import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import NavBar from './Component/NavBar';
import Footer from './Component/Footer';
import Login from './Component/auth/Login';
import Register from './Component/auth/Register';
import DataInput from './Component/DataInput';
import Dashboard from './Component/dashboard/Dashboard';
import LeetCodeStats from './Component/leetcode/LeetCodeStats';
import GFGStats from './Component/gfg/GFGStats';
import CodeForcesStats from './Component/codeforces/CodeForcesStats';

const App = () => {
  const location = useLocation(); // Get the current route

  // Define routes where NavBar should not be visible
  const noNavBarRoutes = ['/login', '/register'];
  const isNavBarVisible = !noNavBarRoutes.includes(location.pathname);

  return (
    <>
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

      <Footer />
    </>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
