import React, { memo, useMemo, useCallback } from 'react';

const ProblemsCard = memo(({ platformData, usernames, loading, platformErrors }) => {
  const getTotalProblems = useCallback(() => {
    let total = 0;
    if (platformData.leetcode && !platformErrors.leetcode) {
      total += Number(platformData.leetcode?.totalSolved || 0);
    }
    if (platformData.gfg && !platformErrors.gfg) {
      total += Number(platformData.gfg?.codingStats?.problemsSolved || 0);
    }
    if (platformData.codeforces && !platformErrors.codeforces) {
      total += Number(platformData.codeforces?.problemsSolved || 0);
    }
    return total;
  }, [platformData, platformErrors]);

  // Memoize the total to prevent unnecessary recalculations
  const totalProblems = useMemo(() => getTotalProblems(), [getTotalProblems]);

  return (
    <div className="bg-gray-700 p-4 sm:p-6 rounded-xl h-full">
      <h2 className="text-xl sm:text-2xl font-semibold text-blue-300 mb-4 sm:mb-6">Problems Solved</h2>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 flex flex-col space-y-3 sm:space-y-4">
          {usernames.codeforces && (
            <div className="flex justify-between items-center p-3 sm:p-4 bg-[#1a518c] rounded-lg">
              <h3 className="text-base sm:text-xl text-white font-medium">CodeForces</h3>
              <p className="text-xl sm:text-3xl text-white font-bold">
                {loading ? "..." : platformData.codeforces?.problemsSolved || "0"}
              </p>
            </div>
          )}
          {usernames.leetcode && (
            <div className="flex justify-between items-center p-3 sm:p-4 bg-yellow-700 rounded-lg">
              <h3 className="text-base sm:text-xl text-white font-medium">LeetCode</h3>
              <p className="text-xl sm:text-3xl text-white font-bold">
                {platformData.leetcode?.totalSolved || "0"}
              </p>
            </div>
          )}
          {usernames.gfg && (
            <div className="flex justify-between items-center p-3 sm:p-4 bg-green-800 rounded-lg">
              <h3 className="text-base sm:text-xl text-white font-medium">GeeksForGeeks</h3>
              <p className="text-xl sm:text-3xl text-white font-bold ml-0 sm:ml-3">
                {platformData.gfg?.codingStats?.problemsSolved || "0"}
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center mt-4 sm:mt-0">
          <div className="w-full h-fit p-4 sm:p-6 bg-blue-600 rounded-xl text-center">
            <h3 className="text-base sm:text-xl text-white font-medium mb-1 sm:mb-2">Total Problems<br />Solved</h3>
            <p className="text-2xl sm:text-4xl text-white font-bold">{totalProblems}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProblemsCard;
