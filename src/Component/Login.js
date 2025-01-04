import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth, db } from "./Firebase";
import { toast } from "react-toastify";
import SignInwithGoogle from "./SignInwithGoogle";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const fetchUserData = async (user) => {
    try {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data;  // Return user data
      } else {
        console.log("User data not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!email || !password) {
      toast.error("Email and password are required!", {
        position: "bottom-center",
      });
      return;
    }

    try {
      // Attempt login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data after login
      const userData = await fetchUserData(user);

      if (userData) {
        // Check if college and leetcode fields are empty
        if (!userData.college || !userData.leetcode) {
          // Redirect to DataInput page if any field is empty
          navigate("/datainput");
        } else {
          // Redirect to dashboard if both fields are filled
          navigate("/dashboard");
        }
      }

      // Log and notify
      console.log("User logged in successfully:", user);
      toast.success("User logged in successfully!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-6 text-center text-blue-400">Login</h3>

        <div className="mb-4">
          <label className="block text-gray-300">Email address</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-600 rounded mt-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-600 rounded mt-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Login
          </button>
        </div>

        <p className="text-center text-sm text-gray-400">
          Don't have an account? <a href="/register" className="text-blue-500">Sign up</a>
        </p>

        <SignInwithGoogle />
      </form>
    </div>
  );
}

export default Login;
