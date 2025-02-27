use crate::{
    errors::UserError,
    state::STATE,
    types::{SystemStats, User, UserRole},
    utils::is_admin,
};
use ic_cdk::caller;

/// Retrieves all users. Only an admin (as determined by `is_admin`) is allowed.
pub fn get_all_users() -> Result<Vec<User>, UserError> {
    let caller_principal = caller();
    if !is_admin(&caller_principal) {
        return Err(UserError::UnauthorizedAccess);
    }

    STATE.with(|state| {
        let state = state.borrow();
        let users = state.values().cloned().collect();
        Ok(users)
    })
}

/// Computes system statistics by counting total users, doctors, patients,
/// and aggregating medical records from patients.
/// Only accessible to an admin.
pub fn get_system_statistics() -> Result<SystemStats, UserError> {
    let caller_principal = caller();
    if !is_admin(&caller_principal) {
        return Err(UserError::UnauthorizedAccess);
    }

    // Count users from the global state.
    let (total_users, doctors, patients) = STATE.with(|state| {
        let state = state.borrow();
        let total = state.len() as u64;
        let doc_count = state.values()
            .filter(|user| *user.role == UserRole::Doctor)
            .count() as u64;
        let pat_count = state.values()
            .filter(|user| *user.role == UserRole::Patient)
            .count() as u64;
        (total, doc_count, pat_count)
    });

    // Aggregate total records from patients stored in PATIENTS.
    let total_records = crate::state::PATIENTS.with(|patients| {
        patients.borrow().values().map(|patient| patient.medical_history.len() as u64).sum()
    });

    Ok(SystemStats {
        total_users,
        active_doctors: doctors, // "active" flag removed since it isn’t in the candid interface
        total_patients: pat_count,
        total_records,
        current_time: ic_cdk::api::time(),
    })
}
