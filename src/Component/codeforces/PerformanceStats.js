import React from 'react';
import { Target, Trophy } from 'lucide-react';

const PerformanceStats = ({ userData }) => {
  return (
    <div className="bg-[#374151] p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <Target className="text-green-500" />
        <h3 className="text-lg font-semibold">Performance Stats</h3>
      </div>

      <div className="flex flex-col items-center">
        <p className="text-gray-400">{userData?.rank || 'Unrated'}</p>
        <div className="flex items-center gap-2 mt-2">
          <Trophy className="text-yellow-500" />
          <span>Max Rating: {userData?.maxRating || 0}</span>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        <div>
          <p className="text-gray-400">Contribution</p>
          <p className="text-xl font-bold">{userData?.contribution || 0}</p>
        </div>
        <div>
          <p className="text-gray-400">Global Rank</p>
          <p className="text-xl font-bold">#{userData?.rank || 'NA'}</p>
        </div>
        <div>
          <p className="text-gray-400">Contest Rating</p>
          <p className="text-xl font-bold">{userData?.rating || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceStats;