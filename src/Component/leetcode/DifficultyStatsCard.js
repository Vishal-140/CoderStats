import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DifficultyStatsCard = ({ 
  easySolved, 
  totalEasy, 
  mediumSolved, 
  totalMedium, 
  hardSolved, 
  totalHard 
}) => {
  const totalSolved = easySolved + mediumSolved + hardSolved;
  
  // Calculate percentages of total solved
  const getPercentageOfTotal = (solved) => ((solved / totalSolved) * 100).toFixed(1);
  
  // Prepare data for charts
  const data = [
    { name: 'Easy', solved: easySolved, color: '#22C55E' },
    { name: 'Medium', solved: mediumSolved, color: '#EAB308' },
    { name: 'Hard', solved: hardSolved, color: '#EF4444' }
  ];

  const pieData = data.map(item => ({
    name: item.name,
    value: item.solved,
    color: item.color
  }));

  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-lg space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-100">Difficulty Stats</h3>
      </div>
      
      {/* Progress Bars Section */}
      <div className="w-full space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-200">{item.name}</span>
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-200">
                  {item.solved}
                </span>
                <span className="text-sm ml-2 text-gray-400">
                  ({getPercentageOfTotal(item.solved)}%)
                </span>
              </div>
            </div>
            <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(item.solved / totalSolved) * 100}%`,
                  backgroundColor: item.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pie Chart Section */}
      <div className="w-full h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-gray-900 p-2 rounded shadow border border-gray-700">
                      <p className="text-sm text-gray-200">
                        {data.name}: {data.value} (
                        {((data.value / totalSolved) * 100).toFixed(1)}%)
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

      {/* Legend */}
      <div className="flex justify-center gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-300">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DifficultyStatsCard;