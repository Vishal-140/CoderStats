import React from 'react';
import { useGlobalData } from '../../../context/GlobalDataContext';

const CodeForcesSubmissionStats = () => {
    const { platformData } = useGlobalData();
    const stats = platformData?.codeforces || {};

    const submissionData = [
        {
            difficulty: "Easy",
            count: stats?.difficultyBreakdown?.Easy || 0,
            description: "≤ 1200"
        },
        {
            difficulty: "Medium",
            count: stats?.difficultyBreakdown?.Medium || 0,
            description: "1300-2000"
        },
        {
            difficulty: "Hard",
            count: stats?.difficultyBreakdown?.Hard || 0,
            description: "> 2000"
        }
    ];

    // Calculate total solved
    const totalSolved = stats?.problemsSolved || 0;

    const getBgColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case "easy":
                return "bg-green-600";
            case "medium":
                return "bg-yellow-600";
            case "hard":
                return "bg-red-600";
            case "total":
                return "bg-blue-600";
            default:
                return "bg-gray-600";
        }
    };

    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-5 text-center text-white">Submission Stats</h3>
            <div className="flex flex-wrap justify-center gap-4">
                {submissionData.map((submission, index) => (
                    <div
                        key={index}
                        className={`${getBgColor(submission.difficulty)} text-white p-4 rounded-lg shadow-md w-full sm:w-[48%] md:w-[30%] lg:w-[23%] flex flex-col items-center`}
                    >
                        <h4 className="text-lg font-semibold mb-2">{submission.difficulty}</h4>
                        <p className="text-sm mb-2 text-gray-200">Rating: {submission.description}</p>
                        <p>
                            <strong>Solved:</strong>{' '}
                            <span className="text-xl font-bold">{submission.count}</span>
                        </p>
                    </div>
                ))}

                {/* Total Stats Card */}
                <div
                    className={`${getBgColor('total')} text-white p-4 rounded-lg shadow-md w-full sm:w-[48%] md:w-[30%] lg:w-[23%] flex flex-col items-center`}
                >
                    <h4 className="text-lg font-semibold mb-2">All</h4>
                    <p className="text-sm mb-2 text-gray-200">All Difficulties</p>
                    <p>
                        <strong>Solved:</strong>{' '}
                        <span className="text-xl font-bold">{totalSolved}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CodeForcesSubmissionStats;