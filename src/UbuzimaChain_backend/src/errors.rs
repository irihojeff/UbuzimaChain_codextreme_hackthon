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

// Implement Display for UserError to return user-friendly error messages
impl fmt::Display for UserError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let error_message = match self {
            UserError::UsernameTaken => "The chosen username is already in use. Please select a different username.",
            UserError::InvalidCredentials => "The username or password you entered is incorrect.",
            UserError::EmptyFields => "All required fields must be filled out.",
            UserError::UserNotFound => "No user was found with the provided information.",
            UserError::SystemError => "A system error has occurred. Please try again later.",
            UserError::PatientNotFound => "The patient record could not be found.",
            UserError::UnauthorizedAccess => "You are not authorized to perform this action.",
            UserError::PatientAlreadyRegistered => "This patient is already registered.",
            UserError::InvalidData => "The data provided is invalid. Please review your input and try again.",
        };
        write!(f, "{}", error_message)
    }
}
