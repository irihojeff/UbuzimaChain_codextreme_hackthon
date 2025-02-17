use crate::types::{Patient, PatientRegistrationPayload, UserRole};
use crate::errors::UserError;
use crate::state::{STATE, PATIENTS, USER_PATIENTS};
use crate::utils::generate_unique_id;
use ic_cdk::api::{time, caller};
use ic_cdk_macros::{update, query};

#[update]
pub async fn register_patient(payload: PatientRegistrationPayload) -> Result<String, UserError> {
    ic_cdk::println!("Received registration payload: {:?}", payload);
    let caller_id = caller().to_text();
    
    // Check if the user exists
    let user = STATE.with(|state| {
        state.borrow().get(&payload.user_id).cloned()
    }).ok_or(UserError::UserNotFound)?;

    // Ensure the caller is the user
    if user.principal_id != caller_id {
        return Err(UserError::UnauthorizedAccess);
    }

    // Check if the patient is already registered
    USER_PATIENTS.with(|user_patients| {
        if user_patients.borrow().contains_key(&payload.user_id) {
            return Err(UserError::PatientAlreadyRegistered);
        }
        Ok(())
    })?;

    // Validate the payload
    if payload.full_name.is_empty() || payload.date_of_birth.is_empty() || payload.gender.is_empty() {
        return Err(UserError::InvalidData);
    }

    // Generate a unique patient ID
    let patient_id = generate_unique_id();

    // Create the patient object
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

    // Store the patient in the state
    PATIENTS.with(|patients| {
        patients.borrow_mut().insert(patient_id.clone(), patient);
    });

    // Map the user to the patient
    USER_PATIENTS.with(|user_patients| {
        user_patients.borrow_mut().insert(payload.user_id, patient_id.clone());
    });

    ic_cdk::println!("Patient registered successfully with ID: {}", patient_id);
    Ok(patient_id)
}

#[query]
pub fn get_patient(patient_id: String) -> Result<Patient, UserError> {
    let caller_id = caller().to_text();
    
    PATIENTS.with(|patients| {
        let patients = patients.borrow();
        let patient = patients.get(&patient_id).ok_or(UserError::PatientNotFound)?;
        
        // Ensure the caller is authorized to access the patient's data
        if patient.user_id != caller_id && !patient.authorized_doctors.contains(&caller_id) {
            return Err(UserError::UnauthorizedAccess);
        }
        
        ic_cdk::println!("Retrieved patient with ID: {}", patient_id);
        Ok(patient.clone())
    })
}

#[update]
pub async fn authorize_doctor(patient_id: String, doctor_id: String) -> Result<(), UserError> {
    let caller_id = caller().to_text();
    
    PATIENTS.with(|patients| {
        let mut patients = patients.borrow_mut();
        let patient = patients.get_mut(&patient_id).ok_or(UserError::PatientNotFound)?;
        
        // Ensure the caller is the patient
        if patient.user_id != caller_id {
            return Err(UserError::UnauthorizedAccess);
        }
        
        // Check if the doctor exists and has the correct role
        STATE.with(|state| {
            let state = state.borrow();
            if let Some(user) = state.get(&doctor_id) {
                match user.role {
                    UserRole::Doctor => Ok(()),
                    _ => Err(UserError::UnauthorizedAccess),
                }
            } else {
                Err(UserError::UserNotFound)
            }
        })?;
        
        // Clone the doctor_id before pushing it
        let doctor_id_clone = doctor_id.clone();
        
        // Add the doctor to the authorized list if not already present
        if !patient.authorized_doctors.contains(&doctor_id_clone) {
            patient.authorized_doctors.push(doctor_id_clone);
            patient.updated_at = time();
        }
        
        ic_cdk::println!("Doctor {} authorized for patient {}", doctor_id, patient_id);
        Ok(())
    })
}

#[query]
pub fn get_my_patient_details() -> Result<Patient, UserError> {
    let caller_id = caller().to_text();

    // Get the patient ID associated with the caller
    let patient_id = USER_PATIENTS.with(|user_patients| {
        user_patients.borrow().get(&caller_id).cloned()
    }).ok_or(UserError::PatientNotFound)?;

    // Retrieve the patient details
    PATIENTS.with(|patients| {
        let patients = patients.borrow();
        let patient = patients.get(&patient_id).ok_or(UserError::PatientNotFound)?;
        
        ic_cdk::println!("Retrieved patient details for caller: {}", caller_id);
        Ok(patient.clone())
    })
}

#[query]
pub fn get_all_patients() -> Result<Vec<Patient>, UserError> {
    let caller_id = caller().to_text();

    // Check if the caller is an admin
    STATE.with(|state| {
        let state = state.borrow();
        let user = state.get(&caller_id).ok_or(UserError::UserNotFound)?;
        if user.role != UserRole::Admin {
            return Err(UserError::UnauthorizedAccess);
        }
        Ok(())
    })?;

    // Retrieve all patients
    let patients = PATIENTS.with(|patients| {
        patients.borrow().values().cloned().collect()
    });

    ic_cdk::println!("Retrieved all patients for admin: {}", caller_id);
    Ok(patients)
}