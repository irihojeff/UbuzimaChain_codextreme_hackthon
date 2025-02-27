import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from '../declarations/UbuzimaChain_backend/UbuzimaChain_backend.did.js';

class ApiService {
    constructor() {
        this.actor = null;
    }

    async createActor() {
        if (this.actor) return this.actor;

        const canisterId = process.env.CANISTER_ID_UBUZIMACHAIN_BACKEND || 'bkyz2-fmaaa-aaaaa-qaaaq-cai';
        const host = process.env.DFX_NETWORK === 'ic'
            ? 'https://boundary.ic0.app'
            : 'http://localhost:4943';

        const agent = new HttpAgent({ host });

        if (process.env.DFX_NETWORK !== 'ic') {
            try {
                await agent.fetchRootKey();
            } catch (err) {
                throw new Error('Network configuration error');
            }
        }

        this.actor = Actor.createActor(idlFactory, {
            agent,
            canisterId,
        });

        return this.actor;
    }

    async login(username, password) {
        const actor = await this.createActor();
        return actor.login({ username, password });
    }

    async register(username, password, role) {
        const actor = await this.createActor();
        return actor.register_user({ username, password }, { [role]: null });
    }
}

export const apiService = new ApiService();