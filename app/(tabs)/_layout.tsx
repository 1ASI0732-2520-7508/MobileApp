import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import { useLanguage } from "@/src/contexts/LanguageContext";

export default function TabLayout() {
  const theme = useTheme();
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          switch (route.name) {
            case "index":
              iconName = focused ? "view-dashboard" : "view-dashboard-outline";
              break;
            case "inventory":
              iconName = focused ? "package-variant" : "package-variant-closed";
              break;
            case "analytics":
              iconName = focused ? "chart-line" : "chart-line-variant";
              break;
            case "profile":
              iconName = focused ? "account" : "account-outline";
              break;
            default:
              iconName = "help";
          }
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
      })}
    >
      <Tabs.Screen name="index" options={{ title: t("nav.dashboard") }} />
      <Tabs.Screen
        name="inventory"
        options={{ headerShown: false, title: t("nav.inventory") }}
      />
      <Tabs.Screen name="analytics" options={{ title: t("nav.analytics") }} />
      <Tabs.Screen name="profile" options={{ title: t("nav.profile") }} />
    </Tabs>
  );
}
