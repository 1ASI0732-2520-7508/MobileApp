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
import { useLanguage } from "../contexts/LanguageContext";

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
  const { t } = useLanguage();

  const stockStatus: ValidStockStatus = getStockStatus(item);
  const stockColor =
    stockStatus === ValidStockStatus.InStock
      ? theme.colors.secondary
      : stockStatus === ValidStockStatus.LowStock
        ? theme.colors.tertiary
        : theme.colors.error;

  const handleDelete = async () => {
    Alert.alert(t("itemDetails.deleteItem"), t("itemDetails.deleteConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteInventoryItem(item.id.toString());
            router.back();
          } catch (error) {
            Alert.alert(
              t("itemDetails.deleteItem"),
              t("itemDetails.deleteFailed")
            );
          }
        },
      },
    ]);
  };

  const detailItems: Items[] = [
    { icon: "tag", label: t("itemDetails.category"), value: item.category_name },
    {
      icon: "package",
      label: t("itemDetails.currentStock"),
      value: `${item.current_quantity} ${t("common.units")}`,
    },
    {
      icon: "alert-circle",
      label: t("itemDetails.minimumStock"),
      value: `${item.minimum_stock_level} ${t("common.units")}`,
    },
    {
      icon: "currency-usd",
      label: t("itemDetails.unitPrice"),
      value: formatCurrency(parseFloat(item.unit_price)),
    },
    {
      icon: "calculator",
      label: t("itemDetails.totalValue"),
      value: formatCurrency(
        item.current_quantity * parseFloat(item.unit_price),
      ),
    },
    { icon: "truck", label: t("itemDetails.supplier"), value: item.supplier_name },
    {
      icon: "calendar",
      label: t("itemDetails.lastUpdated"),
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
                {stockStatus === ValidStockStatus.InStock
                  ? t("itemDetails.inStock")
                  : stockStatus === ValidStockStatus.LowStock
                    ? t("itemDetails.lowStock")
                    : t("itemDetails.outOfStock")}
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
              {t("itemDetails.itemDetails")}
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
            {t("itemDetails.editItem")}
          </Button>

          <Button
            mode="outlined"
            onPress={handleDelete}
            style={styles.deleteButton}
            textColor={theme.colors.error}
            icon="delete"
          >
            {t("itemDetails.deleteItem")}
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
