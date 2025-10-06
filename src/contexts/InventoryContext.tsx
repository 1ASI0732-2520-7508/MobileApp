import {
  createContext,
  JSX,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { InventoryItem, Category, Supplier } from "../types/inventory";
import backendApi from "../infrastructure/backend-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

interface InventoryContextType {
  inventory?: InventoryItem[];
  categories?: Category[];
  suppliers?: Supplier[];
  addInventoryItem: (
    item: Omit<InventoryItem, "id" | "lastUpdated" | "supplier" | "category">,
  ) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  editInventoryItem: (
    id: string,
    updatedFields: Omit<
      InventoryItem,
      "id" | "lastUpdated" | "supplier" | "category"
    >,
  ) => Promise<void>;
  refreshInventory: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshSuppliers: () => Promise<void>;
  addCategory?: (category: Category) => void;
  updateCategory?: (category: Category) => void;
  deleteCategory?: (id: string) => void;
}

interface InventoryProviderProps {
  children: React.ReactNode;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined,
);

export const InventoryProvider = ({
  children,
}: InventoryProviderProps): JSX.Element => {
  const [inventory, setInventory] = useState<InventoryItem[]>();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { isAuthenticated } = useAuth();

  const ensureAuthHeader = useCallback(async () => {
    const storedToken = await AsyncStorage.getItem("accessToken");
    console.log("Setting JWT token:", storedToken ? "Token found" : "No token");
    backendApi.setJwtToken(storedToken ?? "");
  }, []);

  const fetchSuppliers = useCallback(async (): Promise<Supplier[] | undefined> => {
    try {
      await ensureAuthHeader();
      const response = await backendApi.getSuppliers();
      setSuppliers(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to fetch suppliers:",
          error.response?.status,
          error.config?.url,
        );
      } else {
        console.error("Failed to fetch suppliers:", error);
      }
      return undefined;
    }
  }, [ensureAuthHeader]);

  const fetchCategories = useCallback(async (): Promise<Category[] | undefined> => {
    try {
      await ensureAuthHeader();
      const response = await backendApi.getCategories();
      setCategories(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to fetch categories:",
          error.response?.status,
          error.config?.url,
        );
      } else {
        console.error("Failed to fetch categories:", error);
      }
      return undefined;
    }
  }, [ensureAuthHeader]);

  const fetchInventoryItems = useCallback(async (): Promise<
    InventoryItem[] | undefined
  > => {
    try {
      await ensureAuthHeader();
      const response = await backendApi.getInventoryItems();
      setInventory(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to fetch inventory items:",
          error.response?.status,
          error.config?.url,
        );
      } else {
        console.error("Failed to fetch inventory items:", error);
      }
      return undefined;
    }
  }, [ensureAuthHeader]);

  const refreshInventory = useCallback(async () => {
    await fetchInventoryItems();
  }, [fetchInventoryItems]);

  const refreshCategories = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  const refreshSuppliers = useCallback(async () => {
    await fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    if (!isAuthenticated) {
      setInventory(undefined);
      setSuppliers([]);
      setCategories([]);
      return;
    }

    Promise.all([refreshSuppliers(), refreshCategories(), refreshInventory()]);
  }, [isAuthenticated, refreshCategories, refreshInventory, refreshSuppliers]);

  const resolveCategoryAndSupplier = useCallback(
    async (
      item: Omit<InventoryItem, "id" | "lastUpdated" | "supplier" | "category">,
    ) => {
      const currentCategories =
        categories.length > 0 ? categories : ((await fetchCategories()) ?? []);
      const currentSuppliers =
        suppliers.length > 0 ? suppliers : ((await fetchSuppliers()) ?? []);

      const categoryObject = currentCategories.find(
        (cat) => cat.category_name === item.category_name,
      );
      const supplierObject = currentSuppliers.find(
        (sup) => sup.supplier_name === item.supplier_name,
      );

      if (!categoryObject || !supplierObject) {
        console.error("Resolution failed:", {
          categoryObject,
          supplierObject,
          item_category_name: item.category_name,
          item_supplier_name: item.supplier_name,
          available_categories: currentCategories.map(c => c.category_name),
          available_suppliers: currentSuppliers.map(s => s.supplier_name),
        });
        throw new Error(
          `${!categoryObject ? "Category" : ""} ${!categoryObject && !supplierObject ? "and " : ""} ${!supplierObject ? "Supplier" : ""} not found`
        );
      }

      return { categoryObject, supplierObject };
    },
    [categories, fetchCategories, fetchSuppliers, suppliers],
  );

  const addInventoryItem = useCallback(
    async (
      newItem: Omit<
        InventoryItem,
        "id" | "lastUpdated" | "supplier" | "category"
      >,
    ) => {
      try {
        await ensureAuthHeader();
        const { categoryObject, supplierObject } =
          await resolveCategoryAndSupplier(newItem);

        const itemToCreate = {
          ...newItem,
          supplier: supplierObject.id,
          category: categoryObject.id,
        };
        console.log("Creating item with data:", itemToCreate);
        
        await backendApi.createInventoryItem(itemToCreate);
        await fetchInventoryItems();
      } catch (error) {
        console.error("Error adding item:", error);
        if (axios.isAxiosError(error)) {
          console.error("Axios error details:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            method: error.config?.method,
            data: error.response?.data,
          });
        }
        throw error;
      }
    },
    [ensureAuthHeader, fetchInventoryItems, resolveCategoryAndSupplier],
  );

  const editInventoryItem = useCallback(
    async (
      itemId: string,
      updatedItem: Omit<
        InventoryItem,
        "id" | "lastUpdated" | "supplier" | "category"
      >,
    ) => {
      try {
        await ensureAuthHeader();
        const { categoryObject, supplierObject } =
          await resolveCategoryAndSupplier(updatedItem);

        const itemToUpdate = {
          ...updatedItem,
          supplier: supplierObject.id,
          category: categoryObject.id,
        };
        console.log("Updating item with id:", itemId, "data:", itemToUpdate);
        
        await backendApi.updateInventoryItem(itemId, itemToUpdate);
        await fetchInventoryItems();
      } catch (error) {
        console.error("Error updating item:", error);
        if (axios.isAxiosError(error)) {
          console.error("Axios error details:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            method: error.config?.method,
            data: error.response?.data,
          });
        }
        throw error;
      }
    },
    [ensureAuthHeader, fetchInventoryItems, resolveCategoryAndSupplier],
  );

  const deleteInventoryItem = useCallback(async (itemId: string) => {
    try {
      await ensureAuthHeader();
      await backendApi.deleteInventoryItem(itemId);
      setInventory((prev) =>
        prev?.filter((item) => item.id !== parseInt(itemId, 10)),
      );
    } catch (error) {
      console.log("Error deleting item", error);
      throw error;
    }
  }, [ensureAuthHeader]);

  return (
    <InventoryContext
      value={{
        inventory,
        categories,
        suppliers,
        addInventoryItem,
        deleteInventoryItem,
        editInventoryItem,
        refreshInventory,
        refreshCategories,
        refreshSuppliers,
      }}
    >
      {children}
    </InventoryContext>
  );
};

export const useInventoryContext = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error(
      "useInventoryContext must be used within an InventoryProvider",
    );
  }
  return context;
};

export default InventoryContext;
