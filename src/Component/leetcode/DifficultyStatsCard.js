import React from 'react';

const DifficultyStatsCard = ({ easySolved, totalEasy, mediumSolved, totalMedium, hardSolved, totalHard }) => (
  <div className="bg-gray-700 p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-5">Difficulty Stats</h3>
    <ul className="space-y-2">
      <li><strong>Easy:</strong><span className="text-[22px] font-bold"> {easySolved} / {totalEasy}</span></li>
      <li><strong>Medium:</strong><span className="text-[22px] font-bold"> {mediumSolved} / {totalMedium}</span></li>
      <li><strong>Hard:</strong><span className="text-[22px] font-bold"> {hardSolved} / {totalHard}</span></li>
    </ul>
  </div>
);

export default DifficultyStatsCard;
