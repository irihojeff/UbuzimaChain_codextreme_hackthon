use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum QueryResponse<T> {
    Ok(T),
    Err(String),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct User {
    pub id: String,
    pub username: String,
    pub password_hash: String,
    pub created_at: u64,
    pub last_login: Option<u64>,
    pub role: UserRole,
    // Note: Although your candid interface does not list this field,
    // you may keep internal fields like principal_id if needed.
    pub principal_id: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum UserRole {
    Patient,
    Doctor,
    Admin,
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
pub struct Attachment {
    pub id: String,
    pub name: String,
    pub content_type: String,
    pub encrypted_data: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EmergencyContact {
    pub name: String,
    pub relationship: String,
    pub phone: String,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct AuthPayload {
    pub username: String,
    pub password: String,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct AuthResponse {
    pub token: String,
    pub user_id: String,
    pub username: String,
    pub created_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct PatientRegistrationPayload {
    pub user_id: String,
    pub full_name: String,
    pub date_of_birth: String,
    pub gender: String,
    pub blood_type: Option<String>,
    pub emergency_contacts: Vec<EmergencyContact>,
}

/// New type for returning system-wide statistics.
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct SystemStats {
    pub total_users: u64,
    pub active_doctors: u64,
    pub total_patients: u64,
    pub total_records: u64,
    pub current_time: u64,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
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
