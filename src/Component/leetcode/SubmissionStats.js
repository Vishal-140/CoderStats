import React from 'react';
import { Trophy, Target, Clock, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const DifficultyBadge = ({ difficulty }) => {
  const colors = {
    Easy: 'bg-green-500',
    Medium: 'bg-yellow-500',
    Hard: 'bg-red-500'
  };

  return (
    <span className={`${colors[difficulty]} px-3 py-1 rounded-full text-xs font-semibold text-white`}>
      {difficulty}
    </span>
  );
};

const DifficultyStats = ({ submission }) => {
  const submissionRate = submission.submissions > 0 
    ? ((submission.count / submission.submissions) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <div className="flex items-center justify-between mb-3">
        <DifficultyBadge difficulty={submission.difficulty} />
        <div className="bg-gray-700 px-2 py-1 rounded-lg">
          <span className="text-sm text-green-400 font-medium">{submissionRate}%</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-700/50 p-2 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Trophy className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Solved</span>
          </div>
          <span className="text-lg font-bold text-white">{submission.count}</span>
        </div>
        <div className="bg-gray-700/50 p-2 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Attempts</span>
          </div>
          <span className="text-lg font-bold text-white">{submission.submissions}</span>
        </div>
      </div>
    </div>
  );
};

const SubmissionStats = () => {
  // Sample data - replace with actual data
  const totalSubmissions = [
    { difficulty: 'Easy', count: 25, submissions: 30 },
    { difficulty: 'Medium', count: 15, submissions: 25 },
    { difficulty: 'Hard', count: 5, submissions: 15 }
  ];

  const totalSolved = totalSubmissions.reduce((acc, curr) => acc + curr.count, 0);
  const totalAttempts = totalSubmissions.reduce((acc, curr) => acc + curr.submissions, 0);
  const successRate = totalAttempts > 0 ? ((totalSolved / totalAttempts) * 100).toFixed(1) : '0.0';

  // Prepare data for bar chart
  const chartData = totalSubmissions.map(item => ({
    name: item.difficulty,
    Solved: item.count,
    Attempts: item.submissions,
  }));

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-xl w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Submission Stats</h2>
          <p className="text-sm text-gray-400">Track your coding progress</p>
        </div>
        <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-gray-400 text-sm">Success Rate:</span>
          <span className="text-lg font-bold text-white">{successRate}%</span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-1/3">
          {totalSubmissions.map((submission, index) => (
            <DifficultyStats key={index} submission={submission} />
          ))}
        </div>
        <div className="w-2/3 bg-gray-800 p-4 rounded-lg">
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
              labelStyle={{ color: 'white' }}
            />
            <Bar dataKey="Solved" fill="#4ade80" />
            <Bar dataKey="Attempts" fill="#60a5fa" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default SubmissionStats;