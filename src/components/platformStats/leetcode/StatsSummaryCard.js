import React from 'react';

const StatsSummaryCard = ({ totalSolved, totalActiveDays, ranking, contributionPoint, reputation }) => (
  <div className="space-y-6 w-full">
  {/* Grid container for Total Questions Solved, Ranking, Contribution Points, and Reputation cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
    {/* Total Questions Solved Card */}
    <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full">
      <h3 className="text-xl">Total Questions</h3>
      <p className="text-[50px] font-bold">{totalSolved}</p>
    </div>

    {/* Ranking Card */}
    <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full">
      <h3 className="text-base">Ranking</h3>
      <p className="text-[40px] font-bold">{ranking}</p>
    </div>

    {/* Contribution Points Card */}
    <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full">
      <h3 className="text-xl">Contribution Points</h3>
      <p className="text-[50px] font-bold">{contributionPoint}</p>
    </div>

    {/* Reputation Card */}
    <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full">
      <h3 className="text-xl">Reputation</h3>
      <p className="text-[50px] font-bold">{reputation}</p>
    </div>
  </div>
</div>


);

export default StatsSummaryCard;
