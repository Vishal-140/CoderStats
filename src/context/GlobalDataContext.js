import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { auth, db } from '../components/auth/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import API from '../components/services/API';

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const [platformData, setPlatformData] = useState({
    leetcode: null,
    gfg: null,
    codeforces: null
  });
  
  const [platformErrors, setPlatformErrors] = useState({
    leetcode: null,
    gfg: null,
    codeforces: null
  });
  
  const [usernames, setUsernames] = useState({
    leetcode: null,
    gfg: null,
    codeforces: null
  });
  
  // State for submissions data
  const [codeforcesSubmissions, setCodeforcesSubmissions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Process Codeforces submissions
  const processCodeforcesSubmissions = useCallback((userInfo, allSubmissions) => {
    const acceptedSubmissions = allSubmissions.filter(sub => sub.verdict === "OK");
    const uniqueProblems = new Set();
    const difficulties = { Easy: 0, Medium: 0, Hard: 0 };
    
    acceptedSubmissions.forEach(sub => {
      const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
      if (!uniqueProblems.has(problemKey)) {
        uniqueProblems.add(problemKey);
        const rating = sub.problem.rating || 0;
        if (rating <= 1200) difficulties.Easy++;
        else if (rating <= 2000) difficulties.Medium++;
        else difficulties.Hard++;
      }
    });
    
    return {
      ...userInfo,
      problemsSolved: uniqueProblems.size,
      totalSubmissions: allSubmissions.length,
      difficultyBreakdown: difficulties
    };
  }, []);

  // Fetch user profile data
  const fetchUserData = useCallback(async (user) => {
    try {
      const docSnap = await getDoc(doc(db, 'Users', user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsernames({
          leetcode: data.leetcode || null,
          gfg: data.gfg || null,
          codeforces: data.codeforces || null
        });
      }
    } catch (error) {
      console.error('Firebase fetch error:', error);
    }
  }, []);

  // Fetch all platform data
  const fetchPlatformStats = useCallback(async () => {
    if (dataLoaded) {
      console.log('Data already loaded, skipping fetch');
      return;
    }

    setLoading(true);
    const newPlatformData = { ...platformData };
    const newPlatformErrors = { ...platformErrors };

    const fetchData = async (platform, url, dataTransform) => {
      try {
        const { data } = await axios.get(url);
        newPlatformData[platform] = dataTransform ? dataTransform(data) : data;
        newPlatformErrors[platform] = null;
      } catch (err) {
        console.error(`Error fetching ${platform} data:`, err);
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
        (async () => {
          try {
            // Fetch both user info and submissions
            const [userInfoResponse, submissionsResponse] = await Promise.all([
              axios.get(`${API.CodeforcesAPI}${usernames.codeforces}`),
              axios.get(`https://codeforces.com/api/user.status?handle=${usernames.codeforces}`)
            ]);
            
            const userInfo = userInfoResponse.data.result[0];
            const allSubmissions = submissionsResponse.data.result;
            
            // Set processed data
            newPlatformData['codeforces'] = processCodeforcesSubmissions(userInfo, allSubmissions);
            newPlatformErrors['codeforces'] = null;
            
            // Store the recent submissions (limited to 5)
            setCodeforcesSubmissions(allSubmissions.slice(0, 5));
          } catch (err) {
            console.error("Error fetching CodeForces data:", err);
            newPlatformErrors['codeforces'] = "Failed to fetch data";
            newPlatformData['codeforces'] = null;
          }
        })()
      );
    }

    await Promise.allSettled(promises);
    setPlatformData(newPlatformData);
    setPlatformErrors(newPlatformErrors);
    setLoading(false);
    setDataLoaded(true);
    console.log('All platform data loaded successfully');
  }, [usernames, platformData, platformErrors, dataLoaded, processCodeforcesSubmissions]);

  // Manually trigger a refresh if needed
  const refreshData = useCallback(() => {
    setDataLoaded(false);
    fetchPlatformStats();
  }, [fetchPlatformStats]);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user);
      }
    });
    return () => unsubscribe();
  }, [fetchUserData]);

  // Fetch data when usernames are available
  useEffect(() => {
    if (Object.values(usernames).some(username => username)) {
      fetchPlatformStats();
    }
  }, [usernames, fetchPlatformStats]);

  const value = {
    platformData,
    platformErrors,
    usernames,
    loading,
    refreshData,
    codeforcesSubmissions  // Include Codeforces submissions in the context
  };

  return (
    <GlobalDataContext.Provider value={value}>
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);
