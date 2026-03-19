import { useAppFonts } from "@/src/hooks/useAppFonts";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

import Toast from "react-native-toast-message";
import {
  selectIsAuthenticated,
  selectIsHydrated,
  selectUser,
  useAuthStore,
} from "../store/auth.store";
import { queryClient } from "../utils/queryClient";

SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
  const hydrate = useAuthStore((s) => s.hydrate);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isHydrated = useAuthStore(selectIsHydrated);
  const user = useAuthStore(selectUser);

  const [fontsLoaded] = useAppFonts();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (fontsLoaded && isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !isHydrated) {
    return null;
  }

  if (!isHydrated) return null;
  console.log("is Authenticated", isAuthenticated);
  console.log("user is", user?.role);
  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            {/* Public screens — only accessible when NOT authenticated */}
            <Stack.Protected guard={!isAuthenticated}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>

            {/* Protected screens — only accessible when authenticated */}
            <Stack.Protected guard={isAuthenticated && user?.role === "FARMER"}>
              <Stack.Screen name="(farmer)" />
            </Stack.Protected>
            <Stack.Protected guard={isAuthenticated && user?.role === "BUYER"}>
              <Stack.Screen name="(buyer)" />
            </Stack.Protected>
          </Stack>
          {Platform.OS === "web" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
          <Toast />
        </PaperProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
