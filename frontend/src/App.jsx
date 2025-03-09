import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";

const App = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Perform any necessary initialization here
        // For example:
        // - Check blockchain connection
        // - Load user data if authenticated
        // - Initialize services

        // Simulate initialization delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Initialization error:', error);
        setInitError(error.message);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (initError) {
    return <ErrorScreen 
      error={initError}
      onRetry={() => window.location.reload()}
    />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/profile" 
          element={
            <Profile 
              userData={userData} 
              setUserData={setUserData} 
            />
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;