use crate::types::{AutonomousAppointmentPayload, Appointment, AppointmentStatus, User, UserRole};
use crate::errors::UserError;
use crate::state::{APPOINTMENTS, STATE, DOCTOR_SCHEDULES};
use crate::utils::generate_unique_id;
use ic_cdk::api::{caller, time};
use ic_cdk_macros::{update, query};

#[update]
pub async fn create_autonomous_appointment(payload: AutonomousAppointmentPayload) -> Result<String, UserError> {
    let patient_id = payload.patient_id;
    let symptoms = payload.symptoms;
    let caller_id = caller().to_text();

    if caller_id != patient_id {
        return Err(UserError::UnauthorizedAccess);
    }

    // Find doctors with a complete profile and matching specialization
    let matching_doctors: Vec<User> = STATE.with(|state| {
        state.borrow().values()
            .filter(|user| {
                if user.role == UserRole::Doctor && user.profile_complete {
                    if let Some(spec) = &user.specialization {
                        return symptoms.to_lowercase().contains(&spec.to_lowercase());
                    }
                }
                false
            })
            .cloned()
            .collect()
    });

    if matching_doctors.is_empty() {
        return Err(UserError::InvalidData);
    }

    // Select a doctor with an available slot (always choose the earliest available slot)
    let mut selected_doctor: Option<(User, u64)> = None;
    for doctor in matching_doctors {
        let available_slot = DOCTOR_SCHEDULES.with(|schedules| {
            let schedules = schedules.borrow();
            if let Some(schedule) = schedules.get(&doctor.id) {
                schedule.available_slots.first().cloned()
            } else {
                None
            }
        });
        if let Some(slot) = available_slot {
            selected_doctor = Some((doctor, slot));
            break;
        }
    }

    let (doctor, slot) = selected_doctor.ok_or(UserError::InvalidData)?;

    let appointment_id = generate_unique_id();
    let now = time();
    let new_appointment = Appointment {
        id: appointment_id.clone(),
        doctor_id: doctor.id.clone(),
        patient_id: patient_id.clone(),
        scheduled_time: slot,
        status: AppointmentStatus::Pending,
        created_at: now,
        updated_at: now,
        notes: payload.notes,
    };

    APPOINTMENTS.with(|appointments| {
        appointments.borrow_mut().insert(appointment_id.clone(), new_appointment);
    });

    DOCTOR_SCHEDULES.with(|schedules| {
        if let Some(schedule) = schedules.borrow_mut().get_mut(&doctor.id) {
            schedule.available_slots.retain(|&time_slot| time_slot != slot);
        }
    });

    Ok(appointment_id)
}

#[query]
pub fn get_appointment(appointment_id: String) -> Result<Appointment, UserError> {
    APPOINTMENTS.with(|appointments| {
        appointments.borrow().get(&appointment_id).cloned().ok_or(UserError::InvalidData)
    })
}

#[query]
pub fn get_appointments_by_patient(patient_id: String) -> Vec<Appointment> {
    APPOINTMENTS.with(|appointments| {
        appointments.borrow().values()
            .filter(|appt| appt.patient_id == patient_id)
            .cloned()
            .collect()
    })
}
