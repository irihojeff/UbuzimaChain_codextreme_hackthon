import React, { useEffect, useState } from 'react';
import { createActor } from '../utils/actorUtils';

const AdminDashboard = ({ token }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actor, setActor] = useState(null);

  // Initialize actor on component mount
  useEffect(() => {
    const initActor = async () => {
      try {
        // Use REACT_APP_ environment variables for consistency
        const newActor = await createActor();
        console.log('Actor methods:', Object.getOwnPropertyNames(newActor));
        setActor(newActor);
      } catch (err) {
        console.error('Actor initialization error:', err);
        setError('Failed to initialize connection');
        setLoading(false);
      }
    };

    initActor();
  }, []);

  // Fetch all patients once the actor is ready
  useEffect(() => {
    const fetchPatients = async () => {
      if (!actor) return;

      try {
        console.log('Fetching all patients');
        const result = await actor.get_all_patients();
        console.log('All patients result:', result);

        if (result.Ok) {
          setPatients(result.Ok);
        } else if (result.Err) {
          // Convert error variant to a string message
          const errorType = typeof result.Err === 'object'
            ? JSON.stringify(result.Err)
            : result.Err;
          throw new Error(errorType);
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to fetch patients: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (actor) {
      fetchPatients();
    }
  }, [actor]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      
      {error ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.date_of_birth}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.blood_type || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
