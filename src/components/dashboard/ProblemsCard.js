import React from 'react';
import { useCodeForces } from '../../context/CodeForcesContext';

const ProblemsCard = ({ platformData, usernames, loading, platformErrors }) => {
  const { stats } = useCodeForces(); // Get CodeForces data from context

  const getTotalProblems = () => {
    let total = 0;
    if (platformData.leetcode && !platformErrors.leetcode) {
      total += platformData.leetcode?.totalSolved || 0;
    }
    if (platformData.gfg && !platformErrors.gfg) {
      total += Number(platformData.gfg?.codingStats?.problemsSolved || 0);
    }
    if (stats?.problemsSolved) {
      total += stats.problemsSolved; // Use context data for CodeForces
    }
    return total;
  };

  return (
    <div className="bg-gray-700 p-6 rounded-xl h-full">
      <h2 className="text-2xl font-semibold text-blue-300 mb-6">Problems Solved</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col space-y-4">
          {usernames.codeforces && (
            <div className="flex justify-between items-center p-4 bg-[#1a518c] rounded-lg">
              <h3 className="text-xl text-white font-medium">CodeForces</h3>
              <p className="text-3xl text-white font-bold">
                {loading ? "Loading..." : stats?.problemsSolved || "0"}
              </p>
            </div>
          )}
          {usernames.leetcode && (
            <div className="flex justify-between items-center p-4 bg-yellow-700 rounded-lg">
              <h3 className="text-xl text-white font-medium">LeetCode</h3>
              <p className="text-3xl text-white font-bold">
                {platformData.leetcode?.totalSolved || "0"}
              </p>
            </div>
          )}
          {usernames.gfg && (
            <div className="flex justify-between items-center p-4 bg-green-800 rounded-lg">
              <h3 className="text-xl text-white font-medium">GeeksForGeeks</h3>
              <p className="text-3xl text-white font-bold ml-3">
                {platformData.gfg?.codingStats?.problemsSolved || "0"}
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center mt-6 sm:mt-0">
          <div className="w-full h-fit p-6 bg-blue-600 rounded-xl text-center">
            <h3 className="text-xl text-white font-medium mb-2">Total Problems<br />Solved</h3>
            <p className="text-4xl text-white font-bold">{getTotalProblems()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsCard;
