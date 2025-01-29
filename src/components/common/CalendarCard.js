import React from 'react';
import LeetCodeCalendar from 'leetcode-calendar';

const CalendarCard = ({ username, calendarData }) => {
  // Custom theme for the calendar with different shades of green for activity
  const customTheme = {
    light: [
      'rgba(106, 114, 128, 1)', // Light grey for empty blocks
      'rgba(22, 163, 74, 0.3)', // Light green for low activity
      'rgba(22, 163, 74, 0.6)', // Medium green for moderate activity
      'rgba(22, 163, 74, 0.8)', // Dark green for high activity
      'rgba(22, 163, 74, 1)',   // Solid green for very high activity
    ],
    dark: [
      'rgba(106, 114, 128, 1)', // Light grey for empty blocks
      'rgba(22, 163, 74, 0.3)', // Light green for low activity
      'rgba(22, 163, 74, 0.6)', // Medium green for moderate activity
      'rgba(22, 163, 74, 0.8)', // Dark green for high activity
      'rgba(22, 163, 74, 1)',   // Solid green for very high activity
    ],
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md w-full mt-6 max-w-4xl mx-auto sm:p-6 md:mt-8 lg:mt-10">
      <h3 className="text-lg font-semibold text-center md:text-xl lg:text-2xl">Submission Calendar</h3>
      <div className="mt-4 flex justify-center">
        <LeetCodeCalendar
          username={username}              // Pass username for identification
          blockSize={window.innerWidth < 640 ? 8 : 12}  // Smaller blocks on smaller screens
          blockMargin={window.innerWidth < 640 ? 2 : 4} // Smaller margins on smaller screens
          fontSize={window.innerWidth < 640 ? 10 : 12}  // Smaller font size on smaller screens
          theme={customTheme}              // Apply the custom theme
          style={{ maxWidth: '100%', margin: '0 auto' }} // Calendar styling
          submissionCalendar={calendarData} // Pass the formatted submission calendar data
        />
      </div>
    </div>
  );
};

export default CalendarCard;
