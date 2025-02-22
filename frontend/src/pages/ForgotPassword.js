import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Password reset link sent to ${email}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Navbar */}
      {/* <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-xl font-bold">Tasko</Link>
        </div>
      </nav> */}

      {/* Forgot Password Form */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">Forgot Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Reset Password
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-blue-500 hover:text-blue-400"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;