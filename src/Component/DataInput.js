import React, { useEffect, useState } from "react";
import { auth, db, storage } from "./Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
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
        if (!userDetails) fetchUserData(user);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate, userDetails]);

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

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const { college, leetcode, gfg, codingNinjas, hackerEarth, codeChef, hackerRank } = formData;

      if (!college || !(leetcode || gfg || codingNinjas || hackerEarth || codeChef || hackerRank)) {
        setErrorMessage(
          "Please fill in the college and at least one profile from LeetCode, GFG, Coding Ninjas, HackerEarth, CodeChef, or HackerRank."
        );
        return;
      }

      const docRef = doc(db, "Users", user.uid);
      await updateDoc(docRef, formData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving user data:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800">
      {userDetails ? (
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-4">Update Your Details</h2>

          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">College</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">LeetCode</label>
            <input
              type="text"
              name="leetcode"
              value={formData.leetcode}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">GeeksforGeeks</label>
            <input
              type="text"
              name="gfg"
              value={formData.gfg}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Coding Ninjas</label>
            <input
              type="text"
              name="codingNinjas"
              value={formData.codingNinjas}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">GitHub</label>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">HackerEarth</label>
            <input
              type="text"
              name="hackerEarth"
              value={formData.hackerEarth}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">CodeChef</label>
            <input
              type="text"
              name="codeChef"
              value={formData.codeChef}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">HackerRank</label>
            <input
              type="text"
              name="hackerRank"
              value={formData.hackerRank}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      ) : (
        <p className="mt-6 text-lg text-white">Loading...</p>
      )}
    </div>
  );
}

export default DataInput;
