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
    <div className="bg-gray-700 p-4 rounded-lg shadow-md w-full mt-6">
      <h3 className="text-lg font-semibold">Submission Calendar</h3>
      <div className="mt-4">
        <LeetCodeCalendar
          username={username}              // Pass username for identification
          blockSize={12}                   // Block size for the calendar
          blockMargin={4}                  // Margin between blocks
          fontSize={12}                    // Font size inside blocks
          theme={customTheme}              // Apply the custom theme
          style={{ maxWidth: '800px', margin: '0 auto' }} // Calendar styling
          submissionCalendar={calendarData} // Pass the formatted submission calendar data
        />
      </div>
    </div>
  );
};

export default CalendarCard;
