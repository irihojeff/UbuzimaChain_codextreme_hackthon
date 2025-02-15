use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::fmt;

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

// Implement Display for UserError to return readable error messages
impl fmt::Display for UserError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let error_message = match self {
            UserError::UsernameTaken => "Username already exists",
            UserError::InvalidCredentials => "Invalid username or password combination",
            UserError::EmptyFields => "Please fill in all required fields",
            UserError::UserNotFound => "The specified user could not be found",
            UserError::SystemError => "An unexpected system error occurred",
            UserError::PatientNotFound => "Patient record not found",
            UserError::UnauthorizedAccess => "Unauthorized access",
            UserError::PatientAlreadyRegistered => "Patient is already registered",
            UserError::InvalidData => "Invalid input data",
        };
        write!(f, "{}", error_message)
    }
}