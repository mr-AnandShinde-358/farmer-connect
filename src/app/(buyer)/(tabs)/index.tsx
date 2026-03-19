import { useGetProducts } from "@/src/hooks/useBuyer";
import { getProductImageUrl } from "@/src/utils/imagekit";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Chip, Menu, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = [
  "ALL",
  "GRAIN",
  "VEGETABLE",
  "FRUIT",
  "SPICE",
  "DAIRY",
  "OTHER",
];

export default function BrowseScreen() {
  const router = useRouter();

  const [category, setCategory] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [state, setState] = useState("");
  const [search, setSearch] = useState("");
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filters = {
    ...(category && { category }),
    ...(minPrice && { minPrice: Number(minPrice) }),
    ...(maxPrice && { maxPrice: Number(maxPrice) }),
    ...(state && { state }),
    ...(search && { search }),
  };

  const { data, isLoading } = useGetProducts(filters);
  const products = data?.docs ?? [];

  const clearFilters = () => {
    setCategory(undefined);
    setMinPrice("");
    setMaxPrice("");
    setState("");
    setSearch("");
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          {/* Search bar */}
          <View style={styles.searchRow}>
            <TextInput
              mode="outlined"
              placeholder="Search products..."
              value={search}
              onChangeText={setSearch}
              left={<TextInput.Icon icon="magnify" />}
              style={styles.searchInput}
              dense
            />
            <Button
              mode={showFilters ? "contained" : "outlined"}
              onPress={() => setShowFilters((p) => !p)}
              style={styles.filterBtn}
              contentStyle={styles.filterBtnContent}
            >
              Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
            </Button>
          </View>

          {/* Filter panel */}
          {showFilters && (
            <View style={styles.filterPanel}>
              {/* Category */}
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
                      value={category ?? "ALL"}
                      editable={false}
                      right={<TextInput.Icon icon="chevron-down" />}
                      dense
                    />
                  </TouchableOpacity>
                }
              >
                {CATEGORIES.map((c) => (
                  <Menu.Item
                    key={c}
                    title={c}
                    onPress={() => {
                      setCategory(c === "ALL" ? undefined : c);
                      setCategoryMenuVisible(false);
                    }}
                  />
                ))}
              </Menu>

              {/* Price range */}
              <View style={styles.row}>
                <TextInput
                  label="Min Price"
                  mode="outlined"
                  keyboardType="numeric"
                  value={minPrice}
                  onChangeText={setMinPrice}
                  style={styles.flex}
                  dense
                />
                <TextInput
                  label="Max Price"
                  mode="outlined"
                  keyboardType="numeric"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  style={styles.flex}
                  dense
                />
              </View>

              {/* State */}
              <TextInput
                label="State"
                mode="outlined"
                value={state}
                onChangeText={setState}
                dense
              />

              {activeFilterCount > 0 && (
                <Button mode="text" onPress={clearFilters} textColor="red">
                  Clear Filters
                </Button>
              )}
            </View>
          )}

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipRow}
            >
              {category && (
                <Chip
                  compact
                  onClose={() => setCategory(undefined)}
                  style={styles.chip}
                >
                  {category}
                </Chip>
              )}
              {minPrice && (
                <Chip
                  compact
                  onClose={() => setMinPrice("")}
                  style={styles.chip}
                >
                  Min ₹{minPrice}
                </Chip>
              )}
              {maxPrice && (
                <Chip
                  compact
                  onClose={() => setMaxPrice("")}
                  style={styles.chip}
                >
                  Max ₹{maxPrice}
                </Chip>
              )}
              {state && (
                <Chip compact onClose={() => setState("")} style={styles.chip}>
                  {state}
                </Chip>
              )}
              {search && (
                <Chip compact onClose={() => setSearch("")} style={styles.chip}>
                  "{search}"
                </Chip>
              )}
            </ScrollView>
          )}

          {/* Product list */}
          {isLoading ? (
            <Text style={styles.center}>Loading...</Text>
          ) : products.length === 0 ? (
            <Text style={styles.center}>No products found</Text>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/(buyer)/product-detail",
                      params: { id: item._id },
                    })
                  }
                >
                  <Card style={styles.card}>
                    {item.image?.[0]?.url && (
                      <Card.Cover
                        source={{
                          uri: getProductImageUrl(item.image[0].url, {
                            width: 400,
                            height: 300,
                          }),
                        }}
                      />
                    )}
                    <Card.Content style={styles.cardContent}>
                      <View style={styles.row}>
                        <Text variant="titleMedium">{item.name}</Text>
                        <Chip compact>{item.category}</Chip>
                      </View>
                      <Text variant="bodyMedium">
                        ₹{item.price} / {item.unit}
                      </Text>
                      <Text variant="bodySmall" style={styles.farmer}>
                        🧑‍🌾 {item.farmer?.fullName} · {item.location?.district},{" "}
                        {item.location?.state}
                      </Text>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  searchRow: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    alignItems: "center",
  },
  searchInput: { flex: 1 },
  filterBtn: { justifyContent: "center" },
  filterBtnContent: { height: 40 },
  filterPanel: {
    padding: 12,
    gap: 8,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  row: { flexDirection: "row", gap: 8 },
  flex: { flex: 1 },
  chipRow: { paddingHorizontal: 12, paddingBottom: 8 },
  chip: {
    marginRight: 6,
    // backgroundColor: "red",
    height: 60,
    marginBottom: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  list: { padding: 12, gap: 12 },
  card: { borderRadius: 12 },
  cardContent: { gap: 4, paddingTop: 8 },
  farmer: { color: "#6b7280" },
  center: { textAlign: "center", marginTop: 40 },
});
