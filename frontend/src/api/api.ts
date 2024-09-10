import axios from "axios";

import { AuthEndpoint } from "./endpoints/authEndpoint";
import { UserEndpoint } from "./endpoints/userEndpoint";
import { DashboardEndpoint } from "./endpoints/dashboardEndpoint";

class ApiClass {
  public auth = new AuthEndpoint(this.axios);
  public user = new UserEndpoint(this.axios);
  public dashboard = new DashboardEndpoint(this.axios);

  constructor() {
    this.axios.defaults.baseURL = "http://localhost:3009/api";

    this.axios.interceptors.request.use((config) => {
      config.withCredentials = true;
      return config;
    });

    axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        console.error("API Error", error?.response?.data?.errorMessage || "An error has occurred, Please Try again later.");
        return {
          data: {
            errorMessage: error?.response?.data?.errorMessage || "An error has occurred, Please Try again later.",
          },
        };
      },
    );
  }

  private get axios() {
    return axios;
  }
}

export const api = new ApiClass();
