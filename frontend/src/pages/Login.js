import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Login=()=>{
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const navigate=useNavigate();


    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response=await api.post('/token/',{username,password});
            localStorage.setItem('token',response.data.access);
            console.log(response.data.access);
            console.log('Successfully logged in')
            navigate('/dashboard');
        }
        catch(error){
            alert('Log in failed. Check our credentials:',error);
        }
    };
    return(
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Username</label>
                        <input type="text" id="username" value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input type="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg"/>
                    </div>
                    <button type="submit" className="w-full bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700">
                        Log in
                    </button>


                </form>

            </div>


        </div>
    )
};
export default Login;