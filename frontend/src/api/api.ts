import axios from "axios";
import { parseCookies, setCookie, destroyCookie } from 'nookies';

import { AuthEndpoint } from "./endpoints/authEndpoint";
import { UserEndpoint } from "./endpoints/userEndpoint";

class ApiClass {
  public auth = new AuthEndpoint(this.axios);
  public user = new UserEndpoint(this.axios);

  constructor() {
    this.axios.defaults.baseURL = process.env.API_URL;

    this.axios.interceptors.request.use(
      (config) => {
        const cookies = parseCookies();
        if (cookies.token) {
          config.headers.Authorization = `Bearer ${cookies.token}`;
        }
        // Set cookie header
        config.headers.Cookie = Object.entries(cookies)
          .map(([key, value]) => `${key}=${value}`)
          .join('; ');
        config.withCredentials = true;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error("API Error", error);
        if (error.response && error.response.status === 401) {
          destroyCookie(null, 'token');
          // Redirect to login page
          window.location.href = '/login';
        }
        return Promise.reject(error);
      },
    );
  }

  private get axios() {
    return axios;
  }

  public setToken(token: string) {
    setCookie(null, 'token', token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
  }

  public clearToken() {
    destroyCookie(null, 'token');
  }
}

export const api = new ApiClass();
