import { BaseEndpoint } from "./baseEndpoint";
import type { IProfile } from "@/types/user.types";

export class UserEndpoint extends BaseEndpoint {
  async getMyProfile() {
    const res = await this.axios.get<{ user: IProfile }>("/user");
    return res.data?.user;
  }
}
