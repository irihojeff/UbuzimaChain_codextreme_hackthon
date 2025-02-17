use ic_cdk_macros::init;

// Module declarations
mod authentication;
mod errors;
mod medical_records;
mod patients;
mod state;
mod types;
mod utils;

// Re-export public functions and types
pub use authentication::{login, register_user, get_user, get_user_by_principal}; // Added get_user and get_user_by_principal
pub use medical_records::add_medical_record;
pub use patients::{
    register_patient, get_patient, authorize_doctor, 
    get_my_patient_details, get_all_patients, // New functions for data retrieval
};
pub use types::*; // This will now include QueryResponse
pub use errors::UserError;

// Canister initialization
#[init]
fn init() {
    ic_cdk::println!("Initializing UbuzimaChain backend canister");
}

// Export Candid interface
ic_cdk::export_candid!();