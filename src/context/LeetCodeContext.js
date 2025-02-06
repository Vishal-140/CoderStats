import { createContext, useState, useEffect } from "react";
import { auth, db } from "../components/auth/Firebase";
import { doc, getDoc } from "firebase/firestore";
import axios from "axios";
import API from "../components/services/API";

export const LeetCodeContext = createContext();

export const LeetCodeProvider = ({ children }) => {
    const defaultStats = {
        totalSolved: "NA",
        totalActiveDays: "NA",
        ranking: "NA",
        contributionPoint: "NA",
        reputation: "NA",
        totalSubmissions: [],
        easySolved: "NA",
        totalEasy: "NA",
        mediumSolved: "NA",
        totalMedium: "NA",
        hardSolved: "NA",
        totalHard: "NA",
        recentSubmissions: [],
    };

    const [stats, setStats] = useState(defaultStats);
    const [username, setUsername] = useState(null);

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
                                setUsername(leetcodeUsername);
                                const { data } = await axios.get(`${API.leetcodeAPI}${leetcodeUsername}`);
                                setStats(data); // Update stats with fetched data
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
        <LeetCodeContext.Provider value={{ stats, username }}>
            {children}
        </LeetCodeContext.Provider>
    );
};
