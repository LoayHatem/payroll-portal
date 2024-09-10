import type { IUser, IUserInfo } from "@/types/user.types";
import { BaseEndpoint } from "./baseEndpoint";

// **User**

export interface IValidationReturn {
  valid: boolean;
  status: IUser["status"];
  emailVerified: boolean;
}

export class AuthEndpoint extends BaseEndpoint {
  async login(email: string, password: string) {
    const res = await this.axios.post("/auth/login", {
      email,
      password,
    });
    return res.data;
  }

  async signUp(email: string, password: string) {
    const res = await this.axios.post<{ profile: IUser }>("/auth/signup", {
      email,
      password,
    });
    return res.data;
  }

  async updateUserInfo(info: IUserInfo) {
    const res = await this.axios.post<{ user: IUser }>("/auth/update-user-info", info);
    return res.data;
  }

  async validateToken() {
    const res = await this.axios.get<IValidationReturn>("/auth/validate-token");
    return res.data;
  }

  async logout() {
    return await this.axios.get("/auth/logout");
  }

  async resendEmailConfirmationCode() {
    const res = await this.axios.get<{ success: boolean; message: string; remainingTime: number }>("/auth/resend-email-confirmation");
    return res.data;
  }

  async confirmEmail(token: string) {
    const res = await this.axios.post<{ message: string }>("/auth/confirm-email", { token });
    return res.data;
  }

  async verifyEmailByCode(code: string) {
    const res = await this.axios.post<{ message: string }>("/auth/confirm-email-code", { code });
    return res.data;
  }
}
