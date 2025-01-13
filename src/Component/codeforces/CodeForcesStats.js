import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, db } from "../auth/Firebase";
import { doc, getDoc } from "firebase/firestore";
import API from '../auth/API';
import ProfileCard from '../ProfileCard';
import CalendarCard from '../CalendarCard';
import SubmissionDistribution from './SubmissionDistribution';
import RecentSubmissions from './RecentSubmissions';
import RatingProgress from './RatingProgress';

const defaultStats = {
  handle: 'Loading...',
  rank: 'Loading...',
  maxRank: 'Loading...',
  rating: 0,
  maxRating: 0,
  contribution: 0,
  totalSubmissions: 0,
  submissions: [],
  ratingHistory: []
};

const CodeForcesStats = () => {
  const [userData, setUserData] = useState(defaultStats);
  const [submissions, setSubmissions] = useState([]);
  const [ratingHistory, setRatingHistory] = useState([]);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);

  const calculateStats = (submissionsData) => {
    const solvedProblems = new Set(
      submissionsData?.filter(s => s.verdict === 'OK')?.map(s => s.problem.name)
    ).size;

    const successRate = submissionsData?.length > 0
      ? ((submissionsData.filter(s => s.verdict === 'OK').length / submissionsData.length) * 100).toFixed(1)
      : 0;

    return { solvedProblems, successRate };
  };

  const fetchData = async (user) => {
    try {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const cfUsername = docSnap.data().codeforces;
        setUsername(cfUsername);
        
        const [userResponse, ratingResponse, submissionsResponse] = await Promise.all([
          axios.get(`${API.CodeforcesAPI}${cfUsername}`),
          axios.get(`https://codeforces.com/api/user.rating?handle=${cfUsername}`),
          axios.get(`https://codeforces.com/api/user.status?handle=${cfUsername}`)
        ]);

        if (userResponse.data.status === 'FAILED') {
          throw new Error(userResponse.data.comment || 'Failed to fetch user data');
        }

        setUserData(userResponse.data.result[0]);
        setRatingHistory(ratingResponse.data.result.map(entry => ({
          contestName: entry.contestName,
          rating: entry.newRating,
          rank: entry.rank,
          timeSeconds: entry.ratingUpdateTimeSeconds
        })));
        setSubmissions(submissionsResponse.data.result);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching CodeForces data.');
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchData(user);
    });
    return () => unsubscribe();
  }, []);

  const { solvedProblems, successRate } = calculateStats(submissions);

  const StatCard = ({ title, value, className = "" }) => (
    <div className={`bg-gray-700 p-4 rounded-lg shadow ${className}`}>
      <div className="text-lg md:text-xl">{title}</div>
      <p className="text-2xl md:text-4xl font-bold mt-2">{value}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-20 bg-gray-800 text-white shadow-lg rounded-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">CodeForces Stats</h1>

      {error && <div className="text-center text-red-500 mb-6">{error}</div>}

      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard userData={userData} username={username || 'Loading...'} />
            <SubmissionDistribution submissions={submissions} />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <CalendarCard />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard title="Total Solved" value={solvedProblems} />
              <StatCard title="Global Rank" value={userData?.rank || 'Loading...'} />
              <StatCard title="Total Submissions" value={submissions.length || 0} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard title="Contribution" value={userData?.contribution || 0} />
              <StatCard title="Success Rate" value={`${successRate}%`} />
              <StatCard title="Max Rating" value={userData?.maxRating || 0} />
              <StatCard title="Contest Rating" value={userData?.rating || 0} />
            </div>

            <RatingProgress ratingHistory={ratingHistory} />
          </div>
        </div>

        <RecentSubmissions submissions={submissions} />
      </div>
    </div>
  );
};

export default CodeForcesStats;