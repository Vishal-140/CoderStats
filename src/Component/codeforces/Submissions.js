import React from 'react'

import { BookOpen, Target, Trophy, Award, GitCommit } from 'lucide-react';
// Submissions Component
const Submissions = ({ totalSubmissions }) => {
    return (
      <div className="bg-gray-700 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <GitCommit className="text-green-500" />
          <h3 className="text-lg font-semibold">Submissions</h3>
        </div>
        <div>
          <p className="text-gray-400">Total Submissions</p>
          <p className="text-xl font-bold">{totalSubmissions}</p>
        </div>
      </div>
    );
  };

export default Submissions