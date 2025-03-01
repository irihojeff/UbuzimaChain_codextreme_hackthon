// File: src/services/api.service.js
import { backendActor } from "./actorUtils";

// Convert role string to candid variant
function roleToVariant(roleString) {
  switch (roleString) {
    case "Patient":
      return { Patient: null };
    case "Doctor":
      return { Doctor: null };
    case "Admin":
      return { Admin: null };
    default:
      return { Patient: null };
  }
}

// Register a new user
export async function registerUser(payload, roleString) {
  const roleVariant = roleToVariant(roleString);
  const result = await backendActor.register_user(payload, roleVariant);
  if ("Ok" in result) {
    return result.Ok; // user_id
  }
  throw result.Err;
}

// Log in
export async function loginUser(payload) {
  const result = await backendActor.login(payload);
  if ("Ok" in result) {
    return result.Ok; // AuthResponse
  }
  throw result.Err;
}

// Get user by principal
export async function getUserByPrincipal() {
  const result = await backendActor.get_user_by_principal();
  if ("Ok" in result) {
    return result.Ok;
  }
  throw result.Err;
}

// Get user by user ID
export async function getUser(userId) {
  const result = await backendActor.get_user(userId);
  if ("Ok" in result) {
    return result.Ok;
  }
  throw result.Err;
}

// Create an autonomous appointment
export async function createAutonomousAppointment(payload) {
  const result = await backendActor.create_autonomous_appointment(payload);
  if ("Ok" in result) {
    return result.Ok; // appointment_id
  }
  throw result.Err;
}

// Get an appointment by ID
export async function getAppointment(appointmentId) {
  const result = await backendActor.get_appointment(appointmentId);
  if ("Ok" in result) {
    return result.Ok;
  }
  throw result.Err;
}
