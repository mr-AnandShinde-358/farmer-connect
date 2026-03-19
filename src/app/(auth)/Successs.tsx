import ButtonComp from "@/src/components/atom/ButtonComp";
import { fonts } from "@/src/constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const Successs = () => {
  const onSubmit = (data: any) => {
    router.push("/Login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.arrow_back}>
          <AntDesign
            onPress={() => {
              router.push("/Login");
            }}
            name="check"
            size={20}
            color="#208B3A"
          />
        </View>
        <Text style={styles.MainHeading}>Successful</Text>
        <Text style={styles.description}>
          Congratulations! Your Password has been changed.Click continue to
          login
        </Text>

        <ButtonComp
          title="Continue"
          style={styles.buttonContainer}
          textStyle={styles.buttonText}
          onPress={onSubmit}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(15),
    paddingTop: verticalScale(180),
    gap: moderateScale(30),
    justifyContent: "center",
    alignItems: "center",
  },
  arrow_back: {
    backgroundColor: "#B9DAC2",
    width: moderateScale(98),
    height: moderateScale(98),
    borderRadius: moderateScale(98),
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: scale(0),
    borderColor: "#208B3A",
    borderWidth: moderateScale(1),
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
    width: scale(200),
  },
});

export default Successs;
