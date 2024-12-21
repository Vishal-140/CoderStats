import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileCard from './ProfileCard';
import NavigationCard from './NavigationCard';
import RecentSubmissions from './RecentSubmissions';
import SubmissionStats from './SubmissionStats';
import CalendarCard from './CalendarCard';
import StatsSummaryCard from './StatsSummaryCard';
import DifficultyStatsCard from './DifficultyStatsCard';
import { auth, db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
import API from './API'; // Import the API.js to access the URLs

const LeetCodeStats = () => {
  const [stats, setStats] = useState(null);
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);

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

  // Fetch user data from Firestore
  const fetchUserData = async (user) => {
    try {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsername(docSnap.data().leetcode);
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error.message);
    }
  };

  // Fetch stats from the LeetCode API
  const fetchStats = async () => {
    if (!username) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`${API.leetcodeAPI}${username}`);
      setStats(data);

      if (data?.submissionCalendar) {
        const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;
        const filteredCalendarData = Object.entries(data.submissionCalendar)
          .filter(([timestamp]) => parseInt(timestamp) * 1000 > sixMonthsAgo)
          .reduce((acc, [timestamp, count]) => {
            acc[parseInt(timestamp) / 1000] = count;
            return acc;
          }, {});
        setCalendarData(filteredCalendarData);
      }
    } catch (err) {
      console.error('Error Fetching LeetCode Data:', err);
      setError('Error fetching LeetCode data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchUserData(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (username) fetchStats();
  }, [username]);

  // Show components with default values when loading
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-800 text-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">LeetCode Stats</h1>

      {error && <div className="text-center text-red-500">{error}</div>}

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="w-full lg:w-1/4 space-y-6">
            <ProfileCard stats={stats || defaultStats} username={username || 'NA'} />
            <NavigationCard />
          </div>

          <div className="flex-1 space-y-6">
            <CalendarCard calendarData={calendarData || {}} />
            <div className="flex flex-col lg:flex-row justify-between space-y-6 lg:space-y-0 lg:space-x-6">
              <StatsSummaryCard
                totalSolved={stats?.totalSolved || defaultStats.totalSolved}
                totalActiveDays={stats?.totalActiveDays || defaultStats.totalActiveDays}
                ranking={stats?.ranking || defaultStats.ranking}
                contributionPoint={stats?.contributionPoint || defaultStats.contributionPoint}
                reputation={stats?.reputation || defaultStats.reputation}
              />
              <div className="w-full space-y-6">
                <SubmissionStats totalSubmissions={stats?.totalSubmissions || defaultStats.totalSubmissions} />
                <DifficultyStatsCard
                  easySolved={stats?.easySolved || defaultStats.easySolved}
                  totalEasy={stats?.totalEasy || defaultStats.totalEasy}
                  mediumSolved={stats?.mediumSolved || defaultStats.mediumSolved}
                  totalMedium={stats?.totalMedium || defaultStats.totalMedium}
                  hardSolved={stats?.hardSolved || defaultStats.hardSolved}
                  totalHard={stats?.totalHard || defaultStats.totalHard}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-6">
          <RecentSubmissions
            recentSubmissions={stats?.recentSubmissions || defaultStats.recentSubmissions}
          />
        </div>
      </div>
    </div>
  );
};

export default LeetCodeStats;
