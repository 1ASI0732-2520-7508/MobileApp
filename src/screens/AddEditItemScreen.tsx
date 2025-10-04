import { JSX, useEffect, useState } from "react";
import { InventoryItem } from "../types/inventory";
import {
  useTheme,
  Text,
  TextInput,
  Button,
  Card,
  SegmentedButtons,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { categories } from "../data/mockData";
import { Alert, StyleSheet, View, ScrollView } from "react-native";
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
  const { addItem, editItem } = useInventoryContext();

  const isEditing = !!item; // Convert the existence of item to a boolean

  const [formData, setFormData] = useState<
    Omit<InventoryItem, "id" | "lastUpdated">
  >({
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    category: categories[0]?.name || "",
    supplier: "",
    minStock: 0,
  });

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert("Validation Error", "Item name is required.");
    }
    if (!formData.supplier.trim()) {
      Alert.alert("Validation Error", "Supplier name is required.");
    }

    if (isEditing && item) {
      editItem(item.id, formData);
      router.back();
    } else {
      addItem(formData);
      router.back();
    }
  };

  const categoryButtons = categories.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.formCard}>
          <Card.Content>
            <TextInput
              label="Item Name *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              mode="outlined"
              style={styles.input}
            />

            <Text
              style={[styles.sectionLabel, { color: theme.colors.onSurface }]}
            >
              Category
            </Text>
            <SegmentedButtons
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              buttons={categoryButtons}
              style={styles.categoryButtons}
            />

            <View style={styles.row}>
              <TextInput
                label="Current Quantity"
                value={
                  /* This prevents the value set to NaN */
                  formData.quantity.toString()
                    ? formData.quantity.toString()
                    : "0"
                }
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    quantity: text ? parseInt(text) : 0,
                  })
                }
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfWidth]}
              />

              <TextInput
                label="Minimum Stock"
                value={
                  formData.minStock.toString()
                    ? formData.minStock.toString()
                    : "0"
                }
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    minStock: text ? parseInt(text) : 0,
                  })
                }
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfWidth]}
              />
            </View>

            <TextInput
              label="Unit Price"
              value={
                formData.price.toString() ? formData.price.toString() : "0"
              }
              onChangeText={(text) =>
                setFormData({ ...formData, price: text ? parseFloat(text) : 0 })
              }
              mode="outlined"
              keyboardType="decimal-pad"
              left={<TextInput.Icon icon="currency-usd" />}
              style={styles.input}
            />

            <TextInput
              label="Supplier *"
              value={formData.supplier}
              onChangeText={(text) =>
                setFormData({ ...formData, supplier: text })
              }
              mode="outlined"
              style={styles.input}
            />

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
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
  },
  categoryButtons: {
    marginBottom: 16,
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
