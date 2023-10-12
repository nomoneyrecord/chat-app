import { useState } from 'react';
import Login from './Pages/Login';
import HomePage from './Pages/Home'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={<HomePage onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
