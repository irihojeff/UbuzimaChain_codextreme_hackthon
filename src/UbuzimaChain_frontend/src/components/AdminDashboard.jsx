import React, { useEffect, useState } from 'react';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from '../declarations/UbuzimaChain_backend/UbuzimaChain_backend.did.js';

const AdminDashboard = ({ token }) => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllPatients = async () => {
            try {
                const actor = await createActor();
                const allPatients = await actor.get_all_patients();
                setPatients(allPatients);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchAllPatients();
    }, [token]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                        <th>Blood Type</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.id}>
                            <td>{patient.id}</td>
                            <td>{patient.full_name}</td>
                            <td>{patient.date_of_birth}</td>
                            <td>{patient.gender}</td>
                            <td>{patient.blood_type || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;