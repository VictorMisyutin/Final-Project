import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// import pages/components
import Header from './Components/Header/Header';
import ProtectedRoute from './Components/ProtectedComponent/ProtectedComponent';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import AddMatch from './pages/AddMatch/AddMatch';
import Players from './pages/Players/Players';
import Results from './pages/Results/Results';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
      <Route path="/add-match" element={<ProtectedRoute><AddMatch /></ProtectedRoute>}/>
      <Route path="/players" element={<Players /> }/>
      <Route path="/results" element={<Results />}/>
      <Route path="/profile/:userid" element={<Profile />}/>
    </Routes>
    </>
  );
}

export default App;
