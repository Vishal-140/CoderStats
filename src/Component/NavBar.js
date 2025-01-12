import React, { useEffect, useState, useCallback } from 'react';
import { auth, db } from './auth/Firebase';
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
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const defaultValues = {
    photo: '/logoCS.png',
  };

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

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

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest('.dropdown')) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [dropdownOpen]);

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setNavVisible(false);
    } else {
      setNavVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 shadow-md z-50 transition-transform duration-300 ${
        navVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex justify-between items-center pt-1 pl-4 pr-4">
      <div className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/dashboard')}
            >
              <img
                src="/logoCS.png"
                alt="CoderStats Logo"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                CoderStats
              </span>
      </div>

      <div className="hidden md:flex space-x-6 items-center justify-center">
  {usernames.leetcode && (
    <Link to="/dashboard" className="flex flex-col items-center text-md font-bold text-white hover:text-[#F8970D]">
      <img
        src="/dashboard.png"
        alt="dashboard Logo"
        className="w-8 h-8 rounded-full"
      />
      <span>Dashboard</span>
    </Link>
  )}
  {usernames.leetcode && (
    <Link to="/leetcode" className="flex flex-col items-center text-md font-bold text-white hover:text-[#F8970D]">
      <img
        src="/leetcode.png"
        alt="leetcode Logo"
        className="w-8 h-8 rounded-full"
      />
      <span>Leetcode</span>
    </Link>
  )}
  {usernames.gfg && (
    <Link to="/gfg" className="flex flex-col items-center text-md font-bold text-white hover:text-[#F8970D]">
      <img
        src="/gfg.png"
        alt="gfg Logo"
        className="w-8 h-8 rounded-full"
      />
      <span>GeeksForGeeks</span>
    </Link>
  )}
  {usernames.codeforces && (
    <Link to="/codeforces" className="flex flex-col items-center text-md font-bold text-white hover:text-[#F8970D]">
      <img
        src="/codeforces.png"
        alt="Codeforces Logo"
        className="w-8 h-8 rounded-full"
      />
      <span>CodeForces</span>
    </Link>
  )}
</div>



        <div className="flex items-center">
          {user && (
            <div className="relative dropdown">
              <button onClick={handleDropdownClick}>
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
          <button
            className="ml-4 md:hidden text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden flex gap-10 bg-gray-800 text-white p-4 items-center justify-center"
>
          {usernames.leetcode && (
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
              <img
                src="/dashboard.png"
                alt="dashboard Logo"
                className="w-8 h-8 rounded-full"
              />
            </Link>
          )}
          {usernames.leetcode && (
            <Link to="/leetcode" onClick={() => setIsMobileMenuOpen(false)}>
              <img
                src="/leetcode.png"
                alt="leetcode Logo"
                className="w-8 h-8 rounded-full"
              />
            </Link>
          )}
          {usernames.gfg && (
            <Link to="/gfg" onClick={() => setIsMobileMenuOpen(false)}>
              <img
                src="/gfg.png"
                alt="gfg Logo"
                className="w-8 h-8 rounded-full"
              />
            </Link>
          )}
          {usernames.codeforces && (
            <Link to="/codeforces" onClick={() => setIsMobileMenuOpen(false)}>
              <img
                src="/codeforces.png"
                alt="codeforces Logo"
                className="w-8 h-8 rounded-full"
              />
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default React.memo(NavBar);
