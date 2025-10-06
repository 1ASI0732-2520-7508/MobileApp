import { createContext, JSX, useContext, useEffect, useState } from "react";
import { InventoryItem, Category, Supplier } from "../types/inventory";
import backendApi from "../infrastructure/backend-api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface InventoryContextType {
  inventory?: InventoryItem[];
  categories?: Category[];
  suppliers?: Supplier[];
  addInventoryItem: (item: Omit<InventoryItem, "id" | "lastUpdated">) => any;
  deleteInventoryItem: (id: string) => any;
  editInventoryItem: (
    id: string,
    updatedFields: Omit<InventoryItem, "id" | "lastUpdated">,
  ) => any;
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

  const token = AsyncStorage.getItem("accessToken");

  const fetchSuppliers = async () => {
    try {
      backendApi.setJwtToken(await token);
      setSuppliers(await backendApi.getSuppliers().then((res) => res.data));
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      backendApi.setJwtToken(await token);
      setCategories(await backendApi.getCategories().then((res) => res.data));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      backendApi.setJwtToken(await token);
      setInventory(
        await backendApi.getInventoryItems().then((res) => res.data),
      );
      console.log(inventory);
    } catch (error) {
      console.error("Failed to fetch inventory items:", error);
    }
  };

  useEffect(() => {
    Promise.all([fetchSuppliers(), fetchCategories(), fetchInventoryItems()]);
  });

  const addInventoryItem = async (
    newItem: Omit<
      InventoryItem,
      "id" | "lastUpdated" | "supplier" | "category"
    >,
  ) => {
    try {
      const categoryObject = categories.find(
        (cat) => cat.name === newItem.category_name,
      );
      const supplierObject = suppliers.find(
        (sup) => sup.supplier_name === newItem.supplier_name,
      );

      const res = backendApi.createInventoryItem({
        ...newItem,
        supplier: supplierObject?.id,
        category: categoryObject?.id,
      });
      console.log(res);
      fetchInventoryItems();
    } catch (error) {
      console.log("Error adding item", error);
    }
  };

  const editInventoryItem = (
    itemId: string,
    updatedItem: Omit<
      InventoryItem,
      "id" | "lastUpdated" | "supplier" | "category"
    >,
  ) => {
    try {
      const categoryObject = categories.find(
        (cat) => cat.name === updatedItem.category_name,
      );
      const supplierObject = suppliers.find(
        (sup) => sup.supplier_name === updatedItem.supplier_name,
      );

      const res = backendApi.updateInventoryItem(itemId, {
        ...updatedItem,
        supplier: supplierObject?.id,
        category: categoryObject?.id,
      });
      console.log(res);
      fetchInventoryItems();
    } catch (error) {
      console.log("Error updating item", error);
    }
  };

  const deleteInventoryItem = async (itemId: string) => {
    try {
      await backendApi.deleteInventoryItem(itemId);
      setInventory((prev) =>
        prev?.filter((item) => item.id !== parseInt(itemId)),
      );
    } catch (error) {
      console.log("Error deleting item", error);
    }
  };

  return (
    <InventoryContext
      value={{
        inventory,
        addInventoryItem,
        deleteInventoryItem,
        editInventoryItem,
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
