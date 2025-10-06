import { LoginScreen } from "@/src/screens/LoginScreen";
import { useAuth } from "@/src/contexts/AuthContext";
import { Redirect } from "expo-router";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <LoginScreen />;
}
