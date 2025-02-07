import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { auth, db } from "../components/auth/Firebase";
import { doc, getDoc } from "firebase/firestore";

const CodeForcesContext = createContext();

export const CodeForcesProvider = ({ children }) => {
    const [stats, setStats] = useState({});
    const [submissions, setSubmissions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async (user) => {
            try {
                const userProfileRef = doc(db, "Users", user.uid);
                const userProfileSnapshot = await getDoc(userProfileRef);

                if (userProfileSnapshot.exists()) {
                    const codeforcesUsername = userProfileSnapshot.data().codeforces;
                    if (codeforcesUsername) {
                        fetchCodeForcesData(codeforcesUsername);
                    }
                }
            } catch (err) {
                console.error("Error fetching user profile:", err);
            }
        };

        const fetchCodeForcesData = async (handle) => {
            try {
                console.log("Fetching CodeForces data for:", handle);
                
                const [userInfoResponse, submissionsResponse] = await Promise.all([
                    axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
                    axios.get(`https://codeforces.com/api/user.status?handle=${handle}`)
                ]);

                const userInfo = userInfoResponse.data.result[0];
                const allSubmissions = submissionsResponse.data.result;

                const acceptedSubmissions = allSubmissions.filter(sub => sub.verdict === "OK");
                const uniqueProblems = new Set();
                const difficulties = { easy: 0, medium: 0, hard: 0 };

                acceptedSubmissions.forEach(sub => {
                    const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
                    if (!uniqueProblems.has(problemKey)) {
                        uniqueProblems.add(problemKey);
                        const rating = sub.problem.rating || 0;
                        if (rating <= 1200) difficulties.easy++;
                        else if (rating <= 2000) difficulties.medium++;
                        else difficulties.hard++;
                    }
                });

                setStats({
                    ...userInfo,
                    problemsSolved: uniqueProblems.size,
                    totalSubmissions: allSubmissions.length,
                    difficultyBreakdown: {
                        Easy: difficulties.easy,
                        Medium: difficulties.medium,
                        Hard: difficulties.hard
                    }
                });

                setSubmissions(allSubmissions.slice(0, 5));
                setError(null);
            } catch (err) {
                console.error("Error fetching CodeForces data:", err);
                setError("Failed to fetch data");
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) fetchUserData(user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <CodeForcesContext.Provider value={{ stats, submissions, error }}>
            {children}
        </CodeForcesContext.Provider>
    );
};

export const useCodeForces = () => useContext(CodeForcesContext);
