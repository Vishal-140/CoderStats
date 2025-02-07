import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DifficultyBreakdown = ({ stats }) => {
    if (!stats || !stats.difficultyBreakdown) {
        return <div className="text-center text-gray-400">No difficulty data available</div>;
    }

    const difficulties = Object.entries(stats.difficultyBreakdown);
    const totalSolved = difficulties.reduce((sum, [, count]) => sum + count, 0);

    const colors = {
        Easy: '#22C55E',
        Medium: '#EAB308',
        Hard: '#EF4444'
    };

    const pieData = difficulties.map(([level, count]) => ({
        name: level,
        value: count,
        color: colors[level] || '#ffffff'
    }));

    return (
        <div className="bg-gray-700 p-3 rounded-lg shadow-lg space-y-3">
            <h3 className="text-lg font-semibold text-gray-100">Difficulty Breakdown</h3>
            
            <div className="w-full space-y-2">
                {difficulties.map(([level, count], index) => (
                    <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-200 text-sm">{level}</span>
                            <div className="flex items-center">
                                <span className="text-sm font-bold text-gray-200">{count}</span>
                                <span className="text-xs ml-2 text-gray-400">
                                    ({((count / totalSolved) * 100).toFixed(1)}%)
                                </span>
                            </div>
                        </div>
                        <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                    width: `${(count / totalSolved) * 100}%`,
                                    backgroundColor: colors[level] || '#ffffff'
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="w-full h-36">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
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
                                            <p className="text-xs text-gray-200">
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
            
            <div className="flex justify-center gap-2">
                {pieData.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <div 
                            className="w-2 h-2 rounded-full mr-1" 
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-gray-300">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DifficultyBreakdown;
