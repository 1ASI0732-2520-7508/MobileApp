import { InventoryItem, ValidStockStatus } from "../types/inventory";

export const getStockStatus = (item: InventoryItem): ValidStockStatus => {
  if (item.current_quantity === 0) return ValidStockStatus.OutOfStock;
  if (item.current_quantity <= item.minimum_stock_level)
    return ValidStockStatus.LowStock;
  return ValidStockStatus.InStock;
};

export const getStockStatusColor = (status: ValidStockStatus): string => {
  switch (status) {
    case ValidStockStatus.InStock:
      return "#10B981";
    case ValidStockStatus.LowStock:
      return "#F59E0B";
    case ValidStockStatus.OutOfStock:
      return "#EF4444";
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};
