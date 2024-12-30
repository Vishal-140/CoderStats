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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
          photo: data.photo || "",
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
      if (user) {
        fetchUserData(user);
        // Check for required fields after fetching user data
        if (!userDetails?.college || !userDetails?.leetcode) {
          navigate("/datainput");
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [userDetails, navigate]);

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

      setLoading(true);

      const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}`);
      try {
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);

        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "Users", user.uid);
          await updateDoc(docRef, { photo: photoURL });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error uploading photo:", error.message);
        setLoading(false);
      }
    }
  };

  const handleRemovePhoto = async () => {
    setFormData((prevState) => ({
      ...prevState,
      photo: "",
    }));

    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "Users", user.uid);
      await updateDoc(docRef, { photo: "" });
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
        await updateDoc(docRef, formData);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error saving user data:", error.message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
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
            <div className="mb-4">
              <label className="block text-gray-300">College</label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded mt-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your college"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">LeetCode</label>
              <input
                type="text"
                name="leetcode"
                value={formData.leetcode}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded mt-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your LeetCode ID"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">GeeksforGeeks (GFG)</label>
              <input
                type="text"
                name="gfg"
                value={formData.gfg}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded mt-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your GFG ID"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">Coding Ninjas</label>
              <input
                type="text"
                name="codingNinjas"
                value={formData.codingNinjas}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded mt-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Coding Ninjas ID"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">HackerEarth</label>
              <input
                type="text"
                name="hackerEarth"
                value={formData.hackerEarth}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded mt-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your HackerEarth ID"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">CodeChef</label>
              <input
                type="text"
                name="codeChef"
                value={formData.codeChef}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded mt-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your CodeChef ID"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">HackerRank</label>
              <input
                type="text"
                name="hackerRank"
                value={formData.hackerRank}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded mt-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your HackerRank ID"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded mt-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your LinkedIn URL"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">GitHub</label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded mt-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your GitHub URL"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded mt-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your country"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300">Profile Picture</label>
              {formData.photo ? (
                <div className="relative">
                  <img
                    src={formData.photo}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover mx-auto mt-2"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-0 right-0 text-white bg-red-600 p-1 rounded-full"
                  >
                    X
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  onChange={handlePhotoUpload}
                  className="w-full p-2 mt-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none"
                />
              )}
              {loading && <p className="text-center text-gray-300 mt-2">Uploading...</p>}
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-gray-500 rounded text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 rounded text-white"
              >
                Save
              </button>
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
