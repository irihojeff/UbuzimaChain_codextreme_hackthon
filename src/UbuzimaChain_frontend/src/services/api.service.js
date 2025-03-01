// File: src/services/api.service.js
import { backendActor } from "./actorUtils";

////////////////////
// User Management
////////////////////
export async function registerUser(payload, role) {
    // Map role string to a proper variant.
    let roleVariant = {};
    if (role === "Patient") roleVariant = { Patient: null };
    else if (role === "Doctor") roleVariant = { Doctor: null };
    else if (role === "Admin") roleVariant = { Admin: null };
  
    const response = await backendActor.register_user(payload, roleVariant);
    if ("Ok" in response) {
      return response.Ok; // user_id on success
    }
    throw response.Err;
  }
  

export async function loginUser(payload) {
  const response = await backendActor.login(payload);
  if ("Ok" in response) {
    return response.Ok; // AuthResponse
  }
  throw response.Err;
}

export async function getUser(userId) {
  const response = await backendActor.get_user(userId);
  if ("Ok" in response) {
    return response.Ok; // User object
  }
  throw response.Err;
}

export async function getUserByPrincipal() {
  const response = await backendActor.get_user_by_principal();
  if ("Ok" in response) {
    return response.Ok; // User object
  }
  throw response.Err;
}

////////////////////
// Appointments
////////////////////
export async function createAppointment(doctorId, patientId, scheduledTime, notes) {
  const response = await backendActor.create_appointment(
    doctorId,
    patientId,
    scheduledTime,
    notes
  );
  if ("Ok" in response) {
    return response.Ok; // appointment_id
  }
  throw response.Err;
}

export async function updateAppointmentStatus(appointmentId, newStatus) {
  const response = await backendActor.update_appointment_status(appointmentId, newStatus);
  if ("Ok" in response) {
    return;
  }
  throw response.Err;
}

export async function getAppointment(appointmentId) {
  const response = await backendActor.get_appointment(appointmentId);
  if ("Ok" in response) {
    return response.Ok;
  }
  throw response.Err;
}

export async function getAppointmentsByDoctor(doctorId) {
  return await backendActor.get_appointments_by_doctor(doctorId);
}

export async function getAppointmentsByPatient(patientId) {
  return await backendActor.get_appointments_by_patient(patientId);
}

export async function createAutonomousAppointment(payload) {
    const response = await backendActor.create_autonomous_appointment(payload);
    if ("Ok" in response) {
      return response.Ok;
    }
    throw response.Err;
  }