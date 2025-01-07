import React from 'react';

const ProblemsCard = ({ platformData, usernames, loading, platformErrors }) => {
  const getTotalProblems = () => {
    let total = 0;
    if (platformData.leetcode && !platformErrors.leetcode) {
      total += platformData.leetcode?.totalSolved || 0;
    }
    if (platformData.gfg && !platformErrors.gfg) {
      total += Number(platformData.gfg?.codingStats?.problemsSolved || 0);
    }
    if (platformData.codeforces && !platformErrors.codeforces) {
      total += Number(platformData.codeforces?.problemCount || 0);
    }
    return total;
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md">
      {/* Problems Solved Card */}
      <h2 className="text-lg font-semibold text-blue-300 mb-3">
        Problems Solved
      </h2>
      <div className="flex flex-col space-y-3">
        <div className="p-4 bg-blue-600 rounded-lg text-center">
          <h3 className="text-xl font-medium mb-1">Total Problems Solved</h3>
          <p className="text-3xl font-bold">{getTotalProblems()}</p>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {usernames.leetcode && (
            <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
              <h3 className="text-md font-medium">LeetCode</h3>
              <p className="text-xl font-bold">
                {platformData.leetcode?.totalSolved || "0"}
              </p>
            </div>
          )}
          {usernames.gfg && (
            <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
              <h3 className="text-md font-medium">GeeksForGeeks</h3>
              <p className="text-xl font-bold">
                {platformData.gfg?.codingStats?.problemsSolved || "0"}
              </p>
            </div>
          )}
          {usernames.codeforces && (
            <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
              <h3 className="text-md font-medium">CodeForces</h3>
              <p className="text-xl font-bold">
                {platformData.codeforces?.problemCount || "0"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemsCard;
