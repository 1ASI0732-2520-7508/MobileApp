import axios from "axios";

//const backendBaseURL = process.env.EXPO_PUBLIC_API_URL;
const backendBaseURL = "https://backend-e5e8.onrender.com/api";

export class BaseApi {
  private _http;
  private _httpWithAuthToken;
  constructor() {
    this._http = axios.create({
      baseURL: backendBaseURL,
    });
    this._httpWithAuthToken = axios.create({
      baseURL: backendBaseURL,
    });
  }

  get http() {
    return this._http;
  }

  get httpWithAuthToken() {
    return this._httpWithAuthToken;
  }

  withAuthToken(token: string) {
    this._httpWithAuthToken.defaults.headers.common["Authorization"] =
      `Bearer ${token}`;
  }
}
