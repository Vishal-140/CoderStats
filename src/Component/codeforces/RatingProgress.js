import React from 'react';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RatingProgress = ({ ratingHistory }) => {
  return (
    <div className="bg-[#374151] p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="text-blue-500 w-4 h-4" />
        Rating Progress
      </h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ratingHistory.slice(-10)}>
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
  );
};

export default RatingProgress;