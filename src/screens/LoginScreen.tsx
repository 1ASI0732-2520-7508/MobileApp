import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { LoginCredentials } from "../types/auth";
import { Alert, ScrollView, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Button,
  Card,
  Text,
  TextInput,
  Divider,
  Chip,
  useTheme,
} from "react-native-paper";

export const LoginScreen = () => {
  const theme = useTheme();
  const { login, isLoading } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      Alert.alert("Error", "Please enter email and password");
    }

    const result = await login(credentials);
    if (!result.success && result.error) {
      Alert.alert("Login Failed", result.error);
    }
  };

  const demoCredentials = [
    { email: "admin@inventorypro.com", role: "Admin" },
    { email: "manager@inventorypro.com", role: "Manager" },
    { email: "demo@inventorypro.com", role: "Employee" },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="package-variant"
            size={64}
            color={theme.colors.primary}
          />
          <Text
            variant="headlineLarge"
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            Inventory Pro
          </Text>
          <Text
            variant="titleMedium"
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            Mobile Inventory Management
          </Text>
        </View>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Email Address"
              value={credentials.username}
              onChangeText={(text) =>
                setCredentials({ ...credentials, username: text })
              }
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="mail" />}
            />

            <TextInput
              label="Password"
              value={credentials.password}
              onChangeText={(text) =>
                setCredentials({ ...credentials, password: text })
              }
              mode="outlined"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              contentStyle={styles.loginButtonContent}
            >
              Sign In
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.demoCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.demoTitle}>
              Demo Credentials
            </Text>
            <Divider style={styles.divider} />
            {demoCredentials.map((demo, index) => (
              <View key={index} style={styles.demoItem}>
                <Text style={styles.demoEmail}>{demo.email}</Text>
                <Chip mode="outlined" compact>
                  {demo.role}
                </Chip>
              </View>
            ))}
            <View style={styles.passwordInfo}>
              <Text
                style={[
                  styles.passwordText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Password for all accounts:{" "}
                <Text style={styles.passwordValue}>password123</Text>
              </Text>
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
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  demoCard: {
    opacity: 0.9,
  },
  demoTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  demoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  demoEmail: {
    fontSize: 14,
    flex: 1,
  },
  passwordInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  passwordText: {
    fontSize: 12,
    textAlign: "center",
  },
  passwordValue: {
    fontFamily: "monospace",
    fontWeight: "bold",
  },
});
