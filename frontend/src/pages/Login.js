import React,{useState} from "react";
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const Login=()=>{
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const navigate=useNavigate();
    const {login}=useAuth();
    const[error,setError]=useState(null);


    const handleSubmit=async(e)=>{
        e.preventDefault();
        if (password === '' || username === '') {
          setError('Please fill in all details.');
          return;
        }
        try{
            const response=await api.post('/token/',{username,password});
            login(response.data.access);
            // localStorage.setItem('token',response.data.access);
            console.log(response.data.access);
            console.log('Successfully logged in')
            navigate('/dashboard');
        }
        catch(error){
            // alert('Log in failed. Check our credentials',error);
            setError('Log in failed. Check your credentials or please try again later');
        }
    };
    return(

        <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Navbar */}
      {/* <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-xl font-bold">Tasko</Link>
        </div>
      </nav> */}

      {/* Login Form */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-blue-500 hover:text-blue-400"
            >
              Forgot Password?
            </Link>
            <p className="text-gray-400 mt-2">
              Don't have an account?{' '}
              <Link
                to="/create-account"
                className="text-blue-500 hover:text-blue-400"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>


        // <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        //     <div className="bg-white p-8 rounded-lg shadow-md w-96">
        //         <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        //         <form onSubmit={handleSubmit} className="space-y-4">
        //             <div>
        //                 <label className="block text-gray-700 mb-2">Username</label>
        //                 <input type="text" id="username" value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg"/>
        //             </div>
        //             <div>
        //                 <label className="block text-gray-700 mb-2">Password</label>
        //                 <input type="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg"/>
        //             </div>
        //             <button type="submit" className="w-full bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700">
        //                 Login
        //             </button>


        //         </form>

        //     </div>


        // </div>
    )
};
export default Login;