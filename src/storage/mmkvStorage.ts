// Handle MMKV storage functionality

import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV({
    id: "auth_storage",
    encryptionKey: "farmerconnect-auth-secret-2026",
});

// Storage Keys- typed constants to avoid typos

export const STORAGE_KEYS = {
    ACCESS_TOKEN:'auth.accessToken',
    REFRESH_TOKEN:'auth.refreshToken',
    // TOKEN_KEPIRES_AT:'auth.tokenExpiresAt',
    USER:'auth.user'
} as const;


// Token Helpers 

export const tokenStorage = {

    // get Access Token
    getAccessToken:():string|undefined =>{
        return storage.getString(STORAGE_KEYS.ACCESS_TOKEN);
    },

    // get Refresh Token

    getRefreshToken:():string|undefined => {
        return storage.getString(STORAGE_KEYS.REFRESH_TOKEN)
    },

    // // Get Token Expires
    // getTokenExpiresAt:():number|undefined => {
    //     return storage.getNumber(STORAGE_KEYS.TOKEN_KEPIRES_AT)
    // },

    // set Tokens

    setTokens:(accessToken:string,refreshToken:string,)=>{ // expiresIn:number
    // const expiresAt = Date.now()+expiresIn*1000;
    storage.set(STORAGE_KEYS.ACCESS_TOKEN,accessToken);
    storage.set(STORAGE_KEYS.REFRESH_TOKEN,refreshToken);
    // storage.set(STORAGE_KEYS.TOKEN_KEPIRES_AT,expiresAt)
    },

    updateAccessToken:(accessToken:string)=>{ //expiresIn:number
        // const expiresAt = Date.now()+expiresIn*1000;
        storage.set(STORAGE_KEYS.ACCESS_TOKEN,accessToken);
        // storage.set(STORAGE_KEYS.TOKEN_KEPIRES_AT,expiresAt)
    },

    clearTokens:()=>{
        storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        // storage.remove(STORAGE_KEYS.TOKEN_KEPIRES_AT);
    },

    // isTokenExpired:():boolean => {
    //     const expiresAt = storage.getNumber(STORAGE_KEYS.TOKEN_KEPIRES_AT);

    //     if(!expiresAt) return true;

    //     // Add 30s buffer before actual expiry
    //     return Date.now()>=expiresAt - 30_000;
    // },

    hasTokens:():boolean => {
        return !!storage.getString(STORAGE_KEYS.ACCESS_TOKEN)
    },

};

// User Helpers

export const userStorage = {
    getUser:<T>():T|null => {

        const raw = storage.getString(STORAGE_KEYS.USER);
        if(!raw) return null;

        try {
            return JSON.parse(raw) as T;
        } catch (error) {
            return null;
        }
    },

    setUser:(user:unknown)=>{
        storage.set(STORAGE_KEYS.USER,JSON.stringify(user));
    },

    clearUser:()=>{
        storage.remove(STORAGE_KEYS.USER)
    }
}