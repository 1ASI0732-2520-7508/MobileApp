import {
  Avatar,
  Card,
  useTheme,
  Text,
  List,
  Divider,
  Button,
} from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ProfileScreen = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            logout();
          } catch (error) {
            console.warn("Logout failed:", error);
          }
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card>
          <Card.Content>
            <Avatar.Text
              size={80}
              label={user.username
                .split(" ")
                .map((n) => n[0])
                .join("")}
              style={{ backgroundColor: theme.colors.primary }}
            />
            <Text style={[styles.userName, { color: theme.colors.onSurface }]}>
              {user.username}
            </Text>
            <Text
              style={[
                styles.userEmail,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {user.email}
            </Text>
            <Text style={[styles.userRole, { color: theme.colors.primary }]}>
              {user.group.toUpperCase()}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.menuCard}>
          <List.Item
            title="Account Settings"
            description="Manage your account preferences"
            left={(props) => <List.Icon {...props} icon="account-cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Notifications"
            description="Configure notification settings"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Help & Support"
            description="Get help and contact support"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="About"
            description="App version and information"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </Card>

        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={theme.colors.error}
          icon="logout"
        >
          Logout
        </Button>
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
  profileCard: {
    marginBottom: 24,
  },
  profileContent: {
    alignItems: "center",
    paddingVertical: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 8,
  },
  userRole: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
  },
  menuCard: {
    marginVertical: 24,
  },
  logoutButton: {
    borderColor: "#EF4444",
  },
});
