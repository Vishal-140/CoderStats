import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart2 } from "react-feather";

const DifficultyBreakdown = ({ submissions }) => {
  // Calculate difficulty breakdown
  const calculateDifficulty = (submissionsData) => {
    const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
    const solvedProblems = new Set();

    submissionsData.forEach((submission) => {
      if (submission.verdict === "OK") {
        const { contestId, index, rating } = submission.problem;
        const problemId = `${contestId}-${index}`;

        if (!solvedProblems.has(problemId)) {
          solvedProblems.add(problemId);

          if (rating >= 800 && rating <= 1200) {
            difficultyCounts.easy += 1;
          } else if (rating >= 1300 && rating <= 2000) {
            difficultyCounts.medium += 1;
          } else if (rating > 2000) {
            difficultyCounts.hard += 1;
          }
        }
      }
    });

    return difficultyCounts;
  };

  const difficultyCounts = calculateDifficulty(submissions);
  const totalSubmissions =
    difficultyCounts.easy + difficultyCounts.medium + difficultyCounts.hard;

  const difficultyData = [
    { name: "Easy", value: difficultyCounts.easy, color: "#34D399" },
    { name: "Medium", value: difficultyCounts.medium, color: "#FBBF24" },
    { name: "Hard", value: difficultyCounts.hard, color: "#F87171" },
  ];

  return (
    <div className="bg-[#374151] p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart2 className="text-green-500" />
        Difficulty Breakdown
      </h3>
      <div className="grid grid-row-2 gap-4">
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
        <div className="h-64">
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

export default DifficultyBreakdown;
