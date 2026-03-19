import { useFonts } from "expo-font";

import {
    Inter_400Regular,
    Inter_700Bold,
} from "@expo-google-fonts/inter";

import {
    Poppins_500Medium,
    Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export const useAppFonts = () => {
  return useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });
};