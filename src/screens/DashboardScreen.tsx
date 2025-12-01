import { JSX } from "react";
import { Text, Card, useTheme } from "react-native-paper";
import { useInventoryContext } from "../contexts/InventoryContext";
import { useLanguage } from "../contexts/LanguageContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStockStatus, formatCurrency } from "../utils/stockUtils";
import { ValidStockStatus } from "../types/inventory";
import { generateStats } from "../utils/dashboardUtils";
import { ScrollView, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const DashboardScreen = (): JSX.Element => {
  const theme = useTheme();
  const { inventory: items } = useInventoryContext();
  const { t } = useLanguage();

  const totalItems = items?.length;

  const totalUnits = items?.reduce(
    (sum, item) => sum + item.current_quantity,
    0,
  );
  const totalValue = items?.reduce(
    (sum, item) => sum + item.current_quantity * parseFloat(item.unit_price),
    0,
  );

  const lowStockItems = items?.filter(
    (item) => getStockStatus(item) === ValidStockStatus.LowStock,
  ).length;

  const outOfStockItems = items?.filter(
    (item) => getStockStatus(item) === ValidStockStatus.OutOfStock,
  ).length;

  const stats = generateStats({
    totalItems,
    totalUnits,
    totalValue,
    lowStockItems,
    outOfStockItems,
    theme,
    t,
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <View style={styles.statHeader}>
                  <MaterialCommunityIcons
                    name={stat.icon as any}
                    size={32}
                    color={stat.color}
                  />
                </View>

                <Text
                  style={[styles.statValue, { color: theme.colors.onSurface }]}
                >
                  {stat.value}
                </Text>

                <Text
                  style={[
                    styles.statTitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {stat.title}
                </Text>

                <Text
                  style={[
                    styles.statSubtitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {stat.subtitle}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        <Card style={styles.recentCard}>
          <Card.Content>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              {t("dashboard.recentItems")}
            </Text>

            {items?.slice(0, 5).map((item) => (
              <View key={item.id} style={styles.recentItem}>
                <View style={styles.recentItemInfo}>
                  <Text
                    style={[styles.itemName, { color: theme.colors.onSurface }]}
                  >
                    {item.item_name}
                  </Text>
                  <Text
                    style={[
                      styles.itemDetails,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {item.current_quantity} units •{" "}
                    {formatCurrency(parseFloat(item.unit_price))}
                  </Text>
                </View>
                <View
                  style={[
                    styles.stockBadge,
                    {
                      backgroundColor:
                        getStockStatus(item) === "in-stock"
                          ? theme.colors.secondaryContainer
                          : getStockStatus(item) === "low-stock"
                            ? theme.colors.tertiaryContainer
                            : theme.colors.errorContainer,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stockText,
                      {
                        color:
                          getStockStatus(item) === "in-stock"
                            ? theme.colors.secondary
                            : getStockStatus(item) === "low-stock"
                              ? theme.colors.tertiary
                              : theme.colors.error,
                      },
                    ]}
                  >
                    {getStockStatus(item).replace("-", " ")}
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    marginBottom: 16,
  },
  statContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  statHeader: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    textAlign: "center",
  },
  recentCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  recentItemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
