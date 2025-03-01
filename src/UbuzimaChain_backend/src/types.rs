use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum UserRole {
    Patient,
    Doctor,
    Admin,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct User {
    pub id: String,
    pub username: String,
    pub password_hash: String,
    pub created_at: u64,
    pub last_login: Option<u64>,
    pub role: UserRole,
    pub principal_id: String,
    // For doctors, store their specialization (e.g., "Cardiology")
    pub specialization: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AuthPayload {
    pub username: String,
    pub password: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AuthResponse {
    pub token: String,
    pub user_id: String,
    pub username: String,
    pub created_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EmergencyContact {
    pub name: String,
    pub relationship: String,
    pub phone: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Attachment {
    pub id: String,
    pub name: String,
    pub content_type: String,
    pub encrypted_data: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MedicalRecord {
    pub id: String,
    pub date: u64,
    pub record_type: String,
    pub description: String,
    pub doctor_id: String,
    pub attachments: Vec<Attachment>,
    pub encrypted_data: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Patient {
    pub id: String,
    pub user_id: String,
    pub full_name: String,
    pub date_of_birth: String,
    pub gender: String,
    pub blood_type: Option<String>,
    pub medical_history: Vec<MedicalRecord>,
    pub emergency_contacts: Vec<EmergencyContact>,
    pub created_at: u64,
    pub updated_at: u64,
    pub authorized_doctors: Vec<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PatientRegistrationPayload {
    pub user_id: String,
    pub full_name: String,
    pub date_of_birth: String,
    pub gender: String,
    pub blood_type: Option<String>,
    pub emergency_contacts: Vec<EmergencyContact>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum UserError {
    UsernameTaken,
    InvalidCredentials,
    EmptyFields,
    UserNotFound,
    SystemError,
    PatientNotFound,
    UnauthorizedAccess,
    PatientAlreadyRegistered,
    InvalidData,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum AppointmentStatus {
    Pending,
    Confirmed,
    Cancelled,
    Completed,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Appointment {
    pub id: String,
    pub doctor_id: String,
    pub patient_id: String,
    pub scheduled_time: u64,
    pub status: AppointmentStatus,
    pub created_at: u64,
    pub updated_at: u64,
    pub notes: Option<String>,
}

// Autonomous appointment payload. Patient provides symptoms instead of selecting a doctor.
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AutonomousAppointmentPayload {
    pub patient_id: String,
    pub symptoms: String,
    pub desired_time: Option<u64>,
    pub notes: Option<String>,
}

// Represents a doctor's schedule with available time slots.
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct DoctorSchedule {
    pub doctor_id: String,
    pub available_slots: Vec<u64>,
}
