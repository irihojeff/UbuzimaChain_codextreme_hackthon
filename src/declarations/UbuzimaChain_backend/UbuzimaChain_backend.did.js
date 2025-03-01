export const idlFactory = ({ IDL }) => {
  const Attachment = IDL.Record({
    'id' : IDL.Text,
    'encrypted_data' : IDL.Text,
    'name' : IDL.Text,
    'content_type' : IDL.Text,
  });
  const MedicalRecord = IDL.Record({
    'id' : IDL.Text,
    'encrypted_data' : IDL.Text,
    'record_type' : IDL.Text,
    'date' : IDL.Nat64,
    'description' : IDL.Text,
    'doctor_id' : IDL.Text,
    'attachments' : IDL.Vec(Attachment),
  });
  const UserError = IDL.Variant({
    'EmptyFields' : IDL.Null,
    'UsernameTaken' : IDL.Null,
    'SystemError' : IDL.Null,
    'PatientNotFound' : IDL.Null,
    'InvalidData' : IDL.Null,
    'InvalidCredentials' : IDL.Null,
    'UnauthorizedAccess' : IDL.Null,
    'UserNotFound' : IDL.Null,
    'PatientAlreadyRegistered' : IDL.Null,
  });
  const AutonomousAppointmentPayload = IDL.Record({
    'patient_id' : IDL.Text,
    'desired_time' : IDL.Opt(IDL.Nat64),
    'notes' : IDL.Opt(IDL.Text),
    'symptoms' : IDL.Text,
  });
  const EmergencyContact = IDL.Record({
    'relationship' : IDL.Text,
    'name' : IDL.Text,
    'phone' : IDL.Text,
  });
  const Patient = IDL.Record({
    'id' : IDL.Text,
    'updated_at' : IDL.Nat64,
    'emergency_contacts' : IDL.Vec(EmergencyContact),
    'created_at' : IDL.Nat64,
    'blood_type' : IDL.Opt(IDL.Text),
    'user_id' : IDL.Text,
    'gender' : IDL.Text,
    'date_of_birth' : IDL.Text,
    'medical_history' : IDL.Vec(MedicalRecord),
    'authorized_doctors' : IDL.Vec(IDL.Text),
    'full_name' : IDL.Text,
  });
  const AppointmentStatus = IDL.Variant({
    'Confirmed' : IDL.Null,
    'Cancelled' : IDL.Null,
    'Completed' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const Appointment = IDL.Record({
    'id' : IDL.Text,
    'scheduled_time' : IDL.Nat64,
    'status' : AppointmentStatus,
    'patient_id' : IDL.Text,
    'updated_at' : IDL.Nat64,
    'created_at' : IDL.Nat64,
    'notes' : IDL.Opt(IDL.Text),
    'doctor_id' : IDL.Text,
  });
  const UserRole = IDL.Variant({
    'Doctor' : IDL.Null,
    'Admin' : IDL.Null,
    'Patient' : IDL.Null,
  });
  const User = IDL.Record({
    'id' : IDL.Text,
    'password_hash' : IDL.Text,
    'last_login' : IDL.Opt(IDL.Nat64),
    'username' : IDL.Text,
    'role' : UserRole,
    'created_at' : IDL.Nat64,
    'specialization' : IDL.Opt(IDL.Text),
    'principal_id' : IDL.Text,
  });
  const AuthPayload = IDL.Record({
    'username' : IDL.Text,
    'password' : IDL.Text,
  });
  const AuthResponse = IDL.Record({
    'token' : IDL.Text,
    'username' : IDL.Text,
    'created_at' : IDL.Nat64,
    'user_id' : IDL.Text,
  });
  const PatientRegistrationPayload = IDL.Record({
    'emergency_contacts' : IDL.Vec(EmergencyContact),
    'blood_type' : IDL.Opt(IDL.Text),
    'user_id' : IDL.Text,
    'gender' : IDL.Text,
    'date_of_birth' : IDL.Text,
    'full_name' : IDL.Text,
  });
  return IDL.Service({
    'add_medical_record' : IDL.Func(
        [IDL.Text, MedicalRecord],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : UserError })],
        [],
      ),
    'authorize_doctor' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : UserError })],
        [],
      ),
    'create_autonomous_appointment' : IDL.Func(
        [AutonomousAppointmentPayload],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : UserError })],
        [],
      ),
    'get_all_patients' : IDL.Func(
        [],
        [IDL.Variant({ 'Ok' : IDL.Vec(Patient), 'Err' : UserError })],
        ['query'],
      ),
    'get_appointment' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : Appointment, 'Err' : UserError })],
        ['query'],
      ),
    'get_my_patient_details' : IDL.Func(
        [],
        [IDL.Variant({ 'Ok' : Patient, 'Err' : UserError })],
        ['query'],
      ),
    'get_patient' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : Patient, 'Err' : UserError })],
        ['query'],
      ),
    'get_user' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : User, 'Err' : UserError })],
        ['query'],
      ),
    'get_user_by_principal' : IDL.Func(
        [],
        [IDL.Variant({ 'Ok' : User, 'Err' : UserError })],
        ['query'],
      ),
    'init' : IDL.Func([], [], []),
    'login' : IDL.Func(
        [AuthPayload],
        [IDL.Variant({ 'Ok' : AuthResponse, 'Err' : UserError })],
        [],
      ),
    'register_patient' : IDL.Func(
        [PatientRegistrationPayload],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : UserError })],
        [],
      ),
    'register_user' : IDL.Func(
        [AuthPayload, UserRole],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : UserError })],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
