import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const ButtonComp = ({ title, style, textStyle, onPress }: any) => {
  return (
    <TouchableOpacity
      style={[styles.button_container, style]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={[styles.button_Text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button_container: {
    backgroundColor: "#055B1D",
    width: "100%",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(4),
  },

  button_Text: {
    fontSize: moderateScale(14),
    color: "white",
    textAlign: "center",
    // fontWeight: "bold",
  },
});
export default ButtonComp;
