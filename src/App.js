import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import NavBar from './Component/NavBar';
import Footer from './Component/Footer';
import Dashboard from './Component/Dashboard';
import LeetCodeStats from './Component/LeetCodeStats';
import GFGStats from './Component/GFGStats';
import Login from './Component/Login';
import Register from './Component/Register';
import DataInput from './Component/DataInput';
import CodeForcesStats from './Component/CodeForcesStats';

const App = () => {
  const location = useLocation(); // Get the current route

  // Define routes where NavBar should not be visible
  const noNavBarRoutes = ['/login', '/register'];
  const isNavBarVisible = !noNavBarRoutes.includes(location.pathname);

  return (
    <>
      {isNavBarVisible && <NavBar />}
      
      <div style={{ padding: '20px' }}>
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
