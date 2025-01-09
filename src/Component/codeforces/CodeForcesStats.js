import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Trophy, Star, Target, BookOpen, Award, 
  TrendingUp, Users, Check, BarChart2 
} from 'lucide-react';

const CodeForcesDashboard = ({ username = "vishal140" }) => {
  const [userData, setUserData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [ratingHistory, setRatingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
        const userResult = await userResponse.json();
        setUserData(userResult.result[0]);

        const ratingResponse = await fetch(`https://codeforces.com/api/user.rating?handle=${username}`);
        const ratingResult = await ratingResponse.json();
        setRatingHistory(ratingResult.result.map(entry => ({
          contestName: entry.contestName,
          rating: entry.newRating,
          rank: entry.rank
        })));

        const statusResponse = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
        const statusResult = await statusResponse.json();
        setSubmissions(statusResult.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const getVerdict = (submissions) => {
    const verdicts = submissions.reduce((acc, sub) => {
      acc[sub.verdict] = (acc[sub.verdict] || 0) + 1;
      return acc;
    }, {});

    return [
      { name: 'Accepted', value: verdicts.OK || 0, color: '#22C55E' },
      { name: 'Wrong Answer', value: verdicts.WRONG_ANSWER || 0, color: '#EF4444' },
      { name: 'Time Limit', value: verdicts.TIME_LIMIT_EXCEEDED || 0, color: '#F59E0B' }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-blue-500 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img 
              src={userData?.titlePhoto || "/api/placeholder/100/100"} 
              alt="Profile" 
              className="w-16 h-16 rounded-full border-2 border-blue-500"
            />
            <div>
              <h1 className="text-2xl font-bold">{userData?.handle || username}</h1>
              <p className="text-gray-400">Rank: {userData?.rank || 'Unrated'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              <span>Max Rating: {userData?.maxRating || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-blue-500" />
              <span>Current: {userData?.rating || 0}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <Target className="text-green-500" />
              <h3>Contribution</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{userData?.contribution || 0}</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <BookOpen className="text-blue-500" />
              <h3>Problems Solved</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {new Set(submissions.filter(s => s.verdict === 'OK')
                .map(s => s.problem.name)).size}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <Award className="text-purple-500" />
              <h3>Contest Rating</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{userData?.rating || 0}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="text-yellow-500" />
              <h3>Global Rank</h3>
            </div>
            <p className="text-2xl font-bold mt-2">#{userData?.rank || 'NA'}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Rating History */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-blue-500" />
              Rating Progress
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="contestName" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Submission Statistics */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart2 className="text-green-500" />
              Submission Statistics
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getVerdict(submissions)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getVerdict(submissions).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    formatter={(value, name) => [`${value} submissions`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {getVerdict(submissions).map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Check className="text-green-500" />
            Recent Submissions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3">Problem</th>
                  <th className="pb-3">Verdict</th>
                  <th className="pb-3">Language</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {submissions.slice(0, 5).map((submission, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-3">{submission.problem.name}</td>
                    <td className={`py-3 ${
                      submission.verdict === 'OK' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {submission.verdict}
                    </td>
                    <td className="py-3">{submission.programmingLanguage}</td>
                    <td className="py-3">
                      {new Date(submission.creationTimeSeconds * 1000).toLocaleDateString()}
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
};

export default CodeForcesDashboard;