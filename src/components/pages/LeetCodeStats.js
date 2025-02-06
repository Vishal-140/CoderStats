import React, { useContext } from "react";
import { LeetCodeContext } from "../../context/LeetCodeContext";
import ProfileCard from "../../components/profile/ProfileCard";
import CalendarCard from "../../components/common/CalendarCard";
import RecentSubmissions from "../platformStats/leetcode/RecentSubmissions";
import SubmissionStats from "../platformStats/leetcode/SubmissionStats";
import StatsSummaryCard from "../platformStats/leetcode/StatsSummaryCard";
import DifficultyStatsCard from "../platformStats/leetcode/DifficultyStatsCard";

const LeetCodeStats = () => {
  const { stats, username } = useContext(LeetCodeContext);

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6 mt-20 bg-gray-800 text-white shadow-lg rounded-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">LeetCode Stats</h1>

      <div className="flex flex-col space-y-4 sm:space-y-6">
        <div className="flex flex-col lg:flex-row lg:space-x-4 xl:space-x-6">
          {/* Left Column */}
          <div className="w-full lg:w-1/4 space-y-4 sm:space-y-6">
            <ProfileCard stats={stats} username={username || "NA"} />
            <DifficultyStatsCard
              easySolved={stats?.easySolved}
              totalEasy={stats?.totalEasy}
              mediumSolved={stats?.mediumSolved}
              totalMedium={stats?.totalMedium}
              hardSolved={stats?.hardSolved}
              totalHard={stats?.totalHard}
            />
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            <CalendarCard />
            <StatsSummaryCard
              totalSolved={stats?.totalSolved}
              totalActiveDays={stats?.totalActiveDays}
              ranking={stats?.ranking}
              contributionPoint={stats?.contributionPoint}
              reputation={stats?.reputation}
            />
            <SubmissionStats
              totalSubmissions={stats?.totalSubmissions}
            />
          </div>
        </div>

        {/* Recent Submissions */}
        <RecentSubmissions
          recentSubmissions={stats?.recentSubmissions}
        />
      </div>
    </div>
  );
};

export default LeetCodeStats;
