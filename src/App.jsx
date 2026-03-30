import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Contests from './pages/Contests.jsx';
import AboutPage from './pages/Aboutpage.jsx';


function App() {
  return (
    <Routes>

      <Route path="/" element={<Dashboard />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/contests" element={<Contests />} />
    </Routes>
  );
}

export default App;

