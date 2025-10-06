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
    return this.baseApi.get(`${this.endpointPath}/${id}`);
  }

  create(resource: Partial<T>) {
    return this.baseApi.post(this.endpointPath, resource);
  }

  update(id: string, resource: Partial<T>) {
    return this.baseApi.put(`${this.endpointPath}/${id}`, resource);
  }

  delete(id: string) {
    return this.baseApi.delete(`${this.endpointPath}/${id}`);
  }
}
