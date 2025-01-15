import React, { useState, useEffect } from 'react';

const Streaks = () => {
  const [extendedStats, setExtendedStats] = useState({ currentStreak: 0, maxStreak: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStreaks = async () => {
      try {
        // Replace 'tourist' with the actual user handle.
        const response = await fetch('https://codeforces.com/api/user.rating?handle=tourist');
        const data = await response.json();

        if (data.status === 'OK') {
          const streakData = data.result.reduce(
            (acc, ratingInfo) => {
              const streak = ratingInfo.newRating === ratingInfo.oldRating ? acc.currentStreak + 1 : 1;
              const maxStreak = Math.max(acc.maxStreak, streak);

              return {
                currentStreak: streak,
                maxStreak,
              };
            },
            { currentStreak: 0, maxStreak: 0 }
          );
          setExtendedStats(streakData);
        } else {
          setError('Failed to fetch streak data');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchStreaks();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 h-full">
      <div className="bg-[#374151] rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4 text-white">Current Streak</h2>
        <p className="text-3xl font-bold text-blue-400">{extendedStats.currentStreak} days</p>
      </div>
      <div className="bg-[#374151] rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4 text-white">Longest Streak</h2>
        <p className="text-3xl font-bold text-green-400">{extendedStats.maxStreak} days</p>
      </div>
    </div>
  );
};

export default Streaks;
