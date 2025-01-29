import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#34495E] text-white text-center py-6 mt-6">
      <p>&copy; {currentYear} Vishal Kumar Chaurasia. All rights reserved.</p>
      <p>
        <a
          href="https://github.com/Vishal-140"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-400 mx-2"
        >
          GitHub
        </a> 
        | 
        <a
          href="https://www.linkedin.com/in/vishalkrchaurasia/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-400 mx-2"
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
};

export default Footer;
