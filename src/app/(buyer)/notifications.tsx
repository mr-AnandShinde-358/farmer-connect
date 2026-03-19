import {
  useGetNotifications,
  useMarkAllRead,
} from "@/src/hooks/useNotification";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const TYPE_COLORS: Record<string, string> = {
  NEW_ORDER: "#f59e0b",
  ORDER_ACCEPTED: "#10b981",
  ORDER_REJECTED: "#ef4444",
  ORDER_COMPLETED: "#3b82f6",
  ORDER_CANCELLED: "#6b7280",
};

export default function NotificationsScreen() {
  const { data, isLoading } = useGetNotifications();
  const { mutate: markAll, isPending } = useMarkAllRead();

  const notifications = data?.docs ?? [];

  if (isLoading) return <Text style={styles.center}>Loading...</Text>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          {notifications.length > 0 && (
            <Button
              mode="text"
              onPress={() => markAll()}
              loading={isPending}
              style={styles.markAll}
            >
              Mark all as read
            </Button>
          )}

          {notifications.length === 0 ? (
            <Text style={styles.center}>No notifications</Text>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <Card style={[styles.card, !item.isRead && styles.unread]}>
                  <Card.Content style={styles.content}>
                    <View style={styles.row}>
                      <View
                        style={[
                          styles.dot,
                          {
                            backgroundColor:
                              TYPE_COLORS[item.type] ?? "#6b7280",
                          },
                        ]}
                      />
                      <Text variant="titleSmall" style={styles.title}>
                        {item.title}
                      </Text>
                    </View>
                    <Text variant="bodyMedium">{item.message}</Text>
                    <Text variant="bodySmall" style={styles.time}>
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </Card.Content>
                </Card>
              )}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 10 },
  card: { borderRadius: 12 },
  unread: {
    borderLeftWidth: 7,
    borderLeftColor: "#10b981",
    // backgroundColor: "red",
  },
  content: { gap: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  title: { fontWeight: "600", flex: 1 },
  time: { color: "#6b7280", marginTop: 2 },
  markAll: { alignSelf: "flex-end", marginRight: 8, marginTop: 4 },
  center: { textAlign: "center", marginTop: 40 },
});
