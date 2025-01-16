import React, { useState, useEffect } from "react";
import ProblemDifficultyBreakdown from "./ProblemDifficultyBreakdown";
import RatingComponent from "./RatingComponent";
import TotalProblemSolved from "./TotalProblemSolved";
import RankAndSubmissions from "./RankAndSubmissions.js";
import RatingProgress from "./RatingProgress.js";
import RecentSubmissions from "./RecentSubmissions.js";
import Streaks from "./Streaks.js";
import CalendarCard from "../CalendarCard.js";
import ProfileCard from "../ProfileCard.js";

const CodeforcesStats = () => {
  
  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto bg-gray-800 text-white">
      <div className="flex items-center justify-center">
        <h1 className="text-3xl font-bold">CodeForces Dashboard</h1>
      </div>

      {/* Flexbox layout for Profile on left, Calendar on right */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Profile on Left */}
        <div className="flex-1">
          <ProfileCard />
          <ProblemDifficultyBreakdown />
        </div>

        {/* Calendar on Right */}
        <div className="flex-1">
          <CalendarCard />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">
            {/* TotalProblemSolved takes 1 column */}
            <div className="col-span-1">
              <TotalProblemSolved />
            </div>

            {/* RankAndSubmissions takes 2 columns */}
            <div className="col-span-2">
              <RankAndSubmissions />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">
            {/* Streaks takes 2 columns */}
            <div className="col-span-2 h-full">
              <Streaks />
            </div>

            {/* RatingComponent takes 1 column */}
            <div className="col-span-1">
              <RatingComponent />
            </div>
          </div>

          <RatingProgress />
        </div>
      </div>
      <RecentSubmissions />
    </div>
  );
};

export default CodeforcesStats;
