import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, db } from "../auth/Firebase";
import { doc, getDoc } from "firebase/firestore";
import API from '../auth/API';
import ProfileCard from '../ProfileCard';
import RecentSubmissions from './RecentSubmissions';
import SubmissionStats from './SubmissionStats';
import CalendarCard from '../CalendarCard';
import StatsSummaryCard from './StatsSummaryCard';
import DifficultyStatsCard from './DifficultyStatsCard';
import NavigationCard from '../NavigationCard';

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

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6 mt-20 bg-gray-800 text-white shadow-lg rounded-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">LeetCode Stats</h1>

      {error && <div className="text-center text-red-500 mb-4">{error}</div>}

      <div className="flex flex-col space-y-4 sm:space-y-6">
        <div className="flex flex-col lg:flex-row lg:space-x-4 xl:space-x-6">
          {/* Left Column */}
          <div className="w-full lg:w-1/4 space-y-4 sm:space-y-6">
            <div className="overflow-hidden">
              <ProfileCard stats={stats || defaultStats} username={username || 'NA'} />
            </div>
            <div className="overflow-hidden">
                  <SubmissionStats 
                    totalSubmissions={stats?.totalSubmissions || defaultStats.totalSubmissions} 
                  />
                </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            <div className="overflow-hidden">
              <CalendarCard calendarData={calendarData || {}} />
            </div>
            
            {/* Stats Cards Row */}
            <div className="flex flex-col lg:flex-row lg:space-x-4 xl:space-x-6 space-y-4 lg:space-y-0">
              <div className="w-full lg:w-full overflow-hidden">
                <StatsSummaryCard
                  totalSolved={stats?.totalSolved || defaultStats.totalSolved}
                  totalActiveDays={stats?.totalActiveDays || defaultStats.totalActiveDays}
                  ranking={stats?.ranking || defaultStats.ranking}
                  contributionPoint={stats?.contributionPoint || defaultStats.contributionPoint}
                  reputation={stats?.reputation || defaultStats.reputation}
                />
              </div>
              
            </div>
            <div className="overflow-hidden">
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

        {/* Recent Submissions */}
        <div className="w-full overflow-hidden">
          <RecentSubmissions
            recentSubmissions={stats?.recentSubmissions || defaultStats.recentSubmissions}
          />
        </div>
      </div>
    </div>
  );
};

export default LeetCodeStats;