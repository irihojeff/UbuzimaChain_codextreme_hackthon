use crate::types::{User, UserRole};
use crate::errors::UserError;
use crate::state::STATE;
use ic_cdk::api::caller;
use ic_cdk_macros::update;

#[update]
pub async fn update_doctor_profile(specialization: String) -> Result<(), UserError> {
    let caller_principal = caller().to_text();
    // Find user by principal
    let user_id = STATE.with(|state| {
        state.borrow().values()
             .find(|u| u.principal_id == caller_principal)
             .map(|u| u.id.clone())
    }).ok_or(UserError::UserNotFound)?;
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        let user = state.get_mut(&user_id).ok_or(UserError::UserNotFound)?;
        if user.role != UserRole::Doctor {
            return Err(UserError::UnauthorizedAccess);
        }
        user.specialization = Some(specialization);
        user.profile_complete = true;
        ic_cdk::println!("Doctor '{}' updated profile successfully", user.username);
        Ok(())
    })
}
