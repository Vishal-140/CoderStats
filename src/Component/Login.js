import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth, db } from "./Firebase";
import { toast } from 'react-toastify';
import SignInwithGoogle from "./SignInwithGoogle";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import icons for show/hide functionality

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
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
        toast.error("User data not found", {
          position: "top-center",
        });
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      toast.error("Error fetching user data!", {
        position: "top-center",
      });
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!email || !password) {
      toast.error("Email and password are required!", {
        position: "top-center",
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
        // Log and notify on successful login
        console.log("User logged in successfully:", user);
        toast.success("User logged in successfully!", {
          position: "top-center",
        });

        // Check if college and leetcode fields are empty
        if (!userData.college || !userData.leetcode) {
          // Redirect to DataInput page if any field is empty
          navigate("/datainput");
        } else {
          // Redirect to dashboard if both fields are filled
          navigate("/dashboard");
        }
      }
      // If no user data, toast will already show in fetchUserData function
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error(error.message, {
        position: "top-center",
      });
    }
  };

  // Password reset function
  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email address", {
        position: "top-center",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!\n Check your email", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error resetting password:", error.message);
      toast.error("Error resetting password", {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-gray-700 shadow-md">
        <div className="flex items-center">
          <img
            src='/logoCS.png'
            alt="CoderStats Logo"
            className="w-12 h-12 mr-3 rounded-full"
          />
          <span className="text-xl text-[30px] text-[#F8970D] font-bold">CoderStats</span>
        </div>
      </nav>

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
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle between password and text
                className="w-full p-2 border border-gray-600 rounded mt-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={24} /> // Hidden password icon
                ) : (
                  <AiOutlineEye size={24} /> // Visible password icon
                )}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-green-500 text-black p-2 rounded hover:bg-green-600 transition-colors duration-200"
            >
              Login
            </button>
          </div>

          <p className="text-center text-sm text-gray-400">
            Don't have an account? <a href="/register" className="text-blue-500">Sign up</a>
          </p>

          {/* Forgot Password link */}
          <p className="text-center text-sm text-gray-400 mt-2">
            Forgot your password? <button onClick={handlePasswordReset} className="text-yellow-500">Reset it here</button>
          </p>

          <SignInwithGoogle />
        </form>
      </div>
    </>
  );
}

export default Login;
