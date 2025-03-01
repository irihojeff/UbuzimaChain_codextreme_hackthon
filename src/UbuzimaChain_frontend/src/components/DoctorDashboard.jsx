import React from "react";
import DoctorProfileSection from "./DoctorProfileSection";

export default function DoctorDashboard({ userData }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Doctor Dashboard</h2>
      <p>
        Update your profile to set your specialization and complete your profile.
        This enables the system to match you with patients.
      </p>
      <DoctorProfileSection userData={userData} />
      {/* Additional doctor-specific features can be added here */}
    </div>
  );
}
