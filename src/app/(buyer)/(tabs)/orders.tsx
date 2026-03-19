import { useGetBuyerOrders } from "@/src/hooks/useBuyer";
import { useUpdateOrderStatusAsBuyer } from "@/src/hooks/useOrder";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Text } from "react-native-paper";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  ACCEPTED: "#10b981",
  REJECTED: "#ef4444",
  COMPLETED: "#3b82f6",
  CANCELLED: "#6b7280",
};

export default function BuyerOrdersScreen() {
  const { data, isLoading } = useGetBuyerOrders();
  const {
    mutate: updateStatus,
    isPending,
    isError,
    variables,
  } = useUpdateOrderStatusAsBuyer();

  const orders = data?.docs ?? [];

  if (isLoading) return <Text style={styles.center}>Loading...</Text>;
  if (orders.length === 0)
    return <Text style={styles.center}>No orders yet</Text>;

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <View style={styles.row}>
              <Text variant="titleMedium">
                {item.product?.name ?? "Product"}
              </Text>
              <Chip
                compact
                style={{ backgroundColor: STATUS_COLORS[item.status] }}
                textStyle={{ color: "white" }}
              >
                {item.status}
              </Chip>
            </View>
            <Text variant="bodyMedium">
              Qty: {item.quantity} × ₹{item.pricePerUnit} = ₹{item.totalPrice}
            </Text>
            <Text variant="bodySmall" style={styles.muted}>
              🧑‍🌾 {item.farmer?.fullName ?? "Farmer"}
            </Text>
            {item.note && (
              <Text variant="bodySmall" style={styles.note}>
                Note: {item.note}
              </Text>
            )}

            {item.status === "PENDING" && (
              <View style={styles.actions}>
                <Button
                  mode="contained"
                  buttonColor="#6b7280"
                  loading={isPending && variables?.orderId === item._id}
                  onPress={() =>
                    updateStatus({ orderId: item._id, status: "CANCELLED" })
                  }
                >
                  Canclled
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  card: { borderRadius: 12 },
  content: { gap: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  muted: { color: "#6b7280" },
  note: { color: "#6b7280", fontStyle: "italic" },
  center: { textAlign: "center", marginTop: 40 },
  actions: { gap: 8 },
});
