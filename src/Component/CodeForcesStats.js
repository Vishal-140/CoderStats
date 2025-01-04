import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, db } from './Firebase';
import { doc, getDoc } from "firebase/firestore";
import ProfileCard from './ProfileCard';  
import NavigationCard from './NavigationCard';  
import CalendarCard from './CalendarCard';
import API from './API'; 

const CodeForcesStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [calendarData, setCalendarData] = useState({}); // State for calendar data

  const defaultStats = {
    problemCount: '00',
    contributedProblems: '00',
    rating: '00',
    maxRating: '00',
    ratingHistory: [],
    friendOf: [],
    easy: '00',
    medium: '00',
    hard: '00',
  };

  // Fetch user data from Firestore
  const fetchUserData = async (user) => {
    try {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsername(docSnap.data().codeforces);
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error.message);
    }
  };

  // Fetch stats from the Codeforces API
  const fetchStats = async () => {
    if (!username) return;
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get(`${API.CodeforcesAPI}${username}`);
      const result = response.data?.result; // Ensure result exists
      if (Array.isArray(result) && result.length > 0) {
        setData(result[0]); // Safely access the first element
      } else {
        throw new Error('No data found for the given username.');
      }
    } catch (err) {
      console.error('Error Fetching Codeforces Data:', err);
      setError(err.message || 'Error fetching Codeforces data.');
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

  const getValue = (value, defaultValue = '00') => {
    return value !== null && value !== undefined ? value : defaultValue;
  };

  // Default stats to be shown while loading
  const displayData = loading ? defaultStats : data || defaultStats;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-800 text-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">CodeForces Stats</h1>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Left Sidebar: Profile and Navigation */}
          <div className="w-full lg:w-1/4 space-y-6">
            <ProfileCard stats={displayData} username={username || 'NA'} />
            <NavigationCard />
          </div>
  
          {/* Right Side: Calendar and Stats */}
          <div className="flex-1 space-y-6">
            {/* Calendar Card */}
              <CalendarCard calendarData={calendarData || {}} />
            
            <div className="flex justify-between gap-6">
              {/* Coding Stats Card */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full lg:w-1/3">
                <h2 className="text-xl font-semibold text-blue-300">Coding Stats</h2>
                <p><strong>Problems Solved:</strong> {getValue(displayData.problemCount)}</p>
                <p><strong>Contributed Problems:</strong> {getValue(displayData.contributedProblems)}</p>
              </div>
  
              {/* Contest Rating Card */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full lg:w-1/3">
                <h2 className="text-xl font-semibold text-blue-300">Contest Rating</h2>
                <p><strong>Contest Rating:</strong> {getValue(displayData.rating)}</p>
                <p><strong>Max Contest Rating:</strong> {getValue(displayData.maxRating)}</p>
              </div>
  
              {/* Recent Actions Card */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full lg:w-1/3">
                <h2 className="text-xl font-semibold text-blue-300">Recent Actions</h2>
                <p><strong>Recent Rating Changes:</strong> {getValue(displayData.ratingHistory?.[0]?.newRating)}</p>
              </div>
            </div>
  
            <div className="flex justify-between gap-2">
              {/* Friends List Card */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full sm:w-1/4">
                <h2 className="text-xl font-semibold text-blue-300">Friends List</h2>
                {Array.isArray(displayData.friendOf) && displayData.friendOf.length ? (
                  <ul>
                    {displayData.friendOf.map((friend, index) => (
                      <li key={index}><strong>{friend.handle}</strong></li>
                    ))}
                  </ul>
                ) : (
                  <p>No friends found.</p>
                )}
              </div>
  
              {/* Problem Difficulty Breakdown Cards */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full sm:w-1/4">
                <h2 className="text-xl font-semibold text-blue-300">Easy Problems</h2>
                <p><strong>Easy:</strong> {getValue(displayData.easy)}</p>
              </div>
  
              <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full sm:w-1/4">
                <h2 className="text-xl font-semibold text-blue-300">Medium Problems</h2>
                <p><strong>Medium:</strong> {getValue(displayData.medium)}</p>
              </div>
  
              <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full sm:w-1/4">
                <h2 className="text-xl font-semibold text-blue-300">Hard Problems</h2>
                <p><strong>Hard:</strong> {getValue(displayData.hard)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default CodeForcesStats;