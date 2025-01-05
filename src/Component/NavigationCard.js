import React from 'react';
import { Link } from 'react-router-dom';

const NavigationCard = () => (
  <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full">
    <h3 className="text-xl font-bold text-white pb-4">Navigation</h3>
    <ul className="space-y-2">
      <li className="bg-gray-600 p-3 rounded-md hover:bg-gray-500 transition-all">
        <Link to="/dashboard" className="text-white hover:text-gray-400 font-bold">Dashboard</Link>
      </li>
      <li className="bg-gray-600 p-3 rounded-md hover:bg-gray-500 transition-all">
        <Link to="/leetcode" className="text-white hover:text-gray-400 font-bold">LeetCode</Link>
      </li>
      <li className="bg-gray-600 p-3 rounded-md hover:bg-gray-500 transition-all">
        <Link to="/gfg" className="text-white hover:text-gray-400 font-bold">GFG</Link>
      </li>
      <li className="bg-gray-600 p-3 rounded-md hover:bg-gray-500 transition-all">
        <Link to="/codeforces" className="text-white hover:text-gray-400 font-bold">CodeForces</Link>
      </li>
    </ul>
  </div>
);

export default NavigationCard;
