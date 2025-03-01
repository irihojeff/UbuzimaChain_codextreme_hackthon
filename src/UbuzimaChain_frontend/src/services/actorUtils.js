// File: src/services/actorUtils.js
import { createActor, canisterId } from "../declarations/UbuzimaChain_backend";

/**
 * Create a default actor that can call the UbuzimaChain backend canister.
 * In a real app, you might inject the user's identity for authenticated calls.
 */
export const backendActor = createActor(canisterId, {
  // Optionally pass { agentOptions: { identity } } for auth.
});
