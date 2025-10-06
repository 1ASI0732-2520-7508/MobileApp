import { AxiosInstance } from "axios";

export class BaseEndpoint<T> {
  protected baseApi: AxiosInstance;
  protected endpointPath: string;

  constructor(baseApi: AxiosInstance, endpointPath: string) {
    this.baseApi = baseApi;
    this.endpointPath = endpointPath;
  }

  getAll() {
    return this.baseApi.get(this.endpointPath);
  }

  getById(id: string) {
    const url = `${this.endpointPath}${id}/`;
    console.log(`GET ${url}`);
    return this.baseApi.get(url);
  }

  create(resource: Partial<T>) {
    console.log(`POST ${this.endpointPath}`, resource);
    return this.baseApi.post(this.endpointPath, resource);
  }

  update(id: string, resource: Partial<T>) {
    const url = `${this.endpointPath}${id}/`;
    console.log(`PUT ${url}`, resource);
    return this.baseApi.put(url, resource);
  }

  delete(id: string) {
    const url = `${this.endpointPath}${id}/`;
    console.log(`DELETE ${url}`);
    return this.baseApi.delete(url);
  }
}
