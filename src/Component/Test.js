import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";
import ProfileCard from "./ProfileCard";
import NavigationCard from "./NavigationCard";
import CalendarCard from "./CalendarCard";
import { auth, db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
import API from "./API";

const Dashboard = () => {
  const [platformData, setPlatformData] = useState({
    leetcode: null,
    gfg: null,
    codeforces: null,
  });
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usernames, setUsernames] = useState({
    leetcode: null,
    gfg: null,
    codeforces: null,
  });

  const fetchUserData = async (user) => {
    try {
      const docSnap = await getDoc(doc(db, "Users", user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsernames({
          leetcode: data.leetcode || null,
          gfg: data.gfg || null,
          codeforces: data.codeforces || null,
        });
      }
    } catch (error) {
      console.error("Firebase fetch error:", error);
    }
  };

  const fetchPlatformStats = async () => {
    setLoading(true);
    const newPlatformData = {};

    try {
      if (usernames.leetcode) {
        const { data } = await axios.get(
          `${API.leetcodeAPI}${usernames.leetcode}`
        );
        newPlatformData.leetcode = data;
      }
      if (usernames.gfg) {
        const { data } = await axios.get(`${API.gfgAPI}${usernames.gfg}`);
        newPlatformData.gfg = data;
      }
      if (usernames.codeforces) {
        const { data } = await axios.get(
          `${API.CodeforcesAPI}${usernames.codeforces}`
        );
        newPlatformData.codeforces = data?.result?.[0];
      }
      setPlatformData(newPlatformData);
    } catch (err) {
      setError("Error fetching platform data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchUserData(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (Object.values(usernames).some((username) => username)) {
      fetchPlatformStats();
    }
  }, [usernames]);

  const getTotalProblems = () => {
    const leetcode = platformData.leetcode?.totalSolved || 0;
    const gfg = platformData.gfg?.codingStats?.problemsSolved || 0;
    const codeforces = platformData.codeforces?.problemCount || 0;
    return leetcode + Number(gfg) + Number(codeforces);
  };

  const getDifficultyTotals = () => {
    const totals = {
      school: 0,
      basic: 0,
      easy: 0,
      medium: 0,
      hard: 0,
    };

    if (platformData.leetcode) {
      totals.easy += Number(platformData.leetcode.easySolved || 0);
      totals.medium += Number(platformData.leetcode.mediumSolved || 0);
      totals.hard += Number(platformData.leetcode.hardSolved || 0);
    }

    if (platformData.gfg) {
      totals.school += Number(
        platformData.gfg.school?.split("(")[1]?.split(")")[0] || 0
      );
      totals.basic += Number(
        platformData.gfg.basic?.split("(")[1]?.split(")")[0] || 0
      );
      totals.easy += Number(
        platformData.gfg.easy?.split("(")[1]?.split(")")[0] || 0
      );
      totals.medium += Number(
        platformData.gfg.medium?.split("(")[1]?.split(")")[0] || 0
      );
      totals.hard += Number(
        platformData.gfg.hard?.split("(")[1]?.split(")")[0] || 0
      );
    }

    if (platformData.codeforces) {
      totals.easy += Number(platformData.codeforces.easy || 0);
      totals.medium += Number(platformData.codeforces.medium || 0);
      totals.hard += Number(platformData.codeforces.hard || 0);
    }

    return totals;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-800 text-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        Coding Platforms Dashboard
      </h1>
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4 space-y-6">
            <ProfileCard
              stats={platformData.leetcode}
              username={usernames.leetcode || "NA"}
            />
            <NavigationCard />
            {/* Contest Ratings Card */}
            {Object.values(usernames).some((username) => username) && (
              <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-blue-300 mb-3">
                  Contest Ratings
                </h2>
                <div className="space-y-3">
                  {usernames.leetcode && (
                    <div className="p-3 bg-gray-600 rounded-lg">
                      <h3 className="text-md font-medium">LeetCode</h3>
                      <p className="text-xl font-bold">
                        {platformData.leetcode?.contestRating || "NA"}
                      </p>
                      <p className="text-xs text-gray-300">
                        Contest Rank:{" "}
                        {platformData.leetcode?.contestRanking || "NA"}
                      </p>
                    </div>
                  )}
                  {usernames.gfg && (
                    <div className="p-3 bg-gray-600 rounded-lg">
                      <h3 className="text-md font-medium">GeeksForGeeks</h3>
                      <p className="text-xl font-bold">
                        {platformData.gfg?.codingScore || "NA"}
                      </p>
                      <p className="text-xs text-gray-300">
                        Institute Rank:{" "}
                        {platformData.gfg?.instituteRank || "NA"}
                      </p>
                    </div>
                  )}
                  {usernames.codeforces && (
                    <div className="p-3 bg-gray-600 rounded-lg">
                      <h3 className="text-md font-medium">CodeForces</h3>
                      <p className="text-xl font-bold">
                        {platformData.codeforces?.rating || "NA"}
                      </p>
                      <p className="text-xs text-gray-300">
                        Max Rating: {platformData.codeforces?.maxRating || "NA"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <CalendarCard calendarData={calendarData} />

            {/* Problems Solved and Rankings Cards Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.values(usernames).some((username) => username) && (
                <>
                  {/* Problems Solved Card */}
                  <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-blue-300 mb-3">
                      Problems Solved
                    </h2>
                    <div className="flex flex-col space-y-3">
                      <div className="p-4 bg-blue-600 rounded-lg text-center">
                        <h3 className="text-xl font-medium mb-1">
                          Total Problems
                        </h3>
                        <p className="text-3xl font-bold">
                          {getTotalProblems()}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {usernames.leetcode && (
                          <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                            <h3 className="text-md font-medium">LeetCode</h3>
                            <p className="text-xl font-bold">
                              {platformData.leetcode?.totalSolved || "0"}
                            </p>
                          </div>
                        )}
                        {usernames.gfg && (
                          <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                            <h3 className="text-md font-medium">
                              GeeksForGeeks
                            </h3>
                            <p className="text-xl font-bold">
                              {platformData.gfg?.codingStats?.problemsSolved ||
                                "0"}
                            </p>
                          </div>
                        )}
                        {usernames.codeforces && (
                          <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                            <h3 className="text-md font-medium">CodeForces</h3>
                            <p className="text-xl font-bold">
                              {platformData.codeforces?.problemCount || "0"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rankings Card */}
                  <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-blue-300 mb-3">
                      Platform Rankings
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                      {usernames.leetcode && (
                        <div className="p-4 bg-gray-600 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-md font-medium">LeetCode</h3>
                            <span className="px-2 py-0.5 bg-blue-500 rounded-full text-xs">
                              Global Rank
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-blue-300">
                            {platformData.leetcode?.ranking || "NA"}
                          </p>
                        </div>
                      )}
                      {usernames.gfg && (
                        <div className="p-4 bg-gray-600 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-md font-medium">
                              GeeksForGeeks
                            </h3>
                            <span className="px-2 py-0.5 bg-green-500 rounded-full text-xs">
                              Country Rank
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-green-300">
                            {platformData.gfg?.countryRank || "NA"}
                          </p>
                        </div>
                      )}
                      {usernames.codeforces && (
                        <div className="p-4 bg-gray-600 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-md font-medium">CodeForces</h3>
                            <span className="px-2 py-0.5 bg-purple-500 rounded-full text-xs">
                              Rating
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-purple-300">
                            {platformData.codeforces?.rating || "NA"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Problem Difficulty Breakdown */}
            {Object.values(usernames).some((username) => username) && (
              <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-blue-300 mb-6">
                  Problem Difficulty Breakdown
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {usernames.leetcode && (
                    <div className="bg-gray-600 p-5 rounded-lg">
                      <h3 className="text-lg font-medium mb-4 text-blue-300">
                        LeetCode
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Easy</span>
                            <span className="text-sm font-medium text-green-400">
                              {platformData.leetcode?.easySolved || "0"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-400 h-2 rounded-full"
                              style={{
                                width: `${
                                  (platformData.leetcode?.easySolved /
                                    platformData.leetcode?.totalSolved) *
                                    100 || 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Medium</span>
                            <span className="text-sm font-medium text-yellow-400">
                              {platformData.leetcode?.mediumSolved || "0"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${
                                  (platformData.leetcode?.mediumSolved /
                                    platformData.leetcode?.totalSolved) *
                                    100 || 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Hard</span>
                            <span className="text-sm font-medium text-red-400">
                              {platformData.leetcode?.hardSolved || "0"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-red-400 h-2 rounded-full"
                              style={{
                                width: `${
                                  (platformData.leetcode?.hardSolved /
                                    platformData.leetcode?.totalSolved) *
                                    100 || 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {usernames.gfg && (
                    <div className="bg-gray-600 p-5 rounded-lg">
                      <h3 className="text-lg font-medium mb-4 text-green-300">
                        GeeksForGeeks
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">School</span>
                            <span className="text-sm font-medium text-blue-300">
                              {platformData.gfg?.school
                                ?.split("(")[1]
                                ?.split(")")[0] || "0"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-300 h-2 rounded-full"
                              style={{
                                width: `${
                                  (Number(
                                    platformData.gfg?.school
                                      ?.split("(")[1]
                                      ?.split(")")[0] || 0
                                  ) /
                                    (platformData.gfg?.codingStats
                                      ?.problemsSolved || 1)) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Basic</span>
                            <span className="text-sm font-medium text-teal-300">
                              {platformData.gfg?.basic
                                ?.split("(")[1]
                                ?.split(")")[0] || "0"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-teal-300 h-2 rounded-full"
                              style={{
                                width: `${
                                  (Number(
                                    platformData.gfg?.basic
                                      ?.split("(")[1]
                                      ?.split(")")[0] || 0
                                  ) /
                                    (platformData.gfg?.codingStats
                                      ?.problemsSolved || 1)) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Easy</span>
                            <span className="text-sm font-medium text-green-400">
                              {platformData.gfg?.easy
                                ?.split("(")[1]
                                ?.split(")")[0] || "0"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-400 h-2 rounded-full"
                              style={{
                                width: `${
                                  (Number(
                                    platformData.gfg?.easy
                                      ?.split("(")[1]
                                      ?.split(")")[0] || 0
                                  ) /
                                    (platformData.gfg?.codingStats
                                      ?.problemsSolved || 1)) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Medium</span>
                            <span className="text-sm font-medium text-yellow-400">
                              {platformData.gfg?.medium
                                ?.split("(")[1]
                                ?.split(")")[0] || "0"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${
                                  (Number(
                                    platformData.gfg?.medium
                                      ?.split("(")[1]
                                      ?.split(")")[0] || 0
                                  ) /
                                    (platformData.gfg?.codingStats
                                      ?.problemsSolved || 1)) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Hard</span>
                            <span className="text-sm font-medium text-red-400">
                              {platformData.gfg?.hard
                                ?.split("(")[1]
                                ?.split(")")[0] || "0"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-red-400 h-2 rounded-full"
                              style={{
                                width: `${
                                  (Number(
                                    platformData.gfg?.hard
                                      ?.split("(")[1]
                                      ?.split(")")[0] || 0
                                  ) /
                                    (platformData.gfg?.codingStats
                                      ?.problemsSolved || 1)) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {usernames.codeforces && (
                    <div className="bg-gray-600 p-5 rounded-lg">
                      <h3 className="text-lg font-medium mb-4 text-purple-300">
                        CodeForces
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Easy</span>
                            <span className="text-sm font-medium text-green-400">
                              {platformData.codeforces?.easy || "0"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-400 h-2 rounded-full"
                              style={{
                                width: `${
                                  (platformData.codeforces?.easy /
                                    platformData.codeforces?.problemCount) *
                                    100 || 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Medium</span>
                            <span className="text-sm font-medium text-yellow-400">
                              {platformData.codeforces?.medium || "0"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${
                                  (platformData.codeforces?.medium /
                                    platformData.codeforces?.problemCount) *
                                    100 || 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Hard</span>
                            <span className="text-sm font-medium text-red-400">
                              {platformData.codeforces?.hard || "0"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-red-400 h-2 rounded-full"
                              style={{
                                width: `${
                                  (platformData.codeforces?.hard /
                                    platformData.codeforces?.problemCount) *
                                    100 || 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="bg-gray-600 p-5 rounded-lg">
                    <h3 className="text-lg font-medium mb-4 text-blue-300">
                      Total by Difficulty
                    </h3>
                    <div className="w-full h-64 flex justify-center">
                      <PieChart width={250} height={250}>
                        <Pie
                          data={Object.entries(getDifficultyTotals()).map(
                            ([difficulty, count]) => ({
                              name: difficulty,
                              value: count,
                              fill:
                                difficulty === "hard"
                                  ? "#F87171"
                                  : difficulty === "medium"
                                  ? "#FBBF24"
                                  : difficulty === "easy"
                                  ? "#21C55D"
                                  : difficulty === "basic"
                                  ? "#5EEAD4"
                                  : "#93C5FD",
                            })
                          )}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {Object.entries(getDifficultyTotals()).map(
                            ([difficulty, count]) => (
                              <Cell key={difficulty} />
                            )
                          )}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [
                            `${value} (${(
                              (value / getTotalProblems()) *
                              100
                            ).toFixed(1)}%)`,
                            name.charAt(0).toUpperCase() + name.slice(1),
                          ]}
                        />
                        <Legend
                          verticalAlign="bottom"
                          layout="horizontal"
                          align="center"
                          wrapperStyle={{ position: "relative", bottom: 40}}
                          formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                        />

                      </PieChart>
                    </div>
                  </div>



                </div>
              </div>
            )}

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;