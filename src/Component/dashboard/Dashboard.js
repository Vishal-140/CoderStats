import React, { useState, useEffect } from 'react';
import { auth, db } from '../auth/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import API from '../auth/API';
import ProfileCard from '../ProfileCard';
import CalendarCard from '../CalendarCard';
import ProblemsCard from './ProblemsCard';
import RankingsCard from './RankingCard';
import ContestRatingsCard from './ContestRatingsCard';
import DifficultyBreakdownCard from './DifficultyBreakdownCard';
import NavigationCard from '../NavigationCard';


const Dashboard = () => {
  const [platformData, setPlatformData] = useState({
    leetcode: null,
    gfg: null,
    codeforces: null,
  });
  const [platformErrors, setPlatformErrors] = useState({
    leetcode: null,
    gfg: null,
    codeforces: null,
  });
  const [loading, setLoading] = useState(true);
  const [usernames, setUsernames] = useState({
    leetcode: null,
    gfg: null,
    codeforces: null,
  });

  const fetchUserData = async (user) => {
    try {
      const docSnap = await getDoc(doc(db, 'Users', user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsernames({
          leetcode: data.leetcode || null,
          gfg: data.gfg || null,
          codeforces: data.codeforces || null,
        });
      }
    } catch (error) {
      console.error('Firebase fetch error:', error);
    }
  };

  const fetchPlatformStats = async () => {
    setLoading(true);
    const newPlatformData = { ...platformData };
    const newPlatformErrors = { ...platformErrors };

    const fetchData = async (platform, url, dataTransform) => {
      try {
        const { data } = await axios.get(url);
        newPlatformData[platform] = dataTransform ? dataTransform(data) : data;
        newPlatformErrors[platform] = null;
      } catch (err) {
        newPlatformErrors[platform] = `Error fetching ${platform} data`;
        newPlatformData[platform] = null;
      }
    };

    const promises = [];
    if (usernames.leetcode) {
      promises.push(
        fetchData('leetcode', `${API.leetcodeAPI}${usernames.leetcode}`)
      );
    }
    if (usernames.gfg) {
      promises.push(fetchData('gfg', `${API.gfgAPI}${usernames.gfg}`));
    }
    if (usernames.codeforces) {
      promises.push(
        fetchData(
          'codeforces',
          `${API.CodeforcesAPI}${usernames.codeforces}`,
          (data) => data?.result?.[0]
        )
      );
    }

    await Promise.allSettled(promises);
    setPlatformData(newPlatformData);
    setPlatformErrors(newPlatformErrors);
    setLoading(false);
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

  return (
    <div className="max-w-7xl mx-auto p-4 mt-20 bg-gray-800 text-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center">Coding Platforms Dashboard</h1>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="w-full lg:w-1/4 space-y-4">
            <ProfileCard
              stats={platformData.leetcode}
              username={usernames.leetcode || 'NA'}
              error={platformErrors.leetcode}
              loading={loading}
            />
            <ContestRatingsCard
              platformData={platformData}
              usernames={usernames}
              loading={loading}
              platformErrors={platformErrors}
            />
            <NavigationCard/>
          </div>

          <div className="flex-1 space-y-4">
            <CalendarCard />
            {Object.values(usernames).some((username) => username) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ProblemsCard
                  platformData={platformData}
                  usernames={usernames}
                  loading={loading}
                  platformErrors={platformErrors}
                />
                <RankingsCard
                  platformData={platformData}
                  usernames={usernames}
                  loading={loading}
                  platformErrors={platformErrors}
                />
              </div>
            )}

            {Object.values(usernames).some((username) => username) && (
              <DifficultyBreakdownCard
                platformData={platformData}
                usernames={usernames}
                platformErrors={platformErrors}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
