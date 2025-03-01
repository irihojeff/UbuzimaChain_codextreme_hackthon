use crate::types::{AuthPayload, AuthResponse, User, UserRole};
use crate::errors::UserError;
use crate::utils::{hash_password, verify_password, generate_token, generate_unique_id};
use crate::state::{STATE, USERNAMES, PRINCIPAL_TO_USER};
use ic_cdk::api::{time, caller};
use ic_cdk_macros::{update, query};

#[update]
pub async fn register_user(payload: AuthPayload, role: UserRole) -> Result<String, UserError> {
    if payload.username.is_empty() || payload.password.is_empty() {
        return Err(UserError::EmptyFields);
    }
    
    USERNAMES.with(|usernames| {
        if usernames.borrow().contains_key(&payload.username) {
            return Err(UserError::UsernameTaken);
        }
        Ok(())
    })?;
    
    let user_id = generate_unique_id();
    let principal_id = caller().to_text();
    
    let user = User {
        id: user_id.clone(),
        username: payload.username.clone(),
        password_hash: hash_password(&payload.password),
        created_at: time(),
        last_login: None,
        role,
        principal_id: principal_id.clone(),
        specialization: None,  // By default, not set. For doctors, update later.
        profile_complete: false, // NEW: New users start as incomplete
    };
    
    STATE.with(|state| {
        state.borrow_mut().insert(user_id.clone(), user.clone());
    });
    
    USERNAMES.with(|usernames| {
        usernames.borrow_mut().insert(payload.username.clone(), user_id.clone());
    });
    
    PRINCIPAL_TO_USER.with(|map| {
        map.borrow_mut().insert(principal_id, user_id.clone());
    });
    
    Ok(user_id)
}

#[update]
pub async fn login(payload: AuthPayload) -> Result<AuthResponse, UserError> {
    let user = USERNAMES.with(|usernames| {
        let usernames = usernames.borrow();
        if let Some(user_id) = usernames.get(&payload.username) {
            STATE.with(|state| state.borrow().get(user_id).cloned())
        } else {
            None
        }
    });
    
    match user {
        Some(mut user) => {
            if verify_password(&user.password_hash, &payload.password) {
                user.last_login = Some(time());
                STATE.with(|state| {
                    state.borrow_mut().insert(user.id.clone(), user.clone());
                });
                if !user.profile_complete {
                    return Err(UserError::InvalidData); // Prompt to complete profile
                }
                Ok(AuthResponse {
                    token: generate_token(&user.id),
                    user_id: user.id,
                    username: user.username,
                    created_at: user.created_at,
                })
            } else {
                Err(UserError::InvalidCredentials)
            }
        }
        None => Err(UserError::UserNotFound),
    }
}

#[query]
pub fn get_user(user_id: String) -> Result<User, UserError> {
    match STATE.with(|state| state.borrow().get(&user_id).cloned()) {
        Some(user) => Ok(user),
        None => Err(UserError::UserNotFound),
    }
}

#[query]
pub fn get_user_by_principal() -> Result<User, UserError> {
    let caller_principal = caller().to_text();
    let user_id = PRINCIPAL_TO_USER.with(|map| map.borrow().get(&caller_principal).cloned())
        .ok_or(UserError::UserNotFound)?;
    match STATE.with(|state| state.borrow().get(&user_id).cloned()) {
        Some(user) => Ok(user),
        None => Err(UserError::UserNotFound),
    }
}
