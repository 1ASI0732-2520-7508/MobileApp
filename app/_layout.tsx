import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { ThemeProvider, useAppTheme } from "@/src/contexts/ThemeContext";
import { LanguageProvider } from "@/src/contexts/LanguageContext";
import { StatusBar } from "expo-status-bar";

function AppContent() {
  const { theme } = useAppTheme();
  
  return (
    <>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
          <StatusBar style={theme.dark ? "light" : "dark"} />
        </AuthProvider>
      </PaperProvider>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
