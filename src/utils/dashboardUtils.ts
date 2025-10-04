import { MD3Theme } from "react-native-paper";
import { Stats } from "../types/dashboard";
import { formatCurrency } from "./stockUtils";

type GenerateStatsParams = {
  totalItems: number;
  totalUnits: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  theme: MD3Theme;
};

const generateStats = (params: GenerateStatsParams): Stats[] => {
  const stats = [
    {
      title: "Total Items",
      value: params.totalItems.toString(),
      icon: "package-variant",
      color: params.theme.colors.primary,
      subtitle: `${params.totalUnits} units`,
    },
    {
      title: "Total Value",
      value: formatCurrency(params.totalValue),
      icon: "currency-usd",
      color: params.theme.colors.secondary,
      subtitle: "Inventory worth",
    },
    {
      title: "Low Stock",
      value: params.lowStockItems.toString(),
      icon: "alert-circle",
      color: params.theme.colors.tertiary,
      subtitle: "Items need restock",
    },
    {
      title: "Out of Stock",
      value: params.outOfStockItems.toString(),
      icon: "alert-octagon",
      color: params.theme.colors.error,
      subtitle: "Urgent attention",
    },
  ];

  return stats;
};

export { generateStats };
