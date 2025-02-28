# UbuzimaChain: Decentralized Healthcare Automation via Smart Contracts and AI

UbuzimaChain is a next-generation healthcare platform that redefines patient management by leveraging blockchain, smart contracts, and AI. Our solution goes beyond traditional hospital management systems—automating critical processes, ensuring data integrity, and enhancing security to reduce waiting times and mitigate medical risks.

---

## Features

### Decentralized Data Storage
- Patient records are stored on-chain for immutability and transparency.

### Secure User Authentication
- **Registration:** Users register with roles (Patient, Doctor, Admin) and passwords are securely hashed.
- **Login:** Secure login with token generation and role-based routing.

### Patient Management
- **Patient Registration:** Patients register and have their data stored securely.
- **Profile Retrieval:** Patients can view their profiles via a dedicated dashboard.
- **Doctor Authorization:** Patients can grant doctors access to their records.

### Role-Based Dashboards
- **Admin Dashboard:** Displays a comprehensive table of all registered patients.
- **Doctor Dashboard:** Provides a placeholder UI for future patient management and appointment scheduling.
- **Patient Dashboard & MyProfile:** Enable patients to view and manage their own profiles.

### Future Enhancements
- **Smart Contract Automation:** Automated appointment booking and triage to reduce waiting times.
- **AI-Driven Recommendations:** Intelligent matching of patients with the best available doctors.
- **Profile Modification:** Allow patients to update their details post-registration.
- **Advanced Analytics:** Dashboard enhancements for filtering, sorting, and real-time system statistics.

---

## Technical Stack

### Backend (Rust)
- **Language:** Rust
- **Framework:** [ic-cdk](https://github.com/dfinity/ic-cdk) & [ic-cdk-macros](https://github.com/dfinity/ic-cdk-macros)
- **Blockchain Integration:** Internet Computer Protocol (ICP)
- **Data Storage:** In-memory state with a plan for stable memory upgrades in production

### Frontend (React)
- **Library:** React
- **Tooling:** Vite, Tailwind CSS
- **Routing:** React Router
- **API Communication:** Dfinity Agent for canister calls

---

## Architecture Overview

1. **Authentication Module:**
   - Implements user registration and login.
   - Users are stored in a global state (`STATE`) and mapped from principal IDs to user IDs via `PRINCIPAL_TO_USER`.

2. **Patients Module:**
   - Provides endpoints for patient registration, fetching individual patient details, and admin retrieval of all patients.
   - Uses a two-step lookup in `get_all_patients()` to ensure that only Admins can access patient records.

3. **State Management:**
   - Uses thread-local storage (`RefCell<HashMap<...>>`) for users, patients, and principal-to-user mappings.
   - In development, state resets on each deployment; stable memory persistence is planned for production.

4. **Frontend Components:**
   - **Authentication Components:** Separate Login and Registration (PatientRegistration) components with error handling and role-based redirection.
   - **Dashboard Components:** Role-specific dashboards for Admins, Doctors, and Patients.
   - **Error Boundaries:** Capture runtime errors and display friendly messages.
   - **Routing:** Managed via React Router for seamless navigation.

---

## Installation & Deployment

### Prerequisites
- [DFX SDK](https://smartcontracts.org/docs/developers-guide/install-upgrade.html)
- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js and npm](https://nodejs.org/)

### Backend Setup
1. **Install Dependencies:**
   ```bash
   cd UbuzimaChain_backend
   cargo install --locked
