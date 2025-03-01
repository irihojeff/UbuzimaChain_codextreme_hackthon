use std::cell::RefCell;
use std::collections::HashMap;
use crate::types::{User, Patient, Appointment, DoctorSchedule};

thread_local! {
    // Stores all users by their user ID.
    pub static STATE: RefCell<HashMap<String, User>> = RefCell::new(HashMap::new());

    // Maps usernames to user IDs (for quick lookup during login).
    pub static USERNAMES: RefCell<HashMap<String, String>> = RefCell::new(HashMap::new());

    // Stores all patients by their patient ID.
    pub static PATIENTS: RefCell<HashMap<String, Patient>> = RefCell::new(HashMap::new());

    // Maps user IDs to patient IDs.
    pub static USER_PATIENTS: RefCell<HashMap<String, String>> = RefCell::new(HashMap::new());

    // Maps principal IDs to user IDs.
    pub static PRINCIPAL_TO_USER: RefCell<HashMap<String, String>> = RefCell::new(HashMap::new());

    // Stores all appointments by their appointment ID.
    pub static APPOINTMENTS: RefCell<HashMap<String, Appointment>> = RefCell::new(HashMap::new());

    // Stores doctor schedules (mapping doctor id to their schedule).
    pub static DOCTOR_SCHEDULES: RefCell<HashMap<String, DoctorSchedule>> = RefCell::new(HashMap::new());
}
