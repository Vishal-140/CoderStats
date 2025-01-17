import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';
import { auth, db } from "../auth/Firebase";
import { doc, getDoc } from "firebase/firestore";
import API from '../auth/API';
import axios from 'axios';

const ProblemDifficultyBreakdown = () => {
  const [difficultyBreakdown, setDifficultyBreakdown] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [calendarData, setCalendarData] = useState({});
  const [stats, setStats] = useState(null);

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

  const fetchStats = async () => {
    if (!username) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`${API.CodeforcesStatusAPI}${username}`);
      
      if (!data || !data.result) {
        setError('No data available');
        setLoading(false);
        return;
      }

      setStats(data);
      calculateProblemDifficultyBreakdown(data.result);

      if (data.submissionCalendar) {
        const sixMonthsAgo = Date.now() - 180 * 24 * 60 * 60 * 1000;
        const filteredCalendarData = {};
        
        Object.entries(data.submissionCalendar).forEach(([timestamp, count]) => {
          const ts = parseInt(timestamp) * 1000;
          if (ts > sixMonthsAgo) {
            filteredCalendarData[timestamp] = count;
          }
        });
        
        setCalendarData(filteredCalendarData);
      }
    } catch (err) {
      console.error('Error Fetching Codeforces Data:', err);
      setError('Error fetching Codeforces data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchStats();
    }
  }, [username]);

  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        await fetchUserData(user);
        await fetchStats();
        
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchUserAndData();
    });

    return () => unsubscribe();
  }, []);

  const calculateProblemDifficultyBreakdown = (submissions) => {
    const solvedProblems = new Map();

    submissions.forEach((sub) => {
      if (sub.verdict === 'OK') {
        const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
        if (!solvedProblems.has(problemId)) {
          solvedProblems.set(problemId, sub.problem);
        }
      }
    });

    const breakdown = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    solvedProblems.forEach((problem) => {
      const rating = problem.rating || 0;
      if (rating <= 1300) breakdown.easy++;
      else if (rating <= 2000) breakdown.medium++;
      else breakdown.hard++;
    });

    setDifficultyBreakdown(breakdown);
  };

  const totalSubmissions = difficultyBreakdown.easy + difficultyBreakdown.medium + difficultyBreakdown.hard;
  const difficultyData = [
    { name: 'Easy', value: difficultyBreakdown.easy, color: '#10B981' },
    { name: 'Medium', value: difficultyBreakdown.medium, color: '#F59E0B' },
    { name: 'Hard', value: difficultyBreakdown.hard, color: '#EF4444' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-white" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center p-4">{error}</div>;
  }

  return (
    <div className="bg-[#374151] p-6 rounded-lg mb-8 mt-8">
      <h3 className="text-lg font-semibold mb-4  flex items-center gap-2">
        <BarChart2 className="text-green-500" />
        Difficulty Breakdown
      </h3>
      <div className="grid grid-rows-2 gap-4">
        {/* Progress Bars */}
        <div className="flex flex-col justify-center">
          {difficultyData.map((entry, index) => {
            const percentage =
              totalSubmissions > 0
                ? ((entry.value / totalSubmissions) * 100).toFixed(1)
                : 0;
  
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    {entry.name}
                  </span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: entry.color,
                      transition: "width 0.5s ease-in-out",
                    }}
                  />
                </div>
                <div className="text-sm text-gray-400">
                  {entry.value} problems
                </div>
              </div>
            );
          })}
        </div>
        {/* Pie Chart */}
        <div className="h-48"> {/* Reduced the height here */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "none",
                }}
                formatter={(value, name) => [`${value} problems`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
  
};

export default ProblemDifficultyBreakdown;
