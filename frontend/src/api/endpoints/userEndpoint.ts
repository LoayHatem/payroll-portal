import { BaseEndpoint } from "./baseEndpoint";
import type { IProfile, ITournament } from "@/types/user.types";

export class UserEndpoint extends BaseEndpoint {
  async getMyProfile() {
    const res = await this.axios.get<{ user: IProfile }>("/user");
    return res.data?.user;
  }

  async setLanguage(langId: string) {
    await this.axios.post("/user/set-language", { langId });
  }

  async getTournaments() {
    const res = await this.axios.get<{ tournaments: ITournament }>("/user/tournaments");
    return res.data?.tournaments;
  }
}
