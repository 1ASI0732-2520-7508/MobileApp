export interface Category {
  id: number;
  category_name: string;
  color?: string;
}

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export enum ValidStockStatus {
  InStock = "in-stock",
  LowStock = "low-stock",
  OutOfStock = "out-of-stock",
}

export interface Supplier {
  id: number;
  company_name: string;
  supplier_name: string;
  ruc_n: string;
  address: string;
  company: number; // Foreign key to Company
}

export interface InventoryItem {
  id: number;
  supplier_name: string;
  category_name: string;
  item_name: string;
  current_quantity: number;
  minimum_stock_level: number;
  unit_price: string;
  description: string;
  supplier?: number; // Foreign key to Supplier
  category?: number; // Foreign key to Category
  lastUpdated?: Date;
}
