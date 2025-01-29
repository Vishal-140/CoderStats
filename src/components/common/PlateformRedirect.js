import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import leetcode from "../../assets/logos/leetcode.png";
import gfg from "../../assets/logos/gfg.png";
import codeforces from "../../assets/logos/codeforces.png";

function PlateformRedirect({ usernames }) {
  const navigate = useNavigate();

  const handleRedirect = (platform, username) => {
    let url = '';
    switch (platform) {
      case 'leetcode':
        url = `https://leetcode.com/${username}`;
        break;
      case 'gfg':
        url = `https://www.geeksforgeeks.org/user/${username}`;
        break;
      case 'codeforces':
        url = `https://codeforces.com/profile/${username}`;
        break;
      default:
        alert('Invalid platform');
        return;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 bg-gray-700 rounded-lg">
      <h2 className="text-lg font-semibold text-blue-300 mb-3">Platform Redirect</h2>
      
      {usernames.leetcode && (
        <div
          className="card bg-gray-600 p-4 rounded-lg shadow-md text-center text-white cursor-pointer w-full mb-4 flex items-center transition-transform transform hover:bg-yellow-600 hover:scale-105 hover:shadow-lg"
          onClick={() => handleRedirect('leetcode', usernames.leetcode)}
        >
          <img
            src={leetcode}
            alt="Leetcode Logo"
            className="w-8 h-8 ml-8 mr-5"
          />
          <h3 className="text-xl">Leetcode</h3>
        </div>
      )}
  
      {usernames.gfg && (
        <div
          className="card bg-gray-600 p-4 rounded-lg shadow-md text-center text-white cursor-pointer w-full mb-4 flex items-center transition-transform transform hover:bg-green-600 hover:scale-105 hover:shadow-lg"
          onClick={() => handleRedirect('gfg', usernames.gfg)}
        >
          <img
            src={gfg}
            alt="GFG Logo"
            className="w-8 h-8 ml-8 mr-5"
          />
          <h3 className="mt-2 text-xl">GeeksForGeeks</h3>
        </div>
      )}
  
      {usernames.codeforces && (
        <div
          className="card bg-gray-600 p-4 rounded-lg shadow-md text-center text-white cursor-pointer w-full mb-4 flex items-center transition-transform transform hover:bg-blue-800 hover:scale-105 hover:shadow-lg"
          onClick={() => handleRedirect('codeforces', usernames.codeforces)}
        >
          <img
            src={codeforces}
            alt="Codeforces Logo"
            className="w-8 h-8 ml-8 mr-5"
          />
          <h3 className="mt-2 text-xl">Codeforces</h3>
        </div>
      )}
    </div>
  );
  
}

export default PlateformRedirect;
