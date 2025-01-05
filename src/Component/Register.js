import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./Firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import icons for password visibility toggle

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [mname, setMname] = useState(""); // State for middle name
  const [lname, setLname] = useState("");
  const [error, setError] = useState(""); // State for error handling
  const [showPassword, setShowPassword] = useState(false); // State for password visibility toggle
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state on submit
    try {
      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("User registered:", user);

      // Firestore User Data
      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        firstName: fname,
        middleName: mname, // Save middle name
        lastName: lname,
        photo: "",
      });

      toast.success("User Registered Successfully!", { position: "top-center" });
      navigate("/datainput"); // Redirect to datainput page
    } catch (error) {
      console.error("Error during registration:", error.message);
      setError(error.message); // Update error state
      toast.error(`Registration failed: ${error.message}`, { position: "bottom-center" });
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
        <form
          onSubmit={handleRegister}
          className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
        >
          <h3 className="text-2xl font-semibold text-center mb-4 text-blue-400">Sign Up</h3>

          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">First Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="First Name"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Middle Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Middle Name (Optional)"
              value={mname}
              onChange={(e) => setMname(e.target.value)} // Handle middle name input
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Last Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Last Name"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle password visibility
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle the show/hide state
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={24} /> // Show eye closed icon
                ) : (
                  <AiOutlineEye size={24} /> // Show eye open icon
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-black py-2 rounded-md hover:bg-green-600 transition duration-300"
          >
            Sign Up
          </button>

          {error && (
            <div className="mt-4 text-red-500 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          <p className="text-center text-sm mt-4 text-gray-400">
            Already registered?{" "}
            <a href="/login" className="text-blue-400 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </>
  );
}

export default Register;
