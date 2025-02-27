import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from '../declarations/UbuzimaChain_backend/UbuzimaChain_backend.did.js';

export const createActor = async () => {
  const canisterId = process.env.REACT_APP_CANISTER_ID_UBUZIMACHAIN_BACKEND || 'bkyz2-fmaaa-aaaaa-qaaaq-cai';
  const host = process.env.REACT_APP_DFX_NETWORK === 'ic'
    ? 'https://boundary.ic0.app'
    : 'http://localhost:4943';

  const agent = new HttpAgent({ host });

  if (process.env.REACT_APP_DFX_NETWORK !== 'ic') {
    try {
      await agent.fetchRootKey();
    } catch (err) {
      throw new Error('Network configuration error');
    }
  }

  return Actor.createActor(idlFactory, { agent, canisterId });
};
