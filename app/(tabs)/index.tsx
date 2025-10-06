import { InventoryProvider } from "@/src/contexts/InventoryContext";
import { DashboardScreen } from "@/src/screens/DashboardScreen";

export default function Dashboard() {
  return (
    <InventoryProvider>
      <DashboardScreen />
    </InventoryProvider>
  );
}
