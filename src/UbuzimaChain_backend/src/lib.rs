use ic_cdk_macros::init;

// Module declarations
mod authentication;
mod errors;
mod medical_records;
mod patients;
mod state;
mod types;
mod utils;
mod appointment; // New appointments module

// Re-export public functions and types.
pub use authentication::{login, register_user, get_user, get_user_by_principal};
pub use medical_records::add_medical_record;
pub use patients::{
    register_patient, 
    get_patient, 
    authorize_doctor, 
    get_my_patient_details,  
    get_all_patients,
};
// For appointments, we only expose what we have implemented.
pub use appointment::{
    create_autonomous_appointment,
    get_appointment,
};
pub use types::*;
pub use errors::UserError;

#[init]
fn init() {
    ic_cdk::println!("Initializing UbuzimaChain backend canister");
}

// Export the Candid interface.
ic_cdk::export_candid!();
