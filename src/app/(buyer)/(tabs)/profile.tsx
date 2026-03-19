import {
  useGetBuyerProfile,
  useUpsertBuyerProfile,
} from "@/src/hooks/useBuyer";
import { useAuthStore } from "@/src/store/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Avatar,
  Button,
  HelperText,
  Menu,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const BUYER_TYPES = ["Individual", "Wholesaler", "Retailer", "Processor"];

const profileSchema = z.object({
  fullName: z.string().min(2, "Name required"),
  buyerType: z.enum(["Individual", "Wholesaler", "Retailer", "Processor"]),
  phoneNumbe2: z.string().optional(),
  village: z.string().optional(),
  district: z.string().min(2, "District required"),
  state: z.string().min(2, "State required"),
  pincode: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function BuyerProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: profile, isLoading } = useGetBuyerProfile();
  const { mutate, isPending } = useUpsertBuyerProfile();
  const [menuVisible, setMenuVisible] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: profile?.fullName ?? "",
      buyerType: profile?.buyerType ?? "Individual",
      phoneNumbe2: profile?.phoneNumbe2 ?? "",
      village: profile?.address?.village ?? "",
      district: profile?.address?.district ?? "",
      state: profile?.address?.state ?? "",
      pincode: profile?.address?.pincode?.toString() ?? "",
    },
  });

  const selectedBuyerType = watch("buyerType");

  const onSubmit = (data: ProfileForm) => {
    mutate({
      fullName: data.fullName,
      buyerType: data.buyerType,
      phoneNumbe2: data.phoneNumbe2,
      address: {
        village: data.village,
        district: data.district,
        state: data.state,
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
          contentContainerStyle={[styles.container, { flexGrow: 1 }]}
          keyboardShouldPersistTaps="handled"
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

          {/* Buyer Type */}
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <TextInput
                  label="Buyer Type"
                  mode="outlined"
                  value={selectedBuyerType}
                  editable={false}
                  right={<TextInput.Icon icon="chevron-down" />}
                />
              </TouchableOpacity>
            }
          >
            {BUYER_TYPES.map((t) => (
              <Menu.Item
                key={t}
                title={t}
                onPress={() => {
                  setValue("buyerType", t as any);
                  setMenuVisible(false);
                }}
              />
            ))}
          </Menu>

          <Controller
            control={control}
            name="phoneNumbe2"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Alternate Phone (optional)"
                mode="outlined"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                style={styles.mt}
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
                style={styles.mt}
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
                  style={styles.mt}
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
  mt: { marginTop: 4 },
  btn: { marginTop: 16 },
  center: { textAlign: "center", marginTop: 40 },
});
