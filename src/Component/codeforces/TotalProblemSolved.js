// TotalProblemSolved.js
import React, { useState, useEffect } from 'react';

const TotalProblemSolved = () => {
  const [totalSolved, setTotalSolved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        const response = await fetch('https://codeforces.com/api/user.status?handle=tourist&from=1&count=1000');
        const data = await response.json();

        if (data.status === 'OK') {
          const solvedProblems = new Set();
          data.result.forEach(submission => {
            if (submission.verdict === 'OK') {
              solvedProblems.add(`${submission.problem.contestId}-${submission.problem.index}`);
            }
          });
          setTotalSolved(solvedProblems.size);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchSolvedProblems();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  return (
    <div className="bg-[#374151] rounded-lg shadow p-4 h-full">
      <h2 className="text-xl font-semibold mb-4 text-white">Total Problem Solved</h2>
      <p className="text-4xl font-bold text-green-400">{totalSolved}</p>
    </div>
  );
};

export default TotalProblemSolved;
