use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64};
use ic_cdk::api::{time, caller};
use sha2::{Sha256, Digest};
use std::sync::atomic::{AtomicU64, Ordering};

static COUNTER: AtomicU64 = AtomicU64::new(0);

pub fn hash_password(password: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    let result = hasher.finalize();
    BASE64.encode(result)
}

pub fn verify_password(hash: &str, password: &str) -> bool {
    let password_hash = hash_password(password);
    hash == password_hash
}

pub fn generate_token(user_id: &str) -> String {
    let mut hasher = Sha256::new();
    let timestamp = time();
    hasher.update(format!("{}:{}:{}", user_id, caller().to_text(), timestamp).as_bytes());
    let result = hasher.finalize();
    BASE64.encode(result)
}

pub fn generate_unique_id() -> String {
    let timestamp = time();
    let counter_value = COUNTER.fetch_add(1, Ordering::SeqCst);
    format!("{}-{}", timestamp, counter_value)
}