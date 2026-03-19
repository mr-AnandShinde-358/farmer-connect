// components/OtpInput.tsx
import React, { useRef } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { StyleSheet, TextInput, View } from "react-native";

interface OtpInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  length?: number;
}

export function OtpInput<T extends FieldValues>({
  name,
  control,
  length,
}: OtpInputProps<T>) {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value = "", onChange } }) => {
        const digits = value.split("");

        const handleChange = (text: string, index: number) => {
          const newDigits = [...digits];

          if (text.length > 1) {
            // Handle paste: spread across boxes
            const pasted = text.slice(0, length).split("");
            pasted.forEach((char, i) => (newDigits[i] = char));
            onChange(newDigits.join(""));
            const nextIndex = Math.min(pasted.length, length - 1);
            inputRefs.current[nextIndex]?.focus();
            return;
          }

          newDigits[index] = text;
          onChange(newDigits.join(""));

          if (text && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
          }
        };

        const handleKeyPress = (key: string, index: number) => {
          if (key === "Backspace" && !digits[index] && index > 0) {
            const newDigits = [...digits];
            newDigits[index - 1] = "";
            onChange(newDigits.join(""));
            inputRefs.current[index - 1]?.focus();
          }
        };

        return (
          <View style={styles.container}>
            {Array.from({ length }).map((_, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                style={[
                  styles.box,
                  digits[index] ? styles.boxFilled : undefined,
                ]}
                value={digits[index] ?? ""}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="number-pad"
                maxLength={index === 0 ? length : 1} // allow paste on first box
                selectTextOnFocus
                textContentType="oneTimeCode" // iOS autofill
                autoComplete={index === 0 ? "one-time-code" : "off"} // Android autofill
              />
            ))}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
  },
  boxFilled: {
    borderColor: "#6366F1",
    backgroundColor: "#EEF2FF",
  },
});
