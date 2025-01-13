import React from 'react';

const RankingsCard = ({ platformData, usernames, loading, platformErrors }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md">
      {/* Rankings Card */}
      <h2 className="text-lg font-semibold text-blue-300 mb-3">Rankings</h2>
      <div className="flex flex-col space-y-3">
        {usernames.leetcode && (
          <div className="p-4 bg-[#4B5563] rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-white">LeetCode</h3>
              <span className="px-2 py-0.5 bg-blue-500 rounded-full text-xs">
                Global Rank
              </span>
            </div>
            {platformErrors.leetcode ? (
              <p className="text-red-400 text-sm mt-1">Error loading data</p>
            ) : (
              <p className="text-2xl font-bold text-white mt-1">
                {loading ? '...' : platformData.leetcode?.ranking || 'NA'}
              </p>
            )}
          </div>
        )}
        {usernames.gfg && (
          <div className="p-4 bg-[#4B5563] rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-white">GeeksForGeeks</h3>
              <span className="px-2 py-0.5 bg-green-500 rounded-full text-xs">
                Country Rank
              </span>
            </div>
            {platformErrors.gfg ? (
              <p className="text-red-400 text-sm mt-1">Error loading data</p>
            ) : (
              <p className="text-2xl font-bold text-white mt-1">
                {loading ? '...' : platformData.gfg?.countryRank || 'NA'}
              </p>
            )}
          </div>
        )}
        {usernames.codeforces && (
          <div className="p-4 bg-[#4B5563] rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-white">CodeForces</h3>
              <span className="px-2 py-0.5 bg-purple-500 rounded-full text-xs">
                Global Rank
              </span>
            </div>
            {platformErrors.codeforces ? (
              <p className="text-red-400 text-sm mt-1">Error loading data</p>
            ) : (
              <p className="text-2xl font-bold text-white mt-1">
                {loading ? '...' : platformData.codeforces?.rank || 'NA'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingsCard;
