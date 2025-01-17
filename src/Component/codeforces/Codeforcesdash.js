import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

function CodeForcesStats() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Yahan par username ko hardcode kiya hai, aap ise input field se bhi le sakte hain
  const username = "tourist"; // example username

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
        const data = await response.json();
        
        if(data.status === 'OK') {
          setUserData(data.result[0]);
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>;
  
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!userData) return <div className="text-gray-500 text-center p-4">No data found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img 
            src={userData.titlePhoto} 
            alt={userData.handle} 
            className="w-32 h-32 rounded-full object-cover"
          />
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800">{userData.handle}</h3>
            <div className="mt-2 space-y-1">
              <p className="text-gray-600">Rank: <span className="font-semibold">{userData.rank}</span></p>
              <p className="text-gray-600">Rating: <span className="font-semibold">{userData.rating}</span></p>
              <p className="text-gray-600">Max Rating: <span className="font-semibold">{userData.maxRating}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-gray-500 text-sm font-medium">Total Problems Solved</h4>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {problemStats.easy + problemStats.medium + problemStats.hard}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-gray-500 text-sm font-medium">Total Submissions</h4>
          <p className="text-2xl font-bold text-gray-800 mt-2">{submissions.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-gray-500 text-sm font-medium">Current Streak</h4>
          <p className="text-2xl font-bold text-gray-800 mt-2">{streakData.currentStreak} days</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-gray-500 text-sm font-medium">Longest Streak</h4>
          <p className="text-2xl font-bold text-gray-800 mt-2">{streakData.longestStreak} days</p>
        </div>
      </div>

      {/* Problem Difficulty Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Problem Difficulty Breakdown</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-green-500">Easy</span>
              <span className="font-semibold">{problemStats.easy}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-500">Medium</span>
              <span className="font-semibold">{problemStats.medium}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-500">Hard</span>
              <span className="font-semibold">{problemStats.hard}</span>
            </div>
          </div>
        </div>

        {/* Rating Progress Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Rating Progress</h4>
          <Line 
            data={{
              labels: ratingHistory.map(r => new Date(r.ratingUpdateTimeSeconds * 1000).toLocaleDateString()),
              datasets: [{
                label: 'Rating',
                data: ratingHistory.map(r => r.newRating),
                fill: false,
                borderColor: '#3B82F6',
                tension: 0.1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
          />
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Submissions</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verdict</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((sub, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.problem.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${sub.verdict === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {sub.verdict}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sub.creationTimeSeconds * 1000).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Heatmap */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Submission Calendar</h4>
        <div className="overflow-x-auto">
          <CalendarHeatmap
            startDate={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)}
            endDate={new Date()}
            values={submissions.map(sub => ({
              date: new Date(sub.creationTimeSeconds * 1000),
              count: 1
            }))}
            classForValue={(value) => {
              if (!value) return 'color-empty';
              return `color-github-${Math.min(value.count, 4)}`;
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeForcesStats;