import { InventoryItem, Category } from "../types/inventory";
import { User } from "../types/auth";

export const categories: Category[] = [
  { id: 1, name: "Electronics", color: "#3B82F6" },
  { id: 2, name: "Office Supplies", color: "#10B981" },
  { id: 3, name: "Tools", color: "#F59E0B" },
  { id: 4, name: "Materials", color: "#8B5CF6" },
  { id: 5, name: "Equipment", color: "#F97316" },
];

export const inventoryItems: InventoryItem[] = [
  {
    id: 1,
    item_name: "Wireless Mouse",
    category_name: "Electronics",
    current_quantity: 45,
    minimum_stock_level: 10,
    unit_price: "29.99",
    supplier_name: "TechCorp",
    description: "Ergonomic wireless mouse with 2.4GHz connection",
    lastUpdated: new Date("2024-12-20"),
  },
  {
    id: 2,
    item_name: "Wireless Mouse",
    category_name: "Electronics",
    current_quantity: 45,
    minimum_stock_level: 10,
    unit_price: "29.99",
    supplier_name: "TechCorp",
    description: "Ergonomic wireless mouse with 2.4GHz connection",
    lastUpdated: new Date("2024-12-20"),
  },
  {
    id: 3,
    item_name: "Wireless Mouse",
    category_name: "Electronics",
    current_quantity: 45,
    minimum_stock_level: 10,
    unit_price: "29.99",
    supplier_name: "TechCorp",
    description: "Ergonomic wireless mouse with 2.4GHz connection",
    lastUpdated: new Date("2024-12-20"),
  },
  {
    id: 4,
    item_name: "Wireless Mouse",
    category_name: "Electronics",
    current_quantity: 45,
    minimum_stock_level: 10,
    unit_price: "29.99",
    supplier_name: "TechCorp",
    description: "Ergonomic wireless mouse with 2.4GHz connection",
    lastUpdated: new Date("2024-12-20"),
  },
  {
    id: 5,
    item_name: "Wireless Mouse",
    category_name: "Electronics",
    current_quantity: 45,
    minimum_stock_level: 10,
    unit_price: "29.99",
    supplier_name: "TechCorp",
    description: "Ergonomic wireless mouse with 2.4GHz connection",
    lastUpdated: new Date("2024-12-20"),
  },
  {
    id: 6,
    item_name: "Wireless Mouse",
    category_name: "Electronics",
    current_quantity: 45,
    minimum_stock_level: 10,
    unit_price: "29.99",
    supplier_name: "TechCorp",
    description: "Ergonomic wireless mouse with 2.4GHz connection",
    lastUpdated: new Date("2024-12-20"),
  },
];

export const mockUser: User[] = [
  {
    id: "1",
    email: "admin@inventorypro.com",
    username: "John Admin",
    group: "Admin",
  },
  {
    id: "2",
    email: "manager@inventorypro.com",
    username: "Sarah Manager",
    group: "Manager",
  },
  {
    id: "3",
    email: "demo@inventorypro.com",
    username: "Demo User",
    group: "Employee",
  },
];
