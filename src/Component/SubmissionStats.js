import React from 'react';

const SubmissionStats = ({ totalSubmissions }) => (
  <div className="bg-gray-700 p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-5">Submission Stats</h3>
    {totalSubmissions?.map((submission, index) => (
      <div key={index} >
        <p><strong>{submission.difficulty}:</strong>
        Solved: <span className="text-[20px] font-bold">{submission.count}</span> ,
        Attempts: <span className="text-[20px] font-bold"> {submission.submissions}</span></p>
      </div>
    ))}
  </div>
);

export default SubmissionStats;
