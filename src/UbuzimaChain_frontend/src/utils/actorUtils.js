import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../declarations/UbuzimaChain_backend/UbuzimaChain_backend.did.js";

let cachedActor = null;

export const createActor = async () => {
    try {
        // Return cached actor if available
        if (cachedActor) {
            console.log('actorUtils: Returning cached actor');
            return cachedActor;
        }

        console.log('actorUtils: Starting actor creation...');

        // Get canister ID and host with fallbacks
        const canisterId = process.env.REACT_APP_CANISTER_ID_UBUZIMACHAIN_BACKEND || "bkyz2-fmaaa-aaaaa-qaaaq-cai";
        const host = process.env.REACT_APP_DFX_NETWORK === "ic" 
            ? "https://boundary.ic0.app" 
            : "http://localhost:4943";

        console.log('actorUtils: Using canister ID:', canisterId);
        console.log('actorUtils: Using host:', host);

        // Create auth client
        console.log('actorUtils: Creating AuthClient...');
        const authClient = await AuthClient.create();
        if (!authClient) {
            throw new Error("Failed to create auth client");
        }
        console.log('actorUtils: AuthClient created successfully');

        // Get identity
        console.log('actorUtils: Getting identity...');
        const identity = authClient.getIdentity();
        if (!identity) {
            throw new Error("No identity available");
        }
        console.log('actorUtils: Identity obtained successfully');

        // Create agent
        console.log('actorUtils: Creating HttpAgent...');
        const agent = new HttpAgent({
            host,
            identity
        });

        // Fetch root key in development
        if (process.env.REACT_APP_DFX_NETWORK !== "ic") {
            console.log('actorUtils: Fetching root key...');
            await agent.fetchRootKey().catch(e => {
                console.error("Failed to fetch root key:", e);
                throw new Error("Network configuration error");
            });
            console.log('actorUtils: Root key fetched successfully');
        }

        // Create actor
        console.log('actorUtils: Creating actor...');
        cachedActor = Actor.createActor(idlFactory, {
            agent,
            canisterId,
        });

        // Verify actor was created successfully
        if (!cachedActor) {
            throw new Error("Failed to create actor");
        }

        // Log available methods in development
        if (process.env.NODE_ENV === 'development') {
            const methods = Object.getOwnPropertyNames(cachedActor);
            console.log('actorUtils: Actor created with methods:', methods);
            console.log('actorUtils: Checking for get_my_patient_details method:', 
                methods.includes('get_my_patient_details'));
        }

        console.log('actorUtils: Actor created successfully');
        return cachedActor;
    } catch (error) {
        console.error("actorUtils: Actor creation failed:", error);
        // Clear cached actor in case of error
        cachedActor = null;
        throw new Error(`Failed to initialize actor: ${error.message}`);
    }
};