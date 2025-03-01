import React, { useEffect, useState } from "react";
import { getAppointmentsByPatient } from "../services/api.service";

function AppointmentList({ patientId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const appts = await getAppointmentsByPatient(patientId);
      setAppointments(appts);
    } catch (err) {
      setError(`Error fetching appointments: ${JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchAppointments();
    }
  }, [patientId]);

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">My Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments booked yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {appointments.map((appt) => (
            <li key={appt.id} className="mb-2">
              <strong>Appointment ID:</strong> {appt.id} <br />
              <strong>Doctor ID:</strong> {appt.doctor_id} <br />
              <strong>Scheduled Time:</strong> {appt.scheduled_time} <br />
              <strong>Status:</strong> {appt.status}
              {appt.notes && (
                <>
                  <br />
                  <strong>Notes:</strong> {appt.notes}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
        onClick={fetchAppointments}
      >
        Refresh Appointments
      </button>
    </div>
  );
}

export default AppointmentList;
