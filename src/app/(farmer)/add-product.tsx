import { useCreateProduct } from "@/src/hooks/useProduct";
import {
  addProductSchema,
  type AddProductForm,
} from "@/src/schema/product.schema";
// import { generateProductDescription } from "@/src/utils/gemini";
import { generateProductDescription } from "@/src/utils/openai";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  HelperText,
  Menu,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = ["GRAIN", "VEGETABLE", "FRUIT", "SPICE", "DAIRY", "OTHER"];
const UNITS = ["kg", "quintal", "dozen", "litre", "piece", "ton"];

export default function AddProductScreen() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [unitMenuVisible, setUnitMenuVisible] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddProductForm>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      unit: "kg",
      category: "GRAIN",
      harvestDate: new Date(),
    },
  });

  const { mutate, isPending } = useCreateProduct();
  const selectedCategory = watch("category");
  const selectedUnit = watch("unit");
  const selectedDate = watch("harvestDate");

  const pickImages = async () => {
    if (images.length >= 5) {
      Alert.alert("Max 5 images allowed");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const newImages = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...newImages].slice(0, 5));
    }
  };

  const onSubmit = async (data: AddProductForm) => {
    // TODO: API call + ImageKit upload

    if (images.length === 0) {
      Alert.alert("Error", "At least one image required");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("unit", data.unit);
    formData.append("quantity", data.quantity.toString());
    formData.append("category", data.category);
    formData.append("harvestDate", data.harvestDate.toISOString());
    formData.append("district", data.district);
    formData.append("state", data.state);
    if (data.description) formData.append("description", data.description);

    images.forEach((uri, index) => {
      formData.append("images", {
        uri,
        name: `product_${index}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    mutate(formData, {
      onSuccess: () => {
        Alert.alert("Success", "Product added!");
        router.back();
      },
      onError: (err: any) => {
        Alert.alert(
          "Error",
          err?.response?.data?.message ?? "Something went wrong",
        );
      },
    });
  };

  const onGenerateDescription = async () => {
    if (images.length === 0) {
      Alert.alert("Error", "Pehle ek image add karo");
      return;
    }
    const name = watch("name");
    if (!name) {
      Alert.alert("Error", "Pehle product name likho");
      return;
    }
    setGeneratingDesc(true);
    try {
      const desc = await generateProductDescription(name);
      setValue("description", desc);
    } catch (err) {
      Alert.alert("Error", "Description generation error");
    } finally {
      setGeneratingDesc(false);
    }
  };
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
          <Text variant="headlineSmall" style={styles.title}>
            Add Product
          </Text>

          {/* Name */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  label="Product Name"
                  theme={{ colors: { onSurfaceVariant: "black" } }}
                  textColor="black"
                  outlineColor="black"
                  activeOutlineColor="black"
                  mode="outlined"
                  value={value}
                  onChangeText={onChange}
                  style={styles.inputStyle}
                />
                <HelperText type="error" visible={!!errors.name}>
                  {errors.name?.message}
                </HelperText>
              </>
            )}
          />

          {/* Price + Unit */}
          <View style={styles.row}>
            <View style={styles.flex}>
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      label="Price (₹)"
                      mode="outlined"
                      theme={{ colors: { onSurfaceVariant: "black" } }}
                      style={styles.inputStyle}
                      textColor="black"
                      outlineColor="black"
                      activeOutlineColor="black"
                      keyboardType="numeric"
                      value={value?.toString()}
                      onChangeText={onChange}
                    />
                    <HelperText type="error" visible={!!errors.price}>
                      {errors.price?.message}
                    </HelperText>
                  </>
                )}
              />
            </View>

            <View style={styles.flex}>
              <Menu
                visible={unitMenuVisible}
                onDismiss={() => setUnitMenuVisible(false)}
                anchor={
                  <TouchableOpacity onPress={() => setUnitMenuVisible(true)}>
                    <TextInput
                      label="Unit"
                      mode="outlined"
                      theme={{ colors: { onSurfaceVariant: "black" } }}
                      style={styles.inputStyle}
                      textColor="black"
                      outlineColor="black"
                      activeOutlineColor="black"
                      value={selectedUnit}
                      editable={false}
                      right={<TextInput.Icon icon="chevron-down" />}
                    />
                  </TouchableOpacity>
                }
              >
                {UNITS.map((u) => (
                  <Menu.Item
                    key={u}
                    title={u}
                    onPress={() => {
                      setValue("unit", u);
                      setUnitMenuVisible(false);
                    }}
                  />
                ))}
              </Menu>
            </View>
          </View>

          {/* Quantity */}
          <Controller
            control={control}
            name="quantity"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  label="Quantity"
                  mode="outlined"
                  keyboardType="numeric"
                  value={value?.toString()}
                  onChangeText={onChange}
                  theme={{ colors: { onSurfaceVariant: "black" } }}
                  style={styles.inputStyle}
                  textColor="black"
                  outlineColor="black"
                  activeOutlineColor="black"
                />
                <HelperText type="error" visible={!!errors.quantity}>
                  {errors.quantity?.message}
                </HelperText>
              </>
            )}
          />

          {/* Category */}
          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setCategoryMenuVisible(true)}>
                <TextInput
                  label="Category"
                  mode="outlined"
                  value={selectedCategory}
                  editable={false}
                  right={<TextInput.Icon icon="chevron-down" />}
                  theme={{ colors: { onSurfaceVariant: "black" } }}
                  style={styles.inputStyle}
                  textColor="black"
                  outlineColor="black"
                  activeOutlineColor="black"
                />
              </TouchableOpacity>
            }
          >
            {CATEGORIES.map((c) => (
              <Menu.Item
                key={c}
                title={c}
                onPress={() => {
                  setValue("category", c as any);
                  setCategoryMenuVisible(false);
                }}
              />
            ))}
          </Menu>
          <HelperText type="error" visible={!!errors.category}>
            {errors.category?.message}
          </HelperText>

          {/* Harvest Date */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              label="Harvest Date"
              mode="outlined"
              value={selectedDate ? selectedDate.toLocaleDateString() : ""}
              editable={false}
              right={<TextInput.Icon icon="calendar" />}
              theme={{ colors: { onSurfaceVariant: "black" } }}
              style={styles.inputStyle}
              textColor="black"
              outlineColor="black"
              activeOutlineColor="black"
            />
          </TouchableOpacity>
          <HelperText type="error" visible={!!errors.harvestDate}>
            {errors.harvestDate?.message}
          </HelperText>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              onChange={(_, date) => {
                setShowDatePicker(Platform.OS === "ios");
                if (date) setValue("harvestDate", date);
              }}
            />
          )}

          {/* Location */}
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
                  theme={{ colors: { onSurfaceVariant: "black" } }}
                  style={styles.inputStyle}
                  textColor="black"
                  outlineColor="black"
                  activeOutlineColor="black"
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
                  theme={{ colors: { onSurfaceVariant: "black" } }}
                  style={styles.inputStyle}
                  textColor="black"
                  outlineColor="black"
                  activeOutlineColor="black"
                />
                <HelperText type="error" visible={!!errors.state}>
                  {errors.state?.message}
                </HelperText>
              </>
            )}
          />

          <Button
            mode="outlined"
            icon="robot"
            onPress={onGenerateDescription}
            loading={generatingDesc}
            style={styles.mt}
          >
            Generate with AI
          </Button>
          {/* Description */}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Description (optional)"
                mode="outlined"
                multiline
                numberOfLines={3}
                value={value}
                onChangeText={onChange}
                theme={{ colors: { onSurfaceVariant: "black" } }}
                style={styles.inputStyle}
                textColor="black"
                outlineColor="black"
                activeOutlineColor="black"
              />
            )}
          />

          {/* Images */}
          <Button
            mode="outlined"
            icon="image"
            onPress={pickImages}
            style={styles.mt}
          >
            Pick Images ({images.length}/5)
          </Button>
          <View style={styles.imageRow}>
            {images.map((uri, i) => (
              <Surface key={i} style={styles.imageWrap}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() =>
                    setImages((p) => p.filter((_, idx) => idx !== i))
                  }
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </Surface>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
          >
            Submit
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 4,
    backgroundColor: "white",
    color: "black",
  },
  title: { marginBottom: 12, fontWeight: "bold", color: "black" },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  flex: { flex: 1 },
  mt: { marginTop: 12 },
  imageRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  imageWrap: { width: 80, height: 80, borderRadius: 8, overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  removeBtn: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "rgba(231, 211, 211, 0.5)",
    borderRadius: 10,
    padding: 2,
  },
  removeText: { color: "white", fontSize: 10 },
  inputStyle: {
    backgroundColor: "white",
    color: "black",
  },
});
