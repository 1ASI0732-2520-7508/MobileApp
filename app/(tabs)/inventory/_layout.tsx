import { useAuth } from "@/src/contexts/AuthContext";
import { InventoryProvider } from "@/src/contexts/InventoryContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useTheme } from "react-native-paper";
import { useLanguage } from "@/src/contexts/LanguageContext";

export default function InventoryLayout() {
  const theme = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

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
        <Stack.Screen name="index" options={{ title: t("inventory.title") }} />
        <Stack.Screen name="[id]" options={{ title: t("inventory.itemDetails") }} />
        <Stack.Screen name="add" options={{ title: t("inventory.addItem") }} />
        <Stack.Screen name="edit/[id]" options={{ title: t("inventory.editItem") }} />
      </Stack>
    </InventoryProvider>
  );
}
