import { useGetFarmerDashboard } from "@/src/hooks/useFarmerProfile";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Card, Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <Card style={styles.statCard}>
      <Card.Content style={styles.statContent}>
        <Text
          variant="headlineMedium"
          style={{ color: color ?? "#000", fontWeight: "bold" }}
        >
          {value}
        </Text>
        <Text variant="bodySmall" style={styles.statLabel}>
          {label}
        </Text>
      </Card.Content>
    </Card>
  );
}

export default function DashboardScreen() {
  const { data, isLoading } = useGetFarmerDashboard();

  if (isLoading) return <Text style={styles.center}>Loading...</Text>;

  const orders = data?.orders;
  const products = data?.products;

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
            Dashboard
          </Text>

          {/* Revenue */}
          <Card style={styles.revenueCard}>
            <Card.Content>
              <Text variant="bodyMedium" style={styles.revenueLabel}>
                Total Revenue
              </Text>
              <Text variant="displaySmall" style={styles.revenueValue}>
                ₹{orders?.totalRevenue ?? 0}
              </Text>
            </Card.Content>
          </Card>

          {/* Orders */}
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Orders
          </Text>
          <View style={styles.grid}>
            <StatCard label="Total" value={orders?.total ?? 0} />
            <StatCard
              label="Pending"
              value={orders?.pending ?? 0}
              color="#f59e0b"
            />
            <StatCard
              label="Accepted"
              value={orders?.accepted ?? 0}
              color="#10b981"
            />
            <StatCard
              label="Completed"
              value={orders?.completed ?? 0}
              color="#3b82f6"
            />
            <StatCard
              label="Rejected"
              value={orders?.rejected ?? 0}
              color="#ef4444"
            />
            <StatCard
              label="Cancelled"
              value={orders?.cancelled ?? 0}
              color="#6b7280"
            />
          </View>

          <Divider style={styles.divider} />

          {/* Products */}
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Products
          </Text>
          <View style={styles.grid}>
            <StatCard label="Total" value={products?.total ?? 0} />
            <StatCard
              label="Active"
              value={products?.active ?? 0}
              color="#10b981"
            />
            <StatCard
              label="Sold Out"
              value={products?.sold_out ?? 0}
              color="#f59e0b"
            />
            <StatCard
              label="Inactive"
              value={products?.inactive ?? 0}
              color="#6b7280"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  title: { fontWeight: "bold", marginBottom: 8 },
  revenueCard: {
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#10b981",
  },
  revenueLabel: { color: "white", opacity: 0.8 },
  revenueValue: { color: "white", fontWeight: "bold" },
  sectionTitle: { fontWeight: "600", marginVertical: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statCard: { borderRadius: 12, flex: 1, minWidth: "28%" },
  statContent: { alignItems: "center", gap: 4 },
  statLabel: { color: "#6b7280", textAlign: "center" },
  divider: { marginVertical: 8 },
  center: { textAlign: "center", marginTop: 40 },
});
