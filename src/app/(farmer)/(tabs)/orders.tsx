import {
  useGetMyOrders,
  useUpdateOrderStatusAsFarmer,
} from "@/src/hooks/useOrder";
import { FlatList, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";


const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  ACCEPTED: "#10b981",
  REJECTED: "#ef4444",
  COMPLETED: "#3b82f6",
  CANCELLED: "#6b7280",
};

export default function OrdersScreen() {
  const { data, isLoading } = useGetMyOrders();
  const {
    mutate: updateStatus,
    isPending,
    variables,
  } = useUpdateOrderStatusAsFarmer();

  const orders = data?.docs ?? [];

  if (isLoading) return <Text style={styles.center}>Loading...</Text>;

  if (orders.length === 0)
    return <Text style={styles.center}>No orders yet</Text>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <FlatList
          data={orders}
          scrollEnabled={true}
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
                  Qty: {item.quantity} × ₹{item.pricePerUnit} = ₹
                  {item.totalPrice}
                </Text>

                {item.note && (
                  <Text variant="bodySmall" style={styles.note}>
                    Note: {item.note}
                  </Text>
                )}

                <Divider style={styles.divider} />

                {item.status === "PENDING" && (
                  <View style={styles.actions}>
                    <Button
                      mode="contained"
                      buttonColor="#10b981"
                      loading={isPending && variables?.orderId === item._id}
                      onPress={() =>
                        updateStatus({ orderId: item._id, status: "ACCEPTED" })
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      mode="contained"
                      buttonColor="#ef4444"
                      loading={isPending && variables?.orderId === item._id}
                      onPress={() =>
                        updateStatus({ orderId: item._id, status: "REJECTED" })
                      }
                    >
                      Reject
                    </Button>
                  </View>
                )}

                {item.status === "ACCEPTED" && (
                  <Button
                    mode="contained"
                    buttonColor="#3b82f6"
                    loading={isPending && variables?.orderId === item._id}
                    onPress={() =>
                      updateStatus({ orderId: item._id, status: "COMPLETED" })
                    }
                  >
                    Mark Completed
                  </Button>
                )}
              </Card.Content>
            </Card>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  note: { color: "#6b7280", fontStyle: "italic" },
  divider: { marginVertical: 8 },
  actions: { flexDirection: "row", gap: 8 },
  center: { textAlign: "center", marginTop: 40 },
});
