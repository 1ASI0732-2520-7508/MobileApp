import { JSX } from "react";
import { InventoryItem, ValidStockStatus } from "../types/inventory";
import {
  useTheme,
  Text,
  Card,
  Button,
  Chip,
  Divider,
} from "react-native-paper";
import { useRouter } from "expo-router";
import {
  getStockStatus,
  formatDate,
  formatCurrency,
} from "../utils/stockUtils";
import { Alert, View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useInventoryContext } from "../contexts/InventoryContext";

// Types
type Items = {
  icon: string;
  label: string;
  value: string;
};

interface ItemDetailsScreenProps {
  item: InventoryItem;
}

// Component

/**
 * ItemDetailsScreen component displays detailed information about a specific inventory item.
 * @param  item - The inventory item to display details for.
 * @returns JSX.Element - The rendered ItemDetailsScreen component.
 */
export const ItemDetailsScreen = ({
  item,
}: ItemDetailsScreenProps): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const { deleteInventoryItem } = useInventoryContext();

  const stockStatus: ValidStockStatus = getStockStatus(item);
  const stockColor =
    stockStatus === ValidStockStatus.InStock
      ? theme.colors.secondary
      : stockStatus === ValidStockStatus.LowStock
        ? theme.colors.tertiary
        : theme.colors.error;

  const handleDelete = async () => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteInventoryItem(item.id.toString());
            router.back();
          } catch (error) {
            Alert.alert(
              "Delete Failed",
              "Failed to delete the item. Please try again."
            );
          }
        },
      },
    ]);
  };

  const detailItems: Items[] = [
    { icon: "tag", label: "Category", value: item.category_name },
    {
      icon: "package",
      label: "Current Stock",
      value: `${item.current_quantity} units`,
    },
    {
      icon: "alert-circle",
      label: "Minimum Stock",
      value: `${item.minimum_stock_level} units`,
    },
    {
      icon: "currency-usd",
      label: "Unit Price",
      value: formatCurrency(parseFloat(item.unit_price)),
    },
    {
      icon: "calculator",
      label: "Total Value",
      value: formatCurrency(
        item.current_quantity * parseFloat(item.unit_price),
      ),
    },
    { icon: "truck", label: "Supplier", value: item.supplier_name },
    {
      icon: "calendar",
      label: "Last Updated",
      value: formatDate(item.lastUpdated || new Date()),
    },
  ];

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.header}>
              <Text
                style={[styles.itemName, { color: theme.colors.onSurface }]}
              >
                {item.item_name}
              </Text>
              <Chip
                mode="outlined"
                textStyle={{ color: stockColor }}
                style={{ borderColor: stockColor }}
              >
                {stockStatus.replace("-", " ")}
              </Chip>
            </View>

            <Text
              style={[
                styles.description,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {item.description}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Item Details
            </Text>

            {detailItems.map((detail, index) => (
              <View key={index}>
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <MaterialCommunityIcons
                      name={detail.icon as any}
                      size={20}
                      color={theme.colors.onSurfaceVariant}
                    />
                  </View>
                  <View style={styles.detailContent}>
                    <Text
                      style={[
                        styles.detailLabel,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {detail.label}
                    </Text>
                    <Text
                      style={[
                        styles.detailValue,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {detail.value}
                    </Text>
                  </View>
                </View>
                {index < detailItems.length - 1 && (
                  <Divider style={styles.divider} />
                )}
              </View>
            ))}
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => router.push(`/inventory/edit/${item.id}`)}
            style={styles.editButton}
            icon="pencil"
          >
            Edit Item
          </Button>

          <Button
            mode="outlined"
            onPress={handleDelete}
            style={styles.deleteButton}
            textColor={theme.colors.error}
            icon="delete"
          >
            Delete Item
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemName: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailsCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailIcon: {
    width: 40,
    alignItems: "center",
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    marginVertical: 4,
  },
  actions: {
    gap: 12,
  },
  editButton: {
    marginBottom: 8,
  },
  deleteButton: {
    borderColor: "#EF4444",
  },
});
