import React from 'react';

const StatsSummaryCard = ({ totalSolved, totalActiveDays, ranking, contributionPoint, reputation }) => (
  <div className="space-y-6">
    {/* Flex container for Total Questions Solved and Total Active Days cards */}
    <div className="flex space-x-6">
      {/* Total Questions Solved Card */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-md flex-1">
        <h3 className="text-xl">Total Questions</h3>
        <p className="text-[50px] font-bold">{totalSolved}</p>

      </div>

      {/* Ranking Card */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-md flex-1">
        <h3 className="text-xl">Ranking</h3>
        <p className="text-[50px] font-bold">{ranking}</p>
      </div>
    </div>

    {/* Contribution Card */}
    <div className="bg-gray-700 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold">Contribution</h3>
      <p className="mt-2"><strong>Contribution Points:</strong> <span className="text-[25px] font-bold">{contributionPoint}</span></p>
      <p><strong>Reputation:</strong> <span className="text-[25px] font-bold">{reputation}</span></p>
    </div>
  </div>
);

export default StatsSummaryCard;
