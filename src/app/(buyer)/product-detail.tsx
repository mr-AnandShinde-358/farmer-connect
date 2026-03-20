import { useGetProductById, usePlaceOrder } from "@/src/hooks/useBuyer";
import { getProductImageUrl } from "@/src/utils/imagekit";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import {
  Button,
  Chip,
  Divider,
  HelperText,
  Text,
  TextInput,
} from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading } = useGetProductById(id);
  const { mutate: placeOrder, isPending } = usePlaceOrder();

  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  const [qtyError, setQtyError] = useState("");

  const totalPrice = product ? Number(quantity) * product.price : 0;

  const onOrder = () => {
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      setQtyError("Valid quantity do");
      return;
    }
    if (qty > product?.quantity) {
      setQtyError(`Max available: ${product?.quantity}`);
      return;
    }
    setQtyError("");
    placeOrder(
      { productId: id, quantity: qty, ...(note ? { note } : {}) },
      {
        onSuccess: (res) => {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: res.data?.message ?? "Order placed!",
          });

          router.back();
        },
        onError: (err: any) => {
          Toast.show({
            type: "success",
            text1: "Success",
            text2:
              err.response.data?.message ??
              "Something went wrong While Placing Order",
          });
        },
      },
    );
  };

  if (isLoading) return <Text style={styles.center}>Loading...</Text>;
  if (!product) return <Text style={styles.center}>Product not found</Text>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Image Carousel */}
          {product.images?.length > 0 && (
            <View style={styles.carouselContainer}>
              <Carousel
                width={SCREEN_WIDTH - 32}
                height={220}
                data={product.images}
                scrollAnimationDuration={300}
                renderItem={({ item }: { item: any }) => (
                  <Image
                    source={{
                      uri: getProductImageUrl(item.url, {
                        width: 800,
                        height: 600,
                      }),
                    }}
                    style={styles.carouselImage}
                    resizeMode="cover"
                  />
                )}
              />
              {product.images.length > 1 && (
                <View style={styles.dots}>
                  {product.images.map((_: any, i: number) => (
                    <View key={i} style={styles.dot} />
                  ))}
                </View>
              )}
            </View>
          )}

          <Text variant="headlineSmall" style={styles.name}>
            {product.name}
          </Text>

          <View style={styles.row}>
            <Chip compact>{product.category}</Chip>
            <Chip compact>{product.status}</Chip>
          </View>

          <Text variant="titleLarge" style={styles.price}>
            ₹{product.price} / {product.unit}
          </Text>
          <Text variant="bodyMedium" style={styles.muted}>
            Available: {product.quantity} {product.unit}
          </Text>

          <Divider style={styles.divider} />

          <Text variant="titleSmall">Farmer</Text>
          <Text variant="bodyMedium">🧑‍🌾 {product.farmer?.fullName}</Text>
          <Text variant="bodySmall" style={styles.muted}>
            {product.location?.district}, {product.location?.state}
          </Text>

          {product.description && (
            <>
              <Divider style={styles.divider} />
              <Text variant="titleSmall">Description</Text>
              <Text variant="bodyMedium">{product.description}</Text>
            </>
          )}

          <Divider style={styles.divider} />
          <Text variant="titleSmall">Place Order</Text>

          <TextInput
            label="Quantity"
            mode="outlined"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            style={styles.mt}
          />
          <HelperText type="error" visible={!!qtyError}>
            {qtyError}
          </HelperText>

          <TextInput
            label="Note (optional)"
            mode="outlined"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={2}
          />

          {Number(quantity) > 0 && (
            <Text variant="bodyMedium" style={styles.total}>
              Total: ₹{totalPrice}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={onOrder}
            loading={isPending}
            style={styles.btn}
          >
            Place Order
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 6 },
  carouselContainer: { borderRadius: 12, overflow: "hidden", marginBottom: 12 },
  carouselImage: { width: "100%", height: 220, borderRadius: 12 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#10b981" },
  name: { fontWeight: "bold" },
  row: { flexDirection: "row", gap: 8, marginVertical: 4 },
  price: { color: "#10b981", fontWeight: "bold" },
  muted: { color: "#6b7280" },
  divider: { marginVertical: 12 },
  mt: { marginTop: 4 },
  total: { fontWeight: "600", color: "#10b981", marginTop: 4 },
  btn: { marginTop: 12 },
  center: { textAlign: "center", marginTop: 40 },
});
