import ButtonComp from "@/src/components/atom/ButtonComp";
import FormInput from "@/src/components/atom/FormInput";
import { fonts } from "@/src/constants/fonts";
import {
  ResetPassFormData,
  ResetPassFormSchema,
} from "@/src/schema/user.Schema";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale } from "react-native-size-matters";

const ResetPassword = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPassFormData>({
    resolver: zodResolver(ResetPassFormSchema),
  });

  const onSubmit = (data: ResetPassFormData) => {
    console.log("Form Data:", data);
    router.push("/Successs");
    reset();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.arrow_back}>
          <MaterialIcons
            onPress={() => {
              router.push("/Login");
            }}
            name="arrow-back-ios"
            size={26}
            color="black"
          />
        </View>
        <Text style={styles.MainHeading}>Set a new password</Text>
        <Text style={styles.description}>
          Create a new password. Ensure it differs from previous ones for
          security
        </Text>
        <FormInput
          control={control}
          name="password"
          placeholder="enter password"
          labelName={"Password"}
          error={errors.password?.message}
        />
        <FormInput
          control={control}
          name="cpassword"
          placeholder="enter Confirm password"
          labelName={"Confirm Password"}
          error={errors.password?.message}
        />
        <ButtonComp
          title="Continue"
          style={styles.buttonContainer}
          textStyle={styles.buttonText}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(15),
    gap: moderateScale(10),
  },
  arrow_back: {
    backgroundColor: "#ECECEC",
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(42),
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: scale(10),
  },
  buttonText: {
    fontWeight: "bold",
    fontFamily: fonts.bodyBold,
    color: "white",
  },
  buttonContainer: {
    borderRadius: moderateScale(10),
  },
  MainHeading: {
    fontFamily: fonts.bodyBold,
    fontSize: moderateScale(15),
  },
  description: {
    color: "#989898",
    fontFamily: fonts.body,
    fontWeight: "700",
  },
});

export default ResetPassword;
