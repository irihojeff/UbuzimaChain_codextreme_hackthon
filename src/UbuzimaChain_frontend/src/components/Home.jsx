import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to UbuzimaChain</h1>
      <p className="mb-6">
        A secure, blockchain-based healthcare system. Please login or register to get started.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default Home;
