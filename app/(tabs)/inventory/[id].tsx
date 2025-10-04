import { useInventoryContext } from "@/src/contexts/InventoryContext";
import { ItemDetailsScreen } from "@/src/screens/ItemDetailsScreen";
import { useLocalSearchParams } from "expo-router";

export default function ItemDetails() {
  const { id } = useLocalSearchParams();
  const { inventory: items } = useInventoryContext();

  const item = items.find((item) => item.id === id);

  if (!item) {
    return null;
  }

  return <ItemDetailsScreen item={item} />;
}
