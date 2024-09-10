import { TUserPayload } from "./auth.types";

declare global {
  namespace Express {
    interface Request {
      user: TUserPayload;
    }
  }
}
