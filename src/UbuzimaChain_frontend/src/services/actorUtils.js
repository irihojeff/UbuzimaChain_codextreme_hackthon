// File: src/services/actorUtils.js
import { createActor, canisterId } from "../declarations/UbuzimaChain_backend";

// Creates an actor to call the UbuzimaChain backend canister
export const backendActor = createActor(canisterId, {
  // If you integrate Internet Identity, pass { agentOptions: { identity } } here
});
