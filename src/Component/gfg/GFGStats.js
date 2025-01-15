import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, db } from '../auth/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import API from '../auth/API';
import ProfileCard from '../ProfileCard';
import CalendarCard from '../CalendarCard';
import DifficultyBreakdown from './DifficultyBreakdown';

const GFGStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const [calendarData, setCalendarData] = useState({});

  const defaultStats = {
    username: 'NA',
    globalRank: 'NA',
    countryRank: 'NA',
    codingScore: 'NA',
    codingStats: {
      problemsSolved: 'NA',
      submissions: 'NA',
    },
    streak: 'NA',
    contestRating: 'NA',
    school: '0',
    basic: '0',
    easy: '0',
    medium: '0',
    hard: '0',
  };

  const fetchUserData = async (user) => {
    try {
      const docRef = doc(db, 'Users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsername(docSnap.data().gfg);
      }
    } catch (error) {
      console.error('Error fetching user data from Firestore:', error.message);
    }
  };

  const fetchStats = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const { data: gfgData } = await axios.get(`${API.gfgAPI}${username}`);
      setData(gfgData);

      if (gfgData?.submissionCalendar) {
        const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;
        const filteredCalendarData = Object.entries(gfgData.submissionCalendar)
          .filter(([timestamp]) => parseInt(timestamp) * 1000 > sixMonthsAgo)
          .reduce((acc, [timestamp, count]) => {
            acc[parseInt(timestamp) / 1000] = count;
            return acc;
          }, {});
        setCalendarData(filteredCalendarData);
      }
    } catch (err) {
      console.error('Error Fetching GFG Data:', err);
      setError('Error fetching GFG data.');
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

  const renderMetricsCard = (title, value) => (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-blue-300 mb-2">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );

  const stats = data || defaultStats;
  
  return (
    <div className="max-w-7xl mx-auto p-4 mt-20 bg-gray-800 text-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center">GeeksforGeeks Dashboard</h1>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="w-full lg:w-1/4 space-y-4">
            <ProfileCard
              stats={stats}
              username={stats.username || 'NA'}
              error={error}
              loading={loading}
            />
            <DifficultyBreakdown stats={stats} />
          </div>

          <div className="flex-1 space-y-4">
            <CalendarCard calendarData={calendarData} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderMetricsCard('Total Questions', stats.codingStats.problemsSolved)}
              {renderMetricsCard('Global Rank', stats.globalRank)}
              {renderMetricsCard('Country Rank', stats.countryRank)}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {renderMetricsCard('Coding Score', stats.codingScore)}
              {renderMetricsCard('Streak', stats.streak)}
              {renderMetricsCard('Contest Rating', stats.contestRating)}
              {renderMetricsCard('Submissions', stats.codingStats.submissions)}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default GFGStats;