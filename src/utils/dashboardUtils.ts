import { MD3Theme } from "react-native-paper";
import { Stats } from "../types/dashboard";
import { formatCurrency } from "./stockUtils";

type GenerateStatsParams = {
  totalItems?: number;
  totalUnits?: number;
  totalValue?: number;
  lowStockItems?: number;
  outOfStockItems?: number;
  theme: MD3Theme;
  t: (key: string) => string;
};

const generateStats = (params: GenerateStatsParams): Stats[] => {
  const stats = [
    {
      title: params.t("dashboard.totalItems"),
      value: params.totalItems ? params.totalItems.toString() : "",
      icon: "package-variant",
      color: params.theme.colors.primary,
      subtitle: `${params.totalUnits} ${params.t("dashboard.units")}`,
    },
    {
      title: params.t("dashboard.totalValue"),
      value: formatCurrency(params.totalValue || 0),
      icon: "currency-usd",
      color: params.theme.colors.secondary,
      subtitle: params.t("dashboard.inventoryWorth"),
    },
    {
      title: params.t("dashboard.lowStock"),
      value: params.lowStockItems?.toString(),
      icon: "alert-circle",
      color: params.theme.colors.tertiary,
      subtitle: params.t("dashboard.itemsNeedRestock"),
    },
    {
      title: params.t("dashboard.outOfStock"),
      value: params.outOfStockItems?.toString(),
      icon: "alert-octagon",
      color: params.theme.colors.error,
      subtitle: params.t("dashboard.urgentAttention"),
    },
  ];

  return stats;
};

export { generateStats };
