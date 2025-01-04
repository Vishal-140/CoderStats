import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './Component/NavBar';
import Footer from './Component/Footer';
import Dashboard from './Component/Dashboard';
import LeetCodeStats from './Component/LeetCodeStats';
import GFGStats from './Component/GFGStats';
import Login from './Component/Login';
import Register from './Component/Register';
import DataInput from './Component/DataInput';
import CodeForcesStats from './Component/CodeForcesStats';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <NavBar />
      
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
    </Router>
  );
};

export default App;
