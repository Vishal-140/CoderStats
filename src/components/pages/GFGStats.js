import React from "react";
import { useGFG } from "../../context/GFGContext";
import ProfileCard from "../profile/ProfileCard";
import CalendarCard from "../common/CalendarCard";
import DifficultyBreakdown from "../platformStats/gfg/DifficultyBreakdown";
import GFGSubmissionStats from "../platformStats/gfg/GFGSubmissionStats";

const GFGStats = () => {
  const { stats, error } = useGFG();

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
            <ProfileCard stats={stats} username={stats.username || "NA"} error={error} />
            <DifficultyBreakdown stats={stats} />
          </div>

          <div className="flex-1 space-y-4">
            <CalendarCard />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderMetricsCard("Total Questions", stats.codingStats.problemsSolved)}
              {renderMetricsCard("Global Rank", stats.globalRank)}
              {renderMetricsCard("Country Rank", stats.countryRank)}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {renderMetricsCard("Coding Score", stats.codingScore)}
              {renderMetricsCard("Streak", stats.streak)}
              {renderMetricsCard("Contest Rating", stats.contestRating)}
              {renderMetricsCard("Submissions", stats.codingStats.submissions)}
            </div>
            <GFGSubmissionStats/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GFGStats;