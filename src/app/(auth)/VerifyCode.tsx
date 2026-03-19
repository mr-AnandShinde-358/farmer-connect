import ButtonComp from "@/src/components/atom/ButtonComp";
import { OtpInput } from "@/src/components/atom/OtpInput";

import { fonts } from "@/src/constants/fonts";
import { VerifyOtpData, VerifyOtpSchema } from "@/src/schema/user.Schema";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const VerifyCode = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VerifyOtpData>({
    resolver: zodResolver(VerifyOtpSchema),
  });

  const onSubmit = (data: VerifyOtpData) => {
    console.log("Form Data:", data);
    router.push("/ResetPassword");
    reset();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.arrow_back}>
          <MaterialIcons
            onPress={() => {
              router.push("/ForgotPass");
            }}
            name="arrow-back-ios"
            size={26}
            color="black"
          />
        </View>
        <Text style={styles.MainHeading}>Check your email</Text>
        <Text style={styles.description}>
          We sent a reset link to{" "}
          <Text style={styles.contact}>contact@gmailcom</Text> enter 5 digit
          code that mentioned in the email
        </Text>

        <OtpInput name="otp" control={control} length={5} />
        {errors.otp && <Text style={styles.error}>{errors.otp.message}</Text>}
        <ButtonComp
          title="Verify Code"
          style={styles.buttonContainer}
          textStyle={styles.buttonText}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
      <Text style={styles.account}>
        Haven’t got the email yet?
        <Link style={styles.Link} href="./ForgotPass">
          Resend email
        </Link>
      </Text>
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
  error: {
    color: "red",
  },
  contact: {
    fontFamily: fonts.bodyBold,
    color: "black",
  },
  Link: {
    color: "#648DDB",
    fontFamily: fonts.body,
    fontWeight: "bold",
  },
  account: {
    textAlign: "center",
    marginBottom: verticalScale(10),
    fontFamily: fonts.body,
    fontWeight: "bold",
    color: "#989898",
    paddingTop: verticalScale(10),
    gap: moderateScale(20),
    flex: 1,
  },
});

export default VerifyCode;
