import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, db } from "../../components/auth/Firebase";
import { doc, getDoc } from "firebase/firestore";
import API from '../../components/services/API';
import ProfileCard from '../../components/profile/ProfileCard';
import CalendarCard from '../../components/common/CalendarCard';
import RecentSubmissions from '../platformStats/leetcode/RecentSubmissions';
import SubmissionStats from '../platformStats/leetcode/SubmissionStats';
import StatsSummaryCard from '../platformStats/leetcode/StatsSummaryCard';
import DifficultyStatsCard from '../platformStats/leetcode/DifficultyStatsCard';

const LeetCodeStats = () => {
  const [stats, setStats] = useState(null);
  const [username, setUsername] = useState(null);

  const defaultStats = {
    totalSolved: 'NA',
    totalActiveDays: 'NA',
    ranking: 'NA',
    contributionPoint: 'NA',
    reputation: 'NA',
    totalSubmissions: [],
    easySolved: 'NA',
    totalEasy: 'NA',
    mediumSolved: 'NA', 
    totalMedium: 'NA',
    hardSolved: 'NA',
    totalHard: 'NA',
    recentSubmissions: [],
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const fetchLeetCodeUsername = async () => {
          try {
            const userProfileRef = doc(db, "Users", user.uid);
            const userProfileSnapshot = await getDoc(userProfileRef);
            
            if (userProfileSnapshot.exists()) {
              const leetcodeUsername = userProfileSnapshot.data().leetcode;
              
              if (leetcodeUsername) {
                const { data } = await axios.get(`${API.leetcodeAPI}${leetcodeUsername}`);
                setStats(data);
              } else {
                console.error("LeetCode username not found in user profile.");
              }
            } else {
              console.error("User profile not found.");
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        fetchLeetCodeUsername();
      }
    });
    
    return () => unsubscribe();
  }, []);
  

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6 mt-20 bg-gray-800 text-white shadow-lg rounded-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">LeetCode Stats</h1>

      <div className="flex flex-col space-y-4 sm:space-y-6">
        <div className="flex flex-col lg:flex-row lg:space-x-4 xl:space-x-6">
          {/* Left Column */}
          <div className="w-full lg:w-1/4 space-y-4 sm:space-y-6">
            <ProfileCard stats={stats || defaultStats} username={username || 'NA'} />
            <DifficultyStatsCard
              easySolved={stats?.easySolved || defaultStats.easySolved}
              totalEasy={stats?.totalEasy || defaultStats.totalEasy}
              mediumSolved={stats?.mediumSolved || defaultStats.mediumSolved}
              totalMedium={stats?.totalMedium || defaultStats.totalMedium}
              hardSolved={stats?.hardSolved || defaultStats.hardSolved}
              totalHard={stats?.totalHard || defaultStats.totalHard}
            />
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            <CalendarCard />
            <StatsSummaryCard
              totalSolved={stats?.totalSolved || defaultStats.totalSolved}
              totalActiveDays={stats?.totalActiveDays || defaultStats.totalActiveDays}
              ranking={stats?.ranking || defaultStats.ranking}
              contributionPoint={stats?.contributionPoint || defaultStats.contributionPoint}
              reputation={stats?.reputation || defaultStats.reputation}
            />
            <SubmissionStats 
              totalSubmissions={stats?.totalSubmissions || defaultStats.totalSubmissions} 
            />
          </div>
        </div>

        {/* Recent Submissions */}
        <RecentSubmissions
          recentSubmissions={stats?.recentSubmissions || defaultStats.recentSubmissions}
        />
      </div>
    </div>
  );
};

export default LeetCodeStats;