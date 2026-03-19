// app/(farmer)/edit-product/[id].tsx

import FormInput from "@/src/components/atom/FormInput";
import { useGetProductById } from "@/src/hooks/useBuyer";
import { useDeleteProduct, useUpdateProduct } from "@/src/hooks/useProduct";
import {
  ProductEditFormData,
  productEditSchema,
} from "@/src/schema/editProduct.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, HelperText, Menu, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Toast from "react-native-toast-message";

const EditProduct = () => {
  const { id } = useLocalSearchParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();

  // ✅ Menu state
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [unitMenuVisible, setUnitMenuVisible] = useState(false);

  // ✅ Options
  const CATEGORIES = ["GRAIN", "VEGETABLE", "FRUIT", "SPICE", "DAIRY", "OTHER"];
  const UNITS = ["kg", "quintal", "dozen", "litre", "piece", "ton"];

  const { data: product, isLoading, error } = useGetProductById(productId);

  const {
    mutate: updateProduct,
    isPending,
    error: updateError,
  } = useUpdateProduct();

  const { mutate: deleteProductMutation, isPending: isDeleting } =
    useDeleteProduct();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductEditFormData>({
    resolver: zodResolver(productEditSchema),
  });

  // ✅ Watch values for dropdown display
  const selectedCategory = watch("category");
  const selectedUnit = watch("unit");

  // Pre-fill form
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        unit: product.unit,
        description: product.description || "",
        harvestDate: product.harvestDate,
        location: {
          state: product.location.state,
          district: product.location.district,
        },
      });
    }
  }, [product, reset]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error loading product",
        text2: error?.response?.data?.messages || "Something went wrong",
      });
    }
  }, [error]);

  useEffect(() => {
    if (updateError) {
      Toast.show({
        type: "error",
        text1: "Failed to update",
        text2: updateError?.response?.data?.messages || "Try again",
      });
    }
  }, [updateError]);

  // Delete handler
  const handleDelete = () => {
    Alert.alert("Delete Product", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          deleteProductMutation(productId, {
            onSuccess: () => {
              Toast.show({
                type: "success",
                text1: "Product deleted!",
              });
              router.back();
            },
          });
        },
        style: "destructive",
      },
    ]);
  };

  // Submit handler
  const onSubmit = (formData: ProductEditFormData) => {
    if (!productId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Product ID not found",
      });
      return;
    }
    console.log("before mutation call", productId);

    updateProduct(
      {
        productId: productId,
        data: {
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseFloat(formData.quantity),
        },
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Success!",
            text2: "Product updated!",
          });
          router.back();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.center}>Loading product...</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.center}>Product not found</Text>
        <Button mode="contained" onPress={() => router.back()}>
          Go Back
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.heading}>Edit Product</Text>

            <View style={styles.form}>
              {/* Name */}
              <FormInput
                control={control}
                name="name"
                placeholder="Product name"
                error={errors?.name?.message}
                labelName="Product Name"
              />

              {/* Price + Unit */}
              <View style={styles.row}>
                {/* Price */}
                <View style={styles.flex}>
                  <FormInput
                    control={control}
                    name="price"
                    placeholder="Price"
                    keyboardType="decimal-pad"
                    error={errors?.price?.message}
                    labelName="Price (₹)"
                  />
                </View>

                {/* Unit Dropdown */}
                <View style={styles.flex}>
                  <Menu
                    visible={unitMenuVisible}
                    onDismiss={() => setUnitMenuVisible(false)}
                    anchor={
                      <TouchableOpacity
                        onPress={() => setUnitMenuVisible(true)}
                      >
                        <TextInput
                          label="Unit"
                          mode="outlined"
                          theme={{
                            colors: { onSurfaceVariant: "black" },
                          }}
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
                  <HelperText type="error" visible={!!errors.unit}>
                    {errors.unit?.message}
                  </HelperText>
                </View>
              </View>

              {/* Quantity */}
              <FormInput
                control={control}
                name="quantity"
                placeholder="Available quantity"
                keyboardType="decimal-pad"
                error={errors?.quantity?.message}
                labelName="Quantity"
              />

              {/* Category Dropdown */}
              <View>
                <Menu
                  visible={categoryMenuVisible}
                  onDismiss={() => setCategoryMenuVisible(false)}
                  anchor={
                    <TouchableOpacity
                      onPress={() => setCategoryMenuVisible(true)}
                    >
                      <TextInput
                        label="Category"
                        mode="outlined"
                        theme={{
                          colors: { onSurfaceVariant: "black" },
                        }}
                        style={styles.inputStyle}
                        textColor="black"
                        outlineColor="black"
                        activeOutlineColor="black"
                        value={selectedCategory}
                        editable={false}
                        right={<TextInput.Icon icon="chevron-down" />}
                      />
                    </TouchableOpacity>
                  }
                >
                  {CATEGORIES.map((c) => (
                    <Menu.Item
                      key={c}
                      title={c}
                      onPress={() => {
                        setValue("category", c);
                        setCategoryMenuVisible(false);
                      }}
                    />
                  ))}
                </Menu>
                <HelperText type="error" visible={!!errors.category}>
                  {errors.category?.message}
                </HelperText>
              </View>

              {/* Description */}
              <FormInput
                control={control}
                name="description"
                placeholder="Product description"
                error={errors?.description?.message}
                labelName="Description"
                multiline
              />

              {/* Harvest Date */}
              <FormInput
                control={control}
                name="harvestDate"
                placeholder="YYYY-MM-DD"
                error={errors?.harvestDate?.message}
                labelName="Harvest Date"
              />

              {/* State */}
              <FormInput
                control={control}
                name="location.state"
                placeholder="State"
                error={errors?.location?.state?.message}
                labelName="State"
              />

              {/* District */}
              <FormInput
                control={control}
                name="location.district"
                placeholder="District"
                error={errors?.location?.district?.message}
                labelName="District"
              />

              {/* Buttons */}
              <Button
                mode="contained"
                loading={isPending}
                disabled={isPending}
                onPress={handleSubmit(onSubmit)}
                labelStyle={{ fontSize: 16, paddingVertical: 6 }}
                style={{ marginTop: verticalScale(12) }}
              >
                {isPending ? "Updating..." : "Update Product"}
              </Button>

              <Button
                mode="outlined"
                onPress={() => router.back()}
                labelStyle={{ fontSize: 16, paddingVertical: 6 }}
                style={{ marginTop: verticalScale(8) }}
              >
                Cancel
              </Button>

              <Button
                mode="contained"
                buttonColor="#ef4444"
                loading={isDeleting}
                disabled={isDeleting}
                onPress={handleDelete}
                labelStyle={{ fontSize: 16, paddingVertical: 6 }}
                style={{ marginTop: verticalScale(8) }}
              >
                {isDeleting ? "Deleting..." : "Delete Product"}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(20),
    backgroundColor: "white",
  },
  heading: {
    fontSize: moderateScale(24),
    fontWeight: "600",
    marginBottom: verticalScale(20),
    textAlign: "center",
  },
  form: {
    gap: verticalScale(12),
  },
  row: {
    flexDirection: "row",
    gap: scale(8),
  },
  flex: {
    flex: 1,
  },
  inputStyle: {
    backgroundColor: "white",
    color: "black",
  },
  center: {
    textAlign: "center",
    marginTop: verticalScale(40),
  },
});

export default EditProduct;
