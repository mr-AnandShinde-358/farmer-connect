import { Stack } from "expo-router";
import React from "react";

const AuthenticationLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Login" />
      <Stack.Screen name="Forgoot_Pass" />
      <Stack.Screen name="ResetPassword" />
      <Stack.Screen name="Successs" />
      <Stack.Screen name="VerifyCode" />
    </Stack>
  );
};

export default AuthenticationLayout;
