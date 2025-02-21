import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PatientRegistration from './PatientRegistration';
import { ErrorBoundary } from './ErrorBoundary';
import { createActor } from '../utils/actorUtils';

const PatientDashboard = ({ userId, token, setError }) => {
    const [patientDetails, setPatientDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actor, setActor] = useState(null);

    // Initialize actor
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
    }, [setError]);

    // Fetch patient details when actor is ready
    useEffect(() => {
        const fetchPatientDetails = async () => {
            if (!actor) return;

            try {
                console.log('Fetching patient details...');
                const result = await actor.get_my_patient_details();
                console.log('Patient details result:', result);

                if ('Ok' in result) {
                    setPatientDetails(result.Ok);
                } else {
                    throw new Error(result.Err || 'Failed to fetch patient details');
                }
            } catch (err) {
                console.error('Error fetching patient details:', err);
                // Don't show error if patient just isn't registered yet
                if (!err.message?.includes('PatientNotFound')) {
                    setError(err.message || 'An error occurred while fetching patient details');
                }
            } finally {
                setLoading(false);
            }
        };

        if (actor) {
            fetchPatientDetails();
        }
    }, [actor, setError]);

    if (loading) {
        return (
            <div className="space-y-6">
                <h2 className="text-xl font-bold">Patient Dashboard</h2>
                <div className="animate-pulse">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Patient Dashboard</h2>
            <ErrorBoundary>
                {!patientDetails ? (
                    <div className="bg-white shadow rounded-lg p-6">
                        <PatientRegistration
                            userId={userId}
                            token={token}
                            actor={actor}
                            onError={setError}
                        />
                    </div>
                ) : (
                    <>
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">My Details</h3>
                            <div className="space-y-4">
                                <p><strong>Name:</strong> {patientDetails.full_name}</p>
                                <p><strong>Date of Birth:</strong> {patientDetails.date_of_birth}</p>
                                <p><strong>Gender:</strong> {patientDetails.gender}</p>
                                {patientDetails.blood_type && (
                                    <p><strong>Blood Type:</strong> {patientDetails.blood_type}</p>
                                )}
                                <div>
                                    <strong>Emergency Contacts:</strong>
                                    {patientDetails.emergency_contacts.map((contact, index) => (
                                        <div key={index} className="ml-4 mt-2">
                                            <p>Name: {contact.name}</p>
                                            <p>Relationship: {contact.relationship}</p>
                                            <p>Phone: {contact.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6">
                            <Link
                                to="/my-profile"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                            >
                                View Full Profile
                            </Link>
                        </div>
                    </>
                )}
            </ErrorBoundary>
        </div>
    );
};

export default PatientDashboard;