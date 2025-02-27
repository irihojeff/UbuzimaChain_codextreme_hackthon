import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

export default function AuthSection() {
  // State to toggle between login and register forms
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left side: Form (Login or Register) */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-50 p-8">
        {showRegister ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Create Your Account</h2>
            <Register />
            <p className="mt-4">
              Already have an account?{' '}
              <button
                onClick={() => setShowRegister(false)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Sign In
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Sign In to Your Account</h2>
            <Login />
            <p className="mt-4">
              Don’t have an account?{' '}
              <button
                onClick={() => setShowRegister(true)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Sign Up
              </button>
            </p>
          </>
        )}
      </div>

      {/* Right side: An optional illustration or branding area */}
      <div className="hidden md:flex flex-1 bg-indigo-500 items-center justify-center">
        <h1 className="text-white text-3xl font-bold">
          UbuzimaChain <br /> Hospital Management
        </h1>
      </div>
    </div>
  );
}
