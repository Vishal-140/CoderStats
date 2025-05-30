import React from 'react';
import ProfileCard from '../components/profile/ProfileCard';
import CalendarCard from '../components/common/CalendarCard';
import ProblemsCard from '../components/dashboard/ProblemsCard';
import RankingsCard from '../components/dashboard/RankingCard';
import ContestRatingsCard from '../components/dashboard/ContestRatingsCard';
import DifficultyBreakdownCard from '../components/dashboard/DifficultyBreakdownCard';
import PlateformRedirect from '../components/common/PlateformRedirect';
import { useGlobalData } from '../context/GlobalDataContext';

const Dashboard = () => {
  // Use the global data context instead of fetching data directly
  const { platformData, platformErrors, usernames, loading } = useGlobalData();

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
            <PlateformRedirect usernames={usernames} />

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
