import React, { useEffect, useState } from 'react';
import { auth, db } from './Firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [usernames, setUsernames] = useState({
    leetcode: '',
    gfg: '',
    codingNinjas: '',
    hackerEarth: '',
    codeChef: '',
    hackerRank: '',
  });
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  const defaultValues = {
    photo: '/logoCS.png',
  };

  const fetchUserData = (userId) => {
    const docRef = doc(db, 'Users', userId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        userData.photo = userData.photo || '/logoCS.png';
        setUserDetails(userData); // This will update the profile photo automatically
      } else {
        console.log('User data not found');
      }
    });

    return unsubscribe; // Cleanup the listener when the component unmounts
  };

  const fetchUsernames = (userId) => {
    const userRef = doc(db, 'Users', userId);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsernames({
          leetcode: data.leetcode || '',
          gfg: data.gfg || '',
          codingNinjas: data.codingNinjas || '',
          hackerEarth: data.hackerEarth || '',
          codeChef: data.codeChef || '',
          hackerRank: data.hackerRank || '',
        });
      }
    });

    return unsubscribe; // Cleanup the listener when the component unmounts
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUsernames(currentUser.uid); // Fetch and listen for changes in user data
        fetchUserData(currentUser.uid); // Listen for changes in user data (including photo)
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogOut = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const profilePhoto = userDetails ? userDetails.photo : defaultValues.photo;

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown open/close
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-700 shadow-md">
      <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
        <img
          src="/logoCS.png"
          alt="CoderStats Logo"
          className="w-12 h-12 mr-3 rounded-full"
        />
        <span className="text-xl text-[30px] text-[#F8970D] font-bold">CoderStats</span>
      </div>

      <ul className="flex space-x-8">
        {/* Dashboard link */}
        <li>
          <a href="/dashboard" className="text-lg font-bold text-white hover:text-[#F8970D]">
            Dashboard
          </a>
        </li>

        {usernames.leetcode && (
          <li>
            <a href="/leetcode" className="text-lg font-bold text-white hover:text-[#F8970D]">
              LeetCode
            </a>
          </li>
        )}
        {usernames.gfg && (
          <li>
            <a href="/gfg" className="text-lg font-bold text-white hover:text-[#F8970D]">
              GeeksForGeeks
            </a>
          </li>
        )}
        {usernames.codingNinjas && (
          <li>
            <a href="/codingNinjas" className="text-lg font-bold text-white hover:text-[#F8970D]">
              Coding Ninjas
            </a>
          </li>
        )}
        {usernames.hackerEarth && (
          <li>
            <a href="/hackerEarth" className="text-lg font-bold text-white hover:text-[#F8970D]">
              HackerEarth
            </a>
          </li>
        )}
        {usernames.codeChef && (
          <li>
            <a href="/codeChef" className="text-lg text-white hover:text-[#F8970D]">
              CodeChef
            </a>
          </li>
        )}
        {usernames.hackerRank && (
          <li>
            <a href="/hackerRank" className="text-lg font-bold text-white hover:text-[#F8970D]">
              HackerRank
            </a>
          </li>
        )}
      </ul>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="relative">
            <button onClick={handleDropdownClick} className="text-gray-800 hover:text-gray-400">
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white rounded-lg shadow-lg">
                <div className="p-2">
                  <p className="text-sm font-semibold">{user.displayName}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                <div className="border-t border-gray-600">
                  <button
                    onClick={() => navigate('/datainput')}
                    className="w-full text-left p-2 text-white hover:text-[#F8970D]"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogOut}
                    className="w-full text-left p-2 text-white hover:text-[#F8970D]"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
