// RatingComponent.js
import React, { useState, useEffect } from 'react';

const RatingComponent = () => {
  const [currentRating, setCurrentRating] = useState('Unrated');
  const [maxRating, setMaxRating] = useState('N/A');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch('https://codeforces.com/api/user.info?handles=tourist');
        const data = await response.json();

        if (data.status === 'OK') {
          const user = data.result[0];
          setCurrentRating(user.rating || 'Unrated');
          setMaxRating(user.maxRating || 'N/A');
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  return (
    <div className="bg-[#374151] rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Rating</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-sm text-gray-400">Current Rating</p>
          <p className="text-2xl font-bold text-green-400">{currentRating}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-400">Max Rating</p>
          <p className="text-2xl font-bold text-green-400">{maxRating}</p>
        </div>
      </div>
    </div>
  );
};

export default RatingComponent;
