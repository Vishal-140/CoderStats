import React from 'react';

const ContestRatingsCard = ({ platformData, usernames, loading, platformErrors }) => {
  return (
    <div className="p-4 rounded-lg shadow-md bg-[#374151]">
      {/* Contest Ratings Card */}
      <h2 className="text-lg font-semibold text-blue-300 mb-3">Contest Ratings</h2>
      <div className="flex flex-col space-y-3">
        {usernames.leetcode && (
          <div className="p-3 rounded-lg bg-[#4B5563]">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium">LeetCode</h3>
              <span className="px-2 py-0.5 bg-blue-500 rounded-full text-xs">
                Contest Rating
              </span>
            </div>
            {platformErrors.leetcode ? (
              <p className="text-red-400 text-sm mt-1">Error loading data</p>
            ) : (
              <p className="text-xl font-bold mt-1">
                {loading ? '...' : platformData.leetcode?.contestRating || 'NA'}
              </p>
            )}
          </div>
        )}
        {usernames.gfg && (
          <div className="p-3 rounded-lg bg-[#4B5563]">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium">GeeksForGeeks</h3>
              <span className="px-2 py-0.5 bg-green-500 rounded-full text-xs">
                Coding Score
              </span>
            </div>
            {platformErrors.gfg ? (
              <p className="text-red-400 text-sm mt-1">Error loading data</p>
            ) : (
              <p className="text-xl font-bold mt-1">
                {loading ? '...' : platformData.gfg?.codingScore || 'NA'}
              </p>
            )}
          </div>
        )}
        {usernames.codeforces && (
          <div className="p-3 rounded-lg bg-[#4B5563]">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium">CodeForces</h3>
              <span className="px-2 py-0.5 bg-purple-500 rounded-full text-xs">
                Rating
              </span>
            </div>
            {platformErrors.codeforces ? (
              <p className="text-red-400 text-sm mt-1">Error loading data</p>
            ) : (
              <p className="text-xl font-bold mt-1">
                {loading ? '...' : platformData.codeforces?.rating || 'NA'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestRatingsCard;
