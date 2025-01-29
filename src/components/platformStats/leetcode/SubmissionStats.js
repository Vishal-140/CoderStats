import React from 'react';

const SubmissionStats = ({ totalSubmissions }) => {
  // Sorting the array based on desired order
  const sortOrder = ["Easy", "Medium", "Hard", "All"];
  const sortedSubmissions = totalSubmissions?.sort(
    (a, b) => sortOrder.indexOf(a.difficulty) - sortOrder.indexOf(b.difficulty)
  );

  // Function to get the background color class
  const getBgColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-600";
      case "Medium":
        return "bg-yellow-600";
      case "Hard":
        return "bg-red-600";
      case "All":
        return "bg-blue-600";
      default:
        return "bg-gray-600"; // Default color
    }
  };

  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-5 text-center text-white">Submission Stats</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {sortedSubmissions?.map((submission, index) => (
          <div
            key={index}
            className={`${getBgColor(submission.difficulty)} text-white p-4 rounded-lg shadow-md w-full sm:w-[48%] md:w-[30%] lg:w-[23%] flex flex-col items-center`}
          >
            <h4 className="text-lg font-semibold mb-2">{submission.difficulty}</h4>
            <p>
              <strong>Solved:</strong>{' '}
              <span className="text-xl font-bold">{submission.count}</span>
            </p>
            <p>
              <strong>Attempts:</strong>{' '}
              <span className="text-xl font-bold">{submission.submissions}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionStats;
