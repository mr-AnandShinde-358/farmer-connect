import { fonts } from "@/src/constants/fonts";
import React from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

const FormInput = ({
  control,
  name,
  placeholder,
  secureTextEntry,
  error,
  labelName,
}: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.InputLabel}>{labelName}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            secureTextEntry={secureTextEntry}
            style={styles.input}
            placeholderTextColor="#999"
          />
        )}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    // backgroundColor: "red",
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
  error: {
    color: "red",
    marginTop: 5,
  },
  InputLabel: {
    fontFamily: fonts.bodyBold,
    marginBottom: moderateScale(5),
  },
});
