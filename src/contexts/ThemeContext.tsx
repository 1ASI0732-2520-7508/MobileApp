import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  JSX,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../theme/theme";
import { MD3Theme } from "react-native-paper";

interface ThemeContextType {
  isDarkMode: boolean;
  theme: MD3Theme;
  toggleTheme: () => Promise<void>;
  setDarkMode: (enabled: boolean) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@inventory_app_theme";

export const ThemeProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === "dark");
      }
    } catch (error) {
      console.log("Error loading theme preference:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemePreference = async (isDark: boolean) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
    } catch (error) {
      console.log("Error saving theme preference:", error);
    }
  };

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await saveThemePreference(newMode);
  };

  const setDarkMode = async (enabled: boolean) => {
    setIsDarkMode(enabled);
    await saveThemePreference(enabled);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  // Always provide the context, even while loading (use default theme)
  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;

