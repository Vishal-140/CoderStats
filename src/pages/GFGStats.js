import React from "react";
import { useGlobalData } from "../context/GlobalDataContext";
import ProfileCard from "../components/profile/ProfileCard";
import CalendarCard from "../components/common/CalendarCard";
import DifficultyBreakdown from "../components/platformStats/gfg/DifficultyBreakdown";
import GFGSubmissionStats from "../components/platformStats/gfg/GFGSubmissionStats";

const GFGStats = () => {
  const { platformData, platformErrors, usernames, loading } = useGlobalData();
  const stats = platformData?.gfg || {};
  const error = platformErrors?.gfg;

  // Safe access to avoid null reference errors
  const renderMetricsCard = (title, value) => (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-blue-300 mb-2">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 mt-20 bg-gray-800 text-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center">GeeksforGeeks Dashboard</h1>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="w-full lg:w-1/4 space-y-4">
            <ProfileCard stats={stats} username={usernames?.gfg || "NA"} error={error} loading={loading} />
            <DifficultyBreakdown stats={stats} />
          </div>

          <div className="flex-1 space-y-4">
            <CalendarCard />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderMetricsCard("Total Questions", stats?.codingStats?.problemsSolved || 0)}
              {renderMetricsCard("Global Rank", stats?.globalRank || 'N/A')}
              {renderMetricsCard("Country Rank", stats?.countryRank || 'N/A')}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {renderMetricsCard("Coding Score", stats?.codingScore || 0)}
              {renderMetricsCard("Streak", stats?.streak || 0)}
              {renderMetricsCard("Contest Rating", stats?.contestRating || 0)}
              {renderMetricsCard("Submissions", stats?.codingStats?.submissions || 0)}
            </div>
            <GFGSubmissionStats/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GFGStats;