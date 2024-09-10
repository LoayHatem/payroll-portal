import type { IUser } from "@/types/user.types";
import { BaseEndpoint } from "./baseEndpoint";

// **User**

export interface IValidationReturn {
  valid: boolean;
}

export class AuthEndpoint extends BaseEndpoint {
  async login(email: string, password: string) {
    const res = await this.axios.post("/auth/login", {
      email,
      password,
    });
    return res.data;
  }

  async signUp(email: string, password: string, name: string) {
    const res = await this.axios.post<{ profile: IUser }>("/auth/signup", {
      email,
      password,
      name,
    });
    return res.data;
  }

  async validateToken() {
    const res = await this.axios.get<IValidationReturn>("/auth/validate-token");
    return res.data;
  }

  async logout() {
    return await this.axios.get("/auth/logout");
  }
}
