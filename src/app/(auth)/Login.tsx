import { fonts } from "@/src/constants/fonts";
import { imagePath } from "@/src/constants/imagePath";
import { useLoginUser } from "@/src/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

import ButtonComp from "@/src/components/atom/ButtonComp";
import FormInput from "@/src/components/atom/FormInput";
import { useAuthStore } from "@/src/store/auth.store";
import { Link } from "expo-router";
import Toast from "react-native-toast-message";
import { loginFormData, loginFormSchema } from "../../schema/user.Schema";

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<loginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const setAuth = useAuthStore((state) => state.setAuth);
  const { mutate, isPending, isError, error } = useLoginUser();

  const onSubmit = (data: loginFormData) => {
    mutate(data, {
      onSuccess: (res) => {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Log In successfully...",
        });
        setAuth(res.user, {
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        });
      },
      onError: (err: any) => {
        Toast.show({
          type: "error",
          text1: "❌ Login Failed",
          text2: err?.response?.data?.messages || "Please try again",
        });
      },
    });

    reset();
  };

  // const jsonData = JSON.stringify(data);
  // if (isPending) {
  //   return <Text>Loading...</Text>;
  // }

  // if (isError) {
  //   return <Text>Error loading user</Text>;
  // }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* header */}
          <View>
            <Image style={styles.logo} source={imagePath.logo} />
          </View>
          {/* main */}
          <View style={styles.main}>
            {/* Heading Text */}
            <Text style={styles.MainHeading}>Log in</Text>
            {/* Login Form */}
            <View style={styles.loginForm}>
              <FormInput
                control={control}
                name="email"
                placeholder="Enter Your Email..."
                error={errors?.email?.message}
                labelName={"Your Email"}
              />
              <FormInput
                control={control}
                name="password"
                placeholder="Enter Your Password..."
                error={errors?.password?.message}
                labelName={"Password"}
              />

              {/* <Link
                style={[styles.Forgot_Text, styles.Link]}
                href="./ForgotPass"
              >
                Forgot Password?
              </Link> */}

              <ButtonComp
                title="Continue"
                style={styles.buttonContainer}
                textStyle={styles.buttonText}
                onPress={handleSubmit(onSubmit)}
              />
              <Text style={styles.account}>
                Don’t have an account?
                <Link style={styles.Link} href="./">
                  Sign up
                </Link>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: verticalScale(50),
  },
  logo: {
    height: moderateScale(200),
    width: moderateScale(200),
    // backgroundColor: "red",
  },
  main: {
    // marginTop: verticalScale(10),
  },
  MainHeading: {
    fontSize: moderateScale(20),
    fontWeight: "500",
    fontFamily: fonts.heading,
    borderBottomWidth: moderateScale(2),
    borderBottomColor: "#60AC75",
    textAlign: "center",
  },
  loginForm: {
    marginTop: moderateScale(50),
    width: scale(300),
  },
  dropdown: {
    height: moderateScale(50),
    borderColor: "#60AC75",
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(12),
    marginBottom: verticalScale(16),
  },
  placeholderStyle: {
    fontSize: moderateScale(14),
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: moderateScale(14),
    fontFamily: fonts.heading,
  },
  errorText: {
    color: "red",
    fontSize: moderateScale(12),
    marginTop: verticalScale(-12),
    marginBottom: verticalScale(8),
  },
  Forgot_Text: {
    textAlign: "right",
    marginBottom: verticalScale(10),
    fontFamily: fonts.body,
    fontWeight: "bold",
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
  buttonText: {
    fontWeight: "bold",
    fontFamily: fonts.bodyBold,
    color: "white",
  },
  buttonContainer: {
    borderRadius: moderateScale(10),
  },
});

export default LoginScreen;
