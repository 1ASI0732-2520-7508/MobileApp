import { useRouter } from "expo-router";
import { JSX, useState } from "react";
import {
  Card,
  useTheme,
  Text,
  Chip,
  Searchbar,
  Menu,
  Button,
  FAB,
} from "react-native-paper";
import { ValidStockStatus, InventoryItem } from "../types/inventory";
import { getStockStatus, formatCurrency } from "../utils/stockUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { categories } from "../data/mockData";
import { useInventoryContext } from "../contexts/InventoryContext";

enum SortByOptions {
  Name = "name",
  Quantity = "quantity",
  Price = "price",
}

export const InventoryListScreen = (): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const { inventory: items } = useInventoryContext();
  console.log(items);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortMenuVisible, setSortMenuVisible] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortByOptions>(SortByOptions.Name);

  const filteredItems = items
    ?.filter((item) => {
      const matchesSearch: boolean =
        item.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory: boolean =
        !selectedCategory || item.category_name === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case SortByOptions.Name:
          return a.category_name.localeCompare(b.category_name);
        case SortByOptions.Quantity:
          return b.current_quantity - a.current_quantity;
        case SortByOptions.Price:
          return parseFloat(b.unit_price) - parseFloat(a.unit_price);
        default:
          return 0;
      }
    });

  const renderItem = ({ item }: { item: InventoryItem }): JSX.Element => {
    const stockStatus: ValidStockStatus = getStockStatus(item);
    const stockColor =
      stockStatus === ValidStockStatus.InStock
        ? theme.colors.secondary
        : stockStatus === ValidStockStatus.LowStock
          ? theme.colors.tertiary
          : theme.colors.error;
    return (
      <Card
        style={styles.itemCard}
        onPress={() => router.push(`/inventory/${item.id}`)}
      >
        <Card.Content>
          <View style={styles.itemHeader}>
            <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>
              {item.item_name}
            </Text>
            <Chip
              mode="outlined"
              compact
              textStyle={{ color: stockColor }}
              style={{ borderColor: stockColor }}
            >
              {stockStatus.replace("-", " ")}
            </Chip>
          </View>

          <Text
            style={[
              styles.itemDescription,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {item.description}
          </Text>

          <View style={styles.itemDetails}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="tag"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {item.category}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="package"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {item.current_quantity} units
              </Text>
            </View>

            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {formatCurrency(parseFloat(item.unit_price))}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Searchbar
          placeholder="Search inventory..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <View style={styles.filters}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[{ id: "", name: "All" }, ...categories]}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Chip
                selected={
                  selectedCategory === item.name ||
                  (item.name === "All" && !selectedCategory)
                }
                onPress={() =>
                  setSelectedCategory(item.name === "All" ? "" : item.name)
                }
                style={styles.categoryChip}
              >
                {item.name}
              </Chip>
            )}
          />

          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                compact
                onPress={() => setSortMenuVisible(true)}
                icon="sort"
              >
                Sort
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setSortBy(SortByOptions.Name);
                setSortMenuVisible(false);
              }}
              title="Name"
            />
            <Menu.Item
              onPress={() => {
                setSortBy(SortByOptions.Quantity);
                setSortMenuVisible(false);
              }}
              title="Quantity"
            />
            <Menu.Item
              onPress={() => {
                setSortBy(SortByOptions.Price);
                setSortMenuVisible(false);
              }}
              title="Price"
            />
          </Menu>
        </View>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push("/inventory/add")}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    marginBottom: 16,
  },
  filters: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryChip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  itemCard: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
