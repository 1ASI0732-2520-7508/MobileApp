import { InventoryProvider } from "@/src/contexts/InventoryContext";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function InventoryLayout() {
  const theme = useTheme();

  return (
    <InventoryProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.onSurface,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Inventory" }} />
        <Stack.Screen name="[id]" options={{ title: "Item Details" }} />
        <Stack.Screen name="add" options={{ title: "Add Item" }} />
        <Stack.Screen name="edit/[id]" options={{ title: "Edit Item" }} />
      </Stack>
    </InventoryProvider>
  );
}
