use ic_cdk_macros::init;

mod authentication;
mod errors;
mod medical_records;
mod patients;
mod state;
mod types;
mod utils;
mod appointment;

pub use authentication::{login, register_user, get_user, get_user_by_principal};
pub use medical_records::add_medical_record;
pub use patients::{register_patient, get_patient, authorize_doctor, get_my_patient_details, get_all_patients};
pub use appointment::{create_autonomous_appointment, get_appointment, get_appointments_by_patient};
pub use types::*;
pub use errors::UserError;

#[init]
fn init() {
    ic_cdk::println!("Initializing UbuzimaChain backend canister");
}

ic_cdk::export_candid!();
