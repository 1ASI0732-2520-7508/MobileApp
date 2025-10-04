import { useState } from "react";
import { InventoryItem } from "../types/inventory";
import { inventoryItems as initialItems } from "../data/mockData";

const useInvetory = () => {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);

  const addItem = (
    newItem: Omit<InventoryItem, "id" | "lastUpdated">,
  ): void => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    };
    setItems((prevItems) => [...prevItems, item]);
  };

  const updateItem = (updatedItem: InventoryItem): void => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedItem.id
          ? { ...updatedItem, lastUpdated: new Date() }
          : item,
      ),
    );
  };

  const delteItem = (itemId: string): void => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
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

  return {
    items,
    addItem,
    updateItem,
    delteItem,
    editItem,
  };
};

export default useInvetory;
