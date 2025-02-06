import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, db } from '../auth/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import API from '../services/API';
import ProfileCard from '../profile/ProfileCard';
import CalendarCard from '../common/CalendarCard';
import DifficultyBreakdown from '../platformStats/gfg/DifficultyBreakdown';

const GFGStats = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const fetchGFGUsername = async () => {
          try {
            const userProfileRef = doc(db, "Users", user.uid);
            const userProfileSnapshot = await getDoc(userProfileRef);
            
            if (userProfileSnapshot.exists()) {
              const gfgUsername = userProfileSnapshot.data().gfg;
              if (gfgUsername) {
                const { data } = await axios.get(`${API.gfgAPI}${gfgUsername}`);
                setData(data);
              } else {
                console.error("GFG username not found in user profile.");
              }
            } else {
              console.error("User profile not found.");
            }
          } catch (error) {
            console.error("Error fetching data:", error);
            setError(error);
          }
        };
        fetchGFGUsername();
      }
    });

    return () => unsubscribe();
  }, []);

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
            <ProfileCard stats={stats} username={stats.username || 'NA'} error={error} />
            <DifficultyBreakdown stats={stats} />
          </div>

          <div className="flex-1 space-y-4">
            <CalendarCard />
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