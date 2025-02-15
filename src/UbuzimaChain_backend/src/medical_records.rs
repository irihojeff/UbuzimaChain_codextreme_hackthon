use crate::types::MedicalRecord;
use crate::errors::UserError;
use crate::state::PATIENTS;
use crate::utils::generate_unique_id;
use ic_cdk::api::{time, caller};
use ic_cdk_macros::update;

#[update]
pub async fn add_medical_record(patient_id: String, record: MedicalRecord) -> Result<String, UserError> {
    let caller_id = caller().to_text();
    
    PATIENTS.with(|patients| {
        let mut patients = patients.borrow_mut();
        let patient = patients.get_mut(&patient_id).ok_or(UserError::PatientNotFound)?;
        
        if patient.user_id != caller_id && !patient.authorized_doctors.contains(&caller_id) {
            return Err(UserError::UnauthorizedAccess);
        }
        
        let record_id = generate_unique_id();
        let mut new_record = record;
        new_record.id = record_id.clone();
        
        patient.medical_history.push(new_record);
        patient.updated_at = time();
        
        Ok(record_id)
    })
}