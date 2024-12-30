import React, { useEffect, useState } from "react";
import { auth, db, storage } from "./Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";

function DataInput() {
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    leetcode: "",
    gfg: "",
    codingNinjas: "",
    photo: "",
    college: "",
    linkedin: "",
    github: "",
    country: "",
    hackerEarth: "",
    codeChef: "",
    hackerRank: "",
  });
  const [loading, setLoading] = useState(false);  // State to track loading
  const [errorMessage, setErrorMessage] = useState(""); // Error state
  const navigate = useNavigate();

  const fetchUserData = async (user) => {
    try {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserDetails(data);
        setFormData({
          leetcode: data.leetcode || "",
          gfg: data.gfg || "",
          codingNinjas: data.codingNinjas || "",
          photo: data.photo || "",  // Set the photo URL from Firestore
          college: data.college || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
          country: data.country || "",
          hackerEarth: data.hackerEarth || "",
          codeChef: data.codeChef || "",
          hackerRank: data.hackerRank || "",
        });
      } else {
        console.log("User data not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchUserData(user);
      else navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setFormData((prevState) => ({
        ...prevState,
        photo: objectURL,
      }));

      setLoading(true);  // Set loading to true before upload

      const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}`);
      try {
        // Upload the image to Firebase Storage
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef); // Get the uploaded image's download URL

        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "Users", user.uid);
          await updateDoc(docRef, { photo: photoURL }); // Update Firestore with the new photo URL
        }

        setLoading(false);  // Reset loading state after upload completes
      } catch (error) {
        console.error("Error uploading photo:", error.message);
        setLoading(false);  // Reset loading state if an error occurs
      }
    }
  };

  const handleRemovePhoto = async () => {
    setFormData((prevState) => ({
      ...prevState,
      photo: "",  // Remove the photo locally
    }));

    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "Users", user.uid);
      await updateDoc(docRef, { photo: "" });  // Remove photo from Firestore
    }
  };

  const handleSave = async () => {
    try {
      const { college, leetcode, gfg, codingNinjas, hackerEarth, codeChef, hackerRank } = formData;

      if (!college || !(leetcode || gfg || codingNinjas || hackerEarth || codeChef || hackerRank)) {
        setErrorMessage(
          "Please fill in the college and at least one profile from LeetCode, GFG, Coding Ninjas, HackerEarth, CodeChef, or HackerRank."
        );
        return;
      }

      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        await updateDoc(docRef, formData); // Save the form data to Firestore
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error saving user data:", error.message);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Log out the user
      navigate("/login"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800">
      {userDetails ? (
        <>
          <h1 className="text-2xl font-bold mt-6 text-white">Welcome, {userDetails.firstName}</h1>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-4xl mt-4 text-white">
            <div className="flex justify-between">
              <div className="w-full flex justify-center mb-4">
                <div className="relative mb-4">
                  <input
                    type="file"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0"
                  />
                  <img
                    src={formData.photo || "https://via.placeholder.com/150"}
                    alt="User Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white-500"
                  />
                </div>
                {loading && <div className="text-white">Uploading...</div>}
                
                {/* Option to remove/change profile picture */}
                <div className="mb-4 text-sm text-gray-400 flex space-x-4">
                  <button
                    onClick={handleRemovePhoto}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove Photo
                  </button>
                  
                  <label
                    htmlFor="photo-upload"
                    className="text-blue-500 cursor-pointer hover:text-blue-700"
                  >
                    Change Photo
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Form inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400">College (Required)</label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400">LinkedIn Profile</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400">GitHub Profile</label>
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                />
              </div>
            </div>

            {/* Other profile fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400">LeetCode Profile</label>
                <input
                  type="text"
                  name="leetcode"
                  value={formData.leetcode}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                  placeholder="Enter Your Leetcode Profile ID"
                />
              </div>
              <div>
                <label className="block text-gray-400">GFG Profile</label>
                <input
                  type="text"
                  name="gfg"
                  value={formData.gfg}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                  placeholder="Enter Your GFG Profile ID"
                />
              </div>
              <div>
                <label className="block text-gray-400">Coding Ninjas Profile</label>
                <input
                  type="text"
                  name="codingNinjas"
                  value={formData.codingNinjas}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                  placeholder="Enter Your Coding Ninjas Profile ID"
                />
              </div>
              <div>
                <label className="block text-gray-400">HackerEarth Profile</label>
                <input
                  type="text"
                  name="hackerEarth"
                  value={formData.hackerEarth}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                  placeholder="Enter Your HackerEarth Profile ID"
                />
              </div>
              <div>
                <label className="block text-gray-400">CodeChef Profile</label>
                <input
                  type="text"
                  name="codeChef"
                  value={formData.codeChef}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                  placeholder="Enter Your CodeChef Profile ID"
                />
              </div>
              <div>
                <label className="block text-gray-400">HackerRank Profile</label>
                <input
                  type="text"
                  name="hackerRank"
                  value={formData.hackerRank}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                  placeholder="Enter Your HackerRank Profile ID"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2">
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <div className="flex space-x-4">
                <button
                  onClick={handleBack}
                  className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-500"
                >
                  Back
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-6 text-lg text-white">Loading...</p>
      )}
    </div>
  );
}

export default DataInput;
