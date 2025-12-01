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
import { mockUser } from "../data/mockData";

// Enable mock mode when backend is not available
// Auto-enable if env var is set, or fallback to mock when backend has no users
const USE_MOCK_MODE = process.env.EXPO_PUBLIC_USE_MOCK_MODE === "true";

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

    // Mock mode: Use mock data for development
    if (USE_MOCK_MODE) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Find matching mock user
      const mockUserData = mockUser.find(
        (u) => u.email.toLowerCase() === credentials.username.toLowerCase()
      );
      
      if (mockUserData && credentials.password === "password123") {
        const user: User = {
          ...mockUserData,
          conpany_name: "Demo Company",
        };
        
        await AsyncStorage.setItem("invetoryUser", JSON.stringify(user));
        await AsyncStorage.setItem("accessToken", "mock-token");
        await AsyncStorage.setItem("refreshToken", "mock-refresh-token");
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return { 
          success: false, 
          error: "Credenciales inválidas. Usa: admin@inventorypro.com / password123" 
        };
      }
    }

    try {
      const response = await backendApi.createAuthToken(credentials);

      // Log the response for debugging purposes
      console.log("Login response:", response);

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
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      
      // Log full error for debugging
      console.log("Login error:", error);
      console.log("Error response:", error?.response?.data);
      console.log("Error status:", error?.response?.status);
      
      // If backend fails, try mock mode automatically
      if (error?.response?.status === 401) {
        const errorMessage = error?.response?.data?.detail || 
          error?.response?.data?.message || 
          error?.response?.data?.error ||
          "Credenciales inválidas";
        
        // If backend has no users, automatically try mock mode
        if (errorMessage.includes("No active account")) {
          console.log("Backend has no users, trying mock mode...");
          
          // Try mock login
          const mockUserData = mockUser.find(
            (u) => u.email.toLowerCase() === credentials.username.toLowerCase()
          );
          
          if (mockUserData && credentials.password === "password123") {
            const user: User = {
              ...mockUserData,
              conpany_name: "Demo Company",
            };
            
            await AsyncStorage.setItem("invetoryUser", JSON.stringify(user));
            await AsyncStorage.setItem("accessToken", "mock-token");
            await AsyncStorage.setItem("refreshToken", "mock-refresh-token");
            
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true };
          }
          
          return { 
            success: false, 
            error: "El backend no tiene usuarios. Usa: admin@inventorypro.com / password123 (modo demo)" 
          };
        }
        
        return { 
          success: false, 
          error: `${errorMessage}. Intenta con: admin@inventorypro.com / password123` 
        };
      }
      
      if (error?.response?.status === 404) {
        return { 
          success: false, 
          error: "Endpoint no encontrado. Verifica la configuración del backend." 
        };
      }
      
      if (error?.response?.status === 500) {
        return { 
          success: false, 
          error: "Error interno del servidor. El backend puede estar caído." 
        };
      }
      
      if (error?.response?.status) {
        return { 
          success: false, 
          error: `Error del servidor (${error.response.status}): ${error?.response?.data?.detail || error?.response?.data?.message || 'Error desconocido'}` 
        };
      }
      
      if (error?.code === 'ECONNREFUSED' || error?.code === 'ERR_NETWORK') {
        return { 
          success: false, 
          error: "No se puede conectar al servidor. Verifica que el backend esté activo." 
        };
      }
      
      if (error?.message) {
        return { success: false, error: error.message };
      }
      
      return { success: false, error: "Error de conexión. Verifica tu internet." };
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

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
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
