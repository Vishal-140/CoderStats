# CoderStats - Coding Profile Analytics Platform
[https://coderstats-live.vercel.app](https://coderstats-live.vercel.app)

## Project Overview
CoderStats is a web application that aggregates and visualizes coding profiles from multiple competitive programming platforms. It helps users track their programming journey across different coding platforms in one unified dashboard with optimized performance and a seamless user experience.

## Key Features
1. **Authentication System**
   - Email/Password login
   - Google OAuth integration
   - Secure user profile management

2. **Multi-Platform Integration**
   - LeetCode stats tracking
   - CodeForces performance metrics
   - GeeksForGeeks (GFG) progress monitoring

3. **Dashboard Features**
   - Problems solved counter across platforms
   - Rating progress visualization
   - Difficulty-wise problem breakdown (Easy, Medium, Hard)
   - Recent submissions timeline
   - Performance heatmap
   - Cross-platform data aggregation

4. **User Profile Management**
   - College/Institution details
   - Platform usernames linking
   - Profile photo integration

5. **Performance Optimizations**
   - Centralized data management
   - Smart data loading with caching
   - Optimized component rendering
   - Responsive design for all devices

## Technical Architecture
- **Frontend**: React.js with Tailwind CSS
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Real-time updates
- **External APIs**
  - LeetCode API
  - CodeForces API
  - GeeksForGeeks API
- **State Management**
  - Context API with centralized GlobalDataContext
  - Optimized data fetching with debouncing
  - Intelligent caching mechanism

## Technical Implementation Highlights

### Centralized Data Management
- Implemented GlobalDataContext to ensure data is loaded only once when the website is opened
- Added dataLoaded state flag to track when data has been loaded
- Consolidated all platform data fetching in one place
- Eliminated redundant API calls when navigating between pages

### Performance Optimizations
- React.memo for preventing unnecessary re-renders
- useMemo and useCallback for computed values and functions
- Responsive containers for better chart display on different screen sizes
- Data debouncing to prevent excessive API calls
- 5-minute cache expiry to avoid redundant data fetching

## Purpose
The platform aims to help:
- Competitive programmers track their progress
- Students showcase their coding achievements
- Recruiters evaluate candidates' coding profiles
- Users identify areas for improvement across platforms

## Target Users
- Competitive programmers
- College students
- Software developers
- Coding enthusiasts

## Getting Started

### Prerequisites
- Node.js and npm installed
- Firebase account for backend services

### Installation
1. Clone the repository
2. Install dependencies with `npm install`
3. Configure Firebase credentials
4. Start the development server with `npm start`
