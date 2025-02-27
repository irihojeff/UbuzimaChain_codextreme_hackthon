import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

const DoctorDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Doctor Dashboard</h2>
      <ErrorBoundary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Management Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Patient Management</h3>
            <div className="space-y-4">
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                // TODO: Add functionality to fetch and display the patient list
              >
                View Patient List
              </button>
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                // TODO: Add functionality to add a new patient
              >
                Add New Patient
              </button>
            </div>
          </div>
          {/* Recent Activities Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-2">
              {/* TODO: Replace placeholder with dynamic data when available */}
              <p className="text-gray-600">No recent activities</p>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default DoctorDashboard;
