// File: src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getUser } from "../services/api.service";
import AppointmentSection from "./appointments/AppointmentSection";

function Dashboard({ currentUser }) {
  const [userData, setUserData] = useState(null);

  // Helper to convert variant role to string
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
    return <p>Please log in.</p>;
  }

  if (!userData) {
    return <p>Loading user data...</p>;
  }

  const roleString = getRoleAsString(userData.role);

  return (
    <div className="dashboard-container">
      <h1>Welcome, {userData.username}</h1>
      <p>User Role: {roleString}</p>
      {roleString === "Patient" && (
        <div>
          <h2>Patient Section</h2>
          <AppointmentSection userData={userData} />
        </div>
      )}
      {roleString === "Doctor" && (
        <div>
          <h2>Doctor Section</h2>
          <AppointmentSection userData={userData} />
        </div>
      )}
      {roleString === "Admin" && (
        <div>
          <h2>Admin Section</h2>
          <p>Here you can manage users, view system stats, etc.</p>
          {/* Add Admin-specific dynamic components here */}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
