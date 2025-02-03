use candid::{CandidType, Deserialize};
use ic_cdk::api::time;
use ic_cdk_macros::*;
use serde::Serialize;
use std::collections::HashMap;
use std::cell::RefCell;
use uuid::Uuid;

// Types
#[derive(CandidType, Serialize, Deserialize, Clone)]
struct User {
    id: String,
    username: String,
    password_hash: String,
    created_at: u64,
}

#[derive(CandidType, Serialize, Deserialize)]
struct AuthPayload {
    username: String,
    password: String,
}

#[derive(CandidType, Serialize, Deserialize)]
struct AuthResponse {
    token: String,
    user_id: String,
}

// State management
thread_local! {
    static STATE: RefCell<HashMap<String, User>> = RefCell::new(HashMap::new());
}

// Helper functions
fn hash_password(password: &str) -> String {
    // In a production environment, you should use a proper password hashing function
    format!("hashed_{}", password)
}

fn generate_token(user_id: &str) -> String {
    // In a production environment, use proper JWT implementation
    format!("token_{}", user_id)
}

// Canister methods
#[update]
fn register(payload: AuthPayload) -> Result<String, String> {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        
        // Check if user already exists
        if state.values().any(|u| u.username == payload.username) {
            return Err("Username already exists".to_string());
        }

        let user = User {
            id: Uuid::new_v4().to_string(),
            username: payload.username,
            password_hash: hash_password(&payload.password),
            created_at: time(),
        };

        state.insert(user.id.clone(), user.clone());
        Ok(format!("User {} registered successfully", user.id))
    })
}

#[update]
fn login(payload: AuthPayload) -> Result<AuthResponse, String> {
    STATE.with(|state| {
        let state = state.borrow();
        
        // Find user and verify password
        if let Some(user) = state.values().find(|u| u.username == payload.username) {
            if hash_password(&payload.password) == user.password_hash {
                return Ok(AuthResponse {
                    token: generate_token(&user.id),
                    user_id: user.id.clone(),
                });
            }
        }
        
        Err("Invalid username or password".to_string())
    })
}

#[query]
fn get_user(user_id: String) -> Option<User> {
    STATE.with(|state| {
        state.borrow().get(&user_id).cloned()
    })
}

// Required for candid interface generation
ic_cdk::export_candid!();