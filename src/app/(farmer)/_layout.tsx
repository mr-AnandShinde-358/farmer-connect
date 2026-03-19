import { useLogoutUser } from "@/src/hooks/useAuth";
import { useAuthStore } from "@/src/store/auth.store";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { StyleSheet, View } from "react-native";
import { Avatar, Divider, Text } from "react-native-paper";

function CustomDrawerContent(props: any) {
  // const logout = useAuthStore((s) => s.clearAuth);
  const user = useAuthStore((s) => s.user);
  const { mutate, isPending, isSuccess, isError } = useLogoutUser();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Avatar.Icon size={56} icon="account" />
        <Text variant="titleMedium" style={styles.name}>
          {user?.email}
        </Text>
      </View>
      <Divider />
      <DrawerItem
        label="Settings"
        icon={({ color, size }) => null}
        onPress={() => {}}
      />
      <DrawerItem label="Logout" onPress={() => mutate()} />
    </DrawerContentScrollView>
  );
}

export default function FarmerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="(tabs)" />
      <Drawer.Screen name="add-product" />
      <Drawer.Screen name="notifications" />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, alignItems: "center", gap: 8 },
  name: { textAlign: "center" },
});
