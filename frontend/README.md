# Operation Grandson Frontend

A React application for Operation Grandson - Bridging Conversations Across Generations.

## Features

- Modern React 18 with functional components and hooks
- Bootstrap 5 for responsive design and UI components
- React Bootstrap for enhanced Bootstrap components
- Interactive email signup form
- Responsive design that works on all devices
- Beautiful animations and hover effects

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── Header.js          # Header component with logo and title
│   ├── Hero.js            # Hero section component
│   ├── Features.js        # Features grid component
│   ├── InstallSection.js  # Browser install buttons
│   ├── EmailSignup.js     # Email signup form
│   └── Footer.js          # Footer component
├── App.js                 # Main app component
├── index.js              # React entry point
└── index.css             # Custom styles and animations
```

## Backend Integration

The app is configured to proxy API requests to the Flask backend running on port 5000. Make sure the backend server is running when testing API functionality.

## Technologies Used

- React 18
- Bootstrap 5
- React Bootstrap
- CSS3 with custom animations
- JavaScript ES6+
