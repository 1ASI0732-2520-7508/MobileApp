import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#3B82F6",
    primaryContainer: "#EBF4FF",
    secondary: "#10B981",
    secondaryContainer: "#ECFDF5",
    tertiary: "#F59E0B",
    tertiaryContainer: "#FEF3C7",
    error: "#EF4444",
    errorContainer: "#FEE2E2",
    surface: "#FFFFFF",
    surfaceVariant: "#F8FAFC",
    background: "#F8FAFC",
    onBackground: "#1E293B",
    onSurface: "#1E293B",
    outline: "#E2E8F0",
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#60A5FA",
    primaryContainer: "#1E3A5F",
    secondary: "#34D399",
    secondaryContainer: "#064E3B",
    tertiary: "#FBBF24",
    tertiaryContainer: "#78350F",
    error: "#F87171",
    errorContainer: "#7F1D1D",
    surface: "#1E293B",
    surfaceVariant: "#334155",
    background: "#0F172A",
    onBackground: "#F1F5F9",
    onSurface: "#F1F5F9",
    outline: "#475569",
  },
};

// Default export for backward compatibility
export const theme = lightTheme;
