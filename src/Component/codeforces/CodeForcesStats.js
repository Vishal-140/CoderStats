import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, db } from "../auth/Firebase";
import { doc, getDoc } from "firebase/firestore";
import API from '../auth/API';
import ProfileCard from '../ProfileCard';
import NavigationCard from '../NavigationCard';
import CalendarCard from '../CalendarCard';
import PerformanceStats from './PerformanceStats';
import ProblemStats from './ProblemStats';
import RatingProgress from './RatingProgress';
import SubmissionDistribution from './SubmissionDistribution';
import RecentSubmissions from './RecentSubmissions';

const CodeForcesStats = () => {
  const [userData, setUserData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [ratingHistory, setRatingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);

  // Default states for all data
  const defaultStats = {
    handle: 'NA',
    rank: 'NA',
    maxRank: 'NA',
    rating: 'NA',
    maxRating: 'NA',
    contribution: 'NA',
    friendOfCount: 'NA',
    lastOnline: 'NA',
    registrationTime: 'NA',
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    wrongSubmissions: 0,
    problemsSolved: 0,
    contestsParticipated: 0,
    submissions: [],
    ratingHistory: [],
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

  // Fetch stats from CodeForces API
  const fetchStats = async () => {
    if (!username) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch user info
      const userResponse = await axios.get(`${API.CodeforcesAPI}${username}`);
      if (userResponse.data.status === 'FAILED') {
        throw new Error(userResponse.data.comment || 'Failed to fetch user data');
      }
      setUserData(userResponse.data.result[0]);

      // Fetch rating history
      const ratingResponse = await axios.get(`https://codeforces.com/api/user.rating?handle=${username}`);
      const ratingData = ratingResponse.data.result.map(entry => ({
        contestName: entry.contestName,
        rating: entry.newRating,
        rank: entry.rank,
        timeSeconds: entry.ratingUpdateTimeSeconds
      }));
      setRatingHistory(ratingData);

      // Fetch submissions
      const submissionsResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`);
      const submissionsData = submissionsResponse.data.result;
      setSubmissions(submissionsData);

    } catch (err) {
      console.error('Error Fetching CodeForces Data:', err);
      setError('Error fetching CodeForces data.');
    } finally {
      setLoading(false);
    }
  };

  // Auth listener effect
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchUserData(user);
    });

    return () => unsubscribe();
  }, []);

  // Fetch stats when username changes
  useEffect(() => {
    if (username) fetchStats();
  }, [username]);

  return (
    <div className="max-w-7xl mx-auto p-6 mt-20 bg-gray-800 text-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-8">CodeForces Stats</h1>

      {error && <div className="text-center text-red-500 mb-6">{error}</div>}

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Left Column */}
          <div className="w-full lg:w-1/4 space-y-6">
            <ProfileCard 
              userData={userData || defaultStats}
              username={username || 'NA'}
            />
            <NavigationCard />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <CalendarCard />
            
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProblemStats 
                submissions={submissions || defaultStats.submissions}
              />
              
              <SubmissionDistribution 
                submissions={submissions || defaultStats.submissions}
              />
            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceStats 
                userData={userData || defaultStats}
                ratingHistory={ratingHistory || defaultStats.ratingHistory}
              />
              <RatingProgress 
                ratingHistory={ratingHistory || defaultStats.ratingHistory}
              />
            </div>
          </div>

          
        </div>

        <RecentSubmissions 
          submissions={submissions || defaultStats.submissions}
        />
      </div>
    </div>
  );
};

export default CodeForcesStats;