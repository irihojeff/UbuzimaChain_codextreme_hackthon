import React, { useEffect, useState } from 'react';
import { createActor } from '../utils/actorUtils';

const MyProfile = ({ userId, token }) => {
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const actor = await createActor();
                const result = await actor.get_my_patient_details();
                
                if ('Ok' in result) {
                    setPatient(result.Ok);
                } else if ('Err' in result) {
                    throw new Error(Object.keys(result.Err)[0]);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch patient details');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientDetails();
    }, [userId]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="max-w-6xl mx-auto p-4">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                    No patient profile found
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
                <p className="mb-2"><strong>Name:</strong> {patient.full_name}</p>
                <p className="mb-2"><strong>Date of Birth:</strong> {patient.date_of_birth}</p>
                <p className="mb-2"><strong>Gender:</strong> {patient.gender}</p>
                <p className="mb-2"><strong>Blood Type:</strong> {patient.blood_type || 'N/A'}</p>
                
                <div className="mt-4">
                    <strong>Emergency Contacts:</strong>
                    <ul className="mt-2 space-y-2">
                        {patient.emergency_contacts.map((contact, index) => (
                            <li key={index} className="ml-4">
                                <p>{contact.name}</p>
                                <p className="text-sm text-gray-600">
                                    {contact.relationship} • {contact.phone}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;