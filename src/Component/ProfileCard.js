import React, { useEffect, useState } from "react";
import { auth, db } from "./auth/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import editPencil from "../assets/editpencil.svg"; // Correct path to the SVG

const ProfileCard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  // Default values to show when userDetails is null
  const defaultValues = {
    photo: "/logoCS.png", // Default photo if none is available
    firstName: "NA",
    middleName: "",
    lastName: "",
    country: "NA",
    college: "NA",
    linkedin: "",
    github: "",
  };

  const fetchUserData = async (user) => {
    try {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        // If no photo URL exists, use the default
        userData.photo = userData.photo || "/logoCS.png";
        
        setUserDetails(userData);
      } else {
        console.log("User data not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user);
      }
    });

    return () => unsubscribe();
  }, []);

  // Use defaultValues if userDetails is not available
  const profileData = userDetails || defaultValues;

  // Ensure LinkedIn URL includes https:// if it's not already there
  const linkedinURL = profileData.linkedin && profileData.linkedin.startsWith('http')
    ? profileData.linkedin
    : profileData.linkedin ? `https://${profileData.linkedin}` : null;

  // Ensure GitHub URL is valid
  const githubURL = profileData.github && profileData.github.startsWith('http')
    ? profileData.github
    : profileData.github ? `https://${profileData.github}` : null;

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center space-y-4 max-w-xs mx-auto relative sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      {/* Pencil Icon in Top-Right */}
      <button
        onClick={() => navigate("/datainput")}
        className="absolute top-5 right-5 w-8 h-8 flex justify-center items-center bg-transparent"
        title="Edit Profile"
      >
        <img
          src={editPencil}
          alt="Edit Profile"
          className="w-5 h-5 invert transition-transform transform hover:scale-110"
        />
      </button>

      {/* Displaying profile image from Firebase */}
      <img
        src={profileData.photo}
        alt="Profile"
        className="w-24 h-24 rounded-full border object-cover md:w-32 md:h-32 lg:w-40 lg:h-40"
      />

      {/* Full name display (First, Middle, Last name in the same line) */}
      <h3 className="text-lg font-bold text-center sm:text-xl md:text-xl lg:text-xl">
        {profileData.firstName} {profileData.middleName} {profileData.lastName}
      </h3>

      <p className="text-sm sm:text-base">
        <strong>College:</strong> {profileData.college}
      </p>
      
      <p className="text-sm sm:text-base">
        <strong>Country:</strong> {profileData.country}
      </p>
      
      <div className="flex space-x-3 mt-2 text-sm sm:text-base justify-center">
  {linkedinURL && (
    <a
      href={linkedinURL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center text-blue-500 hover:text-blue-600"
    >
      <img
        src="/linkedinLogo.png"
        alt="LinkedIn Logo"
        className="w-6 h-6 mb-2"
      />
      LinkedIn
    </a>
  )}
  {githubURL && (
    <a
      href={githubURL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center text-gray-400 hover:text-gray-500"
    >
      <img
        src="/githubLogo.png"
        alt="GitHub Logo"
        className="w-6 h-6 mb-2"
      />
      GitHub
    </a>
  )}
</div>

    </div>
  );
};

export default ProfileCard;
