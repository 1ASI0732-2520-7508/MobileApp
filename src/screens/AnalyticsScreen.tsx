import { JSX } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const AnalyticsScreen = (): JSX.Element => {
  const theme = useTheme();

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <MaterialCommunityIcons
              name="chart-line"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Analytics
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              This section is under development and will be available soon.
            </Text>
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
  scrollContent: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  card: {
    padding: 32,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});
