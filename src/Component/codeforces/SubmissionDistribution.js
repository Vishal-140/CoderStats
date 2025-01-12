import React from "react";
import { BarChart2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const SubmissionDistribution = ({ submissions }) => {
  const getVerdict = (submissions) => {
    const verdicts = submissions.reduce((acc, sub) => {
      acc[sub.verdict] = (acc[sub.verdict] || 0) + 1;
      return acc;
    }, {});

    return [
      { name: "Accepted", value: verdicts.OK || 0, color: "#22C55E" },
      {
        name: "Wrong Answer",
        value: verdicts.WRONG_ANSWER || 0,
        color: "#EF4444",
      },
      {
        name: "Time Limit",
        value: verdicts.TIME_LIMIT_EXCEEDED || 0,
        color: "#F59E0B",
      },
    ];
  };

  const verdictData = getVerdict(submissions);

  return (
    <div className="bg-[#374151] p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart2 className="text-green-500" />
        Submission Distribution
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Progress Bars */}
        <div className="flex flex-col justify-center space-y-4">
          {verdictData.map((entry, index) => {
            const totalSubmissions = submissions.length;
            const percentage =
              totalSubmissions > 0
                ? ((entry.value / totalSubmissions) * 100).toFixed(1)
                : 0;

            return (
              <div key={index} className="space-y-1">
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
                  {entry.value} submissions
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
                data={verdictData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {verdictData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "none",
                }}
                formatter={(value, name) => [`${value} submissions`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDistribution;
