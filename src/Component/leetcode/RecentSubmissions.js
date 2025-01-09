import React from 'react';

const RecentSubmissions = ({ recentSubmissions, recentSubmissionsCount, handleSeeMoreClick }) => (
  <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full">
    <h3 className="text-xl font-semibold text-white">Recent Submissions</h3>
    <ul className="space-y-2">
      {recentSubmissions && recentSubmissions.length > 0 ? (
        recentSubmissions.slice(0, recentSubmissionsCount).map((submission, index) => (
          <li
            key={index}
            className="bg-gray-600 p-3 rounded-md hover:bg-gray-500 transition-all"
          >
            <strong>{submission.title}</strong> - {submission.statusDisplay} ({submission.lang})
          </li>
        ))
      ) : (
        <li className="text-gray-400">No recent submissions</li>
      )}
    </ul>
    {recentSubmissionsCount < (recentSubmissions?.length || 0) && (
      <button
        onClick={handleSeeMoreClick}
        className="mt-4 py-2 px-4 text-blue-400 hover:text-blue-600 border border-blue-400 rounded-md transition-all"
      >
        See More
      </button>
    )}
  </div>
);

export default RecentSubmissions;
