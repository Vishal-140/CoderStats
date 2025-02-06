import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { auth, db } from "../components/auth/Firebase";
import { doc, getDoc } from "firebase/firestore";
import API from "../../src/components/services/API";

const GFGContext = createContext();

export const GFGProvider = ({ children }) => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    const defaultStats = {
        username: "NA",
        globalRank: "NA",
        countryRank: "NA",
        codingScore: "NA",
        codingStats: {
            problemsSolved: "NA",
            submissions: "NA",
        },
        streak: "NA",
        contestRating: "NA",
        school: "0",
        basic: "0",
        easy: "0",
        medium: "0",
        hard: "0",
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const fetchGFGUsername = async () => {
                    try {
                        const userProfileRef = doc(db, "Users", user.uid);
                        const userProfileSnapshot = await getDoc(userProfileRef);

                        if (userProfileSnapshot.exists()) {
                            const gfgUsername = userProfileSnapshot.data().gfg;
                            if (gfgUsername) {
                                const { data } = await axios.get(`${API.gfgAPI}${gfgUsername}`);
                                setStats(data);
                            } else {
                                console.error("GFG username not found in user profile.");
                            }
                        } else {
                            console.error("User profile not found.");
                        }
                    } catch (err) {
                        console.error("Error fetching GFG data:", err);
                        setError(err);
                    }
                };
                fetchGFGUsername();
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <GFGContext.Provider value={{ stats: stats || defaultStats, error }}>
            {children}
        </GFGContext.Provider>
    );
};

export const useGFG = () => useContext(GFGContext);
