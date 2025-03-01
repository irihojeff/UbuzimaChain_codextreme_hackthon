import React, { useEffect, useState } from "react";
import { getUser } from "../services/api.service";
import AutonomousAppointmentSection from "./appointments/AutonomousAppointmentSection";
import AppointmentList from "./AppointmentList";
import FutureRoadmap from "./FutureRoadmap";

// Placeholders for role-specific dashboards
import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";

function Dashboard({ currentUser }) {
  const [userData, setUserData] = useState(null);

  const getRoleAsString = (role) => {
    if (typeof role === "object" && role !== null) {
      return Object.keys(role)[0];
    }
    return role;
  };

  useEffect(() => {
    if (currentUser?.id) {
      (async () => {
        try {
          const data = await getUser(currentUser.id);
          setUserData(data);
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      })();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <p className="p-4">Please log in.</p>;
  }

  if (!userData) {
    return <p className="p-4">Loading user data...</p>;
  }

  const roleString = getRoleAsString(userData.role);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Welcome, {userData.username}</h1>
      <p className="mb-4">Your Role: {roleString}</p>

      {roleString === "Admin" && <AdminDashboard />}
      {roleString === "Doctor" && <DoctorDashboard />}
      {roleString === "Patient" && (
        <>
          <PatientDashboard />
          <AutonomousAppointmentSection userData={userData} />
          <AppointmentList patientId={userData.id} />
        </>
      )}

      <FutureRoadmap />
    </div>
  );
}

export default Dashboard;
