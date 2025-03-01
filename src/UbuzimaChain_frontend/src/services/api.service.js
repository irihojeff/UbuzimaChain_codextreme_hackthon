import { backendActor } from "./actorUtils";

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

export async function registerUser(payload, roleString) {
  const roleVariant = roleToVariant(roleString);
  const result = await backendActor.register_user(payload, roleVariant);
  if ("Ok" in result) {
    return result.Ok;
  }
  throw result.Err;
}

export async function loginUser(payload) {
  const result = await backendActor.login(payload);
  if ("Ok" in result) {
    return result.Ok;
  }
  throw result.Err;
}

export async function getUserByPrincipal() {
  const result = await backendActor.get_user_by_principal();
  if ("Ok" in result) {
    return result.Ok;
  }
  throw result.Err;
}

export async function getUser(userId) {
  const result = await backendActor.get_user(userId);
  if ("Ok" in result) {
    return result.Ok;
  }
  throw result.Err;
}

export async function createAutonomousAppointment(payload) {
  // Simply pass the payload without desired_time, as it's removed.
  const modifiedPayload = {
    patient_id: payload.patient_id,
    symptoms: payload.symptoms,
    notes: payload.notes || null,
  };

  const result = await backendActor.create_autonomous_appointment(modifiedPayload);
  if ("Ok" in result) {
    return result.Ok;
  }
  throw result.Err;
}

export async function getAppointment(appointmentId) {
  const result = await backendActor.get_appointment(appointmentId);
  if ("Ok" in result) {
    return result.Ok;
  }
  throw result.Err;
}

export async function getAppointmentsByPatient(patientId) {
  return await backendActor.get_appointments_by_patient(patientId);
}

export async function updateDoctorProfile(specialization) {
  const result = await backendActor.update_doctor_profile(specialization);
  if ("Ok" in result) {
    return;
  }
  throw result.Err;
}
