import { JSX, useEffect, useState } from "react";
import { InventoryItem } from "../types/inventory";
import {
  useTheme,
  Text,
  TextInput,
  Button,
  Card,
  Chip,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, View, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInventoryContext } from "../contexts/InventoryContext";

interface AddEditItemScreenProps {
  item?: InventoryItem;
}

export const AddEditItemScreen = ({
  item,
}: AddEditItemScreenProps): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const {
    addInventoryItem,
    editInventoryItem,
    categories = [],
    suppliers = [],
    refreshCategories,
    refreshSuppliers,
  } = useInventoryContext();

  const isEditing = !!item; // Convert the existence of item to a boolean

  const [formData, setFormData] = useState<
    Omit<InventoryItem, "id" | "lastUpdated" | "supplier" | "category">
  >({
    item_name: "",
    description: "",
    current_quantity: 0,
    unit_price: "",
    category_name: "",
    supplier_name: "",
    minimum_stock_level: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        item_name: item.item_name,
        description: item.description,
        current_quantity: item.current_quantity,
        unit_price: item.unit_price,
        category_name: item.category_name,
        supplier_name: item.supplier_name,
        minimum_stock_level: item.minimum_stock_level,
      });
    }
  }, [item]);

  useEffect(() => {
    if (!item && categories.length) {
      setFormData((prev) => ({
        ...prev,
        category_name: prev.category_name || categories[0].category_name,
      }));
    }
  }, [categories, item]);

  useEffect(() => {
    console.log("Categories in AddEditItemScreen:", categories);
    if (!categories.length) {
      refreshCategories().catch((error) =>
        console.warn("Failed to refresh categories", error),
      );
    } else if (!item && !formData.category_name && categories.length > 0) {
      // Set first category as default for new items
      setFormData((prev) => ({
        ...prev,
        category_name: categories[0].category_name,
      }));
    }
  }, [categories.length, refreshCategories, item]);

  useEffect(() => {
    console.log("Suppliers in AddEditItemScreen:", suppliers);
    if (!suppliers.length) {
      refreshSuppliers().catch((error) =>
        console.warn("Failed to refresh suppliers", error),
      );
    } else if (!item && !formData.supplier_name && suppliers.length > 0) {
      // Set first supplier as default for new items
      setFormData((prev) => ({
        ...prev,
        supplier_name: suppliers[0].supplier_name,
      }));
    }
  }, [refreshSuppliers, suppliers.length, item]);

  const handleSave = async () => {
    if (isSubmitting) {
      return;
    }

    // Validate required fields
    const errors: string[] = [];

    if (!formData.item_name.trim()) {
      errors.push("Item name is required");
    }

    if (!formData.category_name.trim()) {
      errors.push("Category is required");
    } else if (
      categories.length &&
      !categories.some((cat) => cat.category_name === formData.category_name)
    ) {
      errors.push("Please select a valid category");
    }

    if (!formData.supplier_name.trim()) {
      errors.push("Supplier is required");
    } else if (
      suppliers.length &&
      !suppliers.some((sup) => sup.supplier_name === formData.supplier_name)
    ) {
      errors.push("Please select a valid supplier");
    }

    if (!formData.unit_price || formData.unit_price.trim() === "") {
      errors.push("Unit price is required");
    } else if (isNaN(parseFloat(formData.unit_price)) || parseFloat(formData.unit_price) < 0) {
      errors.push("Unit price must be a valid positive number");
    }

    if (formData.current_quantity < 0) {
      errors.push("Current quantity cannot be negative");
    }

    if (formData.minimum_stock_level < 0) {
      errors.push("Minimum stock level cannot be negative");
    }

    // Show validation errors if any
    if (errors.length > 0) {
      Alert.alert(
        "Validation Error",
        errors.join("\n"),
        [{ text: "OK" }]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && item) {
        await editInventoryItem(item.id.toString(), formData);
      } else {
        await addInventoryItem(formData);
      }
      router.back();
    } catch (error) {
      console.error("Failed to save item", error);
      Alert.alert("Error", "Failed to save item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.formCard}>
          <Card.Content>
            <TextInput
              label="Item Name *"
              value={formData.item_name}
              onChangeText={(text) =>
                setFormData({ ...formData, item_name: text })
              }
              mode="outlined"
              style={styles.input}
            />

            <Text
              style={[styles.sectionLabel, { color: theme.colors.onSurface }]}
            >
              Category * ({categories.length} available)
            </Text>
            <View style={styles.categoryContainer}>
              {categories.length > 0 ? (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={categories}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => {
                    console.log("Rendering category chip:", item);
                    return (
                      <Chip
                        selected={formData.category_name === item.category_name}
                        onPress={() => {
                          console.log("Category selected:", item.category_name);
                          setFormData({ ...formData, category_name: item.category_name });
                        }}
                        style={styles.categoryChip}
                        mode="outlined"
                        textStyle={styles.chipText}
                      >
                        {item.category_name}
                      </Chip>
                    );
                  }}
                  contentContainerStyle={styles.categoryList}
                />
              ) : (
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  No categories available
                </Text>
              )}
            </View>

            <View style={styles.row}>
              <TextInput
                label="Current Quantity"
                value={
                  formData.current_quantity === 0 && !item
                    ? ""
                    : formData.current_quantity.toString()
                }
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    current_quantity: text ? parseInt(text, 10) : 0,
                  })
                }
                mode="outlined"
                keyboardType="numeric"
                placeholder="0"
                style={[styles.input, styles.halfWidth]}
              />

              <TextInput
                label="Minimum Stock"
                value={
                  formData.minimum_stock_level === 0 && !item
                    ? ""
                    : formData.minimum_stock_level.toString()
                }
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    minimum_stock_level: text ? parseInt(text, 10) : 0,
                  })
                }
                mode="outlined"
                keyboardType="numeric"
                placeholder="0"
                style={[styles.input, styles.halfWidth]}
              />
            </View>

            <TextInput
              label="Unit Price"
              value={formData.unit_price || ""}
              onChangeText={(text) =>
                setFormData({ ...formData, unit_price: text })
              }
              mode="outlined"
              keyboardType="decimal-pad"
              placeholder="0.00"
              left={<TextInput.Icon icon="currency-usd" />}
              style={styles.input}
            />

            <Text
              style={[styles.sectionLabel, { color: theme.colors.onSurface }]}
            >
              Supplier * ({suppliers.length} available)
            </Text>
            <View style={styles.categoryContainer}>
              {suppliers.length > 0 ? (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={suppliers}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => {
                    console.log("Rendering supplier chip:", item);
                    return (
                      <Chip
                        selected={formData.supplier_name === item.supplier_name}
                        onPress={() => {
                          console.log("Supplier selected:", item.supplier_name);
                          setFormData({ ...formData, supplier_name: item.supplier_name });
                        }}
                        style={styles.categoryChip}
                        mode="outlined"
                        textStyle={styles.chipText}
                      >
                        {item.supplier_name}
                      </Chip>
                    );
                  }}
                  contentContainerStyle={styles.categoryList}
                />
              ) : (
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  No suppliers available
                </Text>
              )}
            </View>

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            loading={isSubmitting}
            disabled={isSubmitting}
            icon={isEditing ? "content-save" : "plus"}
          >
            {isEditing ? "Update Item" : "Add Item"}
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.cancelButton}
          >
            Cancel
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
  formCard: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryList: {
    paddingVertical: 4,
  },
  categoryChip: {
    marginRight: 8,
    height: 40,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  actions: {
    gap: 12,
  },
  saveButton: {
    marginBottom: 8,
  },
  cancelButton: {},
});
