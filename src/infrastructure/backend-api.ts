import { BaseApi } from "./base-api";
import { BaseEndpoint } from "./base-endpoint";
import { Category, InventoryItem, Supplier } from "../types/inventory";
import { LoginCredentials } from "../types/auth";

const AUTH_ENDPOINT_PATH =
  process.env.EXPO_PUBLIC_AUTH_TOKEN_ENDPOINT ?? "/auth/token/";
const SUPPLIERS_ENDPOINT_PATH =
  process.env.EXPO_PUBLIC_SUPPLIERS_ENDPOINT ?? "/suppliers/";
const INVENTORY_ITEMS_ENDPOINT_PATH =
  process.env.EXPO_PUBLIC_ITEMS_ENDPOINT ?? "/items/";
const CATEGORIES_ENDPOINT_PATH =
  process.env.EXPO_PUBLIC_CATEGORIES_ENDPOINT ?? "/categories/";

export class BackendApi extends BaseApi {
  #authTokenEndpoint: BaseEndpoint<LoginCredentials>;
  #suppliersEndpoint: BaseEndpoint<Supplier>;
  #inventoryItemsEndpoint: BaseEndpoint<InventoryItem>;
  #catergoriesEndpoint: BaseEndpoint<Category>;

  constructor() {
    super();
    this.#authTokenEndpoint = new BaseEndpoint<LoginCredentials>(
      this.http,
      AUTH_ENDPOINT_PATH,
    );
    this.#suppliersEndpoint = new BaseEndpoint<Supplier>(
      this.httpWithAuthToken,
      SUPPLIERS_ENDPOINT_PATH,
    );
    this.#inventoryItemsEndpoint = new BaseEndpoint<InventoryItem>(
      this.httpWithAuthToken,
      INVENTORY_ITEMS_ENDPOINT_PATH,
    );
    this.#catergoriesEndpoint = new BaseEndpoint<Category>(
      this.httpWithAuthToken,
      CATEGORIES_ENDPOINT_PATH,
    );
  }

  setJwtToken(token: string | null) {
    this.withAuthToken(token ?? "");
  }

  createAuthToken(resource: LoginCredentials) {
    return this.#authTokenEndpoint.create(resource);
  }

  getSuppliers() {
    return this.#suppliersEndpoint.getAll();
  }

  getSupplierById(id: string) {
    return this.#suppliersEndpoint.getById(id);
  }

  createSupplier(resource: Omit<Supplier, "id">) {
    return this.#suppliersEndpoint.create(resource);
  }

  updateSupplier(id: string, resource: Omit<Supplier, "id">) {
    return this.#suppliersEndpoint.update(id, resource);
  }

  deleteSupplier(id: string) {
    return this.#suppliersEndpoint.delete(id);
  }

  getInventoryItems() {
    return this.#inventoryItemsEndpoint.getAll();
  }

  getInventoryItemById(id: string) {
    return this.#inventoryItemsEndpoint.getById(id);
  }

  createInventoryItem(
    resource: Omit<InventoryItem, "id" | "supplier_name" | "category_name">,
  ) {
    return this.#inventoryItemsEndpoint.create(resource);
  }

  updateInventoryItem(
    id: string,
    resource: Omit<InventoryItem, "id" | "supplier_name" | "category_name">,
  ) {
    return this.#inventoryItemsEndpoint.update(id, resource);
  }

  deleteInventoryItem(id: string) {
    return this.#inventoryItemsEndpoint.delete(id);
  }

  getCategories() {
    return this.#catergoriesEndpoint.getAll();
  }

  getCategoryById(id: string) {
    return this.#catergoriesEndpoint.getById(id);
  }

  createCategory(resource: Omit<Category, "id" | "color">) {
    return this.#catergoriesEndpoint.create(resource);
  }

  updateCategory(id: string, resource: Omit<Category, "id" | "color">) {
    return this.#catergoriesEndpoint.update(id, resource);
  }

  deleteCategory(id: string) {
    return this.#catergoriesEndpoint.delete(id);
  }
}

export default new BackendApi();
