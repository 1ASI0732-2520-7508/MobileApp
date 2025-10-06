import { useAuth } from "@/src/contexts/AuthContext";
import { InventoryProvider } from "@/src/contexts/InventoryContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useTheme } from "react-native-paper";

export default function InventoryLayout() {
  const theme = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isLoading, isAuthenticated, router]);

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
