use std::cell::RefCell;
use std::collections::HashMap;
use crate::types::{User, Patient, Appointment, DoctorSchedule};

thread_local! {
    pub static STATE: RefCell<HashMap<String, User>> = RefCell::new(HashMap::new());
    pub static USERNAMES: RefCell<HashMap<String, String>> = RefCell::new(HashMap::new());
    pub static PATIENTS: RefCell<HashMap<String, Patient>> = RefCell::new(HashMap::new());
    pub static USER_PATIENTS: RefCell<HashMap<String, String>> = RefCell::new(HashMap::new());
    pub static PRINCIPAL_TO_USER: RefCell<HashMap<String, String>> = RefCell::new(HashMap::new());
    pub static APPOINTMENTS: RefCell<HashMap<String, Appointment>> = RefCell::new(HashMap::new());
    pub static DOCTOR_SCHEDULES: RefCell<HashMap<String, DoctorSchedule>> = RefCell::new(HashMap::new());
}
