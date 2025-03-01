// File: src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getUser } from "../services/api.service";
import AutonomousAppointmentSection from "./appointments/AutonomousAppointmentSection";
import AppointmentList from "./AppointmentList";
import FutureRoadmap from "./FutureRoadmap";
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
    return <p className="p-4 text-center text-lg">Please log in.</p>;
  }

  if (!userData) {
    return <p className="p-4 text-center text-lg">Loading user data...</p>;
  }

  const roleString = getRoleAsString(userData.role);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userData.username}</h1>
      <p className="text-lg mb-6">Your Role: {roleString}</p>

      {roleString === "Admin" && <AdminDashboard />}
      {roleString === "Doctor" && <DoctorDashboard userData={userData} />}
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
