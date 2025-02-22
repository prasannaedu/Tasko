// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Communities from './pages/Communities';
import Login from './pages/Login';



const App=()=>{
  return(
    <AuthProvider>
      <Router>
        <AppContent/>
      </Router>
    </AuthProvider>
  );
};

const AppContent=()=>{
  const {isAuthenticated}=useAuth();
  const location = useLocation();

  const hiddenNavbarRoutes = ["/", "/create-account", "/forgot-password"];


  return(
    <div className='min-h-screen bg-gray-900'>
      {!hiddenNavbarRoutes.includes(location.pathname) && <Navbar />}

      <div className='container mx-auto '>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {isAuthenticated?(
            <>
              {/* <Navbar /> */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/communities" element={<Communities />} />
            </>
          ):(<Route path='*' element={<Navigate to="/"/>}/>)}
        </Routes>
      </div>


    </div>
  )
}

// function App() {
//   return(
//     <Router>
//       <div className="min-h-screen bg-gray-100"> 
//       <Navbar />
//       <div className='container mx-auto p-4'>

//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<Home />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/communities" element={<Communities />} />
//       </Routes>
//       </div>
//       </div>

//     </Router> 

//   )
// }

export default App;
