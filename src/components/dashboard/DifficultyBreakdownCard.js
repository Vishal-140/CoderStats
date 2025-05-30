import React, { memo, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DifficultyBreakdownCard = memo(({ platformData = {}, usernames = {}, platformErrors = {} }) => {
  // Improved GFG data parsing with proper error handling
  const parseGFGCount = useCallback((field) => {
    try {
      // Check if the field exists and has the expected format
      const fieldValue = platformData.gfg?.[field];
      if (!fieldValue) return 0;
      
      // Extract the number inside parentheses, e.g., 'Basic (141)'
      const match = fieldValue.match(/\((\d+)\)/);
      return match && match[1] ? Number(match[1]) : 0;
    } catch (err) {
      console.error(`Error parsing GFG ${field} count:`, err);
      return 0;
    }
  }, [platformData.gfg]);

  const getDifficultyTotals = useCallback(() => {
    const totals = {
      school: 0,
      basic: 0,
      easy: 0,
      medium: 0,
      hard: 0,
    };

    if (platformData.leetcode) {
      totals.easy += Number(platformData.leetcode.easySolved || 0);
      totals.medium += Number(platformData.leetcode.mediumSolved || 0);
      totals.hard += Number(platformData.leetcode.hardSolved || 0);
    }

    if (platformData.gfg) {
      // Make sure we're using the correct parsing function for GFG counts
      const schoolCount = parseGFGCount("school");
      const basicCount = parseGFGCount("basic");
      const easyCount = parseGFGCount("easy");
      const mediumCount = parseGFGCount("medium");
      const hardCount = parseGFGCount("hard");
      
      totals.school += schoolCount;
      totals.basic += basicCount;
      totals.easy += easyCount;
      totals.medium += mediumCount;
      totals.hard += hardCount;
    }

    if (platformData.codeforces) {
      totals.easy += Number(platformData.codeforces.difficultyBreakdown?.Easy || 0);
      totals.medium += Number(platformData.codeforces.difficultyBreakdown?.Medium || 0);
      totals.hard += Number(platformData.codeforces.difficultyBreakdown?.Hard || 0);
    }

    return totals;
  }, [platformData, parseGFGCount]);

  const getColorForDifficulty = useCallback((difficulty) => {
    const colors = {
      school: { bg: "bg-blue-500", text: "text-blue-500" },
      basic: { bg: "bg-teal-500", text: "text-teal-500" },
      easy: { bg: "bg-green-500", text: "text-green-500" },
      medium: { bg: "bg-yellow-500", text: "text-yellow-500" },
      hard: { bg: "bg-red-500", text: "text-red-500" }
    };
    return colors[difficulty] || colors.easy;
  }, []);

  const renderProgressBar = useCallback((label, value, total, difficulty) => {
    // Ensure percentage never exceeds 100%
    const calculatedPercentage = (value / total) * 100 || 0;
    const percentage = Math.min(calculatedPercentage, 100).toFixed(1);
    const { bg, text } = getColorForDifficulty(label.toLowerCase());
    
    return (
      <div className="mb-2" key={label}>
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
  }, [getColorForDifficulty]);

  const totals = useMemo(() => getDifficultyTotals(), [getDifficultyTotals]);
  const totalProblems = useMemo(() => Object.values(totals).reduce((sum, val) => sum + val, 0), [totals]);

  const pieChartColors = useMemo(() => ({
    school: "#3B82F6",
    basic: "#14B8A6",
    easy: "#22C55E",
    medium: "#EAB308",
    hard: "#EF4444",
  }), []);

  const pieChartData = useMemo(() => 
    Object.entries(totals).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    })), [totals]);

  return (
    <div className="w-full max-w-full p-3 sm:p-4 bg-[#374151] rounded-xl shadow-lg">
      {Object.values(usernames).some((username) => username) && (
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 text-center sm:text-left">
            Problem Difficulty Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {usernames.leetcode && (
              <div className="bg-[#4B5563] p-2 sm:p-3 rounded-lg">
                <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
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
              <div className="bg-[#4B5563] p-2 sm:p-3 rounded-lg">
                <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
                  GeeksForGeeks
                </h3>
                <div className="space-y-3">
                  {(() => {
                    // Calculate total once outside the map function
                    const difficultyLevels = ["school", "basic", "easy", "medium", "hard"];
                    const gfgTotal = difficultyLevels.reduce((sum, key) => {
                      return sum + parseGFGCount(key);
                    }, 0) || 1;
                    
                    return difficultyLevels.map((level) => {
                      const count = parseGFGCount(level);
                      const capitalizedLevel = level.charAt(0).toUpperCase() + level.slice(1);
                      
                      return renderProgressBar(
                        capitalizedLevel,
                        count,
                        gfgTotal,
                        level
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {usernames.codeforces && (
              <div className="bg-[#4B5563] p-2 sm:p-3 rounded-lg">
                <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
                  Codeforces
                </h3>
                <div className="space-y-3">
                  {["Easy", "Medium", "Hard"].map((level) =>
                    renderProgressBar(
                      level,
                      platformData.codeforces?.difficultyBreakdown?.[level] || 0,
                      platformData.codeforces?.problemsSolved || 1,
                      level.toLowerCase()
                    )
                  )}
                </div>
              </div>
            )}

            <div className="bg-[#4B5563] p-2 sm:p-3 rounded-lg">
              <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3 text-center">
                Total by Difficulty
              </h3>
              <div className="w-full h-56 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="40%"
                      labelLine={false}
                      outerRadius="70%"
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
                      height={36}
                      layout="horizontal"
                      align="center"
                      wrapperStyle={{ 
                        fontSize: "0.75rem",
                        color: "#fff",
                        paddingTop: "0.5rem",
                        width: "90%",
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default DifficultyBreakdownCard;