import { BackendApi } from "../src/infrastructure/backend-api";

describe("BackendApi", () => {
  test("case: get token", () => {
    const backendApi = new BackendApi();
    const credentials = {
      username: "your_username",
      password: "your_password_here",
    };
    backendApi.createAuthToken(credentials).then((response) => {
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("access");
      expect(response.data).toHaveProperty("refresh");
    });
  });
});
