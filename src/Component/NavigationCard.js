import React from 'react';

const NavigationCard = () => (
  <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full">
    <h3 className="text-xl font-bold text-white pb-4">Navigation</h3>
    <ul className="space-y-2">
      <li className="bg-gray-600 p-3 rounded-md hover:bg-gray-500 transition-all">
        <a href="/dashboard" className="text-white hover:text-gray-400 font-bold">Dashboard</a>
      </li>
      <li className="bg-gray-600 p-3 rounded-md hover:bg-gray-500 transition-all">
        <a href="/leetcode" className="text-white hover:text-gray-400 font-bold">LeetCode</a>
      </li>
      <li className="bg-gray-600 p-3 rounded-md hover:bg-gray-500 transition-all">
        <a href="/gfg" className="text-white hover:text-gray-400 font-bold">GFG</a>
      </li>
      <li className="bg-gray-600 p-3 rounded-md hover:bg-gray-500 transition-all">
        <a href="/codeforces" className="text-white hover:text-gray-400 font-bold">CodeForces</a>
      </li>
    </ul>
  </div>
);

export default NavigationCard;
