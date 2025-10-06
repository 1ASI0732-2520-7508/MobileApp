import { JSX, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme, Card, Text, SegmentedButtons } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useInventoryContext } from "../contexts/InventoryContext";
import { getStockStatus, formatCurrency } from "../utils/stockUtils";
import { ValidStockStatus, InventoryItem } from "../types/inventory";

type TimeFilter = "all" | "7d" | "30d" | "90d";

export const AnalyticsScreen = (): JSX.Element => {
  const theme = useTheme();
  const { inventory: items, categories } = useInventoryContext();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // Filter items based on time and category
  const filteredItems = useMemo(() => {
    if (!items) return [];
    
    let filtered = items;

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category_name === categoryFilter);
    }

    // Time filter (based on lastUpdated)
    if (timeFilter !== "all" && items[0]?.lastUpdated) {
      const now = new Date();
      const filterDate = new Date();

      switch (timeFilter) {
        case "7d":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "30d":
          filterDate.setDate(now.getDate() - 30);
          break;
        case "90d":
          filterDate.setDate(now.getDate() - 90);
          break;
      }

      filtered = filtered.filter(
        (item) => new Date(item.lastUpdated || now) >= filterDate,
      );
    }

    return filtered;
  }, [items, categoryFilter, timeFilter]);

  // Calculate analytics metrics
  const analytics = useMemo(() => {
    const totalItems = filteredItems.length;
    const totalValue = filteredItems.reduce(
      (sum, item) => sum + item.current_quantity * parseFloat(item.unit_price),
      0,
    );
    const totalQuantity = filteredItems.reduce(
      (sum, item) => sum + item.current_quantity,
      0,
    );

    const stockAnalysis = {
      inStock: filteredItems.filter(
        (item) => getStockStatus(item) === ValidStockStatus.InStock,
      ).length,
      lowStock: filteredItems.filter(
        (item) => getStockStatus(item) === ValidStockStatus.LowStock,
      ).length,
      outOfStock: filteredItems.filter(
        (item) => getStockStatus(item) === ValidStockStatus.OutOfStock,
      ).length,
    };

    const categoryAnalysis =
      categories?.map((category) => {
        const categoryItems = filteredItems.filter(
          (item) => item.category_name === category.category_name,
        );
        const value = categoryItems.reduce(
          (sum, item) => sum + item.current_quantity * parseFloat(item.unit_price),
          0,
        );
        const quantity = categoryItems.reduce(
          (sum, item) => sum + item.current_quantity,
          0,
        );
        return {
          category: category.category_name,
          items: categoryItems.length,
          quantity,
          value,
          percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
          color: category.color || theme.colors.primary,
        };
      }).sort((a, b) => b.value - a.value) || [];

    const supplierAnalysis = [
      ...new Set(filteredItems.map((item) => item.supplier_name)),
    ]
      .map((supplierName, idx) => {
        const supplierItems = filteredItems.filter(
          (item) => item.supplier_name === supplierName,
        );
        const value = supplierItems.reduce(
          (sum, item) => sum + item.current_quantity * parseFloat(item.unit_price),
          0,
        );
        const quantity = supplierItems.reduce(
          (sum, item) => sum + item.current_quantity,
          0,
        );
        return {
          supplier: supplierName,
          items: supplierItems.length,
          quantity,
          value,
          percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
          color: `hsl(${idx * 60}, 70%, 50%)`,
        };
      })
      .sort((a, b) => b.value - a.value);

    const priceAnalysis = {
      highest:
        filteredItems.length > 0
          ? filteredItems.reduce((max, item) =>
              parseFloat(item.unit_price) > parseFloat(max.unit_price)
                ? item
                : max,
            )
          : null,
      lowest:
        filteredItems.length > 0
          ? filteredItems.reduce((min, item) =>
              parseFloat(item.unit_price) < parseFloat(min.unit_price)
                ? item
                : min,
            )
          : null,
      average: totalQuantity > 0 ? totalValue / totalQuantity : 0,
    };

    return {
      totalItems,
      totalValue,
      totalQuantity,
      stockAnalysis,
      categoryAnalysis,
      supplierAnalysis,
      priceAnalysis,
    };
  }, [filteredItems, categories, theme.colors.primary]);

  const statCards = [
    {
      title: "Total Portfolio Value",
      value: formatCurrency(analytics.totalValue),
      icon: "cash-multiple",
      color: theme.colors.primary,
      subtitle: `${analytics.totalItems} unique items`,
    },
    {
      title: "Total Units",
      value: analytics.totalQuantity.toLocaleString(),
      icon: "package-variant-closed",
      color: theme.colors.secondary,
      subtitle: `Avg: ${formatCurrency(analytics.priceAnalysis.average)}`,
    },
    {
      title: "Stock Health",
      value: `${Math.round((analytics.stockAnalysis.inStock / analytics.totalItems) * 100 || 0)}%`,
      icon: "trending-up",
      color: "#10B981",
      subtitle: `${analytics.stockAnalysis.inStock} items healthy`,
    },
    {
      title: "Attention Needed",
      value: (
        analytics.stockAnalysis.lowStock + analytics.stockAnalysis.outOfStock
      ).toString(),
      icon: "alert-circle",
      color: "#F59E0B",
      subtitle: `${analytics.stockAnalysis.outOfStock} critical`,
    },
  ];

  const timeFilterButtons = [
    { value: "all", label: "All" },
    { value: "7d", label: "7d" },
    { value: "30d", label: "30d" },
    { value: "90d", label: "90d" },
  ];

  const categoryButtons = [
    { value: "", label: "All" },
    ...(categories
      ?.filter((cat) => cat.category_name)
      .map((cat) => ({
        value: cat.category_name,
        label: cat.category_name,
      })) || []),
  ];

  if (!items || items.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <Card style={styles.card}>
            <Card.Content style={styles.emptyContent}>
              <MaterialCommunityIcons
                name="chart-line"
                size={64}
                color={theme.colors.onSurfaceVariant}
              />
              <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
                No Data Available
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Add some inventory items to see analytics
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
            Analytics
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Comprehensive inventory insights
          </Text>
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <Text
            style={[
              styles.filterLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Time Period
          </Text>
          <SegmentedButtons
            value={timeFilter}
            onValueChange={(value) => setTimeFilter(value as TimeFilter)}
            buttons={timeFilterButtons}
            style={styles.filterButtons}
          />

          {categories && categories.length > 0 ? (
            <>
              <Text
                style={[
                  styles.filterLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Category
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                <SegmentedButtons
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                  buttons={categoryButtons}
                />
              </ScrollView>
            </>
          ) : null}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          {statCards.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <MaterialCommunityIcons
                  name={stat.icon as any}
                  size={32}
                  color={stat.color}
                />
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

        {/* Category Performance */}
        {analytics.categoryAnalysis.length > 0 ? (
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  Category Performance
                </Text>
                <MaterialCommunityIcons
                  name="chart-bar"
                  size={24}
                  color={theme.colors.onSurfaceVariant}
                />
              </View>

              {analytics.categoryAnalysis.map((category) => (
                <View key={category.category} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <Text
                      style={[
                        styles.categoryName,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {category.category}
                    </Text>
                    <View style={styles.categoryValueContainer}>
                      <Text
                        style={[
                          styles.categoryValue,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        {formatCurrency(category.value)}
                      </Text>
                      <Text
                        style={[
                          styles.categoryPercentage,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        ({category.percentage.toFixed(1)}%)
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.progressBar,
                      { backgroundColor: theme.colors.surfaceVariant },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${category.percentage}%`,
                          backgroundColor: category.color,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.categoryDetails}>
                    <Text
                      style={[
                        styles.categoryDetailText,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {category.items} items
                    </Text>
                    <Text
                      style={[
                        styles.categoryDetailText,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {category.quantity} units
                    </Text>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        ) : null}

        {/* Supplier Distribution */}
        {analytics.supplierAnalysis.length > 0 ? (
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  Supplier Distribution
                </Text>
                <MaterialCommunityIcons
                  name="trending-up"
                  size={24}
                  color={theme.colors.onSurfaceVariant}
                />
              </View>

              {analytics.supplierAnalysis.map((supplier) => (
                <View
                  key={supplier.supplier}
                  style={[
                    styles.supplierItem,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                >
                  <View style={styles.supplierInfo}>
                    <View
                      style={[
                        styles.supplierColorDot,
                        { backgroundColor: supplier.color },
                      ]}
                    />
                    <View>
                      <Text
                        style={[
                          styles.supplierName,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        {supplier.supplier}
                      </Text>
                      <Text
                        style={[
                          styles.supplierDetails,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {supplier.items} items • {supplier.quantity} units
                      </Text>
                    </View>
                  </View>
                  <View style={styles.supplierValueContainer}>
                    <Text
                      style={[
                        styles.supplierValue,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {formatCurrency(supplier.value)}
                    </Text>
                    <Text
                      style={[
                        styles.supplierPercentage,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {supplier.percentage.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        ) : null}

        {/* Stock Status Distribution */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Stock Status Distribution
              </Text>
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={24}
                color={theme.colors.onSurfaceVariant}
              />
            </View>

            <View style={styles.stockStatusGrid}>
              <View style={[styles.stockStatusCard, styles.stockStatusInStock]}>
                <View style={styles.stockStatusIconContainer}>
                  <MaterialCommunityIcons
                    name="trending-up"
                    size={24}
                    color="#10B981"
                  />
                </View>
                <Text style={[styles.stockStatusValue, { color: "#10B981" }]}>
                  {analytics.stockAnalysis.inStock}
                </Text>
                <Text style={styles.stockStatusLabel}>In Stock</Text>
                <Text style={styles.stockStatusPercentage}>
                  {Math.round(
                    (analytics.stockAnalysis.inStock / analytics.totalItems) *
                      100 || 0,
                  )}
                  % of inventory
                </Text>
              </View>

              <View style={[styles.stockStatusCard, styles.stockStatusLowStock]}>
                <View style={styles.stockStatusIconContainer}>
                  <MaterialCommunityIcons
                    name="trending-down"
                    size={24}
                    color="#F59E0B"
                  />
                </View>
                <Text style={[styles.stockStatusValue, { color: "#F59E0B" }]}>
                  {analytics.stockAnalysis.lowStock}
                </Text>
                <Text style={styles.stockStatusLabel}>Low Stock</Text>
                <Text style={styles.stockStatusPercentage}>
                  {Math.round(
                    (analytics.stockAnalysis.lowStock / analytics.totalItems) *
                      100 || 0,
                  )}
                  % needs reorder
                </Text>
              </View>

              <View style={[styles.stockStatusCard, styles.stockStatusOutOfStock]}>
                <View style={styles.stockStatusIconContainer}>
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={24}
                    color="#EF4444"
                  />
                </View>
                <Text style={[styles.stockStatusValue, { color: "#EF4444" }]}>
                  {analytics.stockAnalysis.outOfStock}
                </Text>
                <Text style={styles.stockStatusLabel}>Out of Stock</Text>
                <Text style={styles.stockStatusPercentage}>
                  {Math.round(
                    (analytics.stockAnalysis.outOfStock /
                      analytics.totalItems) *
                      100 || 0,
                  )}
                  % critical
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Price Analysis */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Price Analysis
              </Text>
              <MaterialCommunityIcons
                name="cash"
                size={24}
                color={theme.colors.onSurfaceVariant}
              />
            </View>

            <View style={styles.priceAnalysisGrid}>
              <View style={[styles.priceCard, styles.priceCardBlue]}>
                <Text style={styles.priceCardLabel}>Highest Priced Item</Text>
                <Text style={styles.priceCardItemName}>
                  {analytics.priceAnalysis.highest?.item_name || "N/A"}
                </Text>
                <Text style={styles.priceCardValue}>
                  {formatCurrency(
                    parseFloat(
                      analytics.priceAnalysis.highest?.unit_price || "0",
                    ),
                  )}
                </Text>
              </View>

              <View style={[styles.priceCard, styles.priceCardGreen]}>
                <Text style={styles.priceCardLabel}>Average Unit Price</Text>
                <Text style={styles.priceCardItemName}>Across all items</Text>
                <Text style={styles.priceCardValue}>
                  {formatCurrency(analytics.priceAnalysis.average)}
                </Text>
              </View>

              <View style={[styles.priceCard, styles.priceCardPurple]}>
                <Text style={styles.priceCardLabel}>Lowest Priced Item</Text>
                <Text style={styles.priceCardItemName}>
                  {analytics.priceAnalysis.lowest?.item_name || "N/A"}
                </Text>
                <Text style={styles.priceCardValue}>
                  {formatCurrency(
                    parseFloat(analytics.priceAnalysis.lowest?.unit_price || "0"),
                  )}
                </Text>
              </View>
            </View>
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
  emptyContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  card: {
    padding: 32,
  },
  emptyContent: {
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  filtersSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
  },
  filterButtons: {
    marginBottom: 8,
  },
  categoryScroll: {
    marginBottom: 8,
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
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  statSubtitle: {
    fontSize: 11,
    textAlign: "center",
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoryValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  categoryPercentage: {
    fontSize: 12,
    marginLeft: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
  },
  categoryDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryDetailText: {
    fontSize: 12,
  },
  supplierItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  supplierInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  supplierColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  supplierName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  supplierDetails: {
    fontSize: 12,
  },
  supplierValueContainer: {
    alignItems: "flex-end",
  },
  supplierValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  supplierPercentage: {
    fontSize: 12,
  },
  stockStatusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  stockStatusCard: {
    width: "31%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  stockStatusInStock: {
    backgroundColor: "#D1FAE5",
  },
  stockStatusLowStock: {
    backgroundColor: "#FEF3C7",
  },
  stockStatusOutOfStock: {
    backgroundColor: "#FEE2E2",
  },
  stockStatusIconContainer: {
    marginBottom: 8,
  },
  stockStatusValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  stockStatusLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    color: "#374151",
  },
  stockStatusPercentage: {
    fontSize: 10,
    textAlign: "center",
    color: "#6B7280",
  },
  priceAnalysisGrid: {
    flexDirection: "column",
  },
  priceCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  priceCardBlue: {
    backgroundColor: "#DBEAFE",
  },
  priceCardGreen: {
    backgroundColor: "#D1FAE5",
  },
  priceCardPurple: {
    backgroundColor: "#E9D5FF",
  },
  priceCardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  priceCardItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  priceCardValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
});
