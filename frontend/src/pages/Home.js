import React from "react";
import {Link} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home=()=>{
    const {isAuthenticated}=useAuth();
    return(
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Welcome to Tasko</h1>
            <p className="text-gray-700">your productivity companion</p>

            {isAuthenticated&&(
                <div>
                    <Link to="/login" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">Login</Link>"

                </div>
            )}
        </div>
    );
};
export default Home;