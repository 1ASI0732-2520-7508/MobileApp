import { InventoryProvider } from "@/src/contexts/InventoryContext";
import { AnalyticsScreen } from "@/src/screens/AnalyticsScreen";

export default function Analytics() {
  return (
    <InventoryProvider>
      <AnalyticsScreen />
    </InventoryProvider>
  );
}
