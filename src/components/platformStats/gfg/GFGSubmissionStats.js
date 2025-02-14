import React from 'react';
import { useGFG } from '../../../context/GFGContext';

const GFGSubmissionStats = () => {
    const { stats } = useGFG();

    // to extract numeric value only from string
    const extractNumber = (str) => {
        if (!str) return 0;
        const matches = str.match(/\d+/);
        return matches ? parseInt(matches[0]) : 0;
    };

    const submissionData = [
        {
            difficulty: "School",
            count: extractNumber(stats.school),
            submissions: "NA"
        },
        {
            difficulty: "Basic",
            count: extractNumber(stats.basic),
            submissions: "NA"
        },
        {
            difficulty: "Easy",
            count: extractNumber(stats.easy),
            submissions: "NA"
        },
        {
            difficulty: "Medium",
            count: extractNumber(stats.medium),
            submissions: "NA"
        },
        {
            difficulty: "Hard",
            count: extractNumber(stats.hard),
            submissions: "NA"
        }
    ];

    // total solved problems
    const totalSolved = submissionData.reduce((acc, curr) => acc + curr.count, 0);

    const getBgColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case "school":
                return "bg-purple-600";
            case "basic":
                return "bg-cyan-600";
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
            <h3 className="text-xl font-semibold mb-5 text-center text-white">GFG Submission Stats</h3>
            <div className="flex flex-wrap justify-center gap-4">
                {submissionData.map((submission, index) => (
                    <div
                        key={index}
                        className={`${getBgColor(submission.difficulty)} text-white p-4 rounded-lg shadow-md w-full sm:w-[48%] md:w-[30%] lg:w-[23%] flex flex-col items-center`}
                    >
                        <h4 className="text-lg font-semibold mb-2">{submission.difficulty}</h4>
                        <p>
                            <strong>Solved:</strong>{' '}
                            <span className="text-xl font-bold">{submission.count}</span>
                        </p>
                        {submission.submissions !== "NA" && (
                            <p>
                                <strong>Attempts:</strong>{' '}
                                <span className="text-xl font-bold">{submission.submissions}</span>
                            </p>
                        )}
                    </div>
                ))}

                {/* Total Stats Card */}
                <div
                    className={`${getBgColor('total')} text-white p-4 rounded-lg shadow-md w-full sm:w-[48%] md:w-[30%] lg:w-[23%] flex flex-col items-center`}
                >
                    <h4 className="text-lg font-semibold mb-2">Total</h4>
                    <p>
                        <strong>Solved:</strong>{' '}
                        <span className="text-xl font-bold">{totalSolved}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GFGSubmissionStats;