import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const DifficultyBreakdownCard = ({ platformData = {}, usernames = {} }) => {
  const getDifficultyTotals = () => {
    const totals = {
      school: 0,
      basic: 0,
      easy: 0,
      medium: 0,
      hard: 0,
    };

    const parseGFGCount = (field) => {
      return Number(platformData.gfg?.[field]?.split("(")?.[1]?.split(")")?.[0] || 0);
    };

    if (platformData.leetcode) {
      totals.easy += Number(platformData.leetcode.easySolved || 0);
      totals.medium += Number(platformData.leetcode.mediumSolved || 0);
      totals.hard += Number(platformData.leetcode.hardSolved || 0);
    }

    if (platformData.gfg) {
      totals.school += parseGFGCount("school");
      totals.basic += parseGFGCount("basic");
      totals.easy += parseGFGCount("easy");
      totals.medium += parseGFGCount("medium");
      totals.hard += parseGFGCount("hard");
    }

    if (platformData.codeforces) {
      totals.easy += Number(platformData.codeforces.easy || 0);
      totals.medium += Number(platformData.codeforces.medium || 0);
      totals.hard += Number(platformData.codeforces.hard || 0);
    }

    return totals;
  };

  const getColorForDifficulty = (difficulty) => {
    const colors = {
      school: { bg: "bg-blue-500", text: "text-blue-500" },
      basic: { bg: "bg-teal-500", text: "text-teal-500" },
      easy: { bg: "bg-green-500", text: "text-green-500" },
      medium: { bg: "bg-yellow-500", text: "text-yellow-500" },
      hard: { bg: "bg-red-500", text: "text-red-500" }
    };
    return colors[difficulty] || colors.easy;
  };

  const renderProgressBar = (label, value, total, difficulty) => {
    const percentage = ((value / total) * 100 || 0).toFixed(1);
    const { bg, text } = getColorForDifficulty(label.toLowerCase());
    
    return (
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-200">{label}</span>
          <span className={`text-xs font-medium ${text}`}>
            {value || "0"} ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className={`${bg} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const totals = getDifficultyTotals();
  const totalProblems = Object.values(totals).reduce((sum, val) => sum + val, 0);

  const pieChartColors = {
    school: "#3B82F6",
    basic: "#14B8A6",
    easy: "#22C55E",
    medium: "#EAB308",
    hard: "#EF4444",
  };

  return (
    <div className="w-full max-w-full p-4 bg-[#374151] rounded-xl shadow-lg">
      {Object.values(usernames).some((username) => username) && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            Problem Difficulty Breakdown
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {usernames.leetcode && (
              <div className="bg-[#4B5563] p-3 rounded-lg">
                <h3 className="text-base font-semibold text-white mb-3">
                  LeetCode
                </h3>
                <div className="space-y-3">
                  {renderProgressBar(
                    "Easy",
                    platformData.leetcode?.easySolved,
                    platformData.leetcode?.totalSolved || 1,
                    "easy"
                  )}
                  {renderProgressBar(
                    "Medium",
                    platformData.leetcode?.mediumSolved,
                    platformData.leetcode?.totalSolved || 1,
                    "medium"
                  )}
                  {renderProgressBar(
                    "Hard",
                    platformData.leetcode?.hardSolved,
                    platformData.leetcode?.totalSolved || 1,
                    "hard"
                  )}
                </div>
              </div>
            )}

            {usernames.gfg && (
              <div className="bg-[#4B5563] p-3 rounded-lg">
                <h3 className="text-base font-semibold text-white mb-3">
                  GeeksForGeeks
                </h3>
                <div className="space-y-3">
                  {["school", "basic", "easy", "medium", "hard"].map((level) =>
                    renderProgressBar(
                      level.charAt(0).toUpperCase() + level.slice(1),
                      totals[level],
                      platformData.gfg?.codingStats?.problemsSolved || 1,
                      level
                    )
                  )}
                </div>
              </div>
            )}

            {usernames.codeforces && (
              <div className="bg-[#4B5563] p-3 rounded-lg">
                <h3 className="text-base font-semibold text-white mb-3">
                  Codeforces
                </h3>
                <div className="space-y-3">
                  {["easy", "medium", "hard"].map((level) =>
                    renderProgressBar(
                      level.charAt(0).toUpperCase() + level.slice(1),
                      platformData.codeforces?.[level] || 0,
                      platformData.codeforces?.problemCount || 1,
                      level
                    )
                  )}
                </div>
              </div>
            )}

            <div className="bg-[#4B5563] p-3 rounded-lg">
              <h3 className="text-base font-semibold text-white mb-3">
                Total by Difficulty
              </h3>
              <div className="w-full h-48 flex justify-center items-center">
                <PieChart width={180} height={160}>
                  <Pie
                    data={Object.entries(totals).map(([key, value]) => ({
                      name: key.charAt(0).toUpperCase() + key.slice(1),
                      value,
                    }))}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    outerRadius={55}
                    dataKey="value"
                  >
                    {Object.keys(totals).map((key) => (
                      <Cell key={key} fill={pieChartColors[key]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} (${((value / totalProblems) * 100).toFixed(1)}%)`,
                      name
                    ]}
                    contentStyle={{ 
                      background: "#1F2937", 
                      border: "none", 
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem"
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={38}
                    wrapperStyle={{ 
                      fontSize: "0.75rem",
                      color: "#fff",
                      paddingTop: "0.5rem"
                    }}
                  />
                </PieChart>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DifficultyBreakdownCard;