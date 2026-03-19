import {
  useGetMyListings,
  useUpdadeProductStatus,
} from "@/src/hooks/useProduct";
import { useRouter } from "expo-router";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, Chip, FAB, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListingsScreen() {
  const router = useRouter();
  const { data, isLoading } = useGetMyListings();

  const {
    mutate: updateProductStatus,
    isPending,
    variables,
  } = useUpdadeProductStatus();

  const products = data?.docs ?? [];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          {isLoading ? (
            <Text style={styles.center}>Loading...</Text>
          ) : products.length === 0 ? (
            <Text style={styles.center}>No listings yet</Text>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <Card style={styles.card}>
                  <Card.Cover source={{ uri: item.images[0]?.url }} />
                  <Card.Content style={styles.cardContent}>
                    <Text variant="titleMedium">{item.name}</Text>
                    <Text variant="bodyMedium">
                      ₹{item.price} / {item.unit}
                    </Text>

                    <Text variant="bodySmall">
                      {item.location.district}, {item.location.state}
                    </Text>
                    <View style={styles.row}>
                      <Chip compact>{item.category}</Chip>
                      <Chip compact>{item.status}</Chip>
                    </View>
                    {/* ✅ Proper button layout */}
                    <View style={styles.actions}>
                      <Button
                        mode="contained"
                        buttonColor="#10b981"
                        loading={isPending && variables?.productId === item._id}
                        disabled={
                          isPending && variables?.productId === item._id
                        }
                        onPress={() =>
                          updateProductStatus({
                            productId: item._id,
                            status: "ACTIVE",
                          })
                        }
                      >
                        Active
                      </Button>

                      <Button
                        mode="contained"
                        buttonColor="#ef4444"
                        loading={isPending && variables?.productId === item._id}
                        disabled={
                          isPending && variables?.productId === item._id
                        }
                        onPress={() =>
                          updateProductStatus({
                            productId: item._id,
                            status: "SOLD_OUT",
                          })
                        }
                      >
                        Sold Out
                      </Button>

                      <Button
                        mode="contained"
                        buttonColor="#6b7280"
                        loading={isPending && variables?.productId === item._id}
                        disabled={
                          isPending && variables?.productId === item._id
                        }
                        onPress={() =>
                          updateProductStatus({
                            productId: item._id,
                            status: "INACTIVE",
                          })
                        }
                      >
                        Inactive
                      </Button>

                      <Button
                        mode="outlined"
                        onPress={() =>
                          router.push(`/(farmer)/edit-product/${item._id}`)
                        }
                      >
                        Edit
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              )}
            />
          )}

          <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => router.push("/(farmer)/add-product")}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 12 },
  card: { borderRadius: 12 },
  cardContent: { gap: 4, paddingTop: 8 },
  row: { flexDirection: "row", gap: 8, marginTop: 4 },
  center: { textAlign: "center", marginTop: 40 },
  fab: { position: "absolute", right: 16, bottom: 16 },
  actions: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
    flexWrap: "wrap",
  },
});
