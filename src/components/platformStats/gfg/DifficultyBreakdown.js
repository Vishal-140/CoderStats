import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const DifficultyBreakdown = ({ stats }) => {
  // Return early if stats is undefined or null
  if (!stats) {
    return <div className="bg-gray-700 p-3 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-blue-300 mb-2">Problem Difficulty Breakdown</h2>
      <p className="text-center text-gray-400 py-4">No difficulty data available</p>
    </div>;
  }
  
  const difficulties = ["school", "basic", "easy", "medium", "hard"];
  const colors = ["#3B82F6", "#14B8A6", "#22C55E", "#EAB308", "#EF4444"];

  const extractNumber = (str) =>
    parseInt(str?.split("(")[1]?.split(")")[0] || "0");

  const difficultyData = difficulties.map((level, index) => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    value: extractNumber(stats[level]),
    color: colors[index],
  }));

  const totalProblems = difficultyData.reduce(
    (acc, curr) => acc + curr.value,
    0
  );

  return (
    <div className="bg-gray-700 p-3 rounded-lg shadow-md space-y-3">
      <h2 className="text-lg font-semibold text-blue-300 mb-2">
        Problem Difficulty Breakdown
      </h2>
  
      {/* Main Content: Progress Bars & Pie Chart */}
      <div className="flex flex-col space-y-4">
        {/* Progress Bars */}
        <div className="flex-1 space-y-2 p-4">
          {difficultyData.map((item, index) => {
            const percentage = ((item.value / totalProblems) * 100).toFixed(1);
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm font-medium">
                    {item.value} ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2 relative">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
  
        {/* Pie Chart */}
        <div className="flex items-center justify-center h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-gray-800 p-2 rounded shadow-lg border border-gray-700">
                        <p className="text-sm">
                          {data.name}: {data.value} (
                          {((data.value / totalProblems) * 100).toFixed(1)}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );  
};

export default DifficultyBreakdown;
