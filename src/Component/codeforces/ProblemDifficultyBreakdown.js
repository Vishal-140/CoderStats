import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';

const ProblemDifficultyBreakdown = () => {
  const [difficultyBreakdown, setDifficultyBreakdown] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissionsResponse = await fetch(
          'https://codeforces.com/api/user.status?handle=tourist&from=1&count=1000'
        );
        const submissionsData = await submissionsResponse.json();

        if (submissionsData.status === 'OK') {
          calculateProblemDifficultyBreakdown(submissionsData.result);
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateProblemDifficultyBreakdown = (submissions) => {
    const solvedProblems = new Set();

    submissions.forEach((sub) => {
      if (sub.verdict === 'OK') {
        solvedProblems.add(`${sub.problem.contestId}-${sub.problem.index}`);
      }
    });

    const breakdown = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    solvedProblems.forEach((problemId) => {
      const problem = submissions.find(
        (sub) => `${sub.problem.contestId}-${sub.problem.index}` === problemId
      ).problem;

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
