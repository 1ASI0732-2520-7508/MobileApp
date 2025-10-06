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
});
