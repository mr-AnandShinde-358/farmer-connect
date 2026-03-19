import {
  useGetFarmerProfile,
  useUpsertFarmerProfile,
} from "@/src/hooks/useFarmerProfile";
import { useAuthStore } from "@/src/store/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Avatar,
  Button,
  HelperText,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name required"),
  phoneNumber2: z.string().optional(),
  district: z.string().min(2, "District required"),
  state: z.string().min(2, "State required"),
  village: z.string().optional(),
  pincode: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);

  // screen mein:
  const { data: profile, isLoading } = useGetFarmerProfile();
  const { mutate, isPending } = useUpsertFarmerProfile();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: profile?.fullName ?? "",
      phoneNumber2: profile?.phoneNumber2 ?? "",
      district: profile?.address?.district ?? "",
      state: profile?.address?.state ?? "",
      village: profile?.address?.village ?? "",
      pincode: profile?.address?.pincode ?? "",
    },
  });

  const onSubmit = (data: ProfileForm) => {
    mutate({
      fullName: data.fullName,
      phoneNumber2: data.phoneNumber2,
      address: {
        district: data.district,
        state: data.state,
        village: data.village,
        pincode: data.pincode,
      },
    });
  };

  if (isLoading) return <Text style={styles.center}>Loading...</Text>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.container, { flexGrow: 1 }]}
        >
          <View style={styles.avatarRow}>
            <Avatar.Icon size={72} icon="account" />
            <Text variant="titleLarge">{user?.email}</Text>
          </View>

          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  label="Full Name"
                  mode="outlined"
                  value={value}
                  onChangeText={onChange}
                />
                <HelperText type="error" visible={!!errors.fullName}>
                  {errors.fullName?.message}
                </HelperText>
              </>
            )}
          />

          <Controller
            control={control}
            name="phoneNumber2"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Alternate Phone (optional)"
                mode="outlined"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="village"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Village (optional)"
                mode="outlined"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="district"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  label="District"
                  mode="outlined"
                  value={value}
                  onChangeText={onChange}
                />
                <HelperText type="error" visible={!!errors.district}>
                  {errors.district?.message}
                </HelperText>
              </>
            )}
          />

          <Controller
            control={control}
            name="state"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  label="State"
                  mode="outlined"
                  value={value}
                  onChangeText={onChange}
                />
                <HelperText type="error" visible={!!errors.state}>
                  {errors.state?.message}
                </HelperText>
              </>
            )}
          />

          <Controller
            control={control}
            name="pincode"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Pincode (optional)"
                mode="outlined"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
            style={styles.btn}
          >
            Save Profile
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 4 },
  avatarRow: { alignItems: "center", gap: 8, marginBottom: 16 },
  center: { flex: 1, textAlign: "center", marginTop: 20 },
  btn: { marginTop: 16 },
});
