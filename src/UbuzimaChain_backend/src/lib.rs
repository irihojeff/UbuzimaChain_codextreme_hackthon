use candid::{CandidType, Deserialize};
use ic_cdk::api::{time, caller};
use ic_cdk_macros::{update, query, init};
use ic_cdk;
use serde::Serialize;
use std::collections::HashMap;
use std::cell::RefCell;
use std::sync::atomic::{AtomicU64, Ordering};
use sha2::{Sha256, Digest};
use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64};

// Custom error type for better error handling
#[derive(CandidType, Serialize, Deserialize, Debug)]
pub enum UserError {
    UsernameTaken,
    InvalidCredentials,
    EmptyFields,
    UserNotFound,
    SystemError,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct User {
    id: String,
    username: String,
    password_hash: String,
    created_at: u64,
    last_login: Option<u64>,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct AuthPayload {
    username: String,
    password: String,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct AuthResponse {
    token: String,
    user_id: String,
    username: String,
    created_at: u64,
}

// State management with initialization
thread_local! {
    static STATE: RefCell<HashMap<String, User>> = RefCell::new(HashMap::new());
    static USERNAMES: RefCell<HashMap<String, String>> = RefCell::new(HashMap::new()); // Username to ID mapping
}

static COUNTER: AtomicU64 = AtomicU64::new(0);

// Initialize canister state
#[init]
fn init() {
    ic_cdk::println!("Initializing UbuzimaChain backend canister");
}

fn hash_password(password: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    let result = hasher.finalize();
    BASE64.encode(result)
}

fn verify_password(hash: &str, password: &str) -> bool {
    let password_hash = hash_password(password);
    hash == password_hash
}

fn generate_token(user_id: &str) -> String {
    let mut hasher = Sha256::new();
    let timestamp = time();
    hasher.update(format!("{}:{}:{}", user_id, caller().to_text(), timestamp).as_bytes());
    let result = hasher.finalize();
    BASE64.encode(result)
}

fn generate_unique_id() -> String {
    let timestamp = time();
    let counter_value = COUNTER.fetch_add(1, Ordering::SeqCst);
    format!("{}-{}", timestamp, counter_value)
}

#[update]
async fn register_user(payload: AuthPayload) -> Result<String, UserError> {
    ic_cdk::println!("Attempting to register user: {}", payload.username);

    if payload.username.is_empty() || payload.password.is_empty() {
        return Err(UserError::EmptyFields);
    }

    // Check username availability
    USERNAMES.with(|usernames| {
        if usernames.borrow().contains_key(&payload.username) {
            return Err(UserError::UsernameTaken);
        }
        Ok(())
    })?;

    let user_id = generate_unique_id();
    let user = User {
        id: user_id.clone(),
        username: payload.username.clone(),
        password_hash: hash_password(&payload.password),
        created_at: time(),
        last_login: None,
    };

    STATE.with(|state| {
        state.borrow_mut().insert(user_id.clone(), user.clone());
    });

    USERNAMES.with(|usernames| {
        usernames.borrow_mut().insert(payload.username.clone(), user_id.clone());
    });

    Ok(user_id)
}

#[update]
async fn login(payload: AuthPayload) -> Result<AuthResponse, UserError> {
    let user = USERNAMES.with(|usernames| {
        let usernames = usernames.borrow();
        if let Some(user_id) = usernames.get(&payload.username) {
            STATE.with(|state| {
                state.borrow().get(user_id).cloned()
            })
        } else {
            None
        }
    });

    match user {
        Some(mut user) => {
            if verify_password(&user.password_hash, &payload.password) {
                // Update last login
                user.last_login = Some(time());
                STATE.with(|state| {
                    state.borrow_mut().insert(user.id.clone(), user.clone());
                });

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
        None => Err(UserError::UserNotFound)
    }
}

#[query]
fn get_user(user_id: String) -> Result<User, UserError> {
    STATE.with(|state| {
        state.borrow()
            .get(&user_id)
            .cloned()
            .ok_or(UserError::UserNotFound)
    })
}

// Required for candid interface generation
ic_cdk::export_candid!();