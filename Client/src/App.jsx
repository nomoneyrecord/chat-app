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
        <Route path="/login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate replace to="/" />} />
        <Route path="/" element={isLoggedIn ? <HomePage onLogout={handleLogout} /> : <Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
