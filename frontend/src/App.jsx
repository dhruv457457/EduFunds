import { useState,useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const App = () => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    if (!import.meta.env.VITE_PINATA_API_KEY || !import.meta.env.VITE_PINATA_SECRET_KEY) {
      console.error('Pinata credentials missing!');
      alert('Configuration error - check console for details');
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile userData={userData} />} />
      </Routes>
    </Router>
  );
};

export default App;