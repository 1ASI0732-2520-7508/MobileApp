import React, {
  createContext,
  useState,
  useEffect,
  JSX,
  useContext,
} from "react";
import { AuthState, LoginCredentials, User } from "../types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import backendApi from "../infrastructure/backend-api";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";

interface AuthContextType extends AuthState {
  login: (
    credentials: LoginCredentials,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// for large state object consider use a library like Zustand or Redux
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  /**
   * Check authentication state on mount
   * In a real app, you might check a token's validity here
   */
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("invetoryUser");
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState((prevState) => ({ ...prevState, isLoading: false }));
      }
    } catch (error) {
      console.log(error);
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  };

  const login = async (
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthState((prevState) => ({ ...prevState, isLoading: true }));

    try {
      const response = await backendApi.createAuthToken(credentials);

      // Log the response for debugging purposes
      console.log(response);

      if (response.status !== 200) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: "Invalid credentials" };
      }

      const jwtToken = response.data.access;

      const payload = jwtDecode(jwtToken);

      const user: User = {
        id: (payload as any).user_id,
        email: credentials.username,
        username: (payload as any).username,
        conpany_name: (payload as any).company_name,
        group: (payload as any).groups[0],
      };

      console.log("Payload:", user);
      await AsyncStorage.setItem("invetoryUser", JSON.stringify(user)).catch(
        () => {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return { success: false, error: "Failed to store user data" };
        },
      );

      await AsyncStorage.setItem("accessToken", jwtToken).catch(() => {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: "Failed to store access token" };
      });

      await AsyncStorage.setItem("refreshToken", response.data.refresh).catch(
        () => {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return { success: false, error: "Failed to store refresh token" };
        },
      );

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    } catch {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error: "Network Error." };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("invetoryUser");
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      router.replace("/auth");
    } catch (error) {
      console.log("Local Storage error: ", error);
    }
  };

  // not need to use AuthContext.Provider, just AuthContext in react 19
  return (
    <AuthContext value={{ ...authState, login, logout }}>
      {children}
    </AuthContext>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
