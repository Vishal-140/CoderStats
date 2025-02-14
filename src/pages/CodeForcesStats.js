import React from "react";
import { useCodeForces } from "../context/CodeForcesContext";
import ProfileCard from "../components/profile/ProfileCard";
import CalendarCard from "../components/common/CalendarCard";
import DifficultyBreakdown from "../components/platformStats/codeforces/DifficultyBreakdown";
import CodeForcesSubmissionStats from "../components/platformStats/codeforces/CodeForcesSubmissionStats";

const CodeForcesStats = () => {
    const context = useCodeForces();
    
    if (!context) {
        return <div className="text-center text-red-500">Error: Context is not available.</div>;
    }

    const { stats = {}, submissions = [], error, loading } = context;

    return (
        <div className="max-w-7xl mx-auto p-4 mt-20 bg-gray-800 text-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-8">Codeforces Dashboard</h1>

            <div className="flex flex-col space-y-4">
                <div className="flex flex-col lg:flex-row lg:space-x-4">
                    <div className="w-full lg:w-1/4 space-y-4">
                        <ProfileCard
                            stats={stats}
                            username={stats.handle || 'NA'}
                            error={error}
                            loading={loading}
                        />
                        <DifficultyBreakdown stats={stats} />
                    </div>

                    <div className="flex-1 space-y-4">
                        <CalendarCard />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold text-blue-300 mb-2">Problems Solved</h2>
                                <p className="text-3xl font-bold">{stats.problemsSolved || 0}</p>
                            </div>
                            <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold text-blue-300 mb-2">Current Rating</h2>
                                <p className="text-3xl font-bold">{stats.rating || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold text-blue-300 mb-2">Max Rating</h2>
                                <p className="text-3xl font-bold">{stats.maxRating || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold text-blue-300 mb-2">Current Rank</h2>
                                <p className="text-3xl font-bold">{stats.rank || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold text-blue-300 mb-2">Max Rank</h2>
                                <p className="text-3xl font-bold">{stats.maxRank || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold text-blue-300 mb-2">Contribution</h2>
                                <p className="text-3xl font-bold">{stats.contribution || 0}</p>
                            </div>
                            <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold text-blue-300 mb-2">Total Submissions</h2>
                                <p className="text-3xl font-bold">{stats.totalSubmissions || 0}</p>
                            </div>
                        </div>
                        <CodeForcesSubmissionStats/>
                    </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-blue-300 mb-4">Recent Submissions</h2>
                    <div className="space-y-2">
                        {submissions.length > 0 ? (
                            submissions.map((sub, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-gray-600 rounded">
                                    <span>{sub.problem.name}</span>
                                    <span className={`px-2 py-1 rounded ${sub.verdict === 'OK' ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {sub.verdict}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400">No recent submissions</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeForcesStats;