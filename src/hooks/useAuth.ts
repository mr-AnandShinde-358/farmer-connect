// src/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { authApi } from "../api/auth.api";
import { loginFormData, SignUpFormData } from "../schema/user.Schema";
import { useAuthStore } from "../store/auth.store";

export function useLoginUser(){
    return useMutation({
        mutationFn:(payload:loginFormData)=>authApi.loginUser(payload)
    })
}

export function useRegisterUser(){
    return useMutation({
        mutationFn:(payload:SignUpFormData)=>authApi.registerUser(payload)
    })
}

export function useLogoutUser(){
    const { clearAuth } = useAuthStore();
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            console.log("🔄 [Logout] Starting logout process...");
            
            try {
                // ✅ Step 1: Call backend logout
                const response = await authApi.logoutUser();
                console.log("✅ [Logout] Backend logout successful:", response);
                return response;
            } catch (error) {
                console.log("⚠️ [Logout] Backend logout failed (will continue with cleanup):", error);
                // Continue with cleanup even if API fails
                throw error;
            }
        },
        
        onSuccess: async () => {
            console.log("✅ [Logout] Mutation successful, clearing state...");
            await performCleanup();
        },

        onError: async (error) => {
            console.log("❌ [Logout] Mutation error, still cleaning up:", error);
            // Cleanup anyway even on error
            await performCleanup();
        },
    });

    async function performCleanup() {
        console.log("🧹 [Logout] Cleaning up...");
        
        // ✅ Step 2: Clear auth state (Zustand + MMKV)
        clearAuth();
        console.log("✅ [Logout] Auth state cleared");
        
        // ✅ Step 3: Reset navigation to login
        setTimeout(() => {
            // router.replace("/(auth)/login");
            console.log("✅ [Logout] Navigated to login");
        }, 200);
    }
}