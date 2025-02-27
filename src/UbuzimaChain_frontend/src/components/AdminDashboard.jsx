import React, { useEffect, useState } from 'react';
import { createActor } from '../utils/actorUtils';

const AdminDashboard = ({ token }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actor, setActor] = useState(null);

  useEffect(() => {
    const initActor = async () => {
      try {
        const newActor = await createActor();
        setActor(newActor);
      } catch (err) {
        console.error('Actor initialization error:', err);
        setError('Failed to initialize connection');
        setLoading(false);
      }
    };
    initActor();
  }, []);

  useEffect(() => {
    const fetchAllPatients = async () => {
      if (!actor) return;
      try {
        console.log('Fetching all patients...');
        const result = await actor.get_all_patients();
        console.log('All patients result:', result); // <-- ADD THIS
        if ('Ok' in result) {
          setPatients(result.Ok);
        } else if ('Err' in result) {
          const errMsg = typeof result.Err === 'object'
            ? JSON.stringify(result.Err)
            : result.Err;
          throw new Error(errMsg);
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to fetch patients: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (actor) {
      fetchAllPatients();
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
          <p className="text-sm text-yellow-700">{error}</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DOB
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.id}
                  </td>
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
