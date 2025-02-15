use crate::types::{Patient, PatientRegistrationPayload};
use crate::errors::UserError;
use crate::state::{STATE, PATIENTS, USER_PATIENTS};
use crate::utils::generate_unique_id;
use ic_cdk::api::{time, caller};
use ic_cdk_macros::{update, query};

#[update]
pub async fn register_patient(payload: PatientRegistrationPayload) -> Result<String, UserError> {
    ic_cdk::println!("Received registration payload: {:?}", payload);
    let caller_id = caller().to_text();
    
    let user = STATE.with(|state| {
        state.borrow().get(&payload.user_id).cloned()
    }).ok_or(UserError::UserNotFound)?;

    if user.principal_id != caller_id {
        return Err(UserError::UnauthorizedAccess);
    }

    USER_PATIENTS.with(|user_patients| {
        if user_patients.borrow().contains_key(&payload.user_id) {
            return Err(UserError::PatientAlreadyRegistered);
        }
        Ok(())
    })?;

    if payload.full_name.is_empty() || payload.date_of_birth.is_empty() || payload.gender.is_empty() {
        return Err(UserError::InvalidData);
    }

    let patient_id = generate_unique_id();
    let patient = Patient {
        id: patient_id.clone(),
        user_id: payload.user_id.clone(),
        full_name: payload.full_name,
        date_of_birth: payload.date_of_birth,
        gender: payload.gender,
        blood_type: payload.blood_type,
        medical_history: Vec::new(),
        emergency_contacts: payload.emergency_contacts,
        created_at: time(),
        updated_at: time(),
        authorized_doctors: Vec::new(),
    };

    PATIENTS.with(|patients| {
        patients.borrow_mut().insert(patient_id.clone(), patient);
    });

    USER_PATIENTS.with(|user_patients| {
        user_patients.borrow_mut().insert(payload.user_id, patient_id.clone());
    });

    Ok(patient_id)
}

#[query]
pub fn get_patient(patient_id: String) -> Result<Patient, UserError> {
    let caller_id = caller().to_text();
    
    PATIENTS.with(|patients| {
        let patients = patients.borrow();
        let patient = patients.get(&patient_id).ok_or(UserError::PatientNotFound)?;
        
        if patient.user_id != caller_id && !patient.authorized_doctors.contains(&caller_id) {
            return Err(UserError::UnauthorizedAccess);
        }
        
        Ok(patient.clone())
    })
}

#[update]
pub async fn authorize_doctor(patient_id: String, doctor_id: String) -> Result<(), UserError> {
    let caller_id = caller().to_text();
    
    PATIENTS.with(|patients| {
        let mut patients = patients.borrow_mut();
        let patient = patients.get_mut(&patient_id).ok_or(UserError::PatientNotFound)?;
        
        if patient.user_id != caller_id {
            return Err(UserError::UnauthorizedAccess);
        }
        
        STATE.with(|state| {
            let state = state.borrow();
            if let Some(user) = state.get(&doctor_id) {
                match user.role {
                    crate::types::UserRole::Doctor => Ok(()),
                    _ => Err(UserError::UnauthorizedAccess),
                }
            } else {
                Err(UserError::UserNotFound)
            }
        })?;
        
        if !patient.authorized_doctors.contains(&doctor_id) {
            patient.authorized_doctors.push(doctor_id);
            patient.updated_at = time();
        }
        
        Ok(())
    })
}