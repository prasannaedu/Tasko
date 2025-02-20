// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Communities from './pages/Communities';
import Login from './pages/Login';


function App() {
  return(
    <Router>
      <div className="min-h-screen bg-gray-100"> 
      <Navbar />
      <div className='container mx-auto p-4'>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/communities" element={<Communities />} />
      </Routes>
      </div>
      </div>

    </Router> 

  )
}

export default App;
