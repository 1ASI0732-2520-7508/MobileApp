import React, {
  createContext,
  useState,
  useEffect,
  JSX,
  useContext,
} from "react";
import { AuthState, LoginCredentials, User } from "../types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Mock user data for demonstration purposes

const mockUser: User[] = [
  {
    id: "1",
    email: "admin@inventorypro.com",
    name: "John Admin",
    role: "admin",
  },
  {
    id: "2",
    email: "manager@inventorypro.com",
    name: "Sarah Manager",
    role: "manager",
  },
  {
    id: "3",
    email: "demo@inventorypro.com",
    name: "Demo User",
    role: "employee",
  },
];

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem("invetoryUser");
      if (userData) {
        const user: User = JSON.parse(userData);
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = mockUser.find((user) => user.email === credentials.email);

    if (!user) {
      setAuthState((prevState) => ({ ...prevState, isLoading: false }));
      return { success: false, error: "User not found" };
    }

    if (credentials.password !== "password123") {
      setAuthState((prevState) => ({ ...prevState, isLoading: false }));
      return { success: false, error: "Invalid password" };
    }

    try {
      await AsyncStorage.setItem("invetoryUser", JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    } catch {
      setAuthState((prevState) => ({ ...prevState, isLoading: false }));
      return { success: false, error: "Failed to store user data" };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("invetoryUser");
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.log("Logout error: ", error);
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
