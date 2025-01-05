import React, { useEffect, useState, useCallback } from 'react';
import { auth, db } from './Firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [usernames, setUsernames] = useState({
    leetcode: '',
    gfg: '',
    codeforces: '',
  });
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  const defaultValues = {
    photo: '/logoCS.png',
  };

  // Firebase persistence to avoid session loss
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        onAuthStateChanged(auth, (currentUser) => {
          setUser((prevUser) => {
            // Set user only if the current user is different
            if (prevUser?.uid !== currentUser?.uid) {
              return currentUser;
            }
            return prevUser;
          });
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  // Fetch user data and update only if it changes
  const fetchUserData = useCallback((userId) => {
    const docRef = doc(db, 'Users', userId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        userData.photo = userData.photo || defaultValues.photo;
        setUserDetails(userData); 
      } else {
        console.log('User data not found');
      }
    });
    return unsubscribe;
  }, []);

  const fetchUsernames = useCallback((userId) => {
    const userRef = doc(db, 'Users', userId);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsernames({
          leetcode: data.leetcode || '',
          gfg: data.gfg || '',
          codeforces: data.codeforces || '',
        });
      }
    });
    return unsubscribe;
  }, []);

  // Handle user authentication state changes
  useEffect(() => {
    if (user) {
      const unsubscribeUsernames = fetchUsernames(user.uid); 
      const unsubscribeUserData = fetchUserData(user.uid); 

      return () => {
        unsubscribeUsernames();
        unsubscribeUserData();
      };
    }
  }, [user, fetchUserData, fetchUsernames]);

  const handleLogOut = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const profilePhoto = userDetails?.photo || defaultValues.photo;

  const handleDropdownClick = useCallback(() => {
    setDropdownOpen((prev) => !prev); 
  }, []);

  useEffect(() => {
    let timer;
    if (dropdownOpen) {
      timer = setTimeout(() => {
        setDropdownOpen(false);
      }, 5000);
    }
    return () => clearTimeout(timer); 
  }, [dropdownOpen]);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-700 shadow-md">
      <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
        <img
          src='/logoCS.png'
          alt="CoderStats Logo"
          className="w-12 h-12 mr-3 rounded-full"
        />
        <span className="text-xl text-[30px] text-[#F8970D] font-bold">CoderStats</span>
      </div>

      <ul className="flex space-x-8">
        {/* Dashboard link */}
        
        {usernames.leetcode && (
          <li>
            <Link to="/dashboard" className="text-lg font-bold text-white hover:text-[#F8970D]">
            Dashboard
            </Link>
          </li>
        )}

        {usernames.leetcode && (
          <li>
            <Link to="/leetcode" className="text-lg font-bold text-white hover:text-[#F8970D]">
              LeetCode
            </Link>
          </li>
        )}
        {usernames.gfg && (
          <li>
            <Link to="/gfg" className="text-lg font-bold text-white hover:text-[#F8970D]">
              GeeksForGeeks
            </Link>
          </li>
        )}
        {usernames.codeforces && (
          <li>
            <Link to="/codeforces" className="text-lg font-bold text-white hover:text-[#F8970D]">
              CodeForces
            </Link>
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

export default React.memo(NavBar);
