import React from 'react';
import { BookOpen } from 'lucide-react';

const ProblemStats = ({ submissions }) => {
  const solvedProblems = new Set(
    submissions.filter(s => s.verdict === 'OK').map(s => s.problem.name)
  ).size;

  const successRate = ((submissions.filter(s => s.verdict === 'OK').length / submissions.length) * 100).toFixed(1);

  return (
    <div className="bg-[#374151] p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="text-blue-500" />
        <h3 className="text-lg font-semibold">Problem Stats</h3>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-gray-400">Problems Solved</p>
          <p className="text-xl font-bold">{solvedProblems}</p>
        </div>
        <div>
          <p className="text-gray-400">Total Submissions</p>
          <p className="text-xl font-bold">{submissions.length}</p>
        </div>
        <div>
          <p className="text-gray-400">Success Rate</p>
          <p className="text-xl font-bold">{successRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default ProblemStats;