import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileCard from './ProfileCard';
import NavigationCard from './NavigationCard';
import RecentSubmissions from './RecentSubmissions';
import SubmissionStats from './SubmissionStats';
import CalendarCard from './CalendarCard';
import StatsSummaryCard from './StatsSummaryCard';
import DifficultyStatsCard from './DifficultyStatsCard';

const CodingNinjasStats = () => {
  const [stats, setStats] = useState(null);
  const [recentSubmissionsCount, setRecentSubmissionsCount] = useState(5);
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`https://alfa-leetcode-api`);
        setStats(response.data);

        const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;
        const filteredCalendarData = Object.entries(response.data.submissionCalendar).filter(([timestamp]) => {
          return parseInt(timestamp) * 1000 > sixMonthsAgo;
        });

        setCalendarData(filteredCalendarData);
      } catch (err) {
        setError('Failed to fetch stats. Please check the username or try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSeeMoreClick = () => {
    setRecentSubmissionsCount((prevCount) => prevCount + 5);
  };

  // Default values for when loading or in case of an error
  const defaultStats = {
    totalSolved: 'NA',
    totalActiveDays: 'NA',
    ranking: 'NA',
    contributionPoint: 'NA',
    reputation: 'NA',
    totalSubmissions: [],
    easySolved: 'NA',
    totalEasy: 'NA',
    mediumSolved: 'NA',
    totalMedium: 'NA',
    hardSolved: 'NA',
    totalHard: 'NA',
    recentSubmissions: [],
  };

  // Default calendar with "NA" values
  const defaultCalendarData = [
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
    ['NA', 0],
  ];

  const displayStats = stats || defaultStats;
  const displayCalendarData = calendarData.length > 0 ? calendarData : defaultCalendarData;
  const loadingContent = <div className="text-center text-lg">Loading...</div>;
  const errorContent = <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-800 text-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Coding Ninjas Stats</h1>

      {loading && loadingContent}
      {error && errorContent}

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="w-full lg:w-1/4 space-y-6">
            <ProfileCard stats={displayStats} username="Vishal140" />
            <NavigationCard />
          </div>

          <div className="flex-1 space-y-6">
            <CalendarCard calendarData={displayCalendarData} />

            <div className="flex flex-col lg:flex-row justify-between space-y-6 lg:space-y-0 lg:space-x-6">
              <div className="w-full space-y-6">
                <StatsSummaryCard
                  totalSolved={displayStats.totalSolved}
                  totalActiveDays={displayStats.totalActiveDays}
                  ranking={displayStats.ranking}
                  contributionPoint={displayStats.contributionPoint}
                  reputation={displayStats.reputation}
                />
              </div>

              <div className="w-full space-y-6">
                <SubmissionStats totalSubmissions={displayStats.totalSubmissions} />
                <DifficultyStatsCard
                  easySolved={displayStats.easySolved}
                  totalEasy={displayStats.totalEasy}
                  mediumSolved={displayStats.mediumSolved}
                  totalMedium={displayStats.totalMedium}
                  hardSolved={displayStats.hardSolved}
                  totalHard={displayStats.totalHard}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-6">
          <RecentSubmissions
            recentSubmissions={displayStats.recentSubmissions}
            recentSubmissionsCount={recentSubmissionsCount}
            handleSeeMoreClick={handleSeeMoreClick}
          />
        </div>
      </div>
    </div>
  );
};

export default CodingNinjasStats;
