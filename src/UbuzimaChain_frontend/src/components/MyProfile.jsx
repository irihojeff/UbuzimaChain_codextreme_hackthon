import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyProfile = ({ userId, token }) => {
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const response = await axios.get('/api/patients/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPatient(response.data);
            } catch (err) {
                setError(err.response?.data || 'Failed to fetch patient details');
            }
        };

        fetchPatientDetails();
    }, [userId, token]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!patient) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
                <p><strong>Name:</strong> {patient.full_name}</p>
                <p><strong>Date of Birth:</strong> {patient.date_of_birth}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Blood Type:</strong> {patient.blood_type || 'N/A'}</p>
                <p><strong>Emergency Contacts:</strong></p>
                <ul>
                    {patient.emergency_contacts.map((contact, index) => (
                        <li key={index}>
                            {contact.name} ({contact.relationship}): {contact.phone}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyProfile;