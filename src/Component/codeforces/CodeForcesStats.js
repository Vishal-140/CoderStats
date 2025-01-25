import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, db } from '../auth/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import ProfileCard from '../ProfileCard';


const CodeForcesStats = () => {
  const [userData, setUserData] = useState(null);
  const [submissions, setSubmissions] = useState([]); // Default is empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null); 

  const defaultStats = {
      handle: 'NA',
      rank: 'NA',
      rating: 'NA',
      maxRank: 'NA',
      maxRating: 'NA',
      contribution: 'NA',
      problemsSolved: 'NA',
      totalSubmissions: 'NA',
      easy: 0,
      medium: 0,
      hard: 0
  };

  const defaultSubmissions = [
      { problem: { name: 'Problem 1' }, verdict: 'NO' },
      { problem: { name: 'Problem 2' }, verdict: 'NO' },
      { problem: { name: 'Problem 3' }, verdict: 'NO' },
      { problem: { name: 'Problem 4' }, verdict: 'NO' },
      { problem: { name: 'Problem 5' }, verdict: 'NO' }
  ];

  const fetchUserData = async (user) => {
      try {
          const docRef = doc(db, 'Users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().codeforces) {
              setUsername(docSnap.data().codeforces);
          }
      } catch (error) {
          console.error('Error:', error);
      }
  };

  const fetchAllData = async (handle) => {
      try {
          setLoading(true);
          console.log('Fetching data for:', handle);

          // Get user info
          const userInfoResponse = await axios.get(
              `https://codeforces.com/api/user.info?handles=${handle}`
          );

          // Get submissions
          const submissionsResponse = await axios.get(
              `https://codeforces.com/api/user.status?handle=${handle}`
          );

          const userInfo = userInfoResponse.data.result[0];
          const allSubmissions = submissionsResponse.data.result;

          // Calculate stats
          const acceptedSubmissions = allSubmissions.filter(sub => sub.verdict === 'OK');
          const uniqueProblems = new Set();
          const difficulties = { easy: 0, medium: 0, hard: 0 };

          acceptedSubmissions.forEach(sub => {
              const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
              if (!uniqueProblems.has(problemKey)) {
                  uniqueProblems.add(problemKey);
                  const rating = sub.problem.rating || 0;
                  if (rating <= 1200) difficulties.easy++;
                  else if (rating <= 2000) difficulties.medium++;
                  else difficulties.hard++;
              }
          });

          const processedData = {
              ...userInfo,
              problemsSolved: uniqueProblems.size,
              totalSubmissions: allSubmissions.length,
              easy: difficulties.easy,
              medium: difficulties.medium,
              hard: difficulties.hard
          };

          console.log('Processed data:', processedData);
          setUserData(processedData);
          setSubmissions(allSubmissions.slice(0, 5));
          setError(null);

      } catch (err) {
          console.error('Error:', err);
          setError('Failed to fetch data');
          setUserData(defaultStats);
          setSubmissions(defaultSubmissions); // Set default submissions on error
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    // Only fetch data once the username is available
    if (username) {
        fetchAllData(username);
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            fetchUserData(user);
        }
    });

    return () => unsubscribe();
}, [username]);


  const DifficultyBreakdown = ({ stats }) => (
      <div className="bg-gray-700 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-blue-300 mb-4">Difficulty Breakdown</h2>
          <div className="space-y-2">
              <div className="flex justify-between items-center">
                  <span>Easy (≤1200)</span>
                  <span className="bg-green-500 px-2 py-1 rounded">{stats.easy}</span>
              </div>
              <div className="flex justify-between items-center">
                  <span>Medium (≤2000)</span>
                  <span className="bg-yellow-500 px-2 py-1 rounded">{stats.medium}</span>
              </div>
              <div className="flex justify-between items-center">
                  <span>Hard ({'>'}2000)</span>
                  <span className="bg-red-500 px-2 py-1 rounded">{stats.hard}</span>
              </div>
          </div>
      </div>
  );

  const stats = userData || defaultStats;

  return (
      <div className="max-w-7xl mx-auto p-4 mt-20 bg-gray-800 text-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-8">Codeforces Dashboard</h1>

          <div className="flex flex-col space-y-4">
              <div className="flex flex-col lg:flex-row lg:space-x-4">
                  <div className="w-full lg:w-1/4 space-y-4">
                      <ProfileCard
                          stats={stats}
                          username={stats.handle || 'NA'}
                          error={error}
                          loading={loading}
                      />
                      <DifficultyBreakdown stats={stats} />
                  </div>

                  <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                              <h2 className="text-lg font-semibold text-blue-300 mb-2">Problems Solved</h2>
                              <p className="text-3xl font-bold">{stats.problemsSolved}</p>
                          </div>
                          <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                              <h2 className="text-lg font-semibold text-blue-300 mb-2">Current Rating</h2>
                              <p className="text-3xl font-bold">{stats.rating}</p>
                          </div>
                          <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                              <h2 className="text-lg font-semibold text-blue-300 mb-2">Max Rating</h2>
                              <p className="text-3xl font-bold">{stats.maxRating}</p>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                              <h2 className="text-lg font-semibold text-blue-300 mb-2">Current Rank</h2>
                              <p className="text-3xl font-bold">{stats.rank}</p>
                          </div>
                          <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                              <h2 className="text-lg font-semibold text-blue-300 mb-2">Max Rank</h2>
                              <p className="text-3xl font-bold">{stats.maxRank}</p>
                          </div>
                          <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                              <h2 className="text-lg font-semibold text-blue-300 mb-2">Contribution</h2>
                              <p className="text-3xl font-bold">{stats.contribution}</p>
                          </div>
                          <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                              <h2 className="text-lg font-semibold text-blue-300 mb-2">Total Submissions</h2>
                              <p className="text-3xl font-bold">{stats.totalSubmissions}</p>
                          </div>
                      </div>

                      <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                          <h2 className="text-lg font-semibold text-blue-300 mb-4">Recent Submissions</h2>
                          <div className="space-y-2">
                              {submissions.map((sub, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-600 rounded">
                                      <span>{sub.problem.name}</span>
                                      <span className={`px-2 py-1 rounded ${
                                          sub.verdict === 'OK' ? 'bg-green-500' : 'bg-red-500'
                                      }`}>
                                          {sub.verdict}
                                      </span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default CodeForcesStats;