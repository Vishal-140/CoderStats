import React from 'react';

const NavBar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-700 shadow-md">
      <div className="flex items-center">
        <img
          src="/logoCS.png"
          alt="CoderStats Logo"
          className="w-12 h-12 mr-3 rounded-full"
        />
        <span className="text-xl text-[30px] text-[#F8970D] font-bold">CoderStats</span>
      </div>

      <ul className="flex space-x-8">
        <li><a href="/question-tracker" className="text-lg text-white hover:text-[#F8970D]">Question Tracker</a></li>
        <li><a href="/event-tracker" className="text-lg text-white hover:text-[#F8970D]">Event Tracker</a></li>
        <li><a href="/profile-tracker" className="text-lg text-white hover:text-[#F8970D]">Profile Tracker</a></li>
      </ul>

      <div className="flex items-center space-x-4">
        {/* Profile option */}
        <div className="relative">
          <button className="text-gray-800 hover:text-gray-400">
            <span className="text-lg text-white hover:text-[#F8970D]">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
