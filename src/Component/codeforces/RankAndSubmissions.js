// RankAndSubmissions.js
import React, { useState, useEffect } from 'react';

const RankAndSubmissions = () => {
  const [currentRank, setCurrentRank] = useState('N/A');
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://codeforces.com/api/user.info?handles=tourist');
        const data = await response.json();

        if (data.status === 'OK') {
          const user = data.result[0];
          setCurrentRank(user.rank); // Current Rank
          setTotalSubmissions(user.friendOfCount); // Total Submissions (or modify if different)
        } else {
          setError('Failed to fetch user data');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 h-full">
      {/* Rank Card */}
      <div className="bg-[#374151] rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4 text-white">Rank</h2>
        <p className="text-3xl font-bold text-blue-400">{currentRank}</p>
      </div>
      
      {/* Submissions Card */}
      <div className="bg-[#374151] rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4 text-white">Total Submissions</h2>
        <p className="text-3xl font-bold text-blue-400">{totalSubmissions}</p>
      </div>
    </div>
  );
  
  
};

export default RankAndSubmissions;
