import { DrawerActions } from "@react-navigation/native";
import { Tabs, useNavigation, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Badge, Icon } from "react-native-paper";

function BellIcon() {
  const router = useRouter();
  const unreadCount = 0;

  return (
    <TouchableOpacity
      onPress={() => router.push("/(farmer)/notifications")}
      style={{ marginRight: 16 }}
    >
      <View>
        <Icon source="bell" size={24} />
        {unreadCount > 0 && (
          <Badge style={{ position: "absolute", top: -4, right: -4 }} size={16}>
            {unreadCount}
          </Badge>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  const navigation = useNavigation();

  return (
    <Tabs
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{ marginLeft: 16 }}
          >
            <Icon source="menu" size={24} />
          </TouchableOpacity>
        ),
        headerRight: () => <BellIcon />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon source="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="listings"
        options={{
          title: "My Listings",
          tabBarIcon: ({ color, size }) => (
            <Icon source="format-list-bulleted" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <Icon source="clipboard-list" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Icon source="account" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
