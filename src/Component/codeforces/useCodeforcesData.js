import React, { useState, useEffect } from 'react';
import { db, auth } from "../auth/Firebase";
import { doc, getDoc } from 'firebase/firestore';
import API from '../auth/API';
import axios from 'axios';

export const useCodeforcesData = () => {
  const [username, setUsername] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async (user) => {
    try {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const cfUsername = docSnap.data().codeforces;
        console.log("Fetched Codeforces username:", cfUsername);
        setUsername(cfUsername);
      } else {
        setError("User document not found");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error.message);
      setError("Error fetching user data");
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API.CodeforcesStatusAPI}${username}&from=1&count=50`); // Limit submissions count to 50
      if (response.data.status === 'OK') {
        setSubmissions(response.data.result);
      } else {
        setError('Invalid Codeforces response');
      }
    } catch (err) {
      console.error('Error Fetching Codeforces Data:', err);
      setError('Error fetching Codeforces data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setError("No authenticated user");
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (username) {
      fetchStats();
    }
  }, [username]);

  return { username, submissions, loading, error };
};

export default useCodeforcesData;
