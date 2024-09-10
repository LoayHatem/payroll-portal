import type { AxiosInstance } from "axios";

export class BaseEndpoint {
  constructor(protected axios: AxiosInstance) {}
}
