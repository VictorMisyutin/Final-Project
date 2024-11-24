import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// import pages/components
import Header from './Components/Header/Header';
import ProtectedRoute from './Components/ProtectedComponent/ProtectedComponent';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';



function App() {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/dashboard" element={<ProtectedRoute><Register /></ProtectedRoute>}/>
    </Routes>
    </>
  );
}

export default App;
