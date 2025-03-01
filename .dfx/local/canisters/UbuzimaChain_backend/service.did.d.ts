import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Appointment {
  'id' : string,
  'scheduled_time' : bigint,
  'status' : AppointmentStatus,
  'patient_id' : string,
  'updated_at' : bigint,
  'created_at' : bigint,
  'notes' : [] | [string],
  'doctor_id' : string,
}
export type AppointmentStatus = { 'Confirmed' : null } |
  { 'Cancelled' : null } |
  { 'Completed' : null } |
  { 'Pending' : null };
export interface Attachment {
  'id' : string,
  'encrypted_data' : string,
  'name' : string,
  'content_type' : string,
}
export interface AuthPayload { 'username' : string, 'password' : string }
export interface AuthResponse {
  'token' : string,
  'username' : string,
  'created_at' : bigint,
  'user_id' : string,
}
export interface AutonomousAppointmentPayload {
  'patient_id' : string,
  'notes' : [] | [string],
  'symptoms' : string,
}
export interface DoctorSchedule {
  'available_slots' : BigUint64Array | bigint[],
  'doctor_id' : string,
}
export interface EmergencyContact {
  'relationship' : string,
  'name' : string,
  'phone' : string,
}
export interface MedicalRecord {
  'id' : string,
  'encrypted_data' : string,
  'record_type' : string,
  'date' : bigint,
  'description' : string,
  'doctor_id' : string,
  'attachments' : Array<Attachment>,
}
export interface Patient {
  'id' : string,
  'updated_at' : bigint,
  'emergency_contacts' : Array<EmergencyContact>,
  'created_at' : bigint,
  'blood_type' : [] | [string],
  'user_id' : string,
  'gender' : string,
  'date_of_birth' : string,
  'medical_history' : Array<MedicalRecord>,
  'authorized_doctors' : Array<string>,
  'full_name' : string,
}
export interface PatientRegistrationPayload {
  'emergency_contacts' : Array<EmergencyContact>,
  'blood_type' : [] | [string],
  'user_id' : string,
  'gender' : string,
  'date_of_birth' : string,
  'full_name' : string,
}
export interface User {
  'id' : string,
  'password_hash' : string,
  'last_login' : [] | [bigint],
  'username' : string,
  'role' : UserRole,
  'created_at' : bigint,
  'specialization' : [] | [string],
  'profile_complete' : boolean,
  'principal_id' : string,
}
export type UserError = { 'EmptyFields' : null } |
  { 'UsernameTaken' : null } |
  { 'SystemError' : null } |
  { 'PatientNotFound' : null } |
  { 'InvalidData' : null } |
  { 'InvalidCredentials' : null } |
  { 'UnauthorizedAccess' : null } |
  { 'UserNotFound' : null } |
  { 'PatientAlreadyRegistered' : null };
export type UserRole = { 'Doctor' : null } |
  { 'Admin' : null } |
  { 'Patient' : null };
export interface _SERVICE {
  'add_medical_record' : ActorMethod<
    [string, MedicalRecord],
    { 'Ok' : string } |
      { 'Err' : UserError }
  >,
  'authorize_doctor' : ActorMethod<
    [string, string],
    { 'Ok' : null } |
      { 'Err' : UserError }
  >,
  'create_autonomous_appointment' : ActorMethod<
    [AutonomousAppointmentPayload],
    { 'Ok' : string } |
      { 'Err' : UserError }
  >,
  'get_all_patients' : ActorMethod<
    [],
    { 'Ok' : Array<Patient> } |
      { 'Err' : UserError }
  >,
  'get_appointment' : ActorMethod<
    [string],
    { 'Ok' : Appointment } |
      { 'Err' : UserError }
  >,
  'get_appointments_by_patient' : ActorMethod<[string], Array<Appointment>>,
  'get_my_patient_details' : ActorMethod<
    [],
    { 'Ok' : Patient } |
      { 'Err' : UserError }
  >,
  'get_patient' : ActorMethod<
    [string],
    { 'Ok' : Patient } |
      { 'Err' : UserError }
  >,
  'get_user' : ActorMethod<[string], { 'Ok' : User } | { 'Err' : UserError }>,
  'get_user_by_principal' : ActorMethod<
    [],
    { 'Ok' : User } |
      { 'Err' : UserError }
  >,
  'init' : ActorMethod<[], undefined>,
  'login' : ActorMethod<
    [AuthPayload],
    { 'Ok' : AuthResponse } |
      { 'Err' : UserError }
  >,
  'register_patient' : ActorMethod<
    [PatientRegistrationPayload],
    { 'Ok' : string } |
      { 'Err' : UserError }
  >,
  'register_user' : ActorMethod<
    [AuthPayload, UserRole],
    { 'Ok' : string } |
      { 'Err' : UserError }
  >,
  'update_doctor_profile' : ActorMethod<
    [string],
    { 'Ok' : null } |
      { 'Err' : UserError }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
