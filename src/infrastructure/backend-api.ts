import { BaseApi } from "./base-api";
import { BaseEndpoint } from "./base-endpoint";
import { Category, InventoryItem, Supplier } from "../types/inventory";
import { LoginCredentials } from "../types/auth";

export class BackendApi extends BaseApi {
  #authTokenEndpoint: BaseEndpoint<LoginCredentials>;
  #suppliersEndpoint: BaseEndpoint<Supplier>;
  #inventoryItemsEndpoint: BaseEndpoint<InventoryItem>;
  #catergoriesEndpoint: BaseEndpoint<Category>;

  constructor() {
    super();
    this.#authTokenEndpoint = new BaseEndpoint<LoginCredentials>(
      this.http,
      "/auth/token/",
    );
    this.#suppliersEndpoint = new BaseEndpoint<Supplier>(
      this.httpWithAuthToken,
      "/suppliers/",
    );
    this.#inventoryItemsEndpoint = new BaseEndpoint<InventoryItem>(
      this.httpWithAuthToken,
      "/items/",
    );
    this.#catergoriesEndpoint = new BaseEndpoint<Category>(
      this.httpWithAuthToken,
      "/categories/",
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
    resource: Omit<InventoryItem, "id" | "supplierName" | "categoryName">,
  ) {
    return this.#inventoryItemsEndpoint.create(resource);
  }

  updateInventoryItem(
    id: string,
    resource: Omit<InventoryItem, "id" | "supplierName" | "categoryName">,
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
