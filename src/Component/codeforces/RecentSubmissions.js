import React from 'react';
import { Check } from 'lucide-react';

const RecentSubmissions = ({ submissions }) => {
  return (
    <div className="bg-gray-700 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Check className="text-green-500" />
        Recent Submissions
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-500">
              <th className="pb-3">Problem</th>
              <th className="pb-3">Verdict</th>
              <th className="pb-3">Language</th>
              <th className="pb-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {submissions.slice(0, 5).map((submission, index) => (
              <tr key={index} className="border-b border-gray-500">
                <td className="py-3">{submission.problem.name}</td>
                <td className={`py-3 ${
                  submission.verdict === 'OK' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {submission.verdict}
                </td>
                <td className="py-3">{submission.programmingLanguage}</td>
                <td className="py-3">
                  {new Date(submission.creationTimeSeconds * 1000).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentSubmissions;