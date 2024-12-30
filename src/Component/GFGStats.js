import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GFGStats = () => {
  const [data, setData] = useState(null); // State to store the fetched data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track any errors

  useEffect(() => {
    // Fetch data when the component mounts
    axios
      .get('https://geeksforgeeksapi.vercel.app/api/gfg?username=vishalkumarchaurasia')
      .then((response) => {
        setData(response.data); // Store the fetched data
        setLoading(false); // Set loading to false
      })
      .catch((error) => {
        setError('Failed to fetch data'); // Handle errors
        setLoading(false);
      });
  }, []); // Empty array means this effect runs only once when the component mounts

  if (loading) return <div className="text-center text-lg">Loading...</div>; // Show loading message
  if (error) return <div className="text-center text-red-500">{error}</div>; // Show error message

  // Display the data once it is loaded
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white shadow-lg rounded-lg space-y-8">
      <h1 className="text-4xl font-bold text-center text-blue-400">GeeksforGeeks Stats</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-300">Profile Information</h2>
          <p><strong>Username:</strong> {data.username}</p>
          <p><strong>Global Rank:</strong> {data.globalRank}</p>
          <p><strong>Country Rank:</strong> {data.countryRank}</p>
          <p><strong>Coding Score:</strong> {data.codingScore}</p>
        </div>

        {/* Coding Stats */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-300">Coding Stats</h2>
          <p><strong>Problems Solved:</strong> {data.codingStats.problemsSolved}</p>
          <p><strong>Submissions:</strong> {data.codingStats.submissions}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Streak */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-300">Streak</h2>
          <p><strong>Streak:</strong> {data.streak}</p>
        </div>

        {/* Contest Rating */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-300">Contest Rating</h2>
          <p><strong>Contest Rating:</strong> {data.contestRating}</p>
        </div>
      </div>

      <div className="bg-gray-700 p-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-blue-300">Problem Difficulty Breakdown</h2>
  <p><strong>School:</strong> {parseInt(data.school.match(/\d+/)) || 0}</p>
  <p><strong>Basic:</strong> {parseInt(data.basic.match(/\d+/)) || 0}</p>
  <p><strong>Easy:</strong> {parseInt(data.easy.match(/\d+/)) || 0}</p>
  <p><strong>Medium:</strong> {parseInt(data.medium.match(/\d+/)) || 0}</p>
  <p><strong>Hard:</strong> {parseInt(data.hard.match(/\d+/)) || 0}</p>
</div>

    </div>
  );
};

export default GFGStats;
