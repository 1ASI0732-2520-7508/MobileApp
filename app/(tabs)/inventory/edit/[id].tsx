import { useInventoryContext } from "@/src/contexts/InventoryContext";
import { AddEditItemScreen } from "@/src/screens/AddEditItemScreen";
import { useLocalSearchParams } from "expo-router";

export default function EditItem() {
  const { id } = useLocalSearchParams();
  const { inventory: items } = useInventoryContext();

  const item = items?.find((item) => item?.id.toString() === id);

  return <AddEditItemScreen item={item} />;
}
