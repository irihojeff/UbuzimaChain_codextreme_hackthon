import { AuthClient } from "@dfinity/auth-client";
import React, { useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../declarations/UbuzimaChain_backend/UbuzimaChain_backend.did.js";

const PatientRegistration = ({ userId, token, actor, onError }) => {
  console.log("PatientRegistration received userId:", userId);
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    blood_type: "",
    emergency_contacts: [
      {
        name: "",
        relationship: "",
        phone: "",
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  const createActor = async () => {
    const canisterId = process.env.REACT_APP_CANISTER_ID_UBUZIMACHAIN_BACKEND || "bkyz2-fmaaa-aaaaa-qaaaq-cai";
    const host = process.env.REACT_APP_DFX_NETWORK === "ic" ? "https://boundary.ic0.app" : "http://localhost:4943";
    
    const authClient = await AuthClient.create();
    const agent = new HttpAgent({ 
      host,
      identity: authClient.getIdentity()
    });
  
    if (process.env.REACT_APP_DFX_NETWORK !== "ic") {
      await agent.fetchRootKey();
    }
  
    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmergencyContactChange = (index, field, value) => {
    setFormData((prev) => {
      const newContacts = [...prev.emergency_contacts];
      newContacts[index] = {
        ...newContacts[index],
        [field]: value,
      };
      return {
        ...prev,
        emergency_contacts: newContacts,
      };
    });
  };

  const addEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergency_contacts: [
        ...prev.emergency_contacts,
        { name: "", relationship: "", phone: "" },
      ],
    }));
  };

  const removeEmergencyContact = (index) => {
    setFormData((prev) => ({
      ...prev,
      emergency_contacts: prev.emergency_contacts.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const { full_name, date_of_birth, gender, emergency_contacts } = formData;
    if (!full_name || !date_of_birth || !gender) {
      setMessage({
        type: "error",
        content: "Please fill in all required fields.",
      });
      return false;
    }
    for (const contact of emergency_contacts) {
      if (!contact.name || !contact.relationship || !contact.phone) {
        setMessage({
          type: "error",
          content: "Please fill in all emergency contact fields.",
        });
        return false;
      }
      const phoneRegex = /^\+?[\d\s-]{10,15}$/;
      if (!phoneRegex.test(contact.phone)) {
        setMessage({
          type: "error",
          content: "Enter a valid phone number (e.g., +250781932205).",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with userId:", userId);
    if (!userId) {
      setMessage({
        type: "error",
        content: "User ID is not available. Please try logging in again."
      });
      return;
    }
    setLoading(true);
    setMessage({ type: "", content: "" });
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    try {
      // Use provided actor if available; otherwise, create a new one.
      const usedActor = actor || await createActor();
      console.log("Submitting payload:", formData);
      
      const registrationPayload = {
        user_id: userId,
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        // Wrap blood_type in an array if provided; otherwise, use null.
        blood_type: formData.blood_type ? [formData.blood_type] : null,
        emergency_contacts: formData.emergency_contacts.map(contact => ({
          name: contact.name,
          relationship: contact.relationship,
          phone: contact.phone
        }))
      };

      const result = await usedActor.register_patient(registrationPayload);
      console.log("Registration result:", result);
      if ("Ok" in result) {
        setMessage({
          type: "success",
          content: "Patient registration successful!",
        });
        setFormData({
          full_name: "",
          date_of_birth: "",
          gender: "",
          blood_type: "",
          emergency_contacts: [
            { name: "", relationship: "", phone: "" },
          ],
        });
      } else {
        console.log("Registration error details:", result.Err);
        const errorType = Object.keys(result.Err)[0];
        let errorMessage;
        switch (errorType) {
          case 'PatientAlreadyRegistered':
            errorMessage = "You are already registered as a patient";
            break;
          case 'UserNotFound':
            errorMessage = "User not found";
            break;
          case 'InvalidData':
            errorMessage = "Invalid data provided";
            break;
          case 'UnauthorizedAccess':
            errorMessage = "Unauthorized access";
            break;
          default:
            errorMessage = `Registration failed: ${errorType}`;
        }
        setMessage({ type: "error", content: errorMessage });
      }
    } catch (error) {
      console.error("Registration error details:", error);
      setMessage({
        type: "error",
        content: "Registration failed: " + (error.message || "Check your input and try again")
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Patient Registration</h2>
      {message.content && (
        <div className={`p-4 mb-4 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.content}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Blood Type</label>
          <select
            name="blood_type"
            value={formData.blood_type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Unknown</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Emergency Contacts</label>
          {formData.emergency_contacts.map((contact, index) => (
            <div key={index} className="border p-4 rounded-md mb-4 space-y-4">
              <input
                type="text"
                placeholder="Contact Name"
                value={contact.name}
                onChange={(e) => handleEmergencyContactChange(index, "name", e.target.value)}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm"
              />
              <input
                type="text"
                placeholder="Relationship"
                value={contact.relationship}
                onChange={(e) => handleEmergencyContactChange(index, "relationship", e.target.value)}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm"
              />
              <input
                type="tel"
                placeholder="Phone Number (e.g., +250781932205)"
                value={contact.phone}
                onChange={(e) => handleEmergencyContactChange(index, "phone", e.target.value)}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm"
              />
              {formData.emergency_contacts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmergencyContact(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove Contact
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addEmergencyContact}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
          >
            + Add Another Emergency Contact
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register as Patient"}
        </button>
      </form>
    </div>
  );
};

export default PatientRegistration;
