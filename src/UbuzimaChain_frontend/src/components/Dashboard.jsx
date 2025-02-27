import React, { useState, useEffect } from 'react';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from '../declarations/UbuzimaChain_backend/UbuzimaChain_backend.did.js';
import PatientRegistration from './PatientRegistration';
import { ErrorBoundary } from './ErrorBoundary';
import { Link } from 'react-router-dom';

const Dashboard = ({ userId, token, onLogout, setUserRole }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actor, setActor] = useState(null);

  // Initialize IC actor with REACT_APP_ environment variables
  const initActor = async () => {
    try {
      const canisterId = process.env.REACT_APP_CANISTER_ID_UBUZIMACHAIN_BACKEND || 'bkyz2-fmaaa-aaaaa-qaaaq-cai';
      const host = process.env.REACT_APP_DFX_NETWORK === 'ic'
        ? 'https://boundary.ic0.app'
        : 'http://localhost:4943';

      const agent = new HttpAgent({ host });
      if (process.env.REACT_APP_DFX_NETWORK !== 'ic') {
        await agent.fetchRootKey();
      }

      const newActor = Actor.createActor(idlFactory, { agent, canisterId });
      setActor(newActor);
      return newActor;
    } catch (err) {
      console.error('Actor initialization failed:', err);
      setError('Failed to initialize the application');
      return null;
    }
  };

  // Fetch user details (which includes role) from the canister
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const currentActor = actor || await initActor();
        if (!currentActor) return;

        console.log('Fetching user details for ID:', userId);
        const result = await currentActor.get_user(userId);
        if ('Ok' in result) {
          console.log('User details:', result.Ok);
          setUserDetails(result.Ok);
          // Derive role string from the variant (e.g., { Patient: null } becomes "Patient")
          const roleKey = Object.keys(result.Ok.role)[0];
          setUserRole(roleKey);
        } else {
          throw new Error(result.Err || 'Failed to fetch user details');
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err.message || 'An error occurred while fetching user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, actor, setUserRole]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div className="mt-4 text-lg">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-600 text-xl font-semibold mb-4">Error</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Dashboard Components for different roles
  const DoctorDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Doctor Dashboard</h2>
      <ErrorBoundary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Patient Management</h3>
            <div className="space-y-4">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                View Patient List
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                Add New Patient
              </button>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-2">
              <p className="text-gray-600">No recent activities</p>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );

  const PatientDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Patient Dashboard</h2>
      <ErrorBoundary>
        <div className="bg-white shadow rounded-lg p-6">
          <PatientRegistration 
            userId={userId} 
            token={token} 
            actor={actor}
            onError={setError}
          />
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <Link
            to="/my-profile"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            View My Profile
          </Link>
        </div>
      </ErrorBoundary>
    </div>
  );

  const AdminDashboardComponent = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Admin Dashboard</h2>
      <ErrorBoundary>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">User Management</h3>
            <div className="space-y-2">
              <Link
                to="/admin-dashboard"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Manage Patients
              </Link>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">System Stats</h3>
            <div className="space-y-2">
              <p className="text-gray-600">Loading statistics...</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Audit Log</h3>
            <div className="space-y-2">
              <p className="text-gray-600">No recent activities</p>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );

  const renderDashboardContent = () => {
    if (!userDetails) return null;
    // Convert the variant to a string key
    const roleKey = Object.keys(userDetails.role)[0];
    console.log("User role:", roleKey);

    switch (roleKey) {
      case 'Patient':
        return <PatientDashboard />;
      case 'Doctor':
        return <DoctorDashboard />;
      case 'Admin':
        return <AdminDashboardComponent />;
      default:
        return (
          <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            Unknown user role: {JSON.stringify(userDetails.role)}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {userDetails?.username}
            </h1>
            <p className="text-gray-600 mt-1">
              Role: {Object.keys(userDetails?.role)[0]}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              Refresh
            </button>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              Logout
            </button>
          </div>
        </div>
        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default Dashboard;
