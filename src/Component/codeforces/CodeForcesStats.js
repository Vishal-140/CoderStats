import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import ProfileCard from '../ProfileCard';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const getCodeforcesTotalSolved = (problemStats) => {
  // Add debugging
  console.log("problemStats received:", problemStats);
  
  if (!problemStats) {
    console.log("No problemStats provided");
    return 0;
  }
  
  const total = problemStats.easy + problemStats.medium + problemStats.hard;
  console.log("Calculated total:", total);
  return total;
};

function CodeForcesStats() {
  const [userData, setUserData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [ratingHistory, setRatingHistory] = useState([]);
  const [problemStats, setProblemStats] = useState({
    easy: 0,
    medium: 0,
    hard: 0
  });
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const username = "tourist"; // example username

  // Add this style object inside the component
  const heatmapStyle = {
    '.react-calendar-heatmap text': {
      fontSize: '12px',
      fill: '#aaa'
    },
    '.react-calendar-heatmap rect': {
      rx: '2',
      height: '11px',
      width: '11px'
    },
    '.react-calendar-heatmap .color-empty': {
      fill: '#1e293b'
    },
    '.react-calendar-heatmap .color-scale-1': {
      fill: '#0f766e'
    },
    '.react-calendar-heatmap .color-scale-2': {
      fill: '#14b8a6'
    },
    '.react-calendar-heatmap .color-scale-3': {
      fill: '#2dd4bf'
    },
    '.react-calendar-heatmap .color-scale-4': {
      fill: '#5eead4'
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch basic user info
        const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
        const userData = await userResponse.json();

        // Fetch user submissions
        const submissionsResponse = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
        const submissionsData = await submissionsResponse.json();

        // Fetch rating history
        const ratingResponse = await fetch(`https://codeforces.com/api/user.rating?handle=${username}`);
        const ratingData = await ratingResponse.json();

        if(userData.status === 'OK') {
          setUserData(userData.result[0]);
          
          // Process submissions
          const allSubmissions = submissionsData.result;
          setSubmissions(allSubmissions.slice(0, 10)); // Latest 10 submissions
          
          // Calculate problem stats
          const stats = calculateDifficultyBreakdown(allSubmissions);
          setProblemStats(stats);
          
          // Calculate streaks
          const streaks = calculateStreaks(allSubmissions);
          setStreakData(streaks);
          
          // Set rating history
          setRatingHistory(ratingData.result);
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [username]);

  // Helper function to calculate difficulty breakdown
  const calculateDifficultyBreakdown = (submissions) => {
    const solved = new Set();
    const difficulty = {
      easy: 0,
      medium: 0,
      hard: 0
    };

    submissions.forEach(sub => {
      if(sub.verdict === 'OK') {
        const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
        if(!solved.has(problemId)) {
          solved.add(problemId);
          const rating = sub.problem.rating || 0;
          if(rating < 1400) difficulty.easy++;
          else if(rating < 2000) difficulty.medium++;
          else difficulty.hard++;
        }
      }
    });
    return difficulty;
  };

  // Helper function to calculate streaks
  const calculateStreaks = (submissions) => {
    // Basic streak calculation
    const dates = submissions
      .filter(sub => sub.verdict === 'OK')
      .map(sub => new Date(sub.creationTimeSeconds * 1000).toDateString());
    
    const uniqueDates = [...new Set(dates)].sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let currentCount = 0;
    
    for(let i = 0; i < uniqueDates.length; i++) {
      const curr = new Date(uniqueDates[i]);
      const prev = new Date(uniqueDates[i - 1]);
      
      if(i === 0 || (curr - prev) / (1000 * 60 * 60 * 24) === 1) {
        currentCount++;
      } else {
        currentCount = 1;
      }
      
      longestStreak = Math.max(longestStreak, currentCount);
      if(i === uniqueDates.length - 1) {
        const today = new Date();
        const lastSubmission = new Date(uniqueDates[uniqueDates.length - 1]);
        if((today - lastSubmission) / (1000 * 60 * 60 * 24) <= 1) {
          currentStreak = currentCount;
        }
      }
    }
    
    return {
      currentStreak,
      longestStreak
    };
  };

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Rating Progress'
      }
    },
    scales: {
      x: {
        type: 'category',
        display: true,
        title: {
          display: true,
          text: 'Contest Date'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Rating'
        }
      }
    }
  };

  const chartData = {
    labels: ratingHistory.map(r => new Date(r.ratingUpdateTimeSeconds * 1000).toLocaleDateString()),
    datasets: [
      {
        label: 'Rating',
        data: ratingHistory.map(r => r.newRating),
        fill: false,
        borderColor: '#3B82F6',
        tension: 0.1
      }
    ]
  };

  // Helper function to process submission data for heatmap
  const getHeatmapData = () => {
    // Get date range for last 12 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    startDate.setDate(1); // Start from first day of the month
    
    // Create a map for submissions
    const submissionMap = new Map();
    
    // Process submissions
    submissions.forEach(sub => {
      const date = new Date(sub.creationTimeSeconds * 1000);
      const dateKey = date.toISOString().split('T')[0];
      
      if (date >= startDate && date <= endDate) {
        submissionMap.set(dateKey, (submissionMap.get(dateKey) || 0) + 1);
      }
    });
    
    // Generate complete date range with values
    const values = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      values.push({
        date: dateKey,
        count: submissionMap.get(dateKey) || 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return values;
  };

  // Pie chart configuration
  const pieData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [problemStats.easy, problemStats.medium, problemStats.hard],
        backgroundColor: ['#4ade80', '#facc15', '#f87171'],
        borderColor: ['#22c55e', '#eab308', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#fff',
          font: {
            size: 12
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  useEffect(() => {
    if (submissions.length > 0) {
      const stats = calculateDifficultyBreakdown(submissions);
      console.log("Calculated problemStats:", stats);
      setProblemStats(stats);
    }
  }, [submissions]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6 mt-20 bg-gray-800 text-white shadow-lg rounded-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">Codeforces Stats</h1>

      {error && <div className="text-center text-red-500 mb-4">{error}</div>}

      <div className="flex flex-col space-y-4 sm:space-y-6">
        <div className="flex flex-col lg:flex-row lg:space-x-4 xl:space-x-6">
          {/* Left Column */}
          <div className="w-full lg:w-1/4 space-y-4 sm:space-y-6">
            {/* Profile Card */}
            <ProfileCard/>

            {/* Problem Difficulty Breakdown */}
            <div className="bg-gray-700 rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold mb-4">Problem Difficulty</h4>
              
              {/* Pie Chart */}
              <div className="h-48 mb-6">
                <Pie data={pieData} options={pieOptions} />
              </div>
              
              {/* Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-green-400 text-sm">Easy</span>
                    <span className="text-green-400 text-sm">{problemStats.easy}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div 
                      className="bg-green-400 h-2.5 rounded-full" 
                      style={{ 
                        width: `${(problemStats.easy / (problemStats.easy + problemStats.medium + problemStats.hard)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-yellow-400 text-sm">Medium</span>
                    <span className="text-yellow-400 text-sm">{problemStats.medium}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-400 h-2.5 rounded-full" 
                      style={{ 
                        width: `${(problemStats.medium / (problemStats.easy + problemStats.medium + problemStats.hard)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-red-400 text-sm">Hard</span>
                    <span className="text-red-400 text-sm">{problemStats.hard}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div 
                      className="bg-red-400 h-2.5 rounded-full" 
                      style={{ 
                        width: `${(problemStats.hard / (problemStats.easy + problemStats.medium + problemStats.hard)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Total Problems */}
              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Problems</span>
                  <span className="text-gray-300 font-semibold">
                    {problemStats.easy + problemStats.medium + problemStats.hard}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            {/* Submission Calendar */}
            <div className="bg-gray-700 rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold mb-4">Submission Calendar</h4>
              <div className="overflow-x-auto py-4">
                <CalendarHeatmap
                  startDate={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)}
                  endDate={new Date()}
                  values={getHeatmapData()}
                  showWeekdayLabels={true}
                  weekdayLabels={['', 'Wed', '']}
                  gutterSize={4}
                  horizontal={true}
                  showMonthLabels={true}
                  monthLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
                  classForValue={(value) => {
                    if (!value || value.count === 0) return 'color-empty';
                    return `color-scale-${Math.min(value.count, 4)}`;
                  }}
                  style={heatmapStyle}
                />
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg shadow p-4">
                <h4 className="text-gray-400 text-sm">Total Solved</h4>
                <p className="text-2xl font-bold mt-1">
                  {problemStats.easy + problemStats.medium + problemStats.hard}
                </p>
              </div>
              
              <div className="bg-gray-700 rounded-lg shadow p-4">
                <h4 className="text-gray-400 text-sm">Rank</h4>
                <p className="text-2xl font-bold mt-1">{userData?.rank}</p>
              </div>
              <div className="bg-gray-700 rounded-lg shadow p-4">
                <h4 className="text-gray-400 text-sm">Contest Rating </h4>
                <p className="text-2xl font-bold mt-1">{userData?.rating}</p>
              </div>
              <div className="bg-gray-700 rounded-lg shadow p-4">
                <h4 className="text-gray-400 text-sm">Max Rating </h4>
                <p className="text-2xl font-bold mt-1">{userData?.maxRating}</p>
              </div>
              <div className="bg-gray-700 rounded-lg shadow p-4">
                <h4 className="text-gray-400 text-sm">Total Submissions</h4>
                <p className="text-2xl font-bold mt-1">{submissions.length}</p>
              </div>
              <div className="bg-gray-700 rounded-lg shadow p-4">
                <h4 className="text-gray-400 text-sm">Longest Streak</h4>
                <p className="text-2xl font-bold mt-1">{streakData.longestStreak}</p>
              </div>
              <div className="bg-gray-700 rounded-lg shadow p-4">
                <h4 className="text-gray-400 text-sm">Current Streak</h4>
                <p className="text-2xl font-bold mt-1">{streakData.currentStreak}</p>
              </div>
              

            </div>

            {/* Rating Progress Chart */}
            <div className="bg-gray-700 rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold mb-4">Rating Progress</h4>
              <div className="h-[350px]">
                <Line options={chartOptions} data={chartData} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-gray-700 rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold mb-4">Recent Submissions</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Problem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Verdict</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {submissions.slice(0, 10).map((sub, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{sub.problem.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${sub.verdict === 'OK' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                        {sub.verdict}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(sub.creationTimeSeconds * 1000).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeForcesStats;