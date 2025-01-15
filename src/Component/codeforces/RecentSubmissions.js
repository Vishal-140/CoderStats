import React, { useState, useEffect } from 'react';

const RecentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // Replace 'tourist' with the actual user handle.
        const response = await fetch('https://codeforces.com/api/user.status?handle=tourist');
        const data = await response.json();

        if (data.status === 'OK') {
          const recentSubmissions = data.result.map(submission => ({
            problem: {
              name: submission.problem.name
            },
            programmingLanguage: submission.programmingLanguage,
            verdict: submission.verdict
          }));
          setSubmissions(recentSubmissions);
        } else {
          setError('Failed to fetch submissions');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  return (
    <div className="bg-[#374151] rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
      <div className="space-y-2">
        {submissions.slice(0, 10).map((submission, index) => (
          <div 
            key={index}
            className="flex justify-between items-center p-3 bg-gray-700 rounded hover:bg-gray-600"
          >
            <div>
              <span className="font-medium">{submission.problem.name}</span>
              <span className="ml-2 text-sm text-gray-300">
                ({submission.programmingLanguage})
              </span>
            </div>
            <span className={`px-3 py-1 rounded ${
              submission.verdict === 'OK' 
                ? 'bg-green-900 text-green-200' 
                : 'bg-red-900 text-red-200'
            }`}>
              {submission.verdict}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSubmissions;
