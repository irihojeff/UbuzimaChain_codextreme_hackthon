export const canisterIds = {
    "UbuzimaChain_backend": process.env.CANISTER_ID_UBUZIMACHAIN_BACKEND || 
      process.env.UBUZIMACHAIN_BACKEND_CANISTER_ID
  };
  
  export const host = process.env.DFX_NETWORK === "local" ? 
    "http://127.0.0.1:4943" : 
    "https://ic0.app";