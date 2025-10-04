import { createContext, JSX, useContext, useState } from "react";
import { InventoryItem, Category } from "../types/inventory";
import { inventoryItems as initialInventory } from "../data/mockData";

interface InventoryContextType {
  inventory: InventoryItem[];
  categories?: Category[];
  addItem: (item: Omit<InventoryItem, "id" | "lastUpdated">) => void;
  updateItem: (item: InventoryItem) => void;
  deleteItem: (id: string) => void;
  editItem: (
    id: string,
    updatedFields: Omit<InventoryItem, "id" | "lastUpdated">,
  ) => void;
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
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [categories, setCategories] = useState<Category[]>([]);

  const addItem = (
    newItem: Omit<InventoryItem, "id" | "lastUpdated">,
  ): void => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    };
    setInventory((prevItems) => [...prevItems, item]);
  };

  const updateItem = (updatedItem: InventoryItem): void => {
    setInventory((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedItem.id
          ? { ...updatedItem, lastUpdated: new Date() }
          : item,
      ),
    );
  };

  const deleteItem = (itemId: string): void => {
    setInventory((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const editItem = (
    itemId: string,
    updatedFields: Omit<InventoryItem, "id" | "lastUpdated">,
  ): void => {
    const updatedItem: InventoryItem = {
      ...updatedFields,
      id: itemId,
      lastUpdated: new Date(),
    };
    updateItem(updatedItem);
  };

  return (
    <InventoryContext
      value={{ inventory, addItem, updateItem, deleteItem, editItem }}
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
