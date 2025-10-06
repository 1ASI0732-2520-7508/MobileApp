import { InventoryItem } from "@/src/types/inventory";
import backendApi, { BackendApi } from "../src/infrastructure/backend-api";

describe("BackendApi", () => {
  let token = "";
  let tokenEndpointResponse: any;

  beforeAll(async () => {
    const backendApi = new BackendApi();
    const credentials = {
      username: "your_username",
      password: "your_password_here",
    };
    const response = await backendApi.createAuthToken(credentials);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("access");
    expect(response.data).toHaveProperty("refresh");
    token = response.data.access;
    tokenEndpointResponse = response;
  });

  test("should get a valid token", () => {
    expect(token).not.toBe("");
    expect(tokenEndpointResponse.status).toBe(200);
    expect(tokenEndpointResponse.data).toHaveProperty("access");
    expect(tokenEndpointResponse.data).toHaveProperty("refresh");
  });

  test("get items", async () => {
    backendApi.withAuthToken(token);
    const response = await backendApi.getInventoryItems();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test("get categories", async () => {
    backendApi.withAuthToken(token);
    const response = await backendApi.getCategories();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test("get suppliers", async () => {
    backendApi.withAuthToken(token);
    const response = await backendApi.getSuppliers();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test("create item", async () => {
    backendApi.withAuthToken(token);
    const newItem: Omit<
      InventoryItem,
      "id" | "supplier_name" | "category_name"
    > = {
      item_name: "Test Item",
      description: "This is a test item",
      current_quantity: 10,
      minimum_stock_level: 5,
      supplier: 1,
      category: 1,
      unit_price: "99.99",
    };
    const response = await backendApi.createInventoryItem(newItem);
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty("id");
    expect(response.data.item_name).toBe(newItem.item_name);
  });

  test("update item", async () => {
    backendApi.withAuthToken(token);
    const updatedItemData: Omit<
      InventoryItem,
      "id" | "supplier_name" | "category_name"
    > = {
      item_name: "Updated Test Item",
      description: "This is an updated test item",
      current_quantity: 20,
      minimum_stock_level: 10,
      supplier: 1,
      category: 1,
      unit_price: "89.99",
    };
    // First, create a new item to update
    const createResponse = await backendApi.createInventoryItem({
      item_name: "Item to Update",
      description: "This item will be updated",
      current_quantity: 5,
      minimum_stock_level: 2,
      supplier: 1,
      category: 1,
      unit_price: "49.99",
    });
    expect(createResponse.status).toBe(201);
    const itemId = createResponse.data.id;

    // Now, update the created item
    const updateResponse = await backendApi.updateInventoryItem(
      itemId.toString(),
      updatedItemData,
    );
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data.item_name).toBe(updatedItemData.item_name);
    expect(updateResponse.data.description).toBe(updatedItemData.description);
    expect(updateResponse.data.current_quantity).toBe(
      updatedItemData.current_quantity,
    );
    expect(updateResponse.data.minimum_stock_level).toBe(
      updatedItemData.minimum_stock_level,
    );
    expect(updateResponse.data.unit_price).toBe(updatedItemData.unit_price);
  });
});
