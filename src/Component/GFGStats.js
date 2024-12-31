import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileCard from './ProfileCard';
import CalendarCard from './CalendarCard';
import { auth, db } from './Firebase';
import { doc, getDoc } from 'firebase/firestore';
import API from './API'; // Import the API.js to access the URLs

const GFGStats = () => {
  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [username, setUsername] = useState(null); // State for GFG username
  const [calendarData, setCalendarData] = useState({}); // State for calendar data

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

  // Fetch user data from Firestore
  const fetchUserData = async (user) => {
    try {
      const docRef = doc(db, 'Users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsername(docSnap.data().gfg); // Set GFG username from Firestore
      }
    } catch (error) {
      console.error('Error fetching user data from Firestore:', error.message);
    }
  };

  // Fetch stats from the GFG API
  const fetchStats = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const { data: gfgData } = await axios.get(`${API.gfgAPI}${username}`);
      setData(gfgData); // Store the fetched GFG data

      if (gfgData?.submissionCalendar) {
        const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;
        const filteredCalendarData = Object.entries(gfgData.submissionCalendar)
          .filter(([timestamp]) => parseInt(timestamp) * 1000 > sixMonthsAgo)
          .reduce((acc, [timestamp, count]) => {
            acc[parseInt(timestamp) / 1000] = count;
            return acc;
          }, {});
        setCalendarData(filteredCalendarData); // Store calendar data
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

  // Default loading or error messages
  if (loading) {
    // Return default data while loading
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-800 text-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">GeeksforGeeks Stats</h1>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Left Sidebar: Profile and Navigation */}
            <div className="w-full lg:w-1/4 space-y-6">
              <ProfileCard stats={defaultStats} username={defaultStats.username} />
              <div className="space-y-6">
                <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-blue-300">Problem Difficulty Breakdown</h2>
                  <p><strong className="text-xl">School:</strong> <span className="text-[30px] font-bold">{defaultStats.school}</span></p>
                  <p><strong className="text-xl">Basic:</strong> <span className="text-[30px] font-bold">{defaultStats.basic}</span></p>
                  <p><strong className="text-xl">Easy:</strong> <span className="text-[30px] font-bold">{defaultStats.easy}</span></p>
                  <p><strong className="text-xl">Medium:</strong> <span className="text-[30px] font-bold">{defaultStats.medium}</span></p>
                  <p><strong className="text-xl">Hard:</strong> <span className="text-[30px] font-bold">{defaultStats.hard}</span></p>
                </div>
              </div>
            </div>

            {/* Right Side: Calendar and Stats */}
            <div className="flex-1 space-y-6">
              <CalendarCard calendarData={calendarData || {}} />
              <div className="flex justify-between gap-6">
                <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full lg:w-1/3">
                  <h2 className="text-xl font-semibold text-blue-300">Total Questions</h2>
                  <p className="text-[40px] font-bold">{defaultStats.codingStats.problemsSolved}</p>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full lg:w-1/3">
                  <h2 className="text-xl font-semibold text-blue-300">Global Rank</h2>
                  <p className="text-[40px] font-bold">{defaultStats.globalRank}</p>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full lg:w-1/3">
                  <h2 className="text-xl font-semibold text-blue-300">Country Rank</h2>
                  <p className="text-[40px] font-bold">{defaultStats.countryRank}</p>
                </div>
              </div>

              <div className="flex justify-between gap-2">
                <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full sm:w-1/4">
                  <h2 className="text-xl font-semibold text-blue-300">Coding Score</h2>
                  <p className="text-[40px] font-bold">{defaultStats.codingScore}</p>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full sm:w-1/4">
                  <h2 className="text-xl font-semibold text-blue-300">Streak</h2>
                  <p className="text-[40px] font-bold">{defaultStats.streak}</p>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full sm:w-1/4">
                  <h2 className="text-xl font-semibold text-blue-300">Contest Rating</h2>
                  <p className="text-[40px] font-bold">{defaultStats.contestRating}</p>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full sm:w-1/4">
                  <h2 className="text-xl font-semibold text-blue-300">Submissions</h2>
                  <p className="text-[40px] font-bold">{defaultStats.codingStats.submissions}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="flex justify-center items-center">
      <div className="text-center text-red-500">{error}</div>
    </div>
  );

  // Render actual data once it's fetched
  const { 
    username: userName = 'NA', 
    globalRank = 'NA', 
    countryRank = 'NA', 
    codingScore = 'NA', 
    codingStats = { problemsSolved: 'NA', submissions: 'NA' },
    streak = 'NA', 
    contestRating = 'NA', 
    school = '0', 
    basic = '0', 
    easy = '0', 
    medium = '0', 
    hard = '0'
  } = data || defaultStats;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-800 text-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">GeeksforGeeks Stats</h1>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Left Sidebar: Profile and Navigation */}
          <div className="w-full lg:w-1/4 space-y-6">
            <ProfileCard stats={data || defaultStats} username={userName || 'NA'} />
            <div className="space-y-6">
              <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-blue-300">Problem Difficulty Breakdown</h2>
                <p><strong className="text-xl">School:</strong> <span className="text-[25px] font-bold">{school.split('(')[1]?.split(')')[0]}</span></p>
                <p><strong className="text-xl">Basic:</strong> <span className="text-[25px] font-bold">{basic.split('(')[1]?.split(')')[0]}</span></p>
                <p><strong className="text-xl">Easy:</strong> <span className="text-[25px] font-bold">{easy.split('(')[1]?.split(')')[0]}</span></p>
                <p><strong className="text-xl">Medium:</strong> <span className="text-[25px] font-bold">{medium.split('(')[1]?.split(')')[0]}</span></p>
                <p><strong className="text-xl">Hard:</strong> <span className="text-[25px] font-bold">{hard.split('(')[1]?.split(')')[0]}</span></p>
              </div>
            </div>
          </div>

          {/* Right Side: Calendar and Stats */}
          <div className="flex-1 space-y-6">
            <CalendarCard calendarData={calendarData || {}} />
            <div className="flex justify-between gap-6">
              <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full lg:w-1/3">
                <h2 className="text-xl font-semibold text-blue-300">Total Questions</h2>
                <p className="text-[40px] font-bold">{codingStats.problemsSolved}</p>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full lg:w-1/3">
                <h2 className="text-xl font-semibold text-blue-300">Global Rank</h2>
                <p className="text-[40px] font-bold">{globalRank}</p>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full lg:w-1/3">
                <h2 className="text-xl font-semibold text-blue-300">Country Rank</h2>
                <p className="text-[40px] font-bold">{countryRank}</p>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full sm:w-1/4">
                <h2 className="text-xl font-semibold text-blue-300">Coding Score</h2>
                <p className="text-[40px] font-bold">{codingScore}</p>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full sm:w-1/4">
                <h2 className="text-xl font-semibold text-blue-300">Streak</h2>
                <p className="text-[40px] font-bold">{streak}</p>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full sm:w-1/4">
                <h2 className="text-xl font-semibold text-blue-300">Contest Rating</h2>
                <p className="text-[40px] font-bold">{contestRating}</p>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full sm:w-1/4">
                <h2 className="text-xl font-semibold text-blue-300">Submissions</h2>
                <p className="text-[40px] font-bold">{codingStats.submissions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GFGStats;
