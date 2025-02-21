// src/utils/actorUtils.js
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../declarations/UbuzimaChain_backend/UbuzimaChain_backend.did.js";

export const createActor = async () => {
    try {
        // Get canister ID and host with fallbacks
        const canisterId = process.env.REACT_APP_CANISTER_ID_UBUZIMACHAIN_BACKEND || "bkyz2-fmaaa-aaaaa-qaaaq-cai";
        const host = process.env.REACT_APP_DFX_NETWORK === "ic" 
            ? "https://boundary.ic0.app" 
            : "http://localhost:4943";

        // Create auth client
        const authClient = await AuthClient.create();
        if (!authClient) {
            throw new Error("Failed to create auth client");
        }

        // Get identity
        const identity = authClient.getIdentity();
        if (!identity) {
            throw new Error("No identity available");
        }

        // Create agent
        const agent = new HttpAgent({
            host,
            identity
        });

        // Fetch root key in development
        if (process.env.REACT_APP_DFX_NETWORK !== "ic") {
            await agent.fetchRootKey().catch(e => {
                console.error("Failed to fetch root key:", e);
                throw new Error("Network configuration error");
            });
        }

        // Create actor
        const actor = Actor.createActor(idlFactory, {
            agent,
            canisterId,
        });

        // Verify actor was created successfully
        if (!actor) {
            throw new Error("Failed to create actor");
        }

        // Log available methods in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Actor created with methods:', Object.getOwnPropertyNames(actor));
        }

        return actor;
    } catch (error) {
        console.error("Actor creation failed:", error);
        throw new Error(`Failed to initialize actor: ${error.message}`);
    }
};