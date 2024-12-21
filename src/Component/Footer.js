import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>&copy; 2024 Vishal Kumar Chaurasia. All rights reserved.</p>
      <p>
        <a href="https://github.com/Vishal-140" target="_blank" rel="noopener noreferrer" style={linkStyle}>GitHub</a> | 
        <a href="https://www.linkedin.com/in/vishalkrchaurasia/" target="_blank" rel="noopener noreferrer" style={linkStyle}> LinkedIn</a>
      </p>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#34495e',
  color: '#ecf0f1',
  textAlign: 'center',
  padding: '20px',
  marginTop: '20px', // Add some space above the footer
  // Do not use position: fixed to avoid it being stuck to the bottom
  // This allows it to move naturally with the page content
};

const linkStyle = {
  color: '#ecf0f1',
  textDecoration: 'none',
  margin: '0 10px',
};

export default Footer;
